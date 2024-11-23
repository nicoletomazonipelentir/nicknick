from flask import Blueprint, jsonify, request
from . import db
from .models import Track
from sqlalchemy import or_
import random
from sqlalchemy.sql import text

main = Blueprint('main', __name__)

@main.route('/api/v1/songs', methods=['POST'])
def get_songs():
    data = request.get_json()

    artist = data.get('artist', None)
    track_name = data.get('track_name', None)
    genre = data.get('genre', None)
    danceability = data.get('danceability', None)
    disable_explicit = data.get('disableExplicit', False)

    if not genre:
        return jsonify({"error": "Genre is required"}), 400

    # Fetch the cluster value associated with the genre
    genre_cluster = Track.query.filter(Track.track_genre.ilike(f"%{genre}%")).first()
    if not genre_cluster:
        return jsonify({"error": f"No cluster found for genre '{genre}'"}), 404

    cluster_value = genre_cluster.cluster

    # Filter songs by the given cluster
    query = Track.query.filter(Track.cluster == cluster_value)

    # Filter explicit tracks if disable_explicit is set
    if disable_explicit:
        query = query.filter(Track.explicit.ilike("false"))

    cluster_rank = {}

    min_danceability, max_danceability = None, None
    if danceability is not None:
        try:
            danceability = float(danceability)
            danceability = danceability / 100
            min_danceability = max(0, danceability - 0.10)
            max_danceability = min(1, danceability + 0.10)

            danceability_tracks = query.filter(Track.danceability.between(min_danceability, max_danceability)).all()

            for track in danceability_tracks:
                cluster_rank[track.cluster] = cluster_rank.get(track.cluster, 0) + 1

        except ValueError:
            return jsonify({"error": "Invalid danceability value"}), 400

    if track_name:
        track = Track.query.filter(
            Track.track_name.ilike(f"%{track_name}%"),
            Track.cluster == cluster_value
        ).first()
        if track:
            cluster_rank[track.cluster] = cluster_rank.get(track.cluster, 0) + 100

    if artist:
        artist_track = Track.query.filter(
            Track.artists.ilike(f"%{artist}%"),
            Track.cluster == cluster_value
        ).first()
        if artist_track:
            cluster_rank[artist_track.cluster] = cluster_rank.get(artist_track.cluster, 0) + 100

    # Fetch final tracks based on the cluster and danceability
    final_tracks = query.all()

    if danceability is not None:
        final_tracks = [
            track for track in final_tracks
            if track.danceability and min_danceability <= float(track.danceability) <= max_danceability
        ]

    # Limit results to 10
    if len(final_tracks) > 10:
        final_tracks = random.sample(final_tracks, 10)

    songs = [
        {
            'track_id': track.track_id,
            'artist': track.artists.split(';'),
            'album': track.album_name,
            'track': track.track_name,
            'popularity': track.popularity,
            'genre': track.track_genre,
            'danceability': track.danceability,
            'cluster': track.cluster,
        }
        for track in final_tracks
    ]

    if songs:
        return jsonify(songs), 200

    return jsonify({"message": "Nenhuma música foi encontrada com essas características"}), 404


@main.route('/api/v1/artists', methods=['GET'])
def get_artists():
    artists = db.session.query(Track.artists).distinct().limit(20).all()
    artist_list = [artist[0] for artist in artists]
    return jsonify({'artists': artist_list}), 200


@main.route('/api/v1/track_names', methods=['GET'])
def get_track_names():
    track_names = db.session.query(Track.track_name).distinct().limit(20).all()
    track_name_list = [track_name[0] for track_name in track_names]
    return jsonify({'track_names': track_name_list}), 200


@main.route('/api/v1/genres', methods=['GET'])
def get_genres():
    query = request.args.get('query', '').strip().lower()

    if query:
        genres = db.session.query(Track.track_genre).distinct().filter(
            Track.track_genre.ilike(f"%{query}%")
        ).limit(20).all()
    else:
        genres = db.session.query(Track.track_genre).distinct().limit(20).all()

    genre_list = [genre[0] for genre in genres if genre[0] is not None]
    return jsonify({'genres': genre_list}), 200


@main.route('/api/v1/favorites', methods=['POST'])
def list_favorites():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    query = text("""
        SELECT t.track_id, t.artists, t.album_name, t.track_name, t.popularity, 
               t.track_genre, t.danceability, t.cluster
        FROM favorites f
        JOIN tracks t ON f.track_id = t.track_id
        WHERE f.user_id = :user_id
    """)

    favorite_tracks = db.session.execute(query, {'user_id': user_id}).fetchall()

    favorites_list = [
        {
            'track_id': track.track_id,
            'artist': track.artists.split(';'),
            'album': track.album_name,
            'track': track.track_name,
            'popularity': track.popularity,
            'genre': track.track_genre,
            'danceability': track.danceability,
            'cluster': track.cluster
        }
        for track in favorite_tracks
    ]

    return jsonify(favorites_list), 200

@main.route('/api/v1/favorites/all', methods=['GET'])
def list_all_favorites():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    query = text("""
        SELECT t.track_id, t.artists, t.album_name, t.track_name, t.popularity, 
               t.track_genre, t.danceability, t.cluster
        FROM favorites f
        JOIN tracks t ON f.track_id = t.track_id
        WHERE f.user_id = :user_id
    """)

    favorite_tracks = db.session.execute(query, {'user_id': user_id}).fetchall()

    favorites_list = [
        {
            'track_id': track.track_id,
            'artist': track.artists.split(';'),
            'album': track.album_name,
            'track': track.track_name,
            'popularity': track.popularity,
            'genre': track.track_genre,
            'danceability': track.danceability,
            'cluster': track.cluster
        }
        for track in favorite_tracks
    ]

    return jsonify(favorites_list), 200
