# TweetEmbedder

1. Clone
2. `npm install --save`
3. `node index.js`

## Notes

1. Add the list of tweets you want to embed, line by line, in **tweets.txt**.
2. The script will generate **tweets.html** with the oembed twitter embed markup for every tweet in **tweets.txt**. The script will add the twitter widgets js in order to render the tweets in full. If you would like a simpler, faster version, simply remove the call to:

```js
logger.write(twitterJs);
```
