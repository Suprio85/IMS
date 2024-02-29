const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');




router.get('/', async function (req, res, next) {
  if(req.session.user === undefined){
    res.redirect('/login');
    console.log("I did come here right ?");
    return;
  }
  const username = req.session.user.username;

  try {


    let startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 
    startOfDay = startOfDay.toISOString().slice(0, 19).replace("T", " ");
    console.log("Start of day: ", startOfDay);
    
    let endOfDay = new Date();
     endOfDay = endOfDay.toISOString().slice(0, 19).replace("T", " ");
    console.log("End of day: ", endOfDay);
    

     
      

      const connection = await oracledb.getConnection(dbConfig);
      const reslt = await connection.execute(`SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id}`)
      const shop_id = reslt.rows[0][0];

      console.log("Shop id: ", shop_id);
      
      const query =
      `
      SELECT DISTINCT
    PD.PRODUCT_ID,
    PD.PRODUCT_NAME,
    GET_TOTAL_SALES(
        PD.PRODUCT_ID,
        SP.SHOP_ID,
        TO_TIMESTAMP('2022-02-28 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
        TO_TIMESTAMP('2022-02-28 23:59:59', 'YYYY-MM-DD HH24:MI:SS')
    ) AS TOTAL_SALES,
    (SELECT CATAGORY_NAME FROM CATAGORY WHERE CATAGORY_ID = PD.CATAGORY_ID) AS CATAGORY_NAME
FROM
    PRODUCTS PD
JOIN
    SHOP_PRODUCTS SP ON PD.PRODUCT_ID = SP.PRODUCT_ID
JOIN
    PURCHASED_PRODUCT PR ON PD.PRODUCT_ID = PR.PRODUCT_ID
JOIN
    PURCHASE P ON PR.PURCHASE_ID = P.PURCHASE_ID
WHERE
    SP.SHOP_ID = :shop_id
ORDER BY TOTAL_SALES DESC
  `
  const result = await connection.execute(query, {
    shop_id: shop_id
  });

      let products = [];
      for (const row of result.rows) {
          let product = {
              id: row[0],
              name: row[1],
              totalSales: row[2],
              catagoery: row[3] 

          };
          products.push(product);
      }

      
    

      res.render('layout/userlayout', { title: 'Home', username: username, products: products});


  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});



router.get('/profile', function (req, res, next) {
  res.render('shopmanager/profile', { title: 'Profile' });
});


router.get('/productquantity', async function (req, res, next) {
  if(req.session.user === undefined){
    res.redirect('/login');
    console.log("I did come here right ?");
    return;
  }
  const connection = await oracledb.getConnection(dbConfig);
  // const shop_id =`SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.user_id}`;
  
  // const query = `SELECT p.PRODUCT_ID, p.PRODUCT_NAME,p.IMAGE,P.CATAGOERY_ID, q.QUANTITY FROM PRODUCT p LEFT JOIN SHOP_PRODUCTS q ON p.PRODUCT_ID = q.PRODUCT_ID WHERE p.SHOP_ID = ${shop_id}`;

  // const products = await connection.execute(query);
   const result = await connection.execute(`SELECT * FROM PRODUCTS`);
  await connection.close();
  const products = result.rows;
  res.render('shopmanager/productquantity', { title: 'Product Quantity', products: products });
});

router.post('/productquantity', async function (req, res, next) {
  //console.log(req.body);

  res.status(200).json({ success: true, message: 'Product quantity updated successfully' });

});

router.get('/addproduct', function (req, res, next) {
  res.render('shopmanager/addproduct', { title: 'Add Product' });
});


function renderRequestPage(req, res, next) {
  if(req.session.user === undefined){
    res.redirect('/login');
    console.log("I did come here right ?");
    return;
  }
  const username = req.session.user.username;
  const requests = req.session.requests || [];
  res.render('shopmanager/Request', { title: 'Request', username: username, requests: requests });
}

// Use the function for both GET and POST requests
router.get('/request', renderRequestPage);

router.post('/request', function (req, res, next) {
  let requests = req.session.requests || [];

  const newRequest = req.body;
  requests.push(newRequest);
  req.session.requests = requests;
  renderRequestPage(req, res, next);
});

router.post('/sendrequests', async (req, res, next) => {
  if(req.session.user === undefined){
    res.redirect('/login');
    return;
  }
  const requests = req.body;
  console.log('Requests:', requests);

  let connection;
  try {
    // Insert into SHIPMENT_REQUEST
    connection = await oracledb.getConnection(dbConfig);
    const shopId = `(SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id})`;
    let shop_id = (await connection.execute(shopId)).rows[0][0];
   
    

    let requestId = (await connection.execute("SELECT SHIPMENT_REQUEST_ID_SEQ.NEXTVAL FROM DUAL")).rows[0][0];
    console.log("Request id: ", requestId);
    console.log("Shop Id: ", shop_id);
    const insertRequestQuery = `
        INSERT INTO SHIPMENT_REQUEST 
        VALUES (:requestId, SYSDATE, 'PENDING', :shop_id)`;
    const requestResult = await connection.execute(insertRequestQuery, {requestId, shop_id});
    
    // // Insert into SHIPMENT_REQUEST_PRODUCT for each product in the request
    for (const {id, amount} of requests) {
        const insertRequestProductQuery = `
            INSERT INTO SHIPMENT_REQUEST_PRODUCT (REQUEST_ID, PRODUCT_ID, QUANTITY)
            VALUES (:requestId, :productId, :quantity)`;
        await connection.execute(insertRequestProductQuery, {
            requestId,
            productId: id,
            quantity: amount
        });
    }

    // Clear the requests array in the session
    req.session.requests = [];

    console.log(req.session.requests);
    connection.commit();
    res.status(200).json({ success: true, message: 'Requests sent successfully' });
} catch (error) {
    console.error('Error saving request:', error);
    // Send an error response
    res.status(500).json({ success: false, message: 'Internal Server Error' });
    if(connection)
      connection.rollback();
    // connection.close();
} finally{
  try{ if(connection) connection.close(); }
  catch(err){ console.log(err); }
}
});





router.get('/sales', async function (req, res, next) {
  if(req.session.user === undefined){
    res.redirect('/login');
    return;
  }
  try {
    const shopId =`(SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id})`

  //   // Implement database query to fetch purchase data based on the shop ID
    const query = `
        SELECT
            P.PURCHASE_ID,
            PP.PRODUCT_ID,
            P.CUSTOMER_ID,
            PP.PRODUCT_PRICE,
            PP.QUANTITY
        FROM
            PURCHASE P
        JOIN
            PURCHASED_PRODUCT PP ON P.PURCHASE_ID = PP.PURCHASE_ID
        WHERE
            P.SHOP_ID = ${shopId}
    `;

    const connection = await oracledb.getConnection(dbConfig);
    // const result = await connection.execute(query, { shopId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const result = await connection.execute(query);
    
    
    let purchases = [];
    for(const row of result.rows){
      let purchase ={ PURCHASE_ID: row[0], PRODUCT_ID: row[1],
                      CUSTOMER_ID: row[2], PRODUCT_PRICE: row[3],
                      QUANTITY: row[4] }
      purchases.push(purchase);
    }

  //   await connection.close();
    // const purchases = [
    //   { PURCHASE_ID: 1, PRODUCT_ID: 101, CUSTOMER_ID: 201, PRODUCT_PRICE: 25.99, QUANTITY: 5 },
    //   { PURCHASE_ID: 2, PRODUCT_ID: 102, CUSTOMER_ID: 202, PRODUCT_PRICE: 19.95, QUANTITY: 8 },
    //   { PURCHASE_ID: 3, PRODUCT_ID: 103, CUSTOMER_ID: 203, PRODUCT_PRICE: 35.50, QUANTITY: 12 },
    //   // Add more dummy data as needed
    // ];
  


    res.render('shopmanager/sales', { title: 'Sales', purchases: purchases });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.render('error', { message: 'An error occurred while fetching sales data.' });
  }
});


// router.get('/shipment', async function (req, res, next) {
//   const shipments = [
//     {
//       SHIPMENT_ID: 1,
//       SHIPPING_DATE: '2024-03-01',
//       RECEIVING_DATE: '2024-03-05',
//       SHIPPING_COST: 20.50,
//       DELIVERY_STATUS: 'PENDING',
//       INVENTORY_ID: 101,
//       SHOP_ID: 201,
//     },
//     {
//       SHIPMENT_ID: 2,
//       SHIPPING_DATE: '2024-03-02',
//       RECEIVING_DATE: '2024-03-06',
//       SHIPPING_COST: 15.75,
//       DELIVERY_STATUS: 'SHIPPED',
//       INVENTORY_ID: 102,
//       SHOP_ID: 202,
//     },
//     {
//       SHIPMENT_ID: 3,
//       SHIPPING_DATE: '2024-03-03',
//       RECEIVING_DATE: '2024-03-07',
//       SHIPPING_COST: 30.00,
//       DELIVERY_STATUS: 'DELIVERED',
//       INVENTORY_ID: 103,
//       SHOP_ID: 203,
//     },
//   ];


//   res.render('shopmanager/shipment', { shipments: shipments });
// })

router.get('/shipment', async function (req, res, next) {

  let shipments = [];

  const connection = await oracledb.getConnection(dbConfig);
  const shopId = `(SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id})`;
  let shop_id = (await connection.execute(shopId)).rows[0][0];

  console.log("Shop id: ", shop_id);

  const query = `SELECT * FROM SHIPMENT WHERE SHOP_ID = ${shop_id}`;

  const result = await connection.execute(query);

  for (const row of result.rows) {

    let shipment = {
      SHIPMENT_ID: row[0],
      SHIPPING_DATE: row[1].toISOString().slice(0, 19).replace("T", " "),
      SHIPPING_COST: row[3],
      DELIVERY_STATUS: row[4],
      INVENTORY_ID: row[5]
    };
    shipments.push(shipment);
  }

  console.log(shipments);
   

  res.render('shopmanager/shipment', { shipments: shipments });
});

router.post('/shipmentproduct', async  (req, res) => {
  console.log("shipmentid")
  const { shipmentId } = req.body;
  console.log(shipmentId);

  const productDetails = [];


  const connection = await oracledb.getConnection(dbConfig);
  const query = `SELECT * FROM SHIPMENT_PRODUCT WHERE SHIPMENT_ID = ${shipmentId}`;

  const result = await connection.execute(query);

  console.log(result);

  for (const row of result.rows) {
  let product = {
    PRODUCT_ID: row[0],
    QUANTITY: row[1],
    RETURN_DATE: row[2],
    RETURN_AMOUNT: row[3]
  }
  productDetails.push(product);
}
  // Send the product details as JSON response
  res.json(productDetails);

});



router.post('/updateshipmentstatus', async (req, res) => {
  const { shipmentId, status } = req.body;
  console.log(shipmentId, status);

   try {
      const connection = await oracledb.getConnection(dbConfig);

      // Update the delivery status in the shipments table

      const query = `UPDATE SHIPMENT SET DELIVERY_STATUS = :status WHERE SHIPMENT_ID = :shipmentId`;

      console.log(query);


      
      await connection.execute(
          `UPDATE SHIPMENT SET DELIVERY_STATUS = :status WHERE SHIPMENT_ID = :shipmentId`,
          { status, shipmentId }
  
      );

      // Fetch the product details for the shipment
      const result = await connection.execute(
          `SELECT * FROM SHIPMENT_PRODUCT WHERE SHIPMENT_ID = :shipmentId`,
          { shipmentId }
      );
      let products =[];
      for (const row of result.rows) {
          let product = {
              PRODUCT_ID: row[0],
              QUANTITY: row[1]
          };
          products.push(product);
      }

      console.log(products);

      // Update the quantity in the shop_product table for each product
      const shopid = `SELECT SHOP_ID FROM SHOP_MANAGER WHERE EMPLOYEE_ID = ${req.session.user.id}`;

      let shop_id = (await connection.execute(shopid)).rows[0][0];

      for (const product of products) {
          await connection.execute(
              `UPDATE SHOP_PRODUCTS SET QUANTITY = QUANTITY + :quantity WHERE PRODUCT_ID = :productId AND SHOP_ID = ${shop_id}`,
              { quantity: product.QUANTITY, productId: product.PRODUCT_ID }
        
          );
      }

      res.status(200).json({ success: true, message: 'Shipment status updated and quantities updated successfully' });
      await connection.commit();
  } catch (error) {
      //await connection.rollback();
      console.error('Error updating shipment status and quantities:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  } 
});




module.exports = router;
