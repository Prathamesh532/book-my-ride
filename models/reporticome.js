const express = require('express');
const router = express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Rentbikeincomes = require('../models/rentbikeincomesSchema');

router.get('/csv', async (req, res) => {
  try {
    // Query MongoDB collection
    const cursor = Rentbikeincomes.find({});
    const results = await cursor.toArray();

    // Write data to CSV file
    const csvWriter = createCsvWriter({
      path: 'rentbike_income.csv',
      header: [
        {id: '_id', title: 'ID'},
        {id: 'userById', title: 'User ID'},
        {id: 'soldItems.productId', title: 'Product ID'},
        {id: 'soldItems.bookedHours', title: 'Booked Hours'},
        {id: 'soldItems.brand', title: 'Brand'},
        {id: 'soldItems.model', title: 'Model'},
        {id: 'soldItems.retailPricePerItem', title: 'Retail Price Per Item'},
        {id: 'soldItems.totalIncome', title: 'Total Income'},
        {id: 'createdAt', title: 'Created At'},
        {id: 'updatedAt', title: 'Updated At'},
      ],
    });

    const records = results.map(result => {
      const soldItems = result.soldItems.map(item => ({
        productId: item.productId,
        bookedHours: item.bookedHours,
        brand: item.brand,
        model: item.model,
        retailPricePerItem: item.retailPricePerItem,
        totalIncome: item.totalIncome,
      }));
      return {
        _id: result._id,
        userById: result.userById,
        soldItems,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    });

    await csvWriter.writeRecords(records);

    // Set response headers
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename=rentbike_income.csv');
    res.download('rentbike_income.csv');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
