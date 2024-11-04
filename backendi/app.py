# app.py

from flask import Flask, render_template, request, redirect, session, flash
from mysql.connector import connect, Error
import os
import bcrypt
from config import config

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Add a secret key for sessions

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/connect_db')
def connect_db():
    try:
        conn = connect(
            host=config.MYSQL_HOST,
            user=config.MYSQL_USER,
            password=config.MYSQL_PASSWORD,
            database=config.MYSQL_DB
        )
        print("Connected to MySQL Database")
        return "Successfully connected to the MySQL database."
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return "Failed to connect to the MySQL database."

if __name__ == '__main__':
    app.run(debug=True)

