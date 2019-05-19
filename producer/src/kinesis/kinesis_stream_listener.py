import datetime
import json
import math

from tweepy import StreamListener
import sys
import time
import dateutil.parser

from src.preprocess.analyze_data import AnalyzeData
import boto3


class KinesisStreamListener(StreamListener):

    def __init__(self, promise_ids):
        self.siesta = 0
        self.nightnight = 0
        self.analyzer = AnalyzeData()
        self.kinesis_client = boto3.client('kinesis')
        self.promise_ids = promise_ids

    def on_data(self, data):
        try:
            data = json.loads(data)
            original_text = data["text"]

            hashtags = data["entities"]["hashtags"]

            if not hashtags:
                print("no promise hashtag found")
                return True

            promise_id = ''
            for hashtag in hashtags:
                if hashtag["text"] in self.promise_ids:
                    promise_id = hashtag["text"]

            normalization, clean_tweet = self.analyzer.analyze(original_text)

            if normalization == -1:
                return True

            result = {
                "day": data["created_at"],
                "timestamp_ms": data["timestamp_ms"],
                "id": data["id"],
                "id_str": data["id_str"],
                "user_screen_name": data["user"]["screen_name"],
                "user_name": data["user"]["name"],
                "user_id": data["user"]["id"],
                "user_id_str": data["user"]["id_str"],
                "created_at": data["created_at"],
                "lang": data["lang"],
                "text": original_text,
                "cleaned_text": clean_tweet,
                "sentiment_score": normalization,
                "promise_id": promise_id

            }
            json_result = json.dumps(result, ensure_ascii=False)
            print(data)
            print(json_result)
            # put tweets on kinesis stream
            self.kinesis_client.put_record(StreamName="twitter", Data=json_result, PartitionKey="promesometro")
            return True
        except Exception as e:
            print(sys.stderr, 'Encountered Exception:', e)

    def on_error(self, status_code):
        print(f'Error: {status_code}')

        if status_code == 420:
            sleepy = 60 * math.pow(2, self.siesta)
            print(time.strftime("%Y%m%d_%H%M%S"))
            print(f'A reconnection attempt will occur in {str(sleepy / 60)} minutes.')
            print(
                '''
                       *******************************************************************
                       From Twitter Streaming API Documentation
                       420: Rate Limited
                       The client has connected too frequently. For example, an 
                       endpoint returns this status if:
                       - A client makes too many login attempts in a short period 
                         of time.
                       - Too many copies of an application attempt to authenticate 
                         with the same credentials.
                       *******************************************************************
                       ''')
            time.sleep(sleepy)
            self.siesta += 1
        else:
            sleepy = 5 * math.pow(2, self.nightnight)
            print
            time.strftime("%Y%m%d_%H%M%S")
            print
            "A reconnection attempt will occur in " + \
            str(sleepy) + " seconds."
            time.sleep(sleepy)
            self.nightnight += 1
        return True


def on_timeout(self):
    print(sys.stderr, 'Timeout...')
    return True  # Don't kill the stream
