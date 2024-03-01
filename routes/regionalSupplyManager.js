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

async function getProductAllotment(product_id, region_id){
    let connection;
    let amount = 0;
    let query1 = "SELECT AMOUNT FROM PRODUCT_ALLOTEMENT WHERE PRODUCT_ID=:product_id AND REGION_ID=:region_id AND STATUS='UPDATED'";
    try{
        connection = await oracledb.getConnection(dbconfig);
        let response = await connection.execute(query1, {product_id, region_id});
        amount = response.rows[0][0] ? response.rows[0][0] : 0;
        connection.close();
    } catch(err){
        console.log(err);
        if(connection) connection.close();
    }
    return amount;
}


async function getProductVsTimeInfo(request){
    let dataForLineChart = [];
    let labelsForLineChart = [];
    let query = `
        WITH months AS (
            SELECT 
                TO_CHAR(ADD_MONTHS(TO_DATE(:start_date, 'YYYY-MM'), LEVEL - 1), 'MON,YY') AS month,
                ADD_MONTHS(TO_DATE(:start_date, 'YYYY-MM'), LEVEL - 1) AS monthDate
            FROM 
                DUAL
            CONNECT BY 
                LEVEL <= MONTHS_BETWEEN(TO_DATE(:end_date, 'YYYY-MM'), TO_DATE(:start_date, 'YYYY-MM')) + 1
        )
        SELECT
            m.month,
            NVL(SUM(PP.QUANTITY), 0) AS total_sales
        FROM
            months m
        LEFT JOIN
            (SELECT PURCHASE_ID, PURCHASE_TIME FROM PURCHASE WHERE SHOP_ID=:shop_id) p ON m.month = TO_CHAR(p.purchase_time, 'MON,YY')
        LEFT JOIN
            (SELECT * FROM PURCHASED_PRODUCT WHERE PRODUCT_ID=:product_id) PP ON PP.PURCHASE_ID=p.PURCHASE_ID
        GROUP BY
            m.month, m.monthDate
        ORDER BY
            m.monthDate
    `;

    let connection;
    try{
        connection = await oracledb.getConnection(dbconfig);
        let response = await connection.execute(query,{
            start_date: request.startMonth, end_date: request.endMonth,
            product_id: request.productID, shop_id: request.shopId
        });
        console.log(response);
        for (row of response.rows){
            labelsForLineChart.push(row[0]); dataForLineChart.push(row[1]);
        }
    }catch(err){
        console.log(err);
    } finally{ if(connection) connection.close(); }
    return {dataForLineChart, labelsForLineChart};
}

// async function getTotalAllotedAmount(product_id, region_id){
//     let amount = 0;
//     let connection;
//     let query1 = "SELECT AMOUNT FROM PRODUCT_ALLOTEMENT WHERE REGION_ID=:region_id AND PRODUCT_ID=:product_id";
//     // let query2 = "SELECT NVL(SUM(),0) FROM "
// }



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


router.post("/total-alloted-product", async(req, res, next)=>{
    let productId = req.body.productId;
    let region_id = 101;
    console.log("Getting allotment of", productId);
    let amount = await getProductAllotment(productId, region_id);
    res.json({totalQuantity: amount});
})

router.post("/fetch-sale-over-time", async(req, res, next)=>{
    console.log("Hello");
    let request = req.body;
    console.log(request);
    let chartInfo =await getProductVsTimeInfo(request);
    console.log(chartInfo);
    res.json({...chartInfo, message: 'Dataset ?', success: true});
})


router.post("/total-alloted-product", async(req, res, next)=>{
    console.log("Showing product id", req.body.productId);
})


router.post("/allot-product-to-shop", async(req, res, next)=>{
    console.log(req.body);
})


module.exports = router;