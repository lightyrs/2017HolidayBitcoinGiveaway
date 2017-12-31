const async = require('async');
const request = require('request');

const fs = require('fs');

// Use this for the fully static version
const writer = fs.createWriteStream('tweets.html', {
  flags: 'w'
});

// Use this for the twitter js version
// const writer = fs.createWriteStream('tweets_js.html', {
//   flags: 'w'
// });

const styleMarkup = '<style>blockquote.twitter-tweet { display: inline-block; font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif; font-size: 12px; font-weight: bold; line-height: 16px; border-color: #eee #ddd #bbb; border-radius: 5px; border-style: solid; border-width: 1px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); margin: 10px 5px; padding: 0 16px 16px 16px; max-width: 468px; } blockquote.twitter-tweet p { font-size: 16px; font-weight: normal; line-height: 20px; } blockquote.twitter-tweet a { color: inherit; font-weight: normal; text-decoration: none; outline: 0 none; } blockquote.twitter-tweet a:hover, blockquote.twitter-tweet a:focus { text-decoration: underline; }</style>';

const twitterJs = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';

// Use this for the fully static version
const openingTags = '<!DOCTYPE html><html><head><meta charset="UTF-8"> <title>TweetEmbedder</title>' + styleMarkup + '</head><body>';

// Use this for the twitter js version
// const openingTags = '<!DOCTYPE html><html><head><meta charset="UTF-8"> <title>TweetEmbedder</title>' + styleMarkup + twitterJs + '</head><body>';

const closingTags = '</body></html>';

// Performs the http request for the oembed tweet
// Parses the oembed tweet and returns the html markup
function fetchEmbedMarkup(url) {
  console.log('Fetching markup for ' + url);

  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      resolve(JSON.parse(body).html + '<br>');
    });
  });
}

// Reads the list of tweet urls
// Transforms each into its corresponding oEmbed url
// Returns array of oEmbed urls
function transformUrls() {
  let urls = [];

  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('tweets.txt')
  });

  console.log("Transforming tweet urls into oEmbed urls...");

  return new Promise(function(resolve, reject) {
    lineReader.on('line', function (line) {
      urls.push('https://publish.twitter.com/oembed?url=' + line + '&omit_script=1');
    });

    lineReader.on('close', function () {
      console.log(urls);
      resolve(urls);
    });
  });
}

// Loops through array of oembed urls
// Returns array of markup for all urls
async function fetchEmbedsMarkup(urls) {
  let embedsMarkup = [];
  for (let url of urls) {
    const embedMarkup = await fetchEmbedMarkup(url);
    embedsMarkup.push(embedMarkup);
  }
  return embedsMarkup;
}

async function run() {
  writer.write(openingTags);
  const oembedUrls = await transformUrls();
  const markup = await fetchEmbedsMarkup(oembedUrls);
  writer.write(markup.join(''));
  writer.write(closingTags);
  console.log('Success!');
}

run();
