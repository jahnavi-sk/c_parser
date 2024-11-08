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
from werkzeug.utils import secure_filename


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

def run_stored_procedure(deadline_time):
    cur = mysql.connection.cursor()
    try:
        # Call the stored procedure
        cur.execute("CALL SetSubmissionDeadline(%s)", (deadline_time,))
        mysql.connection.commit()
        return True
    except Exception as e:
        print(f"Error running stored procedure: {e}")
        return False
    finally:
        cur.close()



def authenticate_student(srn, password):
    # Connect to the database
    cur = mysql.connection.cursor()
    
    try:
        # Query the database for a student with the given SRN 
        
        cur.execute("SELECT id, srn, password FROM students WHERE srn = %s", (srn,))
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

def authenticate_teacher(srn, password):
    # Connect to the database
    cur = mysql.connection.cursor()

    try:
        # Query the database for a teacher with the given SRN 
       
        cur.execute("SELECT id, password FROM teachers WHERE id = %s", (srn,))
        teacher = cur.fetchone()
        print("teacher:", teacher)
        
        if teacher:
            # teacher[2] is the stored password from the DB
            db_password = teacher[1]

            # Check if the provided password matches the stored password
            if password == db_password:
                return True  # Authentication successful
            else:
                return False  # Password doesn't match
        else:
            return False  # Teacher with the given SRN doesn't exist
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

        srn = data.get('srn')
        email = data.get('email')
        password = data.get('password')

        if not all([srn, email, password]):
            app.logger.error(f"Missing fields. Received: srn={bool(srn)}, email={bool(email)}, password={bool(password)}")
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
                "INSERT INTO students (srn, email, password, graded) VALUES (%s, %s, %s, %s)",
                (srn, email, hashed_password,False)
            )
            # Commit the transaction
            mysql.connection.commit()

            return jsonify({
                'message': 'Student registered successfully',
                'student': {'srn': srn, 'email': email}
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
    
    srn = data.get('srn')
    password = data.get('password')

    if authenticate_student(srn, password):
        return jsonify({'message': 'Login successful', 'token': 'your_jwt_token_here', 'srn': srn}), 200
    else:
        return jsonify({'message': 'Invalid SRN or password'}), 401


@app.route('/api/teacher/login', methods=['POST'])
def teacher_login():
    data = request.get_json()
    if not data:
            app.logger.error("No JSON data received")
            return jsonify({'message': 'No data provided'}), 400
    
    name = data.get('name')
    password = data.get('password')
    print("name", name)
    print("pwd", password)

    

    if authenticate_teacher(name, password):
        return jsonify({'message': 'Login successful', 'token': 'your_jwt_token_here'}), 200
    else:
        return jsonify({'message': 'Invalid SRN or password'}), 401

@app.route('/api/upload', methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    srn = request.form.get("srn")
    print("srn!!!!",srn)
    if not srn:
        return jsonify({"error": "SRN is required"}), 400
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Read file content and save it as a text file
        file_content = file.read().decode("utf-8") 
        output_path = os.path.join(UPLOAD_FOLDER, f"{file.filename}.txt")
        with open(output_path, "w") as f:
            f.write(file_content)


        try:
            cur = mysql.connection.cursor()
            insert_query = """
            INSERT INTO submissions (srn, file_name, file_content)
            VALUES (%s, %s, %s)
            """

            cur.execute(insert_query, (srn, file.filename, file_content))
            mysql.connection.commit()
            return jsonify({"message": "File saved to database"}), 200
        
        except Exception as e:
            app.logger.error(f"Database error: {str(e)}")
            if str(e)=="(1644, 'Submission deadline has passed. No new submissions allowed.')":
                return jsonify({"error": "Submission deadline has passed. No new submissions allowed."}), 400

            return jsonify({"error": "File upload failed"}), 500
        finally:
            cur.close()

        # Save the content as a new .txt file
        # output_path = os.path.join(UPLOAD_FOLDER, f"{file.filename}.txt")
        # with open(output_path, "w") as f:
        #     f.write(file_content)
    return jsonify({"error": "File upload failed"}), 500




@app.route('/api/studentlist', methods=['GET'])
def get_student_ids():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT srn FROM students where graded=0")
        student_ids = [row[0] for row in cur.fetchall()]
        return jsonify({"student_ids": student_ids})
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return False
    finally:
        cur.close()

@app.route('/api/students/<student_id>/grade', methods=['POST'])
def update_graded_status(student_id):
    try:
        print("student_id", student_id)
        cur = mysql.connection.cursor()
        cur.execute("UPDATE students SET graded = CASE WHEN srn = %s THEN true ELSE false END WHERE id > 0;", (student_id,))
       
        mysql.connection.commit()
        return jsonify({"message": f"Successfully updated graded status for student {student_id}"})
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return False
    finally:
        cur.close()


@app.route("/api/students/<string:student_id>/code", methods=['GET'])
def get_student_code(student_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT file_content FROM submissions WHERE srn = %s ORDER BY id DESC LIMIT 1", (student_id,))
        result = cur.fetchone()
        
        if result:
            file_content = result[0]
            return jsonify({"file_content": file_content}), 200
        else:
            return jsonify({"message": "No code found for this student"}), 404
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"message": "Server error"}), 500
    finally:
        cur.close()

@app.route('/api/set-submission-time', methods=['POST'])
def set_submission_time():
    data = request.get_json()
    deadline_time = data.get("submissionTime")
    deadline_time = deadline_time.replace('T', ' ') + ":00"

    # submission_time = datetime.fromisoformat(submission_time_str)

    print("data: ",deadline_time)
    if not deadline_time:
        return jsonify({"error": "Deadline time is required"}), 400

    success = run_stored_procedure(deadline_time)

    if success:
        return jsonify({"message": "Submission deadline set successfully"}), 200
    else:
        return jsonify({"error": "Failed to set submission deadline"}), 500


@app.route('/api/students/<student_id>/delete', methods=['DELETE'])
def delete_student_record(student_id):
    try:
        print("student_id:", student_id)
        cur = mysql.connection.cursor()
        
        # Replace `table_name` with the actual table name
        cur.execute(" DELETE FROM submissions WHERE srn = %s; ", (student_id,))
        mysql.connection.commit()
        
        return jsonify({"message": f"Successfully deleted submission for student {student_id}"}), 200
    
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Failed to delete record."}), 500
    
    finally:
        cur.close()


@app.route("/api/no-submission", methods=['GET'])
def get_no_submission_code():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT s.srn FROM students s LEFT JOIN submissions sub ON s.srn = sub.srn WHERE sub.id IS NULL;")
        result = cur.fetchall()
        print("result", result)
        
        if result:
            file_content = result
            return jsonify({"file_content": file_content}), 200
        else:
            return jsonify({"message": "No code found for this student"}), 404
    except Exception as e:
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"message": "Server error"}), 500
    finally:
        cur.close()


if __name__ == '__main__':
    # Enable debug logging
    import logging
    logging.basicConfig(level=logging.DEBUG)
    # Run the app
    app.run(debug=True, port=5001)