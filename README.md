# Promesometro

Hackaton promesometro

## Endpoints

### POST settings/
### GET setttings/

Configure setttings 

```json

{
  "promises": [
  {
      "id": 18,
      "hashtag": "otr3",
      "text": "Promesa 18",
      "sector_id": 6
   }
  ],
  "sectors" : [
  {
      "id": 1,
      "name": "Economía",
      "description": "Promesas "
    }
  ],
  "candidate": {
    "name": "Posible presidente",
    "photo_url": "https://via.placeholder.com/150?text=face",
    "user_id": "user",
    "oficial_ids" : ["gobernacion", "partido"],
    "info": "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  }
}

```

### GET sectores/

```json
[{
  "id": "",
  "name": "",
  "description": ""
}]
```

### GET sector/{id}

```json
{
  "id": 1,
  "tweets_count": 0,
  "sentiment_score": 0.1
}
```

### GET sector/{id}/promises

```json
[{
  "id": 1,
  "hashtag": "",
  "text":""
}]
```

### GET sector/{id}/tweets
### GET promise/{id}/tweets

```json
{
  "tweets": [
  {
      "day": new Date(payload.created_at).toISOString().substring(0, 10), // add primarykey ('day')
      "timestamp_ms": payload.timestamp_ms,
      "id": payload.id,
      "id_str": payload.id_str,
      "user_screen_name": payload.user.screen_name,
      "user_name": payload.user.name,
      "user_id": payload.user.id,
      "user_id_str": payload.user.id_str,
      "url": payload.url,
      "expanded_url": payload.expanded_url,
      "created_at": payload.created_at,
      "lang": payload.lang,
      "text": wholeText,
      "promise_id": ""
    }
  ],
  "ws": "",
  "top_positive" : [{}],
  "top_negative" : [{}]
}
```

### GET promise/{id}

```json
{
  "id": 0,
  "hashtag": "",
  "text": "",
  "ws": [{
    "url": "",
    "name": ""
  }],
  "sentiment_score": 0.1
}
```

## promises.json

```json
{
    "promises": [{
      "id": 0,
      "hashtag" : "",
      "text": "",
      "sector_id": 0
    }],
    "sectors": [{
      "id": 0,
      "name": "",
      "description": ""
    }],
    "president": {
      "name": "",
      "photo_url": "",
      "user_id": "",
      "info": ""
    }
} 
```