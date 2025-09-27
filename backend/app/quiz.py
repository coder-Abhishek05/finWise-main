# app/quiz_routes.py
import json
from flask import Blueprint, request, jsonify
from mysql.connector import Error
from app.utils import get_db_connection   # adjust import if your DB helper module name differs

quiz_bp = Blueprint("quiz_bp", __name__)

@quiz_bp.route("/", methods=["POST"])
def create_quiz():
    """
    Create a quiz.
    JSON body example:
    {
      "title": "Financial Basics",
      "data": { "questions": [ ... ] }   # or a JSON string
    }
    """
    payload = request.get_json() or {}
    title = payload.get("title")
    data = payload.get("data")

    # Normalize data -> JSON string or NULL
    data_json = None
    if data is not None:
        if isinstance(data, (dict, list)):
            data_json = json.dumps(data)
        elif isinstance(data, str):
            # validate it's valid JSON
            try:
                json.loads(data)
                data_json = data
            except Exception:
                return jsonify({"error": "data must be valid JSON"}), 400
        else:
            return jsonify({"error": "data must be an object, array or JSON string"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            sql = "INSERT INTO quizzes (title, data) VALUES (%s, %s)"
            cur.execute(sql, (title, data_json))
            quiz_id = cur.lastrowid
            try:
                conn.commit()
            except Exception:
                pass
            return jsonify({"message": "quiz created", "quiz_id": quiz_id}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@quiz_bp.route("/<int:quiz_id>", methods=["PUT", "PATCH"])
def update_quiz(quiz_id):
    """
    Partial update: provide any of title, data
    {
      "title": "...",
      "data": {...}   # or JSON string
    }
    """
    payload = request.get_json() or {}
    allowed = ["title", "data"]
    updates = []
    params = []

    if "data" in payload:
        d = payload.get("data")
        if d is None:
            data_json = None
        elif isinstance(d, (dict, list)):
            data_json = json.dumps(d)
        elif isinstance(d, str):
            try:
                json.loads(d)
                data_json = d
            except Exception:
                return jsonify({"error": "data must be valid JSON"}), 400
        else:
            return jsonify({"error": "data must be an object, array or JSON string"}), 400
        updates.append("data = %s")
        params.append(data_json)

    if "title" in payload:
        updates.append("title = %s")
        params.append(payload.get("title"))

    if not updates:
        return jsonify({"error": "no updatable fields provided"}), 400

    params.append(quiz_id)
    sql = f"UPDATE quizzes SET {', '.join(updates)} WHERE id = %s"

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            cur.execute(sql, tuple(params))
            if cur.rowcount == 0:
                return jsonify({"error": "quiz not found"}), 404
            try:
                conn.commit()
            except Exception:
                pass
            return jsonify({"message": "quiz updated", "quiz_id": quiz_id}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@quiz_bp.route("/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            cur.execute("DELETE FROM quizzes WHERE id = %s", (quiz_id,))
            if cur.rowcount == 0:
                return jsonify({"error": "quiz not found"}), 404
            try:
                conn.commit()
            except Exception:
                pass
            return jsonify({"message": "quiz deleted", "quiz_id": quiz_id}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    """
    Optional helper: fetch quiz and parse JSON 'data' column into a JSON object if possible.
    """
    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute("SELECT id, title, data, created_at FROM quizzes WHERE id = %s", (quiz_id,))
            row = cur.fetchone()
            if not row:
                return jsonify({"error": "quiz not found"}), 404
            # parse JSON field if present
            if row.get("data"):
                try:
                    row["data"] = json.loads(row["data"])
                except Exception:
                    # leave as raw string if invalid
                    pass
            return jsonify(row), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500
