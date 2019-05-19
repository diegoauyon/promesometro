from textblob import TextBlob
from textblob.blob import BaseBlob
from classifier import *
from src.preprocess.clean_data import TweetPreprocessor


class AnalyzeData:
    __tweet_prep = TweetPreprocessor()

    def __init__(self):
        self.clf = SentimentClassifier()

    def analyze(self, tweet):
        clean_tweet = self.__tweet_prep.clean(tweet)
        if clean_tweet == '':
            return -1, clean_tweet
        normalization = float(self.clf.predict(clean_tweet))

        return normalization, clean_tweet