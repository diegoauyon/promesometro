# Promesometro

Hackaton promesometro

## Endpoints

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
      day: new Date(payload.created_at).toISOString().substring(0, 10), // add primarykey ('day')
      timestamp_ms: payload.timestamp_ms,
      id: payload.id,
      id_str: payload.id_str,
      user_screen_name: payload.user.screen_name,
      user_name: payload.user.name,
      user_id: payload.user.id,
      user_id_str: payload.user.id_str,
      url: payload.url,
      expanded_url: payload.expanded_url,
      created_at: payload.created_at,
      lang: payload.lang,
      text: wholeText,
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
    "candidate": {
      "name": "",
      "photo_url": "",
      "twitter_url": "",
      "info": ""
    }
} 
```