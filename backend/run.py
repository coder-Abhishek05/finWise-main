# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from app.utils import init_db_connection   # your connection helpers (from your snippet)
from app.volunteer import volunteer_bp  # blueprint file you created earlier
from app.blog import blog_bp
from app.course import course_bp
from app.quiz import quiz_bp
from app.employee import auth_bp
import os

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv("FLASK_SECRET_KEY", "change-me-replace-in-prod")
    # initialize global DB connection (prints connection status)
    init_db_connection()
    # Enable CORS for local Next.js dev and generic origins via env
    allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

    # register blueprints
    # volunteer_bp contains /register and /approve endpoints
    app.register_blueprint(volunteer_bp, url_prefix="/volunteer")
    app.register_blueprint(blog_bp, url_prefix="/blog")
    app.register_blueprint(course_bp, url_prefix="/course")
    app.register_blueprint(quiz_bp, url_prefix="/quiz")
    app.register_blueprint(auth_bp)

    # simple health endpoint
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({"status": "ok", "service": "FinWise Backend"})

    return app

if __name__ == "__main__":
    app = create_app()
    # use debug=True for development
    app.run(host="0.0.0.0", port=5000, debug=True)
