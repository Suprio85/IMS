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
            price: 300
        },

        {
            id: 4,
            name: 'Product 4',
            price: 400
        },
        {
            id: 5,
            name: 'Product 5',
            price: 500
        },
        {
            id: 6,
            name: 'Product 6',
            price: 600
        },
        {
            id: 7,
            name: 'Product 7',
            price: 700

        },
        {
            id: 8,
            name: 'Product 8',
            price: 800
        }
    ];

    res.render('productionmanager/userhome', { title: 'Express', username: username, products: products });
});




module.exports = router;