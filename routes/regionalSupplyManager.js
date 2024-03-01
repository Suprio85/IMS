const express = require("express");
const dbconfig = require("../dbconfig");
const oracledb = require("oracledb");

var router = express.Router();


async function getAllProducts(){
    var products = [];
    let connection;
    try{
        connection = await oracledb.getConnection(dbconfig);
        var response = await connection.execute("SELECT PRODUCT_ID, PRODUCT_NAME, PRICE FROM PRODUCTS");
        for (row of response.rows){
            products.push({
                id: row[0], name: row[1], price: row[2]
            });
        }
    } catch(err){
        console.log(err);
    } finally{ connection.close(); }
    return products;
}

async function getAllShops(region_id){
    var shops = [];
    let connection;
    let query = "SELECT S.SHOP_ID, S.SHOP_NAME FROM SHOPS S WHERE S.AREA_CODE = ANY (SELECT AREA_CODE FROM AREAS WHERE REGION_ID=:region_id)";
    try{
        connection = await oracledb.getConnection(dbconfig);
        var response = await connection.execute(query, {region_id});
        for (row of response.rows){
            shops.push({id: row[0], name: row[1]});
        }
    } catch (err){
        console.log(err);
    } finally{ connection.close(); }
    return shops;
}

async function getProductAllotment(product_id){
    let connection;
    let amount = 0;
    let query1 = "SEELCT AMOUNT FROM PRODUCT_ALLOTEMENT WHERE PRODUCT_ID=:product_id AND STATUS='UPDATED'";
    try{
        connection = await oracledb.getConnection(dbconfig);
        let response = await connection.execute(query1, {product_id});
        amount = response.rows[0][0] ? response.rows[0][0] : 0;
        connection.close();
    } catch(err){
        console.log(err);
        if(connection) connection.close();
    }
    return amount;
}


router.get('/', async(req, res, next)=>{
    var employee_id = 2001;
    var region_id = 101;
    var username = 'nafis';
    let products = await getAllProducts();
    let shops = await getAllShops(region_id);
    console.log(shops);
    console.log(products);
    res.status(200).render("rsm/analyze_products", {products, shops, username});
})


router.post("/totalAllotedProduct", async(req, res, next)=>{
    let productId = req.body.productId;
    console.log("Getting allotment of", productId);
    let amount = await getProductAllotment(productId);
    res.json({totalQuantity: amount});
})

router.post("/fetch-sale-over-time", async(req, res, next)=>{
    console.log("Hello");
})


module.exports = router;