const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');


router.get('/', function (req, res, next) {
    username = "suprio"
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
        price: 50
        }
    ];
    res.render('owner/userhome', { title: 'Express', username: username , products: products });
    });




module.exports = router;