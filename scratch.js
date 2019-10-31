const results = $('li.result-row');

results.each((index, element) => {
  const result = $(element);
  const title = result.find('.result-title').text();
  console.log(title);
});

