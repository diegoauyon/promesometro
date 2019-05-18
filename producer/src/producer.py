import time

from src.kinesis.kinesis_stream_producer import KinesisStreamProducer
from src.config import get_config


def main():
    config = get_config()
    kinesis_stream_producer = KinesisStreamProducer(config['TWITTER'])
    kinesis_stream_producer.stream_data(follow=['1129462891038556161'], is_async=True)
    print('waiting 1 minute to shut down')
    time.sleep(60)
    print('disconect')
    kinesis_stream_producer.disconect()


if __name__ == "__main__":
    main()
