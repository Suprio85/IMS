const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { request } = require('../app');

router.use(express.urlencoded({ extended: true }));

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

    regions = [
        {
            id: 1,
            name: 'Region 1'
        },
        {
            id: 2,
            name: 'Region 2'
        },
        // ... more regions
    ];

    res.render('owner/userhome', { title: 'Express', username: username, products: products, regions: regions });
});


router.post('/search', function (req, res, next) {

    console.log(req.body);
    const name = req.body.nameInput;
    const catagory = req.body.categoryInput;
    const price = req.body.priceInput;
    const productid = req.body.productidInput;

    const values = ["name", "category", "price", "productid"];
    const parameters = {};
    let productTable = "PRODUCTS";

    if (req.body.nameInput || req.body.categoryInput || req.body.priceInput || req.body.productidInput) {
        productTable = "PRODUCTS WHERE ";
        let conditions = [];
        if (req.body.productidInput) {
            conditions.push("PRODUCT_ID = :product_id");
            parameters.product_id = req.body.productidInput;
        }

        else {
            if (req.body.nameInput) {
                conditions.push("PRODUCT_NAME = :product_name");
                parameters.product_name = req.body.nameInput;
            }

            if (req.body.categoryInput) {
                conditions.push("CATAGORY_ID = :category_id");
                parameters.category_id = req.body.categoryInput;
            }

            if (req.body.priceInput) {
                conditions.push("PRICE = :product_price");
                parameters.product_price = req.body.priceInput;
            }
        }


        productTable += conditions.join(" AND ");
        productTable += ")";
    }

    const query = "SELECT * FROM " + productTable;
    console.log(query);
    

})

// router.post('/', function (req, res) {
  
//     console.log(req.body);

    
//     dataForLineChart = [];
//     labelsForLineChart = [];

//     try {
       
//         // If the processing is successful
//         res.json({ success: true, message: 'Data received and processed successfully', dataForLineChart: dataForLineChart, labelsForLineChart: labelsForLineChart});
//     } catch (error) {
//         // If there's an error during processing
//         console.error('Error processing data:', error);
//         res.status(500).json({ success: false, message: 'Error processing data' });
//     }
// });


router.post('/', async function (req, res) {
    console.log(req.body);

    const regionId = req.body.regionID;
    const productId = req.body.productID;
    const startMonth = req.body.startMonth;
    const endMonth = req.body.endMonth;

    if (!startMonth || !endMonth || endMonth < startMonth) {
        return res.status(400).json({ success: false, message: 'Invalid date range' });
    }


    dataForLineChart = [];
    labelsForLineChart = [];

    try {
       // const connection = await oracledb.getConnection(dbConfig);

        
        let currentMonth = new Date(startMonth);
        const end = new Date(endMonth);

        while (currentMonth <= end) {
            const currentMonthString = currentMonth.toLocaleString('default', { month: 'short' });
            console.log("currentMonthString := ")
            console.log(currentMonthString);

            
            let query = `
                SELECT COALESCE(SUM(pp.QUANTITY), 0) AS TOTAL_SALES
                FROM REGION r
                LEFT JOIN AREAS a ON r.REGION_ID = a.REGION_ID
                LEFT JOIN SHOPS s ON a.AREA_CODE = s.AREA_CODE
                LEFT JOIN PURCHASE p ON s.SHOP_ID = p.SHOP_ID
                LEFT JOIN PURCHASED_PRODUCT pp ON p.PURCHASE_ID = pp.PURCHASE_ID
                    AND pp.PRODUCT_ID = :productId
                    AND TO_CHAR(p.PURCHASE_TIME, 'YYYY-MM') = :purchaseMonth`;

          
            // const binds = {
            //     productId: productId,
            //     purchaseMonth: currentMonth.toISOString().slice(0, 7)
            // };

          
            if (regionId != 'General') {
                query += ' AND r.REGION_ID = :regionId';
               // binds.regionId = regionId;
            }

           
            console.log("query := " + query);    
           // const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
           // console.log(result.rows[0]);

            
          //  labelsForLineChart.push(currentMonthString);
           // dataForLineChart.push(result.rows[0].TOTAL_SALES);

            
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

       // await connection.close();
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

router.get('/location', function (req, res, next) {
    res.render('owner/location', { title: 'Location' });
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




module.exports = router;