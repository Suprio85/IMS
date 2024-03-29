const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');


//username = req.session.user.username;
username2 = "suprio"

router.get('/', async function (req, res, next) {

    const connection = await oracledb.getConnection(dbConfig);
    const query = `SELECT * FROM INVENTORY`;
    const result = await connection.execute(query);
    console.log(result);
    let Inventorys = [];

    for (const row of result.rows) {
        let inventory = {
            id: row[0],
            name: row[1],
        };
        Inventorys.push(inventory);
    }
    


    res.render('productionmanager/userhome', { title: 'Express', username: username2, Inventorys: Inventorys });
});


// router.post('/', async function (req, res, next) {
//     console.log(req.body);
//     res.status(200).send('Requests processed successfully');

// })

router.post("/", async function (req, res, next) {
    let connection;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection(dbConfig);
        const factoy_id_query = `SELECT FACTORY_ID FROM PRODUCTION_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id}`;
        const result = await connection.execute(factoy_id_query);
        const factoryId = result.rows[0][0];

        console.log(factoryId);

        //Process each request
        for (const request of req.body.requests) {
            const { productId, amount, inventoryId, price } = parseRequest(request);
            console.log(productId, amount, inventoryId, price);

            // Insert into INVENTORY_LOT
            const insertLotQuery = `
            INSERT INTO INVENTORY_LOT (LOT_ID, SUPPLY_DATE, FACTORY_ID, INVENTORY_ID)
            VALUES (INVENTORY_LOT_ID_SEQ.NEXTVAL, SYSTIMESTAMP, :factoryId, :inventoryId)`;
        await connection.execute(insertLotQuery, { factoryId, inventoryId });
        
        // Retrieve the last value from the sequence
        const getLotIdQuery = `SELECT INVENTORY_LOT_ID_SEQ.CURRVAL FROM DUAL`;
        const lotIdResult = await connection.execute(getLotIdQuery);
        
        const lotId = lotIdResult.rows[0][0];
        
        console.log("outLotId:", lotId);

            // Insert into INVENTORY_LOT_PRODUCTS
            const insertLotProductQuery = `
                INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
                VALUES (:lotId, :productId, :quantity, :price, SYSTIMESTAMP)`;
            await connection.execute(
                insertLotProductQuery,
                { lotId, productId, quantity: amount, price: price }
            );

            console.log("inserted into INVENTORY_LOT_PRODUCTS");

            // Update INVENTORY_PRODUCTS quantity
            const updateInventoryQuery = `
                UPDATE INVENTORY_PRODUCTS
                SET QUANTITY = QUANTITY + :quantity
                WHERE PRODUCT_ID = :productId AND INVENTORY_ID = :inventoryId`;
            await connection.execute(
                updateInventoryQuery,
                { productId, inventoryId, quantity: amount }
            );

            console.log("updated INVENTORY_PRODUCTS");
        }

        connection.commit();
        res.status(200).send('Requests processed successfully');
    } catch (error) {
        console.error('Error processing requests:', error);
        res.status(500).send('Internal Server Error');

        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            } finally {
                try {
                    await connection.close();
                } catch (closeError) {
                    console.error('Error closing connection:', closeError);
                }
            }
        }
    }
 });

function parseRequest(request) {
    const matches = request.match(/Product ID: (\d+), Amount: (\d+), Inventory ID: (\d+), Price: (\d+)/);
    if (matches) {
        const productId = parseInt(matches[1]);
        const amount = parseInt(matches[2]);
        const inventoryId = parseInt(matches[3]);
        const price = parseInt(matches[4]);
        return { productId, amount, inventoryId, price };
    } else {
        throw new Error('Invalid request format');
    }
}







module.exports = router;