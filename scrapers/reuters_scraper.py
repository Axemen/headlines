# %%
from splinter import Browser
from bs4 import BeautifulSoup
from collections import Counter

# %%
browser = Browser('chrome', headless=False)

# %%
url = 'https://www.reuters.com/theWire'
browser.visit(url)

# %%


def scroll_to_bottom(browser):
    browser.execute_script("window.scrollTo(0, +document.body.scrollHeight);")


# %%
soup = BeautifulSoup(browser.html, 'html.parser')
stories = soup.find_all(class_='FeedItem_content-container')
# %%
records = []

for story in stories:

    record = {}

    record['meta_tag'] = story.find(class_='FeedItemMeta_channel').text
    record['date_updated'] = story.find(
        class_='FeedItemMeta_date-updated').text
    record['headline'] = story.find(
        class_='FeedItemHeadline_headline').text.replace(u'\xa0', u' ')
    record['description'] = story.find(
        class_='FeedItemLede_lede').text.replace(u'\xa0', u' ')

    records.append(record)


# %%
def get_todays_stories(browser) -> list:
    condition = True
    while condition:

        # Scroll to bottom of page to generate new elements 
        # and then check the date of the last element
        browser.execute_script(
            "window.scrollTo(0, +document.body.scrollHeight);")
        soup = BeautifulSoup(browser.html, 'html.parser')
        stories = soup.find_all(class_='FeedItem_content-container')

        if stories[-1].find(class_='FeedItemMeta_date-updated').text == 'a day ago':
            condition = False

    return stories
# %%
