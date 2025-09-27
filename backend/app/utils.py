import mysql.connector
from mysql.connector import Error

db_connection = None

def init_db_connection():
    global db_connection
    try:
        db_connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="abhishek@0123",
            database="finwise",
            autocommit=True
        )
        if db_connection.is_connected():
            print("Global database connection established.")
    except Error as e:
        print("Error connecting to MySQL:", e)
        db_connection = None

init_db_connection()

def get_db_connection():
    global db_connection
    if db_connection is None or not db_connection.is_connected():
        init_db_connection()
    return db_connection
