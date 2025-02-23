import shutil
from uuid import uuid4
from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
from flask_session import Session
from werkzeug.utils import secure_filename
from PIL import Image
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import tensorflow as tf
import numpy as np
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets

# Initialize Flask app
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/gallery'
GENERATED_FOLDER = 'static/generated'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['SECRET_KEY'] = 'your_secret_key'  # Required for session management
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the server
# Ensure the "gallery" directory exists
GALLERY_FOLDER = os.path.join('static', 'gallery')
os.makedirs(GALLERY_FOLDER, exist_ok=True)
Session(app)


# Ensure the folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# MongoDB Configuration
MONGO_URI = "mongodb+srv://21bq1a05o2:Venky630335@cluster0.7xwmt.mongodb.net/text?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "text_to_image"
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections (will be created automatically if they don't exist)
users_collection = db["users"]
history_collection = db["history"]

# Email Configuration (Update with your email credentials)
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = "madiganiprasannakumar13@gmail.com"  # Replace with your email
EMAIL_PASSWORD = "xbjuecvaeztjjwdv"  # Replace with your email password

# Load the trained generator model
latent_dim = 100  # Must match the latent space used in training
generator = tf.keras.models.load_model("generator_model.h5")  # Load trained model

# Function to map text descriptions to specific latent space vectors
def text_to_latent_vector(text):
    categories = {
        "cat": np.random.normal(0, 1, (latent_dim,)),
        "dog": np.random.normal(1, 1, (latent_dim,)),
        "car": np.random.normal(-1, 1, (latent_dim,)),
        "tree": np.random.normal(0.5, 1, (latent_dim,))
    }
    for keyword in categories.keys():
        if keyword in text.lower():
            return categories[keyword].reshape(1, latent_dim)
    return np.random.normal(0, 1, (1, latent_dim))

# Function to generate an image using DCGAN based on user text
def generate_dcgan_image(text):
    # Convert text to latent vector
    latent_vector = text_to_latent_vector(text)
    
    # Generate image using the DCGAN generator
    generated_image = generator(latent_vector, training=False)
    generated_image = ((generated_image[0] + 1) * 127.5).numpy().astype(np.uint8)
    
    # Generate a unique filename
    unique_filename = f"generated_{uuid4()}.png"
    image_path = os.path.join(GENERATED_FOLDER, unique_filename).replace("\\", "/")
    
    # Save the image
    Image.fromarray(generated_image[:, :, 0], "L").save(image_path)
    
    # Return the relative path (relative to static/)
    return image_path.replace("static/", "")


# Initialize session variables
@app.before_request
def initialize_session():
    if 'history_list' not in session:
        session['history_list'] = []
        

# Forgot Password Route
@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form["email"]

        # Check if the email exists in the database
        user = users_collection.find_one({"username": email})
        if not user:
            flash("No account found with that email.", "error")
            return render_template("forgot_password.html")

        # Generate a unique reset token
        reset_token = secrets.token_urlsafe(32)
        users_collection.update_one({"username": email}, {"$set": {"reset_token": reset_token}})

        # Send password reset email
        reset_link = f"http://localhost:5000/reset-password?token={reset_token}"
        send_reset_email(email, reset_link)

        flash("A password reset link has been sent to your email.", "success")
        return redirect(url_for("login"))

    return render_template("forgot_password.html")

# Reset Password Route
@app.route("/reset-password", methods=["GET", "POST"])
def reset_password():
    token = request.args.get("token")

    # Check if the token is valid
    user = users_collection.find_one({"reset_token": token})
    if not user:
        flash("Invalid or expired reset link.", "error")
        return redirect(url_for("forgot_password"))

    if request.method == "POST":
        new_password = request.form["new_password"]

        # Update the user's password and clear the reset token
        users_collection.update_one(
            {"reset_token": token},
            {"$set": {"password": new_password}, "$unset": {"reset_token": ""}}
        )

        flash("Your password has been reset successfully.", "success")
        return redirect(url_for("login"))

    return render_template("reset_password.html", token=token)

# Helper function to send password reset email
def send_reset_email(to_email, reset_link):
    subject = "Password Reset Request"
    body = f"""
    You requested a password reset for your account.
    Please click the following link to reset your password:
    {reset_link}
    If you did not make this request, please ignore this email.
    """

    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")

# Home route
@app.route("/", methods=["GET", "POST"])
def home():
    # Ensure the user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']

    if request.method == "POST":
        text = request.form["text"]

        # Validate input
        if not text.strip():
            return render_template("index.html", image=None, caption="Please describe an object.", history=[])

        # Generate image
        generated_image_path = generate_dcgan_image(text)

        # Save generation history to MongoDB
        history_collection.insert_one({
            "username": username,
            "description": text,
            "image_path": generated_image_path,
            "timestamp": datetime.now()
        })

        # Fetch updated history
        user_history = list(history_collection.find({"username": username}).sort("timestamp", -1))

        return render_template(
            "index.html",
            image=generated_image_path,
            caption=f"Generated Image for: {text}",
            history=user_history
        )

    # Fetch user's generation history
    user_history = list(history_collection.find({"username": username}).sort("timestamp", -1))
    return render_template("index.html", image=None, caption=None, history=user_history)
# Register route
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        # Check if user already exists
        if users_collection.find_one({"username": username}):
            return render_template("register.html", error="Username already exists!")

        # Insert new user into MongoDB
        users_collection.insert_one({
            "username": username,
            "password": password  # In production, hash passwords using bcrypt or similar
        })
        return redirect(url_for("login"))

    return render_template("register.html", error=None)

from flask import session

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        # Check credentials
        user = users_collection.find_one({"username": username, "password": password})
        if user:
            # Set session variables
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for("home"))
        else:
            return render_template("login.html", error="Invalid username or password!")

    return render_template("login.html", error=None)

# Logout route
@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for("login"))


# Upload image to gallery
@app.route('/upload', methods=['POST'])
def upload():
    # Ensure the user is logged in
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401

    # Get the username from the session
    username = session['username']

    # Parse the JSON data
    data = request.get_json()
    image_path = data.get('image')  # Should be like "generated/generated_<uuid>.png"

    if not image_path:
        return jsonify({'error': 'No image provided'}), 400

    # Remove leading slash from image_path
    image_path = image_path.lstrip('/')

    # Sanitize the filename
    filename = secure_filename(os.path.basename(image_path))

    # Define source and destination paths
    src_path = os.path.join('static', image_path).replace("\\", '/')
    user_gallery_path = os.path.join(GALLERY_FOLDER, username)
    dest_path = os.path.join(user_gallery_path, filename).replace("\\", '/')

    # Debugging: Print paths for verification
    print(f"Image Path: {image_path}")
    print(f"Source Path: {src_path}")
    print(f"Destination Path: {dest_path}")

    # Ensure the user's gallery directory exists
    os.makedirs(user_gallery_path, exist_ok=True)

    # Check if the source file exists
    if not os.path.exists(src_path):
        return jsonify({'error': f'File not found at {src_path}'}), 404

    try:
        # Move the file to the user's gallery folder
        shutil.move(src_path, dest_path)
        return jsonify({
            'success': True,
            'message': 'Image uploaded successfully!',
            'file': f'gallery/{username}/{filename}'
        })
    except Exception as e:
        return jsonify({'error': f'Failed to move file: {str(e)}'}), 500
# Gallery route
@app.route("/gallery")
def gallery():
    # Ensure the user is logged in
    if 'logged_in' not in session:
        return redirect(url_for("login"))

    username = session['username']
    user_gallery_path = os.path.join(GALLERY_FOLDER, username)
    print(user_gallery_path)

    # Check if the user's gallery directory exists
    if os.path.exists(user_gallery_path):
        # List all files in the user's gallery directory
        images = [
            f for f in os.listdir(user_gallery_path)
            if os.path.isfile(os.path.join(user_gallery_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))
        ]
    else:
        images = []

    return render_template("gallery.html", images=images)
@app.route("/delete_image/<path:imagePath>", methods=["DELETE"])
def delete_image(imagePath):
    # Ensure the user is logged in
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401

    # Extract username and filename from the path
    try:
        username, filename = imagePath.split("/", 1)
    except ValueError:
        return jsonify({'error': 'Invalid image path'}), 400

    # Validate the username
    if username != session['username']:
        return jsonify({'error': 'Unauthorized access'}), 401

    # Sanitize the filename to prevent directory traversal attacks
    filename = secure_filename(filename)

    # Construct the file path
    user_gallery_path = os.path.join(GALLERY_FOLDER, username)
    file_path = os.path.join(user_gallery_path, filename)

    # Debugging: Print the file path for verification
    print(f"Deleting file: {file_path}")

    # Check if the file exists
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return jsonify({'success': True, 'message': 'Image deleted successfully'}), 200
        except Exception as e:
            print(f"Error deleting file: {e}")
            return jsonify({'error': 'Failed to delete image'}), 500
    else:
        return jsonify({'error': 'Image not found'}), 404
if __name__ == "__main__":
    app.run(debug=True)