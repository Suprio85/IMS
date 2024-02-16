const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');





username = "suprio"
router.get('/', function (req, res, next) {

 
  products = [
    {
      id: 1,
      name: 'Product 1',
      price: 100
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300
    }
  ];
  res.render('layout/userlayout', { title: 'Express', username: username , products: products });
});



router.get('/profile', function (req, res, next) {
  res.render('shopmanager/profile', { title: 'Profile' });
}); 


router.get('/productquantity', async function (req, res, next) {
  const connection = await oracledb.getConnection(dbConfig);
  const result = await connection.execute(`SELECT * FROM PRODUCT`);
  const products = result.rows;
  res.render('shopmanager/productquantity', { title: 'Product Quantity', products: products });
});

router.get('/addproduct', function (req, res, next) {
  res.render('shopmanager/addproduct', { title: 'Add Product' });
});


function renderRequestPage(req, res, next) {
  const username = "suprio";
  requests = req.session.requests || [];
  console.log("in t");
  console.log(requests);
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

router.post('/sendrequests', async (req, res,next) => {
  const requests = req.body;
  console.log("requests");
  console.log(requests);

  try {
    // Clear the requests array in the session
    await new Promise((resolve, reject) => {
      req.session.requests = [];
      resolve();
    });

    console.log(req.session.requests); // This should be an empty array
    renderRequestPage(req,res,next);
  } catch (error) {
    console.error('Error saving request:', error);
    // Send an error response
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




router.get('/sales', function (req, res, next) {
  const purchases = [
    { PURCHASE_ID: 1, PURCHASE_TIME: '2022-02-15 10:30:00', SHOP_ID: 101, CUSTOMER_ID: 201 },
    { PURCHASE_ID: 2, PURCHASE_TIME: '2022-02-16 14:45:00', SHOP_ID: 102, CUSTOMER_ID: 202 },
    { PURCHASE_ID: 3, PURCHASE_TIME: '2022-02-17 09:15:00', SHOP_ID: 103, CUSTOMER_ID: 203 },
    // Add more sample data as needed
];
  res.render('shopmanager/sales', { title: 'Sales', purchases: purchases });
});


module.exports = router;
