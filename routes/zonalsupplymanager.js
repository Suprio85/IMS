const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');



router.use(express.urlencoded({ extended: true }));



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

router.post('/search', async function (req, res, next) {
    if(req.session.user === undefined){
        res.redirect('/login');
        return;
    }
    
    username = req.session.user.username;
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
    let isOrder = false;

    if (req.body.nameInput || req.body.categoryInput || req.body.priceInput || req.body.productidInput || req.body.priceOrder || req.body.filterInput) {


        productTable = "PRODUCTS p LEFT JOIN PURCHASED_PRODUCT pp ON pp.product_id = p.product_id LEFT JOIN CATAGORY C ON P.CATAGORY_ID = C.CATAGORY_ID"
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

    let  query = "SELECT p.PRODUCT_ID, p.PRODUCT_NAME,P.PRICE,p.IMAGE, SUM(pp.QUANTITY) AS total_quantity FROM " + productTable+" GROUP BY p.PRODUCT_ID, p.PRODUCT_NAME, p.PRICE, p.IMAGE";

    if (priceOrder) {
        if (priceOrder == 2)
           {
               query += " ORDER BY P.PRICE ASC";
                isOrder = true;
           }
        else if (priceOrder == 1){
            query += " ORDER BY P.PRICE DESC";
            isOrder = true;

        }
    }

    if (filter) {
        if(!isOrder)
        query += " ORDER BY TOTAL_QUANTITY DESC";
        else
        query += " ,TOTAL_QUANTITY DESC";

        if (filter == 10) {
            query += " FETCH FIRST 10 ROWS ONLY";
        }

        else if(filter == 5){
            query += " FETCH FIRST 5 ROWS ONLY";
        }
        
    }

    const connection = await oracledb.getConnection(dbConfig);
    let result;
    try{

       result = await connection.execute(query, parameters);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }

    console.log(result.rows);
    
    let products = [];

    for (const row of result.rows) {
        let product = {
            id: row[0],
            name: row[1],
            price: row[2],
            image: row[3],
        };
        products.push(product);
    }

    let regions = [];
    const query2 = `SELECT * FROM REGION`;
    const result2 = await connection.execute(query2);

    for (const row of result2.rows) {
        let region = {
            id: row[0],
            name: row[1]
        };
        regions.push(region);
    }
    isWhere = false;
    isOrder = false;
    let catagories = await getCatagory();
    res.render('zonalsupplymanager/userhome', { title: 'Express', username: username, products: products, regions: regions, catagories: catagories});


})





router.get('/', async function (req, res, next) {
    if(req.session.user === undefined){
        res.redirect('/login');
        return;
    }
    username = req.session.user.username;

    const connection = await oracledb.getConnection(dbConfig);

    const query = `SELECT * FROM PRODUCTS`;
    const result = await connection.execute(query);

    let products = [];
    for (const row of result.rows) {
        let product = {
            id: row[0],
            name: row[1],
            price: row[2],
            image: row[4]
        };
        products.push(product);
    }

    let regions = [];
    const query2 = `SELECT * FROM REGION`;
    const result2 = await connection.execute(query2);

    for (const row of result2.rows) {
        let region = {
            id: row[0],
            name: row[1]
        };
        regions.push(region);
    }

    let catagories = await getCatagory();
    res.render('zonalsupplymanager/userhome', { username: username, regions: regions, title: 'Express', products: products, catagories: catagories });

});


router.post('/totalproduct', async function (req, res) {
    try {
        const productId = req.body.productId;

        console.log(productId);



        const connection = await oracledb.getConnection(dbConfig);

        const query = `SELECT NVL(SUM(QUANTITY),0) AS totalQuantity FROM INVENTORY_PRODUCTS WHERE PRODUCT_ID = :productId`;
        const result = await connection.execute(query, { productId });

        console.log(result);

        const totalQuantity = result.rows[0][0];

        console.log(totalQuantity);

        const query2 = `SELECT NVL(SUM(AMOUNT),0) AS ALLOTMENT_AMOUNT FROM PRODUCT_ALLOTEMENT WHERE PRODUCT_ID = :productId AND (STATUS = 'UPDATED' OR STATUS = 'ON PROCESS')`;

        const result2 = await connection.execute(query2, { productId });

        const Allotment_amount = result2.rows[0][0];

        res.json({ totalQuantity: totalQuantity - Allotment_amount });
    } catch (error) {
        console.error("Error fetching total quantity:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/totalproductregion', async function (req, res) {

    const { productId, regionId, quantity } = req.body;

    console.log(productId);
    console.log(regionId);
    console.log(quantity);

    const connection = await oracledb.getConnection(dbConfig);
    try {

        const query = `
  UPDATE PRODUCT_ALLOTEMENT
  SET AMOUNT = :quantity, STATUS = 'ON PROCESS', LAST_UPDATED=CURRENT_TIMESTAMP, USED_AMOUNT=1
  WHERE PRODUCT_ID = :productId AND REGION_ID = :regionId
`;

        const binds = {
            quantity: { dir: oracledb.BIND_IN, val: quantity },
            productId: { dir: oracledb.BIND_IN, val: productId },
            regionId: { dir: oracledb.BIND_IN, val: regionId },
        };


  result =  await connection.execute(query, binds);
        console.log(result);

        res.json({ success: true, message: 'Product allotted successfully.' });
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        console.error('Error allotting product:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.get('/makeold', async function (req, res, next) {
    console.log("in makeold");

    const connection = await oracledb.getConnection(dbConfig);
    res.json({ success: true, message: 'Data received and processed successfully' });
    try {

        const query = `UPDATE PRODUCT_ALLOTEMENT SET STATUS = 'OLD'`
        const result = await connection.execute(query);



        //console.log("hi");
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error('Error fetching data from the database:', error);

    }
})


router.get('/sendregion', async function (req, res, next) {
    console.log("in sendregion");
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT * FROM REGION`;
        const result = await connection.execute(query);
        let regions = [];
        for (const row of result.rows) {
            let region = {
                id: row[0],
                name: row[1]
            };

            regions.push(region);
        }


        console.log(regions);
        res.json({ success: true, regions: regions });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ success: false, message: 'Error fetching data from the database' });
    }
})

router.post('/confirmregion', async function (req, res) {
    console.log(req.body);

    const { regionId } = req.body;

    console.log(regionId);
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const query = `UPDATE PRODUCT_ALLOTEMENT SET STATUS = 'UPDATED' WHERE REGION_ID = :regionId`;

        const result = await connection.execute(query, { regionId });
        res.json({ success: true, message: 'Region confirmed successfully' });

        await connection.commit();
        await connection.close();

    } catch (error) {
        await connection.rollback();
        console.error('Error confirming region:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})






module.exports = router;