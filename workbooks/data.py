#%%
import csv
from pymongo import MongoClient
from datetime import datetime as dt
from tqdm import tqdm
#%%
client = MongoClient()
db = client.headlines_db
collection = db.reuters_headlines
#%%
# Columns   -   1996 01 02  %Y%m%d
# Date, Category, Headline
year = '2017'
filepath = f'resources/reuters-newswire-{year}.v5.csv'

num_lines = sum(1 for line in open(filepath,'r'))

with open(filepath, newline = '', encoding='iso_8859_1') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')

    i = 1
    documents = []
    headers = next(reader, None)

    for row in tqdm(reader, total = num_lines):
        if i % 1000 == 0:
            i = 0
            collection.insert_many(documents)
            documents = []
        
        doc = {
            'date': dt.strptime(row[0], '%Y%m%d%H%M'),
            'headline' : row[1]
        }
        documents.append(doc)

        i += 1