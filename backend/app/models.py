from . import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

from . import db

class Track(db.Model):
    __tablename__ = 'tracks'
    track_id = db.Column(db.String(50), primary_key=True)
    artists = db.Column(db.Text, nullable=False)
    album_name = db.Column(db.Text, nullable=False)
    track_name = db.Column(db.Text, nullable=False)
    popularity = db.Column(db.Integer, nullable=True)
    duration_ms = db.Column(db.Integer, nullable=True)
    explicit = db.Column(db.String(10), nullable=True)
    danceability = db.Column(db.Numeric(10, 2), nullable=True)
    energy = db.Column(db.Numeric(10, 2), nullable=True)
    key = db.Column(db.Integer, nullable=True)
    loudness = db.Column(db.Numeric(10, 2), nullable=True)
    mode = db.Column(db.Numeric(10, 2), nullable=True)
    speechiness = db.Column(db.Numeric(10, 2), nullable=True)
    acousticness = db.Column(db.Numeric(10, 2), nullable=True)
    instrumentalness = db.Column(db.Numeric(10, 2), nullable=True)
    liveness = db.Column(db.Numeric(10, 2), nullable=True)
    valence = db.Column(db.Numeric(10, 2), nullable=True)
    tempo = db.Column(db.Numeric(10, 2), nullable=True)
    time_signature = db.Column(db.Numeric(10, 2), nullable=True)
    track_genre = db.Column(db.String(255), nullable=True)
    cluster = db.Column(db.Integer, nullable=True)

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    track_id = db.Column(db.String(50), db.ForeignKey('tracks.track_id'), nullable=False)

