#%%
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Date, Integer
from sqlalchemy.orm import sessionmaker
from tqdm import tqdm
import csv
from datetime import datetime as dt

#%%
engine = create_engine('postgresql+psycopg2://jon:postgres@localhost/headlines')
conn = engine.connect()
Base = declarative_base()

#%%

year = '2008'

class Headline(Base):
    __tablename__ = f'headlines_{year}'

    id = Column(Integer, primary_key = True)
    date = Column(Date)
    headline = Column(String(255))

Session = sessionmaker(bind=engine)
session = Session()
Base.metadata.create_all(conn) 

#%%
filepath = f'resources/reuters-newswire-{year}.v5.csv'

num_lines = sum(1 for line in open(filepath,'r'))

with open(filepath, newline = '', encoding='iso_8859_1') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    id_ = 1
    i = 1

    headers = next(reader, None)
    for row in tqdm(reader, total = num_lines):
        if i % 100 == 0:
            i = 0
            session.commit()
        
        session.add(Headline
            (
                id = id_, 
                date = dt.strptime(row[0], '%Y%m%d%H%M'), 
                headline = row[1])
            )
        i += 1
        id_ += 1

#%%
