import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'nicktrick')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:1234@127.0.0.1/tricktrends'
    SQLALCHEMY_TRACK_MODIFICATIONS = False