from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
import sys

app = Flask(__name__)
# Localhost URI
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/reuters_counts'
# MLAB URI
app.config['MONGO_URI'] = 'mongodb://user:password1@ds137498.mlab.com:37498/heroku_nzvq5kp7'

mongo = PyMongo(app)

@app.route('/')
def home():
    return render_template('post.html')

@app.route('/get_words/<words>')
def get_word(words):
    # Grabbing words from input box on home route
    # words = request.form.getlist('words', type=str)

    words = map(lambda x: x.strip(), words.split(','))

    results = []
    years = range(2007, 2018)
    # Iterating through words and years to get all words for all years.
    for word in words:
        for year in years:

            # Creating a dictionary to be jsonified from the mongo query.
            temp_dict = mongo.db[f'headlines_{year}'].find_one_or_404({'word':word})
            temp_dict['year'] = year
            # Dropping _id as it cannot be jsonified.
            del temp_dict['_id']
            # Appending dictionary to results for jsonification.
            results.append(temp_dict)
    # Returning jsonified results. 
    return jsonify(results)
    


if __name__ == '__main__':
    app.run(debug=True)