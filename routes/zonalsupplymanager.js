const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');
const { all } = require('.');


router.use(express.urlencoded({ extended: true }));

username = "suprio";


router.get('/', async function (req, res, next) {
    username = "suprio";

    const connection = await oracledb.getConnection(dbConfig);

    const query = `SELECT * FROM PRODUCTS`;
    const result = await connection.execute(query);

    let products = [];  
    for (const row of result.rows) {
        let product = {
            id: row[0],
            name: row[1],
            price: row[2]
        };
        products.push(product);
    }

    let regions = [];
     const query2 = `SELECT * FROM REGION`;
    const result2 = await connection.execute(query2);

    for (const row of result2.rows) {
        let region = {
            id: row[0],
            name: row[1]
        };
        regions.push(region);
    }





res.render('zonalsupplymanager/userhome', { username : username, regions : regions, title: 'Express', products: products });

});


router.post('/totalproduct', async function (req, res) {
    try {
      const productId = req.body.productId;

      console.log(productId);
      
      
  
      const connection = await oracledb.getConnection(dbConfig);
  
      const query = `SELECT NVL(SUM(QUANTITY),0) AS totalQuantity FROM INVENTORY_PRODUCTS WHERE PRODUCT_ID = :productId`;
      const result = await connection.execute(query, {productId});

      console.log(result);
  
      const totalQuantity = result.rows[0][0];

        console.log(totalQuantity);  
      res.json({ totalQuantity: totalQuantity });
    } catch (error) {
      console.error("Error fetching total quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post('/totalproductregion', async function (req, res) {

    const { productId, regionId, quantity } = req.body;

    console.log(productId);
    console.log(regionId);
    console.log(quantity);
 
    try {
      // Assuming you have a function to perform the allotment in your database
      const success =  true; //await allotProductToRegion(productId, regionId, quantity);
  
      if (success) {
        res.json({ success: true, message: 'Product allotted successfully.' });
      } else {
        res.json({ success: false, message: 'Failed to allot the product.' });
      }
    } catch (error) {
      console.error('Error allotting product:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });






module.exports = router;