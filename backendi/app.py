# # app.py

# from flask import Flask, render_template, request, redirect, session, flash
# from mysql.connector import connect, Error
# import os
# import bcrypt
# from config import config

# app = Flask(__name__)
# app.secret_key = 'your_secret_key_here'  # Add a secret key for sessions

# @app.route('/')
# def home():
#     return render_template('home.html')

# @app.route('/connect_db')
# def connect_db():
#     try:
#         conn = connect(
#             host=config.MYSQL_HOST,
#             user=config.MYSQL_USER,
#             password=config.MYSQL_PASSWORD,
#             database=config.MYSQL_DB
#         )
#         print("Connected to MySQL Database")
#         return "Successfully connected to the MySQL database."
#     except Error as e:
#         print(f"Error connecting to MySQL Database: {e}")
#         return "Failed to connect to the MySQL database."

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS 
from flask_mysqldb import MySQL
import bcrypt
import os
from dotenv import load_dotenv

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS with detailed settings
# CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'hi'
app.config['MYSQL_DB'] = 'parsi'
mysql = MySQL(app)

def authenticate_student(srn, password):
    # Connect to the database
    cur = mysql.connection.cursor()

    try:
        # Query the database for a student with the given SRN (name)
        print("name", srn)
        cur.execute("SELECT id, name, password FROM students WHERE name = %s", (srn,))
        student = cur.fetchone()
        print("student:" ,student)
        if student:
            # student[2] is the hashed password from the DB
            db_password = student[2]

            # Check if the provided password matches the hashed password
            if bcrypt.checkpw(password.encode('utf-8'), db_password.encode('utf-8')):
                return True  # Authentication successful
            else:
                return False  # Password doesn't match
        else:
            return False  # Student with given SRN doesn't exist
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return False
    finally:
        cur.close()

# Test route
@app.route('/api/test', methods=['GET'])

def test():
    return jsonify({"message": "API is working"}), 200

@app.route('/api/student/signup', methods=['POST', 'OPTIONS'])

def student_signup():
    # Handle preflight requests
    if request.method == "OPTIONS":
        return '', 204
    

    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response, 204

    try:
        # Log the incoming request
        app.logger.info("Received signup request")
        app.logger.debug(f"Request headers: {request.headers}")
        
        # Check Content-Type header
        content_type = request.headers.get('Content-Type', '')
        app.logger.debug(f"Content-Type header: {content_type}")

        # Parse JSON data
        data = request.get_json(silent=True)
        if not data:
            app.logger.error("No JSON data received")
            return jsonify({'message': 'No data provided'}), 400

        name = data.get('name')
        print("sign up name",name)
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            app.logger.error(f"Missing fields. Received: name={bool(name)}, email={bool(email)}, password={bool(password)}")
            return jsonify({'message': 'Missing required fields'}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create database cursor
        cur = mysql.connection.cursor()

        try:
            # Check if email already exists
            cur.execute("SELECT id FROM students WHERE email = %s", (email,))
            if cur.fetchone() is not None:
                app.logger.info("Email already registered")
                return jsonify({'message': 'Email already registered'}), 400

            # Insert new student
            cur.execute(
                "INSERT INTO students (name, email, password) VALUES (%s, %s, %s)",
                (name, email, hashed_password)
            )
            # Commit the transaction
            mysql.connection.commit()

            return jsonify({
                'message': 'Student registered successfully',
                'student': {'name': name, 'email': email}
            }), 201
        except Exception as db_error:
            app.logger.error(f"Database error: {str(db_error)}")
            return jsonify({'message': 'Database error occurred'}), 500
        finally:
            # Always close the cursor
            cur.close()
    except Exception as e:
        app.logger.error(f"Error during signup: {str(e)}")
        return jsonify({'message': f'Server error occurred'}), 500
    

@app.route('/api/student/login', methods=['POST'])
def student_login():
    data = request.get_json()
    if not data:
            app.logger.error("No JSON data received")
            return jsonify({'message': 'No data provided'}), 400
    
    srn = data.get('name')
    print("srn:",srn)
    password = data.get('password')

    if authenticate_student(srn, password):
        return jsonify({'message': 'Login successful', 'token': 'your_jwt_token_here'}), 200
    else:
        return jsonify({'message': 'Invalid SRN or password'}), 401

@app.route('/api/upload', methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Read file content and save it as a text file
        file_content = file.read().decode("utf-8")  # Assuming the file is text-based

        # Save the content as a new .txt file
        output_path = os.path.join(UPLOAD_FOLDER, f"{file.filename}.txt")
        with open(output_path, "w") as f:
            f.write(file_content)

        return jsonify({"message": f"File saved as {output_path}"}), 200

    return jsonify({"error": "File upload failed"}), 500


if __name__ == '__main__':
    # Enable debug logging
    import logging
    logging.basicConfig(level=logging.DEBUG)
    # Run the app
    app.run(debug=True, port=5001)