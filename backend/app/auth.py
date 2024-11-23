from flask import Blueprint, request, jsonify
from . import db, bcrypt
from .models import User, Favorite
from flask_login import login_user, logout_user

auth = Blueprint('auth', __name__)

@auth.route('/api/v1/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@auth.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({
            'message': 'Logged in successfully',
            'user_id': user.id
        }), 200
    else:
        return jsonify({'message': 'Login failed'}), 401

@auth.route('/api/v1/favorite/songs', methods=['POST'])
def favorite_song():
    data = request.get_json()
    user_id = data.get('user_id')
    track_id = data.get('track_id')

    if not user_id or not track_id:
        return jsonify({'message': 'User ID and track ID are required'}), 400

    favorite = Favorite(user_id=user_id, track_id=track_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({'message': 'Song favorited successfully'}), 200

