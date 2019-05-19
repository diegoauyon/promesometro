from tweepy import OAuthHandler, Stream

from src.kinesis.kinesis_stream_listener import KinesisStreamListener


class KinesisStreamProducer():

    def __init__(self, credentials, promise_ids):

        self.consumer_key = credentials['APP_KEY']
        self.consumer_secret = credentials['APP_SECRET']
        self.access_token = credentials['ACCESS_TOKEN']
        self.access_token_secret = credentials['ACCESS_TOKEN_SECRET']
        self.kinesis_stream_listener = KinesisStreamListener(promise_ids)
        auth = OAuthHandler(self.consumer_key, self.consumer_secret)
        auth.set_access_token(self.access_token, self.access_token_secret)
        self.stream = Stream(auth, self.kinesis_stream_listener)

    def stream_data(self, follow=None, filter=None, is_async=False):
        self.stream.filter(follow=follow, track=filter, is_async=is_async)

    def disconect(self):
        self.stream.disconnect()
