import time

from src.kinesis.kinesis_stream_producer import KinesisStreamProducer
from src.config import get_config
import requests

def get_settings():
    return {
        "promises": [
            {
                "id": 1,
                "hashtag": "eco1",
                "text": "Promesa 1",
                "sector_id": 1
            },
            {
                "id": 2,
                "hashtag": "eco2",
                "text": "Promesa 2",
                "sector_id": 1
            },
            {
                "id": 3,
                "hashtag": "eco3",
                "text": "Promesa 3",
                "sector_id": 1
            },
            {
                "id": 4,
                "hashtag": "seg1",
                "text": "Promesa 4",
                "sector_id": 2
            },
            {
                "id": 5,
                "hashtag": "seg2",
                "text": "Promesa 5",
                "sector_id": 2
            },
            {
                "id": 6,
                "hashtag": "seg3",
                "text": "Promesa 6",
                "sector_id": 2
            },
            {
                "id": 7,
                "hashtag": "cor1",
                "text": "Promesa 7",
                "sector_id": 3
            },
            {
                "id": 8,
                "hashtag": "cor2",
                "text": "Promesa 8",
                "sector_id": 3
            },
            {
                "id": 9,
                "hashtag": "cor3",
                "text": "Promesa 9",
                "sector_id": 3
            },
            {
                "id": 10,
                "hashtag": "sal1",
                "text": "Promesa 10",
                "sector_id": 4
            },
            {
                "id": 11,
                "hashtag": "sal2",
                "text": "Promesa 11",
                "sector_id": 4
            },
            {
                "id": 12,
                "hashtag": "sal3",
                "text": "Promesa 12",
                "sector_id": 4
            },
            {
                "id": 13,
                "hashtag": "edu1",
                "text": "Promesa 13",
                "sector_id": 5
            },
            {
                "id": 14,
                "hashtag": "edu2",
                "text": "Promesa 14",
                "sector_id": 5
            },
            {
                "id": 15,
                "hashtag": "edu3",
                "text": "Promesa 15",
                "sector_id": 5
            },
            {
                "id": 16,
                "hashtag": "otr1",
                "text": "Promesa 16",
                "sector_id": 6
            },
            {
                "id": 17,
                "hashtag": "otr2",
                "text": "Promesa 17",
                "sector_id": 6
            },
            {
                "id": 18,
                "hashtag": "otr3",
                "text": "Promesa 18",
                "sector_id": 6
            }
        ],
        "sectors": [
            {
                "id": 1,
                "name": "Economía",
                "description": "Promesas "
            },
            {
                "id": 2,
                "name": "Seguridad",
                "description": "Promesas "
            },
            {
                "id": 3,
                "name": "Anti Corrupción",
                "description": "Promesas "
            },
            {
                "id": 4,
                "name": "Salud",
                "description": "Promesas "
            },
            {
                "id": 5,
                "name": "Educación",
                "description": "Promesas "
            },
            {
                "id": 6,
                "name": "Otros",
                "description": "Promesas "
            }
        ],
        "candidate": {
            "name": "Posible presidente",
            "photo_url": "https://via.placeholder.com/150?text=face",
            "user_id": "user",
            "oficial_ids": ["1129462891038556161"],
            "info": "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }
    }

def get_follows(settigs):
    return settigs["candidate"]["oficial_ids"]

def get_promise_ids(settings):
    promises = settings["promises"]
    promise_ids = [promise["hashtag"] for promise in promises]
    return promise_ids


def main():
    #settings = get_settings()
    data = requests.get("https://cpac4glnxd.execute-api.us-east-2.amazonaws.com/dev/settings").json()
    settings = data["data"]
    print(settings)
    follows = ["1129462891038556161", *get_follows(settings)]
    print(follows)
    promises_id = get_promise_ids(settings)
    print(promises_id)
    config = get_config()
    kinesis_stream_producer = KinesisStreamProducer(config['TWITTER'], promises_id)
    kinesis_stream_producer.stream_data(follow=follows, filter=promises_id, is_async=True)
    print('waiting 1 minute to shut down')
    time.sleep(60)
    print('disconect')
    kinesis_stream_producer.disconect()






if __name__ == "__main__":
    main()


