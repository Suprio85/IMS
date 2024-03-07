var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');

async function getCatagory() {
    let category = [];
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT * FROM CATAGORY`;
        const result = await connection.execute(query);

        for (const row of result.rows) {
            let cat = {
                id: row[0],
                name: row[1]
            };
            category.push(cat);
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;  
    }

    return category;
}



router.get('/', async function(req, res, next) {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Fetch products from the database
        // const query =`SELECT P.*, C.CATAGORY_NAME FROM PRODUCTS P LEFT JOIN CATAGORY C ON P.CATAGORY_ID = C.CATAGORY_ID`;
        // const result = await connection.execute(query);
        // const products = result.rows;
        const  query = `SELECT P.PRODUCT_ID, P.PRODUCT_NAME,P.PRICE,P.WARRANTY_YEARS,P.STATUS, C.CATAGORY_NAME
                        FROM PRODUCTS P LEFT JOIN CATAGORY C ON P.CATAGORY_ID = C.CATAGORY_ID`;


        const result = await connection.execute(query);
        let products = [];
        for (const row of result.rows) {
            let product = {
                id: row[0],
                name: row[1],
                price: row[2],
                waranty : row[3],
                status : row[4] == "continued" ? "Available" : "Not Available",
                catagory : row[5]
            };
            products.push(product);
        }

        console.log(result);
        console.log(products);


        // Release the connection
        await connection.close();
        catagories = await getCatagory();
     
        res.status(200).render('users', { title: 'Product Information', products: products,catagories: catagories});
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/search', async function (req, res, next) {

    console.log(req.body);
    const name = req.body.nameInput;
    const catagory = req.body.categoryInput;
    const price = req.body.priceInput;
    const productid = req.body.productidInput;
    const priceOrder = req.body.priceOrder;
    const filter = req.body.filterInput;

    
    const parameters = {};
    let productTable = "PRODUCTS";
    let isWhere = false;

    if (req.body.nameInput || req.body.categoryInput || req.body.priceInput || req.body.productidInput || req.body.priceOrder || req.body.filterInput) {


        productTable = " PRODUCTS p LEFT JOIN PURCHASED_PRODUCT pp ON pp.product_id = p.product_id LEFT JOIN CATAGORY C ON P.CATAGORY_ID = C.CATAGORY_ID "
        let conditions = [];
        if (req.body.productidInput) {
            conditions.push(" WHERE P.PRODUCT_ID = :product_id");
            parameters.product_id = req.body.productidInput;
        }

        else {
            if (req.body.nameInput) {
                if(!isWhere){
                conditions.push(" WHERE UPPER(P.PRODUCT_NAME) LIKE '%' || UPPER(:product_name) || '%'");
                isWhere = true;
                }
                else
                {
                    conditions.push(" UPPER(P.PRODUCT_NAME) LIKE '%' || UPPER(:product_name) || '%'");
                }
                parameters.product_name = req.body.nameInput;
            }

            if (req.body.categoryInput) {
                if(!isWhere){
                    conditions.push(" WHERE p.CATAGORY_ID = :category_id");
                    isWhere = true;
                }
                else
                conditions.push("p.CATAGORY_ID = :category_id");
                parameters.category_id = req.body.categoryInput;
            }

            if (req.body.priceInput) {
                if(!isWhere){
                    conditions.push(" WHERE P.PRICE <= :product_price");
                    isWhere = true;
                }
                else
                conditions.push("P.PRICE <= :product_price");
                parameters.product_price = req.body.priceInput;
            }
        }


        productTable += conditions.join(" AND ");
        //productTable += ")";
    }

    let  query = "SELECT p.PRODUCT_ID, p.PRODUCT_NAME,P.PRICE,p.WARRANTY_YEARS,p.STATUS,C.CATAGORY_NAME, SUM(pp.QUANTITY) AS total_quantity FROM " + productTable+" GROUP BY p.PRODUCT_ID, p.PRODUCT_NAME, p.PRICE,p.WARRANTY_YEARS,p.STATUS,C.CATAGORY_NAME";

    if(priceOrder){
        if(priceOrder == 2)
            query += " ORDER BY P.PRICE ASC";
        else if(priceOrder ==1)
           query += " ORDER BY P.PRICE DESC";
        else if(priceOrder == 3 && filter == ""){
            query += " ORDER BY total_quantity DESC";
        }
        else if(priceOrder == 3 && filter !=""){
            query += " ORDER BY total_quantity DESC";
            query += " FETCH FIRST "+filter+" ROWS ONLY";
        }

    }

    if(filter && priceOrder != 3){
        query += " ORDER BY total_quantity DESC ";
        query += " FETCH FIRST "+filter+" ROWS ONLY ";
    }
    console.log(query);
   
    
    console.log(".........................");
    const connection = await oracledb.getConnection(dbConfig);

    console.log("....................")
    const result = await connection.execute(query, parameters);

    
    let products = [];

    for (const row of result.rows) {
        let product = {
            id: row[0],
            name: row[1],
            price: row[2],
            waranty : row[3],
            status : row[4] == "continued" ? "Available" : "Not Available",
            catagory : row[5]

        }
        products.push(product);
    }

    isWhere = false;
    let catagories = await getCatagory();
    console.log(catagories);
    
    
    res.render('users', { title: 'Product Information', products: products, catagories: catagories });

    
});

router.post('/shops', async function(req, res, next) {
console.log(req.body);
const query = `SELECT S.SHOP_ID, S.SHOP_NAME, S.PHONE_NUMBER FROM SHOPS S JOIN SHOP_PRODUCTS SP ON S.SHOP_ID = SP.SHOP_ID WHERE SP.PRODUCT_ID = ${req.body.productId}`;

const connection = await oracledb.getConnection(dbConfig);
const result = await connection.execute(query);
let shops = [];
for (const row of result.rows) {
    let shop = {
        id: row[0],
        name: row[1],
        phone: row[2]
    };
    shops.push(shop);
}
console.log(shops);

res.json({shops: shops});

});


module.exports = router;
