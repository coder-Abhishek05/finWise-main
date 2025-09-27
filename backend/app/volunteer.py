# app/volunteer_routes.py
from flask import Blueprint, request, jsonify, session
from mysql.connector import Error
from app.utils import get_db_connection
import hashlib
def _sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

volunteer_bp = Blueprint("volunteer_bp", __name__)

@volunteer_bp.route("/register", methods=["POST"])
def register_volunteer():
    """
    Expected JSON body:
    {
      "email": "vol@example.com",
      "password": "plain-or-hashed",
      "name": "Full Name",         <-- optional
      "phone": "9999999999",      <-- optional
      "initial_comment": "..."    <-- optional, saved into approvals comment
    }
    This inserts into volunteers and creates a pending approvals row.
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    phone = data.get("phone")
    initial_comment = data.get("initial_comment")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            # Insert volunteer
            # Store hashed password to match login check
            hashed_pw = _sha256_hex(password)
            insert_vol_sql = """
                INSERT INTO volunteers (email, password, name, phone)
                VALUES (%s, %s, %s, %s)
            """
            cur.execute(insert_vol_sql, (email, hashed_pw, name, phone))
            volunteer_id = cur.lastrowid

            # Create pending approval row
            insert_app_sql = """
                INSERT INTO approvals (volunteer_id, admin_id, status, comment)
                VALUES (%s, %s, %s, %s)
            """
            cur.execute(insert_app_sql, (volunteer_id, None, "pending", initial_comment))

            # If autocommit is off, uncomment the next line
            # conn.commit()

            return jsonify({
                "message": "registered (pending approval)",
                "volunteer_id": volunteer_id,
                "approval_id": cur.lastrowid
            }), 201

        except Error as e:
            # Duplicate email error code for MySQL is 1062
            if getattr(e, "errno", None) == 1062:
                return jsonify({"error": "email already exists"}), 409
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@volunteer_bp.route("/login", methods=["POST"])
def volunteer_login():
    """
    Expected JSON body:
    {
      "email": "vol@example.com",
      "password": "plain-or-hashed"
    }
    
    Validates credentials and checks if volunteer is approved.
    If successful, stores volunteer_id in session.
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            # Get volunteer info
            select_sql = """
                SELECT id, email, password, name, is_approved
                FROM volunteers
                WHERE email = %s
            """
            cur.execute(select_sql, (email,))
            volunteer = cur.fetchone()

            if not volunteer:
                return jsonify({"error": "invalid credentials"}), 401

            # Check password (you may want to use proper password hashing comparison)
            if volunteer["password"] != _sha256_hex(password):
                return jsonify({"error": "invalid credentials"}), 401

            # Check if volunteer is approved
            if not volunteer["is_approved"]:
                return jsonify({"error": "account not approved yet"}), 403

            # Store volunteer ID in session
            session["volunteer_id"] = volunteer["id"]

            return jsonify({
                "message": "login successful",
                "volunteer_id": volunteer["id"],
                "name": volunteer["name"]
            }), 200

        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@volunteer_bp.route("/logout", methods=["POST"])
def volunteer_logout():
    """
    Logs out the current volunteer by removing their ID from the session.
    No request body required.
    """
    if "volunteer_id" in session:
        volunteer_id = session["volunteer_id"]
        session.pop("volunteer_id", None)
        return jsonify({
            "message": "logout successful",
            "volunteer_id": volunteer_id
        }), 200
    else:
        return jsonify({"error": "no active session found"}), 400


@volunteer_bp.route("/approve", methods=["POST"])
def approve_or_reject():
    """
    Accepts JSON body:
    {
      "volunteer_id": 5,
      "admin_id": 2,
      "action": "approve"   # or "reject"
      "comment": "Optional comment"
    }

    Updates volunteers.is_approved and inserts an approvals record with status 'approved'/'rejected'.
    """
    data = request.get_json() or {}
    volunteer_id = data.get("volunteer_id")
    admin_id = data.get("admin_id")
    action = (data.get("action") or "").lower()
    comment = data.get("comment")

    if not volunteer_id or not admin_id or action not in ("approve", "reject"):
        return jsonify({"error": "volunteer_id, admin_id and action('approve'|'reject') required"}), 400

    new_status = "approved" if action == "approve" else "rejected"
    is_approved_value = 1 if action == "approve" else 0

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            # Update volunteer approval flag
            update_sql = """
                UPDATE volunteers
                SET is_approved = %s
                WHERE id = %s
            """
            cur.execute(update_sql, (is_approved_value, volunteer_id))

            # Insert an approvals audit row
            insert_app_sql = """
                INSERT INTO approvals (volunteer_id, admin_id, status, comment)
                VALUES (%s, %s, %s, %s)
            """
            cur.execute(insert_app_sql, (volunteer_id, admin_id, new_status, comment))

            # If autocommit is off, uncomment:
            # conn.commit()

            return jsonify({
                "message": f"volunteer {new_status}",
                "volunteer_id": volunteer_id,
                "approval_id": cur.lastrowid
            }), 200

        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500