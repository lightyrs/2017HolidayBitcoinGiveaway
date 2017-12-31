var _ = require('lodash');
var async = require('async');
var request = require('request');

var fs = require('fs');
var logger = fs.createWriteStream('tweets.html', {
  flags: 'a' // 'a' means appending (old data will be preserved)
});

var twitterJs = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';

var styleMarkup = '<style> blockquote.twitter-tweet { display: inline-block; font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif; font-size: 12px; font-weight: bold; line-height: 16px; border-color: #eee #ddd #bbb; border-radius: 5px; border-style: solid; border-width: 1px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); margin: 10px 5px; padding: 0 16px 16px 16px; max-width: 468px; } blockquote.twitter-tweet p { font-size: 16px; font-weight: normal; line-height: 20px; } blockquote.twitter-tweet a { color: inherit; font-weight: normal; text-decoration: none; outline: 0 none; } blockquote.twitter-tweet a:hover, blockquote.twitter-tweet a:focus { text-decoration: underline; } </style>';

function fetchEmbedMarkup(url, cb) {
  request(url, function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var body = JSON.parse(body);
    var html = body.html.replace('\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', "<br>");

    logger.write(html);

    return cb(null, html);
  });
}

function fetchEmbeds() {
  var urls = [];

  logger.write(styleMarkup);
  logger.write(twitterJs);

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('tweets.txt')
  });

  lineReader.on('line', function (line) {
    var oembedUrl = 'https://publish.twitter.com/oembed?url=' + line.split(' ')[0];
    urls.push(oembedUrl);
  });

  lineReader.on('close', function () {
    console.log(urls);
    async.map(urls, fetchEmbedMarkup, function(err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log('Success');
      }
    });
  });
}

fetchEmbeds();
