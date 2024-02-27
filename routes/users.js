var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');




/* GET products listing. */
router.get('/', async function(req, res, next) {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Fetch products from the database
        // const query =`SELECT P.*, C.CATAGORY_NAME FROM PRODUCTS P LEFT JOIN CATAGORY C ON P.CATAGORY_ID = C.CATAGORY_ID`;
        // const result = await connection.execute(query);
        // const products = result.rows;


        const result = await connection.execute(`SELECT * FROM PRODUCT`);
        const products = result.rows;
        console.log(result);
        console.log(products);
        console.log(typeof(products));
        console.log(typeof(products[0].name));

        // Release the connection
        await connection.close();

        // Render the 'products' page with the retrieved data
        res.status(200).render('users', { title: 'Product Information', products: products });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
