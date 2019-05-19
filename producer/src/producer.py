import time

from src.kinesis.kinesis_stream_producer import KinesisStreamProducer
from src.config import get_config
import requests


def get_follows(settigs):
    return settigs["candidate"]["oficial_ids"]


def get_promise_ids(settings):
    promises = settings["promises"]
    promise_ids = [promise["hashtag"] for promise in promises]
    return promise_ids


def main():
    config = get_config()
    data = requests.get(config['API']['GET_SETTINGS_URL']).json()
    settings = data["data"]
    print(settings)
    follows = ["1129462891038556161", *get_follows(settings)]
    print(follows)
    promises_id = get_promise_ids(settings)
    print(promises_id)
    kinesis_stream_producer = KinesisStreamProducer(config['TWITTER'], promises_id)
    up_time = 15*60
    kinesis_stream_producer.stream_data(follow=follows, filter=promises_id, is_async=True)
    print(f'waiting {up_time/60} minute to shut down')
    time.sleep(up_time)
    print('disconect')
    kinesis_stream_producer.disconect()


if __name__ == "__main__":
    main()
