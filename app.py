from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
import sys

app = Flask(__name__)
# Localhost URI
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/word_counts'
# MLAB URI
app.config['MONGO_URI'] = 'mongodb://user:password1@ds137508.mlab.com:37508/heroku_40txrp1b'

mongo = PyMongo(app)


@app.route('/')
def home():
    return render_template('post.html')


@app.route('/get_words/<words>')
def get_word(words):
    # Grabbing words from input box on home route
    # words = request.form.getlist('words', type=str)

    words = map(lambda x: x.strip().lower(), words.split(','))

    results = []
    years = range(2007, 2018)
    # Iterating through words and years to get all words for all years.
    for word in words:
        for year in years:

            # Creating a dictionary to be jsonified from the mongo query.
            # temp_dict = mongo.db[f'headlines_{year}'].find_one_or_404({'word':word})

            pipeline = [
                {'$match': {'word': word}},
                {'$group': {
                    '_id': '$word',
                    'count': {'$sum': '$count'}}}
            ]

            cursor = mongo.db[f'{year}'].aggregate(pipeline)

            temp_dict = list(cursor)[0]
            temp_dict['date'] = year
            results.append(temp_dict)

    # Returning jsonified results.
    return jsonify(results)


@app.route('/test')
def test():
    return render_template('test.html')


if __name__ == '__main__':
    app.run(debug=True)
