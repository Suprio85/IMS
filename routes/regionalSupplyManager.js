const express = require("express");
const dbconfig = require("../dbconfig");
const oracledb = require("oracledb");
const { json } = require("body-parser");

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


async function getAllShipRequest(region_id){
    let connection;
    let requests = [];
    let query = "SELECT SH.SHOP_NAME, SR.REQUEST_ID, A.STREET_ADDRESS||', '||A.POSTAL_CODE||', '||A.CITY, SH.SHOP_ID "+
                "FROM SHOPS SH JOIN (SELECT * FROM SHIPMENT_REQUEST WHERE STATUS<>'PROCESSED') "+
                "SR ON SH.SHOP_ID=SR.SHOP_ID "+
                "JOIN AREAS A ON SH.AREA_CODE=A.AREA_CODE WHERE A.REGION_ID=:region_id";
    try{
        connection =await oracledb.getConnection(dbconfig);
        let result =await connection.execute(query, {region_id});
        connection.close();
        result.rows.forEach((request)=>{
            requests.push({
                shop_name: request[0],
                req_id: request[1],
                shop_area: request[2],
                shop_id: request[3]
            });
        });
    } catch (err){
        console.log(err);
        if(connection) connection.close();
    }
    return requests;
}


async function getRequestInfo(request_id){
    let request = {};
    let products = [];
    let connection;
    let query = "SELECT SH.SHOP_NAME, A.STREET_ADDRESS||', '||A.POSTAL_CODE||', '||A.CITY, SH.SHOP_ID "+
                "FROM SHOPS SH JOIN (SELECT * FROM SHIPMENT_REQUEST WHERE REQUEST_ID=:request_id) "+
                "SR ON SH.SHOP_ID=SR.SHOP_ID "+
                "JOIN AREAS A ON SH.AREA_CODE=A.AREA_CODE";
    let product_query = "SELECT P.PRODUCT_ID, P.PRODUCT_NAME, P.PRICE, SR.QUANTITY, SR.SUPPLIABLE_AMOUNT "+
                        "FROM PRODUCTS P JOIN (SELECT * FROM SHIPMENT_REQUEST_PRODUCT WHERE REQUEST_ID=:request_id) SR "+
                        "ON P.PRODUCT_ID=SR.PRODUCT_ID";
    try{
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(query, {request_id});
        request.shop_name = result.rows[0][0]; request.shop_location = result.rows[0][1]; request.shop_id = result.rows[0][2];
        request.req_id = request_id;
        result = await connection.execute(product_query, {request_id});
        console.log(result.rows);
        for(let product of result.rows){
            products.push({
                id: product[0], name: product[1], price: product[2],
                quantity: product[3], supp_amount: product[4]
            });
            console.log(product);
        }
    } catch (err){
        console.log(err);
        if(connection) connection.close();
    }
    return {request, products};
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
    
    let query2 = `
        SELECT TO_CHAR(MONTH_YEAR, 'MON,YY'), TOTAL_SALE
        FROM TEMP_MONTHLY_SALE WHERE SHOP_ID = :shop_id
        AND PRODUCT_ID = :product_id
        AND MONTH_YEAR <= TO_DATE(:end_date, 'YYYY-MM') AND MONTH_YEAR >= TO_DATE(:start_date, 'YYYY-MM')
        ORDER BY MONTH_YEAR
    `;

    let query3 = `
        SELECT TO_CHAR(MONTH_YEAR, 'MON,YY'), TOTAL_SALE
        FROM TEMP_MONTHLY_SALE WHERE SHOP_ID = 30001
        AND PRODUCT_ID = 50001
        AND MONTH_YEAR <= TO_DATE('2023-12', 'YYYY-MM') AND MONTH_YEAR >= TO_DATE('2022-01', 'YYYY-MM')
        ORDER BY MONTH_YEAR
    `;

    let connection;
    try{
        connection = await oracledb.getConnection(dbconfig);
        // let response = await connection.execute(query3)
        let response = await connection.execute(query2,{
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


router.get("/all-requests", async(req, res)=>{
    var employee_id = 2001;
    var region_id = 101;
    var username = 'nafis';
    let requests = await getAllShipRequest(region_id);
    res.status(200).render("rsm/review_requests", {username, requests});
    // res.status(200).send(requests);
})

router.get("/process-request", async(req, res)=>{
    let username = "nafis";
    let requestId = req.query.requestId;
    let info = await getRequestInfo(requestId);
    // res.status(200).send(info);
    res.status(200).render("rsm/shipment_request", {username, ...info});
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
    console.log("request:", request);
    let chartInfo =await getProductVsTimeInfo(request);
    console.log(chartInfo);
    res.json({...chartInfo, message: 'Dataset ?', success: true});
})


router.post("/total-alloted-product", async(req, res, next)=>{
    console.log("Showing product id", req.body.productId);
})


router.post("/allot-product-to-shop", async(req, res, next)=>{
    console.log(req.body);
    res.json({message: "Alloted Successfully"})
})


module.exports = router;