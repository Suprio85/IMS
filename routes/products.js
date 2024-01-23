var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');



/* GET products listing. */
router.get('/', function(req, res, next) {
   
    res.status(200).render('products', { title: 'Product Information' });

});

/* POST form submission. */
router.post('/', async function(req, res, next) {
  
    const { name, type, price } = req.body;
    console.log(req.body);
    try {
        if(name != null && type != null && price != null){
        const connection = await oracledb.getConnection(req.dbConfig);
        const result = await connection.execute(
            `INSERT INTO PRODUCT (id, name, catagory , price) VALUES (PRODUCT_ID_SEQ.NEXTVAL, :name, :type, :price)`,
            { name, type, price }
        );
        await connection.commit();
        await connection.close();

        console.log('Rows inserted: ' + result.rowsAffected);
        res.redirect('/users');
        }

        else{
            console.log ("Please fill all the fields");
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
