const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');



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





    res.render('zonalsupplymanager/userhome', { username: username, regions: regions, title: 'Express', products: products });

});


router.post('/totalproduct', async function (req, res) {
    try {
        const productId = req.body.productId;

        console.log(productId);



        const connection = await oracledb.getConnection(dbConfig);

        const query = `SELECT NVL(SUM(QUANTITY),0) AS totalQuantity FROM INVENTORY_PRODUCTS WHERE PRODUCT_ID = :productId`;
        const result = await connection.execute(query, { productId });

        console.log(result);

        const totalQuantity = result.rows[0][0];

        console.log(totalQuantity);

        const query2 = `SELECT NVL(SUM(AMOUNT),0) AS ALLOTMENT_AMOUNT FROM PRODUCT_ALLOTEMENT WHERE PRODUCT_ID = :productId AND (STATUS = 'UPDATED' OR STATUS = 'ON PROCESS')`;

        const result2 = await connection.execute(query2, { productId });

        const Allotment_amount = result2.rows[0][0];

        res.json({ totalQuantity: totalQuantity - Allotment_amount });
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

    const connection = await oracledb.getConnection(dbConfig);
    try {

        const query = `
  UPDATE PRODUCT_ALLOTEMENT
  SET AMOUNT = :quantity, STATUS = 'ON PROCESS'
  WHERE PRODUCT_ID = :productId AND REGION_ID = :regionId
`;

        const binds = {
            quantity: { dir: oracledb.BIND_IN, val: quantity },
            productId: { dir: oracledb.BIND_IN, val: productId },
            regionId: { dir: oracledb.BIND_IN, val: regionId },
        };


  result =  await connection.execute(query, binds);
        console.log(result);

        res.json({ success: true, message: 'Product allotted successfully.' });
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        console.error('Error allotting product:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.get('/makeold', async function (req, res, next) {
    console.log("in makeold");

    const connection = await oracledb.getConnection(dbConfig);
    res.json({ success: true, message: 'Data received and processed successfully' });
    try {

        const query = `UPDATE PRODUCT_ALLOTEMENT SET STATUS = 'OLD'`
        const result = await connection.execute(query);



        //console.log("hi");
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error('Error fetching data from the database:', error);

    }
})


router.get('/sendregion', async function (req, res, next) {
    console.log("in sendregion");
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT * FROM REGION`;
        const result = await connection.execute(query);
        let regions = [];
        for (const row of result.rows) {
            let region = {
                id: row[0],
                name: row[1]
            };

            regions.push(region);
        }


        console.log(regions);
        res.json({ success: true, regions: regions });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ success: false, message: 'Error fetching data from the database' });
    }
})

router.post('/confirmregion', async function (req, res) {
    console.log(req.body);

    const { regionId } = req.body;

    console.log(regionId);
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const query = `UPDATE PRODUCT_ALLOTEMENT SET STATUS = 'UPDATED' WHERE REGION_ID = :regionId`;

        const result = await connection.execute(query, { regionId });
        res.json({ success: true, message: 'Region confirmed successfully' });

        await connection.commit();
        await connection.close();

    } catch (error) {
        await connection.rollback();
        console.error('Error confirming region:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})






module.exports = router;