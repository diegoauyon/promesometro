import re  # regular expression
import string

import preprocessor as p
from nltk import word_tokenize, SnowballStemmer
from nltk.corpus import stopwords
from string import punctuation


class TweetPreprocessor:
    # HappyEmoticons
    __emoticons_happy = {
        ':-)', ':)', ';)', ':o)', ':]',
        ':3', ':c)', ':>', '=]', '8)',
        '=)', ':}', ':^)', ':-D', ':D',
        '8-D', '8D', 'x-D', 'xD', 'X-D',
        'XD', '=-D', '=D', '=-3', '=3',
        ':-))', ":'-)", ":')", ':*',
        ':^*', '>:P', ':-P', ':P', 'X-P',
        'x-p', 'xp', 'XP', ':-p', ':p',
        '=p', ':-b', ':b', '>:)', '>;)',
        '>:-)', '<3'
    }

    # Sad Emoticons
    __emoticons_sad = {
        ':L', ':-/', '>:/', ':S', '>:[',
        ':@', ':-(', ':[', ':-||', '=L',
        ':<', ':-[', ':-<', '=\\', '=/',
        '>:(', ':(', '>.<', ":'-(", ":'(",
        ':\\', ':-c', ':c', ':{', '>:\\',
        ';('
    }

    # Emoji patterns
    __emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                                 u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                 u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                 u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                 u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               "]+", flags=re.UNICODE)

    def __init__(self):
        self.emoticons = self.__emoticons_happy.union(self.__emoticons_sad)
        # stopword list to use
        self.spanish_stopwords = stopwords.words('spanish')

        # spanish stemmer
        self.stemmer = SnowballStemmer('spanish')

        # punctuation to remove
        self.non_words = list(punctuation)
        # we add spanish punctuation
        self.non_words.extend(['¿', '¡'])
        self.non_words.extend(map(str, range(10)))



    def __tokenize(self, text):
        # remove punctuation
        text = ''.join([c for c in text if c not in self.non_words])
        # tokenize
        tokens = word_tokenize(text)

        # stem
        return tokens

    def __clean_leftover__(self, tweet):
        tweet = tweet.lower()
        # after tweepy preprocessing the colon left remain after removing mentions
        # or RT sign in the beginning of the tweet
        tweet = re.sub(r':', '', tweet)
        tweet = re.sub(r'‚Ä¶', '', tweet)
        # replace consecutive non-ASCII characters with a space
        # tweet = re.sub(r'[^\x00-\x7F]+', ' ', tweet)

        # remove emojis from tweet
        tweet = self.__emoji_pattern.sub(r'', tweet)

        # filter using NLTK library append it to a string
        # filtered_tweet = [w for w in word_tokens if not w in stop_words]
        filtered_tweet = []

        word_tokens = self.__tokenize(tweet)

        if len(word_tokens) < 2:
            return ''

        # looping through conditions
        for w in word_tokens:
            # check tokens against stop words , emoticons and punctuations
            if w not in self.emoticons:
                filtered_tweet.append(w)
        return ' '.join(filtered_tweet)

    def clean(self, tweet_text):
        clean_text = p.clean(tweet_text)
        clean_text = self.__clean_leftover__(clean_text)
        return clean_text
