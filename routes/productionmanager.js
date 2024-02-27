const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');
const { connect } = require('./products');


router.get('/', function (req, res, next) {
    username = "suprio"  
   Inventorys=[
    {
        id: 1,
        name: 'Inventory 1',
        price: 100
    },
    {
        id: 2,
        name: 'Inventory 2',
        price: 200
    },
    {
        id: 3,
        name: 'Inventory 3',
        price: 50
    }
   ]


    res.render('productionmanager/userhome', { title: 'Express', username: username, Inventorys: Inventorys });
});


router.post('/', async function (req, res, next) {
    console.log(req.body);
    res.status(200).send('Requests processed successfully');

})

// router.post("/", async function (req, res, next) {
//     let connection;

//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const factoy_id_query = `SELECT FACTORY_ID FROM PRODUCTION_MANAGER WHERE EMPLOYEE_ID = ${req.session.userId}`;
//         const result = await connection.execute(factoy_id_query);
//         const factoryId = result.rows[0].FACTORY_ID;

//         // Process each request
//         for (const request of req.body.requests) {
//             const { productId, amount, inventoryId } = parseRequest(request);

//             // Insert into INVENTORY_LOT
//             const insertLotQuery = `
//                 INSERT INTO INVENTORY_LOT (SUPPLY_DATE, FACTORY_ID, INVENTORY_ID)
//                 VALUES (SYSTIMESTAMP, :factoryId, :inventoryId)
//                 RETURNING LOT_ID INTO :outLotId`;
//             const lotIdResult = await connection.execute(
//                 insertLotQuery,
//                 {
//                     factoryId,
//                     inventoryId,
//                     outLotId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
//                 }
//             );
//             const lotId = lotIdResult.outBinds.outLotId;

//             // Insert into INVENTORY_LOT_PRODUCTS
//             const insertLotProductQuery = `
//                 INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
//                 VALUES (:lotId, :productId, :quantity, :price, SYSTIMESTAMP)`;
//             await connection.execute(
//                 insertLotProductQuery,
//                 { lotId, productId, quantity: amount, price: 0 }
//             );

//             // Update INVENTORY_PRODUCTS quantity
//             const updateInventoryQuery = `
//                 UPDATE INVENTORY_PRODUCTS
//                 SET QUANTITY = QUANTITY + :quantity
//                 WHERE PRODUCT_ID = :productId AND INVENTORY_ID = :inventoryId`;
//             await connection.execute(
//                 updateInventoryQuery,
//                 { productId, inventoryId, quantity: amount }
//             );
//         }

//         res.status(200).send('Requests processed successfully');
//     } catch (error) {
//         console.error('Error processing requests:', error);
//         res.status(500).send('Internal Server Error');

//         if (connection) {
//             try {
//                 await connection.rollback();
//             } catch (rollbackError) {
//                 console.error('Error rolling back transaction:', rollbackError);
//             } finally {
//                 try {
//                     await connection.close();
//                 } catch (closeError) {
//                     console.error('Error closing connection:', closeError);
//                 }
//             }
//         }
//     }
// });

function parseRequest(request) {
    // Example request: 'Product ID: 10, Amount: 12, Inventory ID: 1'
    const matches = request.match(/Product ID: (\d+), Amount: (\d+), Inventory ID: (\d+)/);
    if (matches) {
        const productId = parseInt(matches[1]);
        const amount = parseInt(matches[2]);
        const inventoryId = parseInt(matches[3]);
        return { productId, amount, inventoryId };
    } else {
        throw new Error('Invalid request format');
    }
}







module.exports = router;