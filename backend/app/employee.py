# app/auth_routes.py
import hashlib
from flask import Blueprint, request, jsonify, session
from mysql.connector import Error
from app.utils import get_db_connection   # adjust path if different

auth_bp = Blueprint("auth_bp", __name__)

def _sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

@auth_bp.route("/employee/login", methods=["POST"])
def employee_login():
    """
    POST /employee/login
    JSON body: { "email": "...", "password": "..." }
    On success: stores session['employee_id'] = id
    """
    payload = request.get_json() or {}
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400
    print(email, password)
    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute("SELECT id, password, name, role FROM employees WHERE email = %s", (email,))
            row = cur.fetchone()
            cur.close()
        except Exception as e:
            cur.close()
            return jsonify({"error": "db query failed", "details": str(e)}), 500

        if not row:
            return jsonify({"error": "invalid credentials"}), 401

        db_pw = row.get("password") or ""
        # Accept either plaintext match or SHA-256 hex match
        if db_pw == password or db_pw == _sha256_hex(password):
            # success -> set session
            session["employee_id"] = int(row["id"])
            # optional: store some metadata
            session["employee_name"] = row.get("name")
            session["employee_role"] = row.get("role")
            return jsonify({
                "message": "login successful",
                "employee_id": row["id"],
                "name": row.get("name"),
                "role": row.get("role")
            }), 200
        else:
            return jsonify({"error": "invalid credentials"}), 401

    except Error as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@auth_bp.route("/employee/logout", methods=["POST"])
def employee_logout():
    """
    POST /employee/logout
    Removes employee id from session.
    """
    session.pop("employee_id", None)
    session.pop("employee_name", None)
    session.pop("employee_role", None)
    return jsonify({"message": "logged out"}), 200


@auth_bp.route("/employee/me", methods=["GET"])
def employee_me():
    """
    GET /employee/me
    Returns current employee info from session (and DB) if logged in.
    """
    emp_id = session.get("employee_id")
    if not emp_id:
        return jsonify({"employee": None}), 200

    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute("SELECT id, email, name, role, phone, created_at FROM employees WHERE id = %s", (emp_id,))
            row = cur.fetchone()
            cur.close()
        except Exception as e:
            cur.close()
            return jsonify({"error": "db query failed", "details": str(e)}), 500

        if not row:
            # session may be stale; clear it
            session.pop("employee_id", None)
            session.pop("employee_name", None)
            session.pop("employee_role", None)
            return jsonify({"employee": None}), 200

        # convert datetime to str if needed (Flask jsonify handles it, but being explicit is fine)
        row["created_at"] = str(row["created_at"]) if row.get("created_at") else None
        return jsonify({"employee": row}), 200

    except Error as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500
