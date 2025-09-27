# test_db.py
import pymysql

# Replace these with your actual DB credentials
DB_CONFIG = {
    "host": "localhost",   # or container name if using Docker
    "user": "root",
    "password": "abhishek@0123",
    "database": "finwise",
    "port": 3306
}

def test_connection():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("✅ Database connected successfully. Current time:", result[0])
        conn.close()
    except Exception as e:
        print("❌ Database connection failed:", e)

if __name__ == "__main__":
    test_connection()
