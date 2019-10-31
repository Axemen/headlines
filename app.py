from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
import sys

app = Flask(__name__)
# Localhost URI
app.config['MONGO_URI'] = 'mongodb://localhost:27017/new_counts'
# MLAB URI
# app.config['MONGO_URI'] = 'mongodb://user:password1@ds137508.mlab.com:37508/heroku_40txrp1b'

mongo = PyMongo(app)

def remove_id(cursor):
    results = []
    for doc in cursor:
        del doc['_id']
        results.append(doc)
    return results

@app.route('/')
def home():
    return render_template('post.html')

@app.route('/test')
def test():
    return render_template('test.html')


@app.route('/get_words/<words>')
def get_word(words):
    words = list(map(lambda x: x.strip().lower(), words.split(',')))

    pipeline = [
        {'$match': {
            'word': {'$in': words},
        }
        },
        {'$group': {
            '_id': {
                'word': '$word',
                'year': '$year'
            },
            'count': {'$sum': '$count'}}}
    ]

    cursor = mongo.db.counts.aggregate(pipeline)

    # Returning jsonified results.
    return jsonify(list(cursor))


@app.route('/get_words/<word>/<year>')
def get_year(word, year):
    cursor = mongo.db.counts.find({'year': int(year), 'word': word})
    # Removing the '_id' from the dictionaries as it cannot be jsonified and is only a local id
    return jsonify(remove_id(cursor))

@app.route('/get_words/<word>/all')
def get_all(word):
    cursor = mongo.db.counts.find({'word': word})
    return jsonify(remove_id(cursor))

if __name__ == '__main__':
    app.run(debug=True)
