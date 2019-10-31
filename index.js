const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(morgan('tiny'));

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
    .then(body => response.json({
      results: [],
      body,
    }));
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});


