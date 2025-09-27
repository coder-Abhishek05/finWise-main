# app/course_routes.py
from flask import Blueprint, request, jsonify
from mysql.connector import Error
from app.utils import get_db_connection   # adjust if your DB helper module name is different

course_bp = Blueprint("course_bp", __name__)

@course_bp.route("/", methods=["GET"])
def list_courses():
    """Return a list of courses with fields expected by the frontend."""
    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            sql = "SELECT id, title, course_description as description, rating, thumbnail_url, video_url, created_at FROM courses ORDER BY created_at DESC"
            cur.execute(sql)
            rows = cur.fetchall() or []
            result = []
            for r in rows:
                result.append({
                    "id": r.get("id"),
                    "title": r.get("title"),
                    "description": r.get("description"),
                    "thumbnail": r.get("thumbnail_url"),
                    "duration": "Self-paced",
                    "students": 0,
                    "rating": float(r.get("rating") or 0),
                    "level": "Beginner",
                    "category": "General",
                })
            return jsonify(result), 200
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500

@course_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id: int):
    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        try:
            sql = "SELECT id, title, course_description as description, rating, thumbnail_url, video_url, content, created_at FROM courses WHERE id = %s"
            cur.execute(sql, (course_id,))
            r = cur.fetchone()
            if not r:
                return jsonify({"error": "course not found"}), 404
            result = {
                "id": r.get("id"),
                "title": r.get("title"),
                "description": r.get("description"),
                "thumbnail": r.get("thumbnail_url"),
                "videoUrl": r.get("video_url"),
                "content": r.get("content"),
                "duration": "Self-paced",
                "students": 0,
                "rating": float(r.get("rating") or 0),
                "level": "Beginner",
                "category": "General",
            }
            return jsonify(result), 200
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500

@course_bp.route("/", methods=["POST"])
def create_course():
    """
    Create a course.
    JSON body:
    {
      "title": "Budgeting 101",
      "description": "...",
      "rating": 4.5,                # optional, must be 0-5 if provided
      "thumbnail_url": "https://...",
      "video_url": "https://...",
      "content": "long content..."
    }
    """
    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description")
    rating = data.get("rating")
    thumbnail_url = data.get("thumbnail_url")
    video_url = data.get("video_url")
    content = data.get("content")

    if not title:
        return jsonify({"error": "title is required"}), 400

    # validate rating if provided
    if rating is not None:
        try:
            rating = float(rating)
        except (TypeError, ValueError):
            return jsonify({"error": "rating must be a number between 0 and 5"}), 400
        if rating < 0 or rating > 5:
            return jsonify({"error": "rating must be between 0 and 5"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            sql = """
                INSERT INTO courses (title, description, rating, thumbnail_url, video_url, content)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cur.execute(sql, (title, description, rating, thumbnail_url, video_url, content))
            course_id = cur.lastrowid
            # commit if autocommit is off
            try:
                conn.commit()
            except Exception:
                pass

            return jsonify({"message": "course created", "course_id": course_id}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@course_bp.route("/<int:course_id>", methods=["PUT", "PATCH"])
def update_course(course_id):
    """
    Partial update a course. Provide any subset of fields:
    title, description, rating, thumbnail_url, video_url, content
    """
    data = request.get_json() or {}
    allowed_fields = ["title", "description", "rating", "thumbnail_url", "video_url", "content"]
    updates = []
    params = []

    # validate rating if provided
    if "rating" in data:
        try:
            r = float(data.get("rating"))
        except (TypeError, ValueError):
            return jsonify({"error": "rating must be a number between 0 and 5"}), 400
        if r < 0 or r > 5:
            return jsonify({"error": "rating must be between 0 and 5"}), 400
        # use normalized rating
        data["rating"] = r

    for f in allowed_fields:
        if f in data:
            updates.append(f + " = %s")
            params.append(data.get(f))

    if not updates:
        return jsonify({"error": "no updatable fields provided"}), 400

    params.append(course_id)
    sql = f"UPDATE courses SET {', '.join(updates)} WHERE id = %s"

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            cur.execute(sql, tuple(params))
            if cur.rowcount == 0:
                return jsonify({"error": "course not found"}), 404
            try:
                conn.commit()
            except Exception:
                pass
            return jsonify({"message": "course updated", "course_id": course_id}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500


@course_bp.route("/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    """
    Delete course by id.
    """
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        try:
            cur.execute("DELETE FROM courses WHERE id = %s", (course_id,))
            if cur.rowcount == 0:
                return jsonify({"error": "course not found"}), 404
            try:
                conn.commit()
            except Exception:
                pass
            return jsonify({"message": "course deleted", "course_id": course_id}), 200
        except Error as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
    except Exception as e:
        return jsonify({"error": "db connection error", "details": str(e)}), 500
