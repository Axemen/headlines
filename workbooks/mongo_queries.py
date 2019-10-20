#%%
from pymongo import MongoClient
from datetime import datetime
client = MongoClient()
db = client.headlines_db
collection = db.reuters_headlines

#%%
query = collection.find({'date': {'$gte':datetime(2010, 1, 4), '$lte':datetime(2010, 1, 4)}})

#%%
