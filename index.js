const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(morgan('tiny'));

function getResults(body) {
  const $ = cheerio.load(body);
  const rows = $('li.result-row');
  const results = [];

  rows.each((index, element) => {
    const result = $(element);
    const title = result.find('.result-title').text();
    const price = $(result.find('.result-price').get(0)).text();
    const url = result.find('a').attr('href');
    const imageData = result.find('a.result-image').attr('data-ids');
    let images = [];
    let location = result.find('span.result-hood').text()
    location = location ? location.match(/\((.*)\)/)[1] : ""

    if (imageData) {
      const parts = imageData.split(",");
      images = parts.map(
        x => `https://images.craigslist.org/${x.split(":")[1]}_300x300.jpg`
        );
      };
      results.push({
        title, 
        price,
        url,
        images,
        location,
    });
  });
  
  return results;
};

app.get('/', (request, response) => {
  response.json({
    message: 'Hello World',
  });
});

app.get('/search/:location/:search_term', (request, response) => {
  const { location, search_term } = request.params;
  const url = `https://${location}.craigslist.org/search/sss?query=${search_term}&sort=rel`

  fetch(url)
    .then(response => response.text())
    .then(body => {
      const results = getResults(body);
      response.json({
        results,
    })
  });
});

app.use((request, response, next) => {
  const error = new Error('not found');
  response.status(404);
  next(error);
});

app.use((error, request, response, next) => {
  response.status(response.statusCode || 500);
  response.json({
    message: error.message,
  });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});


