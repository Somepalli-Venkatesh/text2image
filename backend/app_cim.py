# import os
# import shutil
# from uuid import uuid4
# from datetime import datetime, timedelta
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import pyotp
# from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
# from flask_session import Session
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# from werkzeug.security import generate_password_hash, check_password_hash
# from pymongo import MongoClient
# from bson.objectid import ObjectId

# # For image processing and ML (if needed)
# from PIL import Image
# import tensorflow as tf
# import numpy as np
# import secrets

# OTP_SECRET_KEY = pyotp.random_base32()

# app = Flask(__name__)
# CORS(app, supports_credentials=True)  # Allow cross-origin requests from your React app

# # Configuration
# UPLOAD_FOLDER = 'static/gallery'
# GENERATED_FOLDER = 'static/generated'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
# app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
# app.config['SECRET_KEY'] = 'your_secret_key'  # Change this!
# app.config['SESSION_TYPE'] = 'filesystem'
# GALLERY_FOLDER = os.path.join('static', 'gallery')
# os.makedirs(GALLERY_FOLDER, exist_ok=True)
# Session(app)

# # Ensure the folders exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(GENERATED_FOLDER, exist_ok=True)

# # MongoDB Configuration
# MONGO_URI = "mongodb+srv://21bq1a05o2:Venky630335@cluster0.7xwmt.mongodb.net/text?retryWrites=true&w=majority&appName=Cluster0"
# DATABASE_NAME = "text_to_image"
# client = MongoClient(MONGO_URI)
# db = client[DATABASE_NAME]

# # Collections
# users_collection = db["users"]
# history_collection = db["history"]
# image_stats_collection = db["image_stats"]

# # Email Configuration (Update with your email credentials)
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USER = "somepallivenkatesh38@gmail.com"  # Replace with your email
# EMAIL_PASSWORD = "kglt teqt sedp yqmc"   # Replace with your email password

# @app.before_request
# def initialize_session():
#     if 'history_list' not in session:
#         session['history_list'] = []

# # --------------------------
# # API Endpoints (JSON APIs)
# # --------------------------

# @app.route("/api/register", methods=["POST"])
# def api_register():
#     data = request.get_json()
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")
#     if len(password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters long"}), 400
#     if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
#         return jsonify({"error": "Username or email already exists!"}), 400
#     hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
#     users_collection.insert_one({
#         "username": username,
#         "email": email,
#         "password": hashed_password
#     })
#     return jsonify({"success": True}), 201

# @app.route("/api/login", methods=["POST"])
# def api_login():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")
#     user = users_collection.find_one({
#         "$or": [{"username": username}, {"email": username}]
#     })
#     if user and check_password_hash(user['password'], password):
#         session['logged_in'] = True
#         session['username'] = user['username']
#         return jsonify({"success": True, "username": user['username']})
#     else:
#         return jsonify({"error": "Invalid username/email or password!"}), 401

# @app.route("/api/logout", methods=["POST"])
# def api_logout():
#     session.pop('username', None)
#     return jsonify({"success": True})

# @app.route("/api/forgot-password", methods=["POST"])
# def api_forgot_password():
#     data = request.get_json()
#     email = data.get("email")
#     user = users_collection.find_one({"email": email})
#     if not user:
#         return jsonify({"error": "No account found with that email."}), 404
#     totp = pyotp.TOTP(OTP_SECRET_KEY)
#     otp = totp.now()
#     users_collection.update_one(
#         {"email": email},
#         {
#             "$set": {
#                 "reset_otp": otp,
#                 "otp_expiry": datetime.now() + timedelta(minutes=10)
#             }
#         }
#     )
#     if send_reset_email(email, otp):
#         return jsonify({"success": True, "message": "OTP has been sent to your email."})
#     else:
#         return jsonify({"error": "Failed to send OTP. Please try again."}), 500

# @app.route("/api/reset-password", methods=["POST"])
# def api_reset_password():
#     data = request.get_json()
#     email = data.get("email")
#     otp = data.get("otp")
#     new_password = data.get("new_password")
#     user = users_collection.find_one({
#         "email": email,
#         "reset_otp": otp,
#         "otp_expiry": {"$gt": datetime.now()}
#     })
#     if not user:
#         return jsonify({"error": "Invalid or expired OTP."}), 400
#     if len(new_password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters long"}), 400
#     hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
#     users_collection.update_one(
#         {"email": email},
#         {
#             "$set": {"password": hashed_password},
#             "$unset": {"reset_otp": "", "otp_expiry": ""}
#         }
#     )
#     return jsonify({"success": True, "message": "Password reset successfully!"})

# def send_reset_email(to_email, otp):
#     try:
#         msg = MIMEMultipart()
#         msg['From'] = EMAIL_USER
#         msg['To'] = to_email
#         msg['Subject'] = "Password Reset OTP"
#         body = f"""
#         Hello,

#         Your One-Time Password (OTP) for password reset is: {otp}

#         This OTP will expire in 10 minutes. 
#         Do not share this OTP with anyone.

#         Best regards,
#         Your Application Team
#         """
#         msg.attach(MIMEText(body, 'plain'))
#         with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
#             server.starttls()
#             server.login(EMAIL_USER, EMAIL_PASSWORD)
#             server.send_message(msg)
#         return True
#     except Exception as e:
#         print(f"Error sending email: {e}")
#         return False

# @app.route("/api/upload", methods=["POST"])
# def upload():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     username = session['username']
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400
#     file = request.files['image']
#     description = request.form.get('description', 'Uploaded image')
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#     filename = secure_filename(f"generated_{uuid4().hex}.png")
#     user_gallery_path = os.path.join(app.config['UPLOAD_FOLDER'], username)
#     os.makedirs(user_gallery_path, exist_ok=True)
#     save_path = os.path.join(user_gallery_path, filename)
#     try:
#         file.save(save_path)
#         history_collection.insert_one({
#             "username": username,
#             "description": description,
#             "image_path": f"gallery/{username}/{filename}",
#             "timestamp": datetime.now()
#         })
#         return jsonify({
#             'success': True,
#             'message': 'Image uploaded successfully!',
#             'file': f'gallery/{username}/{filename}'
#         })
#     except Exception as e:
#         return jsonify({'error': f'Failed to save image: {str(e)}'}), 500

# @app.route("/api/gallery", methods=["GET"])
# def gallery():
#     gallery_items = []
#     for username in os.listdir(GALLERY_FOLDER):
#         user_gallery_path = os.path.join(GALLERY_FOLDER, username)
#         if os.path.isdir(user_gallery_path):
#             for f in os.listdir(user_gallery_path):
#                 if os.path.isfile(os.path.join(user_gallery_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
#                     image_path = f"gallery/{username}/{f}"
#                     history_doc = history_collection.find_one({"username": username, "image_path": image_path})
#                     if history_doc:
#                         description = history_doc.get("description", "Uploaded image")
#                         timestamp = history_doc.get("timestamp")
#                     else:
#                         description = "Uploaded image"
#                         timestamp = None
#                     gallery_items.append({
#                         "filename": f,
#                         "description": description,
#                         "timestamp": timestamp,
#                         "username": username
#                     })
#     return jsonify({"gallery_items": gallery_items})

# @app.route("/api/like/<imageId>", methods=["POST"])
# def like(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if not stat:
#         stat = {
#             "username": username,
#             "image_id": imageId,
#             "like_count": 0,
#             "comment_count": 0,
#             "comments": [],
#             "liked_by": []
#         }
#         image_stats_collection.insert_one(stat)
#         stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    
#     if "liked_by" not in stat:
#         stat["liked_by"] = []
    
#     if username in stat["liked_by"]:
#         new_like_count = max(stat.get("like_count", 0) - 1, 0)
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$set": {"like_count": new_like_count}, "$pull": {"liked_by": username}}
#         )
#         action = "unliked"
#     else:
#         new_like_count = stat.get("like_count", 0) + 1
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$set": {"like_count": new_like_count}, "$addToSet": {"liked_by": username}}
#         )
#         action = "liked"
#     return jsonify({"likeCount": new_like_count, "action": action})

# @app.route("/api/comment/<imageId>", methods=["POST"])
# def comment(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     data = request.get_json()
#     comment_text = data.get("comment", "").strip()
#     if not comment_text:
#         return jsonify({'error': 'No comment provided'}), 400
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if stat:
#         new_count = stat.get("comment_count", 0) + 1
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$inc": {"comment_count": 1},
#              "$push": {"comments": {"username": username, "comment": comment_text, "timestamp": datetime.now()}}}
#         )
#     else:
#         new_count = 1
#         image_stats_collection.insert_one({
#             "username": username,
#             "image_id": imageId,
#             "like_count": 0,
#             "comment_count": new_count,
#             "comments": [{"username": username, "comment": comment_text, "timestamp": datetime.now()}],
#             "liked_by": []
#         })
#     return jsonify({"commentCount": new_count})

# @app.route("/api/get-comments/<imageId>", methods=["GET"])
# def get_comments(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if stat and "comments" in stat:
#         comments = stat["comments"]
#         comments.sort(key=lambda c: c.get("timestamp", datetime.min))
#         for c in comments:
#             if "timestamp" in c and isinstance(c["timestamp"], datetime):
#                 c["timestamp"] = c["timestamp"].strftime('%b %d, %Y %I:%M %p')
#         return jsonify({"comments": comments})
#     return jsonify({"comments": []})

# @app.route("/api/get-updates", methods=["GET"])
# def get_updates():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stats = list(image_stats_collection.find({"username": username}))
#     results = []
#     for stat in stats:
#         results.append({
#             "imageId": stat.get("image_id", ""),
#             "likeCount": stat.get("like_count", 0),
#             "commentCount": stat.get("comment_count", 0)
#         })
#     return jsonify(results)

# @app.route("/api/delete_image/<path:imagePath>", methods=["DELETE"])
# def delete_image(imagePath):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     try:
#         username, filename = imagePath.split("/", 1)
#     except ValueError:
#         return jsonify({'error': 'Invalid image path'}), 400
#     if username != session['username']:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     filename = secure_filename(filename)
#     user_gallery_path = os.path.join(GALLERY_FOLDER, username)
#     file_path = os.path.join(user_gallery_path, filename)
#     if os.path.exists(file_path):
#         try:
#             os.remove(file_path)
#             image_stats_collection.delete_one({"username": username, "image_id": filename})
#             return jsonify({'success': True, 'message': 'Image deleted successfully'}), 200
#         except Exception as e:
#             return jsonify({'error': 'Failed to delete image'}), 500
#     else:
#         return jsonify({'error': 'Image not found'}), 404

# if __name__ == "__main__":
#     app.run(debug=True)

# import os
# import shutil
# from uuid import uuid4
# from datetime import datetime, timedelta
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import pyotp
# import requests
# from flask import Flask, jsonify, request, session, send_from_directory
# from flask_session import Session
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# from werkzeug.security import generate_password_hash, check_password_hash
# from pymongo import MongoClient
# from bson.objectid import ObjectId

# # For image processing and ML (if needed)
# from PIL import Image
# import tensorflow as tf
# import numpy as np
# import secrets

# # Generate a random base32 secret for OTP generation
# OTP_SECRET_KEY = pyotp.random_base32()

# app = Flask(__name__, static_folder='static')
# CORS(app, supports_credentials=True)  # Allow cross-origin requests from your React app

# # Configuration
# UPLOAD_FOLDER = os.path.join('static', 'gallery')
# GENERATED_FOLDER = os.path.join('static', 'generated')
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
# app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
# app.config['SECRET_KEY'] = 'your_secret_key'  # Change this!
# app.config['SESSION_TYPE'] = 'filesystem'
# GALLERY_FOLDER = os.path.join('static', 'gallery')
# os.makedirs(GALLERY_FOLDER, exist_ok=True)
# Session(app)

# # Ensure required folders exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(GENERATED_FOLDER, exist_ok=True)

# # MongoDB Configuration
# MONGO_URI = "mongodb+srv://21bq1a05o2:Venky630335@cluster0.7xwmt.mongodb.net/text?retryWrites=true&w=majority&appName=Cluster0"
# DATABASE_NAME = "text_to_image"
# client = MongoClient(MONGO_URI)
# db = client[DATABASE_NAME]

# # Collections
# users_collection = db["users"]
# history_collection = db["history"]
# image_stats_collection = db["image_stats"]

# # Email Configuration (update with your email credentials)
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USER = "somepallivenkatesh38@gmail.com"  # Replace with your email
# EMAIL_PASSWORD = "kglt teqt sedp yqmc"           # Replace with your email password

# @app.before_request
# def initialize_session():
#     if 'history_list' not in session:
#         session['history_list'] = []

# # --------------------------
# # API Endpoints (JSON APIs)
# # --------------------------

# @app.route("/api/register", methods=["POST"])
# def api_register():
#     data = request.get_json()
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")
#     if len(password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters long"}), 400
#     if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
#         return jsonify({"error": "Username or email already exists!"}), 400
#     hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
#     users_collection.insert_one({
#         "username": username,
#         "email": email,
#         "password": hashed_password
#     })
#     return jsonify({"success": True}), 201

# @app.route("/api/", methods=["POST"])
# def api_login():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")
#     user = users_collection.find_one({
#         "$or": [{"username": username}, {"email": username}]
#     })
#     if user and check_password_hash(user['password'], password):
#         session['logged_in'] = True
#         session['username'] = user['username']
#         return jsonify({"success": True, "username": user['username']})
#     else:
#         return jsonify({"error": "Invalid username/email or password!"}), 401

# @app.route("/api/logout", methods=["POST"])
# def api_logout():
#     session.pop('username', None)
#     session.pop('logged_in', None)
#     return jsonify({"success": True})

# @app.route("/api/forgot-password", methods=["POST"])
# def api_forgot_password():
#     data = request.get_json()
#     email = data.get("email")
#     user = users_collection.find_one({"email": email})
#     if not user:
#         return jsonify({"error": "No account found with that email."}), 404
#     totp = pyotp.TOTP(OTP_SECRET_KEY)
#     otp = totp.now()
#     users_collection.update_one(
#         {"email": email},
#         {
#             "$set": {
#                 "reset_otp": otp,
#                 "otp_expiry": datetime.now() + timedelta(minutes=10)
#             }
#         }
#     )
#     if send_reset_email(email, otp):
#         return jsonify({"success": True, "message": "OTP has been sent to your email."})
#     else:
#         return jsonify({"error": "Failed to send OTP. Please try again."}), 500

# @app.route("/api/reset-password", methods=["POST"])
# def api_reset_password():
#     data = request.get_json()
#     email = data.get("email")
#     otp = data.get("otp")
#     new_password = data.get("new_password")
#     user = users_collection.find_one({
#         "email": email,
#         "reset_otp": otp,
#         "otp_expiry": {"$gt": datetime.now()}
#     })
#     if not user:
#         return jsonify({"error": "Invalid or expired OTP."}), 400
#     if len(new_password) < 8:
#         return jsonify({"error": "Password must be at least 8 characters long"}), 400
#     hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
#     users_collection.update_one(
#         {"email": email},
#         {
#             "$set": {"password": hashed_password},
#             "$unset": {"reset_otp": "", "otp_expiry": ""}
#         }
#     )
#     return jsonify({"success": True, "message": "Password reset successfully!"})

# def send_reset_email(to_email, otp):
#     try:
#         msg = MIMEMultipart()
#         msg['From'] = EMAIL_USER
#         msg['To'] = to_email
#         msg['Subject'] = "Password Reset OTP"
#         body = f"""
# Hello,

# Your One-Time Password (OTP) for password reset is: {otp}

# This OTP will expire in 10 minutes.
# Do not share this OTP with anyone.

# Best regards,
# Your Application Team
# """
#         msg.attach(MIMEText(body, 'plain'))
#         with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
#             server.starttls()
#             server.login(EMAIL_USER, EMAIL_PASSWORD)
#             server.send_message(msg)
#         return True
#     except Exception as e:
#         print(f"Error sending email: {e}")
#         return False

# # --------------------------
# # Image Generation & Upload
# # --------------------------

# @app.route("/api/generate-image", methods=["POST"])
# def generate_image():
#     data = request.get_json()
#     prompt = data.get("prompt")
#     if not prompt:
#         return jsonify({"error": "Prompt is required"}), 400

#     stability_url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": "Bearer sk-3gyQwLA7GBBhPLjZv91vM51lAW8TnPRXFcznDk1G6AEkePtj"
#     }
#     payload = {
#         "text_prompts": [{"text": prompt}],
#         "cfg_scale": 7,
#         "height": 1024,
#         "width": 1024,
#         "steps": 30,
#         "samples": 1
#     }

#     response = requests.post(stability_url, headers=headers, json=payload)
#     if response.ok:
#         response_data = response.json()
#         try:
#             base64_image = response_data["artifacts"][0]["base64"]
#         except (KeyError, IndexError):
#             return jsonify({"error": "Failed to parse image response"}), 500
#         imageUrl = "data:image/png;base64," + base64_image
#         return jsonify({"success": True, "imageUrl": imageUrl})
#     else:
#         return jsonify({"error": "Failed to generate image"}), 500

# @app.route("/api/upload", methods=["POST"])
# def upload():
#     username = session.get('username')
#     if not username:
#         return jsonify({'error': 'Unauthorized access'}), 401

#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400

#     file = request.files['image']
#     description = request.form.get('description', 'Uploaded image')
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     filename = secure_filename(f"generated_{uuid4().hex}.png")
#     user_gallery_path = os.path.join(app.config['UPLOAD_FOLDER'], username)
#     os.makedirs(user_gallery_path, exist_ok=True)
#     save_path = os.path.join(user_gallery_path, filename)

#     try:
#         file.save(save_path)
#         # Save image path with the /static prefix so it can be accessed from the frontend
#         image_path = f"/static/gallery/{username}/{filename}"
#         history_collection.insert_one({
#             "username": username,
#             "description": description,
#             "image_path": image_path,
#             "timestamp": datetime.now()
#         })
#         return jsonify({
#             'success': True,
#             'message': 'Image uploaded successfully!',
#             'file': image_path
#         })
#     except Exception as e:
#         return jsonify({'error': f'Failed to save image: {str(e)}'}), 500

# # --------------------------
# # Gallery & History Endpoints
# # --------------------------

# @app.route("/api/gallery", methods=["GET"])
# def gallery():
#     gallery_items = []
#     for username in os.listdir(GALLERY_FOLDER):
#         user_gallery_path = os.path.join(GALLERY_FOLDER, username)
#         if os.path.isdir(user_gallery_path):
#             for f in os.listdir(user_gallery_path):
#                 if os.path.isfile(os.path.join(user_gallery_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
#                     # Include the /static prefix for proper URL access
#                     image_path = f"/static/gallery/{username}/{f}"
#                     history_doc = history_collection.find_one({"username": username, "image_path": image_path})
#                     if history_doc:
#                         description = history_doc.get("description", "Uploaded image")
#                         timestamp = history_doc.get("timestamp")
#                     else:
#                         description = "Uploaded image"
#                         timestamp = None
#                     gallery_items.append({
#                         "filename": f,
#                         "description": description,
#                         "timestamp": timestamp,
#                         "username": username,
#                         "image_path": image_path
#                     })
#     return jsonify({"gallery_items": gallery_items})

# @app.route("/api/history", methods=["GET"])
# def get_history():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     username = session['username']
#     history_docs = list(history_collection.find({"username": username}))
#     history = []
#     for doc in history_docs:
#         doc['_id'] = str(doc['_id'])
#         if "timestamp" in doc and isinstance(doc["timestamp"], datetime):
#             doc["timestamp"] = doc["timestamp"].strftime('%Y-%m-%d %H:%M:%S')
#         history.append(doc)
#     return jsonify({"success": True, "history": history})

# # --------------------------
# # Like / Comment Endpoints
# # --------------------------

# @app.route("/api/like/<imageId>", methods=["POST"])
# def like(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if not stat:
#         stat = {
#             "username": username,
#             "image_id": imageId,
#             "like_count": 0,
#             "comment_count": 0,
#             "comments": [],
#             "liked_by": []
#         }
#         image_stats_collection.insert_one(stat)
#         stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    
#     if "liked_by" not in stat:
#         stat["liked_by"] = []
    
#     if username in stat["liked_by"]:
#         new_like_count = max(stat.get("like_count", 0) - 1, 0)
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$set": {"like_count": new_like_count}, "$pull": {"liked_by": username}}
#         )
#         action = "unliked"
#     else:
#         new_like_count = stat.get("like_count", 0) + 1
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$set": {"like_count": new_like_count}, "$addToSet": {"liked_by": username}}
#         )
#         action = "liked"
#     return jsonify({"likeCount": new_like_count, "action": action})

# @app.route("/api/comment/<imageId>", methods=["POST"])
# def comment(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     data = request.get_json()
#     comment_text = data.get("comment", "").strip()
#     if not comment_text:
#         return jsonify({'error': 'No comment provided'}), 400
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if stat:
#         new_count = stat.get("comment_count", 0) + 1
#         image_stats_collection.update_one(
#             {"_id": stat["_id"]},
#             {"$inc": {"comment_count": 1},
#              "$push": {"comments": {"username": username, "comment": comment_text, "timestamp": datetime.now()}}}
#         )
#     else:
#         new_count = 1
#         image_stats_collection.insert_one({
#             "username": username,
#             "image_id": imageId,
#             "like_count": 0,
#             "comment_count": new_count,
#             "comments": [{"username": username, "comment": comment_text, "timestamp": datetime.now()}],
#             "liked_by": []
#         })
#     return jsonify({"commentCount": new_count})

# @app.route("/api/get-comments/<imageId>", methods=["GET"])
# def get_comments(imageId):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
#     if stat and "comments" in stat:
#         comments = stat["comments"]
#         comments.sort(key=lambda c: c.get("timestamp", datetime.min))
#         for c in comments:
#             if "timestamp" in c and isinstance(c["timestamp"], datetime):
#                 c["timestamp"] = c["timestamp"].strftime('%b %d, %Y %I:%M %p')
#         return jsonify({"comments": comments})
#     return jsonify({"comments": []})

# @app.route("/api/get-updates", methods=["GET"])
# def get_updates():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized'}), 401
#     username = session['username']
#     stats = list(image_stats_collection.find({"username": username}))
#     results = []
#     for stat in stats:
#         results.append({
#             "imageId": stat.get("image_id", ""),
#             "likeCount": stat.get("like_count", 0),
#             "commentCount": stat.get("comment_count", 0)
#         })
#     return jsonify(results)

# # --------------------------
# # Delete Endpoints
# # --------------------------

# @app.route("/api/delete_image/<path:imagePath>", methods=["DELETE"])
# def delete_image(imagePath):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     # Remove leading '/static/gallery/' if present
#     if imagePath.startswith("/static/gallery/"):
#         imagePath = imagePath[len("/static/gallery/"):]
#     elif imagePath.startswith("static/gallery/"):
#         imagePath = imagePath[len("static/gallery/"):]
#     try:
#         username, filename = imagePath.split("/", 1)
#     except ValueError:
#         return jsonify({'error': 'Invalid image path'}), 400
#     if username != session['username']:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     filename = secure_filename(filename)
#     user_gallery_path = os.path.join(GALLERY_FOLDER, username)
#     file_path = os.path.join(user_gallery_path, filename)
#     if os.path.exists(file_path):
#         try:
#             os.remove(file_path)
#             image_stats_collection.delete_one({"username": username, "image_id": filename})
#             return jsonify({'success': True, 'message': 'Image deleted successfully'}), 200
#         except Exception as e:
#             return jsonify({'error': 'Failed to delete image'}), 500
#     else:
#         return jsonify({'error': 'Image not found'}), 404

# @app.route("/api/delete_history/<history_id>", methods=["DELETE"])
# def delete_history(history_id):
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     username = session.get('username')
#     result = history_collection.delete_one({"_id": ObjectId(history_id), "username": username})
#     if result.deleted_count:
#         return jsonify({"success": True, "message": "History entry deleted successfully."})
#     else:
#         return jsonify({"error": "History entry not found or unauthorized."}), 404
# model_accuracy=90 
# @app.route("/api/contact", methods=["POST"])
# def contact():
#     data = request.get_json()
#     print("Received contact data:", data)  # Debug log
#     name = data.get("name")
#     email = data.get("email")
#     subject = data.get("subject", "Contact Form Submission")
#     message = data.get("message")

#     # Validate required fields
#     if not name or not email or not message:
#         return jsonify({"error": "Name, email, and message are required."}), 400

#     try:
#         # Create the email message
#         msg = MIMEMultipart()
#         msg['From'] = EMAIL_USER  # Sender's email (your email)
#         msg['To'] = EMAIL_USER    # Recipient's email (could be a dedicated support address)
#         msg['Subject'] = subject

#         # Construct the email body
#         body = f"""
# Hello,

# You have received a new message from the contact form on your website.

# Name: {name}
# Email: {email}

# Message:
# {message}

# Best regards,
# Your VisioText team
# """
#         msg.attach(MIMEText(body, 'plain'))

#         # Send the email
#         with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
#             server.starttls()
#             server.login(EMAIL_USER, EMAIL_PASSWORD)
#             server.send_message(msg)

#         return jsonify({"success": True, "message": "Your message has been sent."}), 200
#     except Exception as e:
#         print(f"Error sending contact email: {e}")
#         return jsonify({"error": f"Failed to send message: {str(e)}"}), 500
    
# @app.route("/api/get-user", methods=["GET"])
# def get_user():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     username = session.get("username")
#     user = users_collection.find_one({"username": username})
#     if user:
#         return jsonify({"username": user["username"], "email": user.get("email", "")}), 200
#     else:
#         return jsonify({"error": "User not found"}), 404

# @app.route("/api/update-email", methods=["POST"])
# def update_email():
#     if 'logged_in' not in session:
#         return jsonify({'error': 'Unauthorized access'}), 401
#     data = request.get_json()
#     new_email = data.get("email")
#     if not new_email:
#         return jsonify({"error": "Email is required"}), 400
#     username = session.get("username")
#     result = users_collection.update_one(
#         {"username": username},
#         {"$set": {"email": new_email}}
#     )
#     if result.modified_count:
#         return jsonify({"success": True, "message": "Email updated successfully"}), 200
#     else:
#         return jsonify({"error": "Email update failed"}), 500


# if __name__ == "__main__":
#     print("Model Accuracy:",model_accuracy)
#     app.run(debug=True)

import os
import shutil
from uuid import uuid4
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pyotp
import requests
from flask import Flask, jsonify, request, session, send_from_directory
from flask_session import Session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# For image processing and ML (if needed)
from PIL import Image
import tensorflow as tf
import numpy as np
import secrets

# Generate a random base32 secret for OTP generation
OTP_SECRET_KEY = pyotp.random_base32()

app = Flask(__name__, static_folder='static')

# Get frontend URL from environment variables with fallback to localhost:5173
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
# Configure CORS to allow requests from the frontend URL
CORS(app, 
     origins=[FRONTEND_URL], 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Configure session cookies based on DEBUG setting.
if os.getenv('DEBUG', 'False').lower() == 'true':
    # Development settings: non-secure, less strict same-site
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
else:
    # Production settings: secure cookies for HTTPS cross-origin requests
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True

# Other configuration from environment variables
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', os.path.join('static', 'gallery'))
GENERATED_FOLDER = os.getenv('GENERATED_FOLDER', os.path.join('static', 'generated'))
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
app.config['ALLOWED_EXTENSIONS'] = set(os.getenv('ALLOWED_EXTENSIONS', 'png,jpg,jpeg').split(','))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['SESSION_TYPE'] = os.getenv('SESSION_TYPE', 'filesystem')
app.config['SERVER_PORT'] = int(os.getenv('PORT', 5000))  # backend port
app.config['FRONTEND_PORT'] = int(os.getenv('FRONTEND_PORT', 5173))  # frontend port

GALLERY_FOLDER = UPLOAD_FOLDER
os.makedirs(GALLERY_FOLDER, exist_ok=True)
Session(app)

# Ensure required folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'text_to_image')
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
users_collection = db["users"]
history_collection = db["history"]
image_stats_collection = db["image_stats"]

# Email Configuration
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

# Stability API Key
STABILITY_API_KEY = os.getenv('STABILITY_API_KEY')

@app.before_request
def initialize_session():
    if 'history_list' not in session:
        session['history_list'] = []

# --- Explicit OPTIONS handler for "/api/" ---
@app.route("/api/", methods=["OPTIONS"])
def handle_api_root_options():
    return '', 200

# --- Catch-all OPTIONS handler for any "/api/*" route ---
@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    return '', 200

# --------------------------
# API Endpoints (JSON APIs)
# --------------------------

@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
    if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
        return jsonify({"error": "Username or email already exists!"}), 400
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    })
    return jsonify({"success": True}), 201

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = users_collection.find_one({
        "$or": [{"username": username}, {"email": username}]
    })
    if user and check_password_hash(user['password'], password):
        session['logged_in'] = True
        session['username'] = user['username']
        return jsonify({"success": True, "username": user['username']})
    else:
        return jsonify({"error": "Invalid username/email or password!"}), 401

@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop('username', None)
    session.pop('logged_in', None)
    return jsonify({"success": True})

@app.route("/api/forgot-password", methods=["POST"])
def api_forgot_password():
    data = request.get_json()
    email = data.get("email")
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "No account found with that email."}), 404
    totp = pyotp.TOTP(OTP_SECRET_KEY)
    otp = totp.now()
    users_collection.update_one(
        {"email": email},
        {"$set": {"reset_otp": otp, "otp_expiry": datetime.now() + timedelta(minutes=10)}}
    )
    if send_reset_email(email, otp):
        return jsonify({"success": True, "message": "OTP has been sent to your email."})
    else:
        return jsonify({"error": "Failed to send OTP. Please try again."}), 500

@app.route("/api/reset-password", methods=["POST"])
def api_reset_password():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")
    user = users_collection.find_one({"email": email, "reset_otp": otp, "otp_expiry": {"$gt": datetime.now()}})
    if not user:
        return jsonify({"error": "Invalid or expired OTP."}), 400
    if len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
    hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}, "$unset": {"reset_otp": "", "otp_expiry": ""}}
    )
    return jsonify({"success": True, "message": "Password reset successfully!"})

def send_reset_email(to_email, otp):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = "Password Reset OTP"
        body = f"""
Hello,

Your One-Time Password (OTP) for password reset is: {otp}

This OTP will expire in 10 minutes.
Do not share this OTP with anyone.

Best regards,
Your Application Team
"""
        msg.attach(MIMEText(body, 'plain'))
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# --------------------------
# Image Generation & Upload
# --------------------------

@app.route("/api/generate-image", methods=["POST"])
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    stability_url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {STABILITY_API_KEY}"
    }
    payload = {
        "text_prompts": [{"text": prompt}],
        "cfg_scale": 7,
        "height": 1024,
        "width": 1024,
        "steps": 30,
        "samples": 1
    }

    response = requests.post(stability_url, headers=headers, json=payload)
    if response.ok:
        response_data = response.json()
        try:
            base64_image = response_data["artifacts"][0]["base64"]
        except (KeyError, IndexError):
            return jsonify({"error": "Failed to parse image response"}), 500
        imageUrl = "data:image/png;base64," + base64_image
        return jsonify({"success": True, "imageUrl": imageUrl})
    else:
        print("Stability API error:", response.text)
        return jsonify({"error": "Failed to generate image"}), 500

@app.route("/api/upload", methods=["POST"])
def upload():
    username = session.get('username')
    if not username:
        return jsonify({'error': 'Unauthorized access'}), 401

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    description = request.form.get('description', 'Uploaded image')
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(f"generated_{uuid4().hex}.png")
    user_gallery_path = os.path.join(app.config['UPLOAD_FOLDER'], username)
    os.makedirs(user_gallery_path, exist_ok=True)
    save_path = os.path.join(user_gallery_path, filename)

    try:
        file.save(save_path)
        image_path = f"/static/gallery/{username}/{filename}"
        history_collection.insert_one({
            "username": username,
            "description": description,
            "image_path": image_path,
            "timestamp": datetime.now()
        })
        return jsonify({'success': True, 'message': 'Image uploaded successfully!', 'file': image_path})
    except Exception as e:
        return jsonify({'error': f'Failed to save image: {str(e)}'}), 500

# --------------------------
# Gallery & History Endpoints
# --------------------------

@app.route("/api/gallery", methods=["GET"])
def gallery():
    gallery_items = []
    for username in os.listdir(GALLERY_FOLDER):
        user_gallery_path = os.path.join(GALLERY_FOLDER, username)
        if os.path.isdir(user_gallery_path):
            for f in os.listdir(user_gallery_path):
                if os.path.isfile(os.path.join(user_gallery_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    image_path = f"/static/gallery/{username}/{f}"
                    history_doc = history_collection.find_one({"username": username, "image_path": image_path})
                    if history_doc:
                        description = history_doc.get("description", "Uploaded image")
                        timestamp = history_doc.get("timestamp")
                    else:
                        description = "Uploaded image"
                        timestamp = None
                    gallery_items.append({
                        "filename": f,
                        "description": description,
                        "timestamp": timestamp,
                        "username": username,
                        "image_path": image_path
                    })
    return jsonify({"gallery_items": gallery_items})

@app.route("/api/history", methods=["GET"])
def get_history():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401
    username = session['username']
    history_docs = list(history_collection.find({"username": username}))
    history = []
    for doc in history_docs:
        doc['_id'] = str(doc['_id'])
        if "timestamp" in doc and isinstance(doc["timestamp"], datetime):
            doc["timestamp"] = doc["timestamp"].strftime('%Y-%m-%d %H:%M:%S')
        history.append(doc)
    return jsonify({"success": True, "history": history})

# --------------------------
# Like / Comment Endpoints
# --------------------------

@app.route("/api/like/<imageId>", methods=["POST"])
def like(imageId):
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    username = session['username']
    stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    if not stat:
        stat = {
            "username": username,
            "image_id": imageId,
            "like_count": 0,
            "comment_count": 0,
            "comments": [],
            "liked_by": []
        }
        image_stats_collection.insert_one(stat)
        stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    
    if "liked_by" not in stat:
        stat["liked_by"] = []
    
    if username in stat["liked_by"]:
        new_like_count = max(stat.get("like_count", 0) - 1, 0)
        image_stats_collection.update_one(
            {"_id": stat["_id"]},
            {"$set": {"like_count": new_like_count}, "$pull": {"liked_by": username}}
        )
        action = "unliked"
    else:
        new_like_count = stat.get("like_count", 0) + 1
        image_stats_collection.update_one(
            {"_id": stat["_id"]},
            {"$set": {"like_count": new_like_count}, "$addToSet": {"liked_by": username}}
        )
        action = "liked"
    return jsonify({"likeCount": new_like_count, "action": action})

@app.route("/api/comment/<imageId>", methods=["POST"])
def comment(imageId):
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    username = session['username']
    data = request.get_json()
    comment_text = data.get("comment", "").strip()
    if not comment_text:
        return jsonify({'error': 'No comment provided'}), 400
    stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    if stat:
        new_count = stat.get("comment_count", 0) + 1
        image_stats_collection.update_one(
            {"_id": stat["_id"]},
            {"$inc": {"comment_count": 1},
             "$push": {"comments": {"username": username, "comment": comment_text, "timestamp": datetime.now()}}}
        )
    else:
        new_count = 1
        image_stats_collection.insert_one({
            "username": username,
            "image_id": imageId,
            "like_count": 0,
            "comment_count": new_count,
            "comments": [{"username": username, "comment": comment_text, "timestamp": datetime.now()}],
            "liked_by": []
        })
    return jsonify({"commentCount": new_count})

@app.route("/api/get-comments/<imageId>", methods=["GET"])
def get_comments(imageId):
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    username = session['username']
    stat = image_stats_collection.find_one({"username": username, "image_id": imageId})
    if stat and "comments" in stat:
        comments = stat["comments"]
        comments.sort(key=lambda c: c.get("timestamp", datetime.min))
        for c in comments:
            if "timestamp" in c and isinstance(c["timestamp"], datetime):
                c["timestamp"] = c["timestamp"].strftime('%b %d, %Y %I:%M %p')
        return jsonify({"comments": comments})
    return jsonify({"comments": []})

@app.route("/api/get-updates", methods=["GET"])
def get_updates():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    username = session['username']
    stats = list(image_stats_collection.find({"username": username}))
    results = []
    for stat in stats:
        results.append({
            "imageId": stat.get("image_id", ""),
            "likeCount": stat.get("like_count", 0),
            "commentCount": stat.get("comment_count", 0)
        })
    return jsonify(results)

# --------------------------
# Delete Endpoints
# --------------------------

@app.route("/api/delete_image/<path:imagePath>", methods=["DELETE"])
def delete_image(imagePath):
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401
    if imagePath.startswith("/static/gallery/"):
        imagePath = imagePath[len("/static/gallery/"):]
    elif imagePath.startswith("static/gallery/"):
        imagePath = imagePath[len("static/gallery/"):]
    try:
        username, filename = imagePath.split("/", 1)
    except ValueError:
        return jsonify({'error': 'Invalid image path'}), 400
    if username != session['username']:
        return jsonify({'error': 'Unauthorized access'}), 401
    filename = secure_filename(filename)
    user_gallery_path = os.path.join(GALLERY_FOLDER, username)
    file_path = os.path.join(user_gallery_path, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            image_stats_collection.delete_one({"username": username, "image_id": filename})
            return jsonify({'success': True, 'message': 'Image deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': 'Failed to delete image'}), 500
    else:
        return jsonify({'error': 'Image not found'}), 404

@app.route("/api/delete_history/<history_id>", methods=["DELETE"])
def delete_history(history_id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401
    username = session.get('username')
    result = history_collection.delete_one({"_id": ObjectId(history_id), "username": username})
    if result.deleted_count:
        return jsonify({"success": True, "message": "History entry deleted successfully."})
    else:
        return jsonify({"error": "History entry not found or unauthorized."}), 404

@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()
    print("Received contact data:", data)
    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject", "Contact Form Submission")
    message = data.get("message")
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required."}), 400
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_USER
        msg['Subject'] = subject
        body = f"""
Hello,

You have received a new message from the contact form on your website.

Name: {name}
Email: {email}

Message:
{message}

Best regards,
Your VisioText team
"""
        msg.attach(MIMEText(body, 'plain'))
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        return jsonify({"success": True, "message": "Your message has been sent."}), 200
    except Exception as e:
        print(f"Error sending contact email: {e}")
        return jsonify({"error": f"Failed to send message: {str(e)}"}), 500
    
@app.route("/api/get-user", methods=["GET"])
def get_user():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401
    username = session.get("username")
    user = users_collection.find_one({"username": username})
    if user:
        return jsonify({"username": user["username"], "email": user.get("email", "")}), 200
    else:
        return jsonify({"error": "User not found"}), 404

@app.route("/api/update-email", methods=["POST"])
def update_email():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401
    data = request.get_json()
    new_email = data.get("email")
    if not new_email:
        return jsonify({"error": "Email is required"}), 400
    username = session.get("username")
    result = users_collection.update_one(
        {"username": username},
        {"$set": {"email": new_email}}
    )
    if result.modified_count:
        return jsonify({"success": True, "message": "Email updated successfully"}), 200
    else:
        return jsonify({"error": "Email update failed"}), 500

@app.route("/")
def index():
    return "Hello, world!"

if __name__ == "__main__":
    model_accuracy = int(os.getenv('MODEL_ACCURACY', 90))
    print("Model Accuracy:", model_accuracy)
    port = int(os.getenv('PORT', 5000))
    debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
