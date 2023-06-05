const mongoose = require('mongoose');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const Rentbikeincomes = require('./rentBikeIncomeSchema');

Rentbikeincomes.find({}).maxTimeMS(30000).exec((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }

  
  // Convert data to CSV
  const csv = json2csv(data);

  // Write CSV to disk
  fs.writeFile('rental_income.csv', csv, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('CSV file saved.');
  });
});
