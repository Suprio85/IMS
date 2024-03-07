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

router.get('/', async function (req, res, next) {
    username = "suprio";

    const connection = await oracledb.getConnection(dbConfig);

    const query = `SELECT * FROM PRODUCTS`;
    const result = await connection.execute(query);

    let products = [];  
    for (const row of result.rows) {
        let product = {
            id: row[0],
            name: row[1],
            price: row[2]
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


    
     catagories =await getCatagory();
     console.log("catagories "+ catagories);

    res.render('owner/userhome', { title: 'Express', username: username, products: products, regions: regions, catagories: catagories});
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

    let  query = "SELECT p.PRODUCT_ID, p.PRODUCT_NAME,P.PRICE, SUM(pp.QUANTITY) AS total_quantity FROM " + productTable+" GROUP BY p.PRODUCT_ID, p.PRODUCT_NAME, p.PRICE";

    if(priceOrder){
        if(priceOrder == 2)
            query += " ORDER BY P.PRICE ASC";
        else if(priceOrder ==1)
           query += " ORDER BY P.PRICE DESC";
        else if(priceOrder == 3 && filter == ""){
            query += " ORDER BY total_quantity DESC";
        }
    }

    if(filter && priceOrder != 3){
        query += " ORDER BY total_quantity DESC ";
        query += " FETCH FIRST "+filter+" ROWS ONLY ";
    }
    console.log(query);
    console.log(parameters);

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
            price: row[2]
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
    let catagories = await getCatagory();
    res.render('owner/userhome', { title: 'Express', username: username, products: products, regions: regions, catagories: catagories});


})


router.post('/', async function (req, res) {
    console.log(req.body);

    const regionId = req.body.regionID;
    const productId = req.body.productID;
    const startMonth = req.body.startMonth;
    const endMonth = req.body.endMonth;

    console.log(startMonth, endMonth);

    if (!startMonth || !endMonth || endMonth < startMonth) {
        return res.status(400).json({ success: false, message: 'Invalid date range' });
    }


    dataForLineChart = [];
    labelsForLineChart = [];

    try {
        const connection = await oracledb.getConnection(dbConfig);
        let query;
        let binds;

       if(regionId == "General")
        {
            query =
            `SELECT NVL(SUM(TOTAL_SALE),0)AS TOTAL_SALES , TO_CHAR(MONTH_YEAR, 'MON') AS MONTH
            FROM TEMP_MONTHLY_SALE
            WHERE PRODUCT_ID = :productId 
            AND TO_CHAR(MONTH_YEAR, 'YYYY-MM') BETWEEN :startMonth AND :endMonth
                    GROUP BY PRODUCT_ID,MONTH_YEAR
                    ORDER BY MONTH_YEAR`

            binds = {
                productId: productId,
                startMonth: startMonth,
                endMonth: endMonth
            };
            
        }

        else{
            query =`
            SELECT NVL(SUM(TOTAL_SALE),0)AS TOTAL_SALES , TO_CHAR(MONTH_YEAR, 'MON') AS MONTH
         FROM TEMP_MONTHLY_SALE
         WHERE PRODUCT_ID = :productId
         AND TO_CHAR(MONTH_YEAR, 'YYYY-MM') BETWEEN :startMonth AND :endMonth
         		AND SHOP_ID IN(
				 SELECT S.SHOP_ID
				 FROM SHOPS S LEFT JOIN AREAS A ON S.AREA_CODE = A.AREA_CODE
				 WHERE A.REGION_ID = :regionId
				 )
				 GROUP BY PRODUCT_ID,MONTH_YEAR
				 ORDER BY MONTH_YEAR`
          binds = {
            productId: productId,
            startMonth: startMonth,
            endMonth: endMonth,
            regionId: regionId
        }
    }

       

        const result = await connection.execute(query, binds);

        for (const row of result.rows) {
            labelsForLineChart.push(row[1]);
            dataForLineChart.push(row[0]);
        }
        console.log(dataForLineChart);
        console.log(labelsForLineChart);
        
        res.json({
            success: true,
            message: 'Data received and processed successfully',
            dataForLineChart: dataForLineChart,
            labelsForLineChart: labelsForLineChart
        });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ success: false, message: 'Error processing data' });
    }
});



router.get('/addproduct', function (req, res, next) {
    console.log("in addproduct");
    console.log(req.body);
    res.render('owner/addproduct', { title: 'Product' });
});

router.post('/addproduct', async function (req, res, next) {
    console.log("in addproduct post");
    console.log(req.body);

    res.status(200).json({ success: true, message: 'Product added successfully' });
});


router.post('/region', async function (req, res, next) {
  console.log(req.body);

  const productId = req.body.productID;
  const startMonth = req.body.startMonth;
  const endMonth = req.body.endMonth;

  try{
    if (!startMonth || !endMonth || endMonth < startMonth) {
      return res.status(400).json({ success: false, message: 'Invalid date range' });
    }

    dataForLineChart = [];
    labelsForLineChart = [];
    let Regions = [];
    
    const connection = await oracledb.getConnection(dbConfig);
   
    const result = await connection.execute(`SELECT * FROM REGION`);

    for (const row of result.rows) {
        let region = {
            id: row[0],
            name: row[1]
        }
        Regions.push(region);
    }

    console.log(Regions);
    

for(const region of Regions){
   
    const query = `SELECT GET_TOTAL_QUANTITY(:productId, :regionId, :startMonth, :endMonth) AS TOTAL_SALES FROM DUAL`;
    const binds = {
        productId: productId,
        startMonth: startMonth,
        endMonth: endMonth,
        regionId: region.id
    };
   const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    labelsForLineChart.push(region.name);
    dataForLineChart.push(result.rows[0].TOTAL_SALES);
}

    await connection.close();
    // If the processing is successful
    res.json({ success: true, message: 'Data received and processed successfully', dataForLineChart: dataForLineChart, labelsForLineChart: labelsForLineChart});


  }catch(error){
    console.error('Error processing data:', error);
    res.status(500).json({ success: false, message: 'Error processing data' });
  }
});




module.exports = router;