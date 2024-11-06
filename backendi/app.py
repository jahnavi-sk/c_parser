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

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS with specific settings
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Accept", "Authorization"],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "max_age": 120
     }}
)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'parsi'

mysql = MySQL(app)

# Test route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"}), 200

@app.route('/api/student/signup', methods=['POST', 'OPTIONS'])
def student_signup():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204

    try:
        # Log the incoming request
        app.logger.info("Received signup request")
        app.logger.debug(f"Request headers: {request.headers}")
        app.logger.debug(f"Request data: {request.get_data(as_text=True)}")
        
        data = request.get_json()
        
        if not data:
            app.logger.error("No JSON data received")
            return jsonify({'message': 'No data provided'}), 400
            
        name = data.get('name')
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

if __name__ == '__main__':
    # Enable debug logging
    import logging
    logging.basicConfig(level=logging.DEBUG)
    
    # Run the app
    app.run(debug=True, port=5000)






# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_mysqldb import MySQL
# import bcrypt
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)

# # Enable CORS with specific settings
# CORS(app, 
#      resources={r"/*": {
#          "origins": ["http://localhost:3000"],
#          "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#          "allow_headers": ["Content-Type", "Accept", "Authorization"],
#          "expose_headers": ["Content-Type", "Authorization"],
#          "supports_credentials": True,
#          "max_age": 120
#      }}
# )

# # MySQL configurations
# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_DB'] = 'parsi'

# mysql = MySQL(app)

# # Test route
# @app.route('/test', methods=['GET'])
# def test():
#     return jsonify({"message": "API is working"}), 200

# @app.route('/api/student/signup', methods=['POST', 'OPTIONS'])
# def student_signup():
#     # Handle preflight requests
#     if request.method == 'OPTIONS':
#         return '', 204

#     try:
#         # Log the incoming request
#         app.logger.info("Received signup request")
#         app.logger.debug(f"Request headers: {request.headers}")
#         app.logger.debug(f"Request data: {request.get_data(as_text=True)}")
        
#         data = request.get_json()
        
#         if not data:
#             app.logger.error("No JSON data received")
#             return jsonify({'message': 'No data provided'}), 400
            
#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         if not all([name, email, password]):
#             app.logger.error(f"Missing fields. Received: name={bool(name)}, email={bool(email)}, password={bool(password)}")
#             return jsonify({'message': 'Missing required fields'}), 400

#         # Hash the password
#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

#         # Create database cursor
#         cur = mysql.connection.cursor()
        
#         try:
#             # Check if email already exists
#             cur.execute("SELECT id FROM students WHERE email = %s", (email,))
#             if cur.fetchone() is not None:
#                 return jsonify({'message': 'Email already registered'}), 400

#             # Insert new student
#             cur.execute(
#                 "INSERT INTO students (name, email, password) VALUES (%s, %s, %s)",
#                 (name, email, hashed_password)
#             )
            
#             # Commit the transaction
#             mysql.connection.commit()
            
#             return jsonify({
#                 'message': 'Student registered successfully',
#                 'student': {'name': name, 'email': email}
#             }), 201
            
#         except Exception as db_error:
#             app.logger.error(f"Database error: {str(db_error)}")
#             return jsonify({'message': 'Database error occurred'}), 500
#         finally:
#             # Always close the cursor
#             cur.close()

#     except Exception as e:
#         app.logger.error(f"Error during signup: {str(e)}")
#         return jsonify({'message': f'Server error occurred'}), 500

# if __name__ == '__main__':
#     # Enable debug logging
#     import logging
#     logging.basicConfig(level=logging.DEBUG)
    
#     # Run the app
#     app.run(debug=True, port=5000)