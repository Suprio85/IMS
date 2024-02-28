var express = require('express');
var oracledb = require('oracledb');
var dbconfig = require('../dbconfig');
// const { route } = require('./login');

var router = express.Router();



async function get_employee_info(employee_id){
    try{
        const orcl_connection = await oracledb.getConnection(dbconfig);
        let query = "SELECT E.*, C.SHOP_ID FROM EMPLOYEES E JOIN CASHIER C ON(E.EMPLOYEE_ID = C.EMPLOYEE_ID)"+
                    "WHERE E.EMPLOYEE_ID = :employee_id";
        var employee = await orcl_connection.execute(query, {employee_id});
        await orcl_connection.close();
        return employee.rows;
    }
    catch(err){
        await orcl_connection.close();
        console.log(err);
        return null;
    }
}

async function fetchProductData(productId){
    try{
        const orcl = await oracledb.getConnection(dbconfig);
        let query = "SELECT PRODUCT_NAME, PRICE FROM PRODUCTS WHERE PRODUCT_ID = :productId";
        var product = await orcl.execute(query, {productId:productId});
        console.log("Calling for ", productId);
        console.log("Resulting ", product.rows);
        await orcl.close();
        return product.rows;
    }
    catch(err){
        await orcl.close();
        console.log(err);
        return {};
    }
}

function generateCustomerQuery(requirements){
    var customer = "CUSTOMER";
    var parameters = {}
    var constraints = ""
    var flag = false;
    if(requirements.name != null){
        constraints += (flag ? " AND " : "WHERE ") + "CUSTOMER_NAME = :customer_name";
        flag = true;
        parameters.customer_name = requirements.name;
    }
    if(requirements.email != null){
        constraints += (flag ? " AND " : "WHERE ") + "EMAIL = :customer_email";
        flag = true;
        parameters.customer_email = requirements.email;
    }
    if(requirements.mobile != null){
        constraints += (flag ? " AND " : "WHERE ") + "MOBILE_NO = :customer_mobile";
        flag = true;
        parameters.customer_mobile = requirements.mobile;
    }
    if(constraints == ""){
        return ["CUSTOMERS", {}];
    }
    var table = "(SELECT CUSTOMER_ID, CUSTOMER_NAME, EMAIL FROM CUSTOMERS " + constraints + ")";
    return [table, parameters];

}


async function getOrderInfoFromQuery(requirements, shop_id){
    var values = ["order", "name", "email", "mobile", "start", "end"];
    console.log("Requirements: "); console.log(requirements);
    var parameters = {};
    let [customer, param] = generateCustomerQuery(requirements);
    console.log(generateCustomerQuery(requirements));
    parameters = {...parameters, ...param};
    var purchase = "(SELECT * FROM PURCHASE WHERE SHOP_ID=:shop_id)";
    
    if(requirements.start != null){
        purchase = "(SELECT * FROM PURCHASE WHERE PURCHASE_TIME >= TO_TIMESTAMP(:d_start, 'YYYY-MM-DD HH24:MI') " +
                    "AND PURCHASE_TIME <= TO_TIMESTAMP(:d_end, 'YYYY-MM-DD HH24:MI') "+
                    "AND SHOP_ID = :shop_id)"
        parameters.d_start = requirements.start + " 00:00"; parameters.d_end = requirements.end + " 00:00";
    }

    purchase = requirements.order === null ? purchase: 
                   "(SELECT * FROM PURCHASE WHERE PURCHASE_ID = :purchase_id AND SHOP_ID = :shop_id)"
    if(requirements.order != null){
        customer = "CUSTOMERS";
        parameters.purchase_id = requirements.order;
    }

    var query = "SELECT P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(P.PURCHASE_TIME, 'HH:MI PM'), SUM(PR.PRODUCT_PRICE) "+
                `FROM ${purchase} P JOIN ${customer} C ON(P.CUSTOMER_ID=C.CUSTOMER_ID) `+
                "LEFT OUTER JOIN PURCHASED_PRODUCT PR ON(P.PURCHASE_ID=PR.PURCHASE_ID) "+
                "GROUP BY P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, P.PURCHASE_TIME"+
                " ORDER BY P.PURCHASE_ID DESC";
    console.log(query);
    console.log(parameters);
    try{
        var connection = await oracledb.getConnection(dbconfig);
        var result = await connection.execute(query, {...parameters, shop_id: shop_id});
        // console.log(result);
        await connection.close();
        return result.rows;
    }
    catch(err){
        console.log(err);
        await connection.close();
        return [];
    }
}


async function getProductsOfOrder(orderId, connection){
    var query = "SELECT (SELECT PRODUCT_NAME FROM PRODUCTS WHERE PRODUCT_ID=PP.PRODUCT_ID), "+
                "PP.PRODUCT_PRICE, PP.QUANTITY FROM PURCHASED_PRODUCT PP " +
                "WHERE PP.PURCHASE_ID=:purchase_id";
    var res = await connection.execute(query, {purchase_id: orderId});
    var products = [];
    for(var p of res.rows){
        var product = {
            "name": p[0],
            "price": p[1],
            "quantity": p[2]
        }
        products.push(product);
    }
    return products;
}

async function findOrderById(orderId){
    var query = "SELECT PURCHASE_ID, CUSTOMER_ID, TO_CHAR(PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(PURCHASE_TIME, 'HH:MI AM')"+
                "FROM PURCHASE WHERE PURCHASE_ID=:purchaseId";
    var customer_query = "SELECT CUSTOMER_NAME, EMAIL, MOBILE_NO FROM CUSTOMERS WHERE CUSTOMER_ID = :customer_id";
    var order = {};
    var customer = {};
    var products = [];
    try{
        var connection = await oracledb.getConnection(dbconfig);
        var order_response = await connection.execute(query, {purchaseId: orderId});
        order = {"id": order_response.rows[0][0], "date": order_response.rows[0][2], "time": order_response.rows[0][3]}
        console.log(order_response.rows);
        var customer_res = await connection.execute(customer_query, {customer_id: order_response.rows[0][1]});
        customer = {"name": customer_res.rows[0][0], "mail": customer_res.rows[0][1], "mobile": customer_res.rows[0][2]}
        products =await getProductsOfOrder(orderId, connection);
    }
    catch(err){
        console.log(err);
        return null;
    }

    var info = {};
    info.order = order;
    info.customer = customer;
    info.products = products;
    return info;
}


async function findCustomerId(customer, connection){
    var query = "SELECT CUSTOMER_ID FROM CUSTOMERS WHERE EMAIL = :email AND MOBILE_NO = :mobile";
    var insertquery = "INSERT INTO CUSTOMERS VALUES(CUSTOMER_ID_SEQ.NEXTVAL, :name, :email, :mobile)";
    var response = await connection.execute(query, {email: customer.mail, mobile: customer.number});
    if (response.rows.length === 1) return response.rows[0][0];
    var insert_result = await connection.execute(insertquery, {name: customer.name, email:customer.mail, mobile: customer.number});
    console.log("Insert result", insert_result);
    response = await connection.execute(query, {email: customer.mail, mobile: customer.number});
    return response.rows[0][0];
}

async function insertPurchaseInfo(info, shop_id){
    var create_purchase = "INSERT INTO PURCHASE VALUES(:purchase_id, CURRENT_TIMESTAMP, :shop_id, :customer_id)"
    var create_purchase_param={"shop_id":shop_id};
    var purchased_product = "INSERT INTO PURCHASED_PRODUCT VALUES(:purchase_id, :id, (SELECT PRICE FROM PRODUCTS WHERE PRODUCT_ID=:id), :quantity)";
    try{
        var dbconn =await oracledb.getConnection(dbconfig);
        create_purchase_param.purchase_id = (await dbconn.execute("SELECT PURCHASE_ID_SEQ.NEXTVAL FROM DUAL")).rows[0][0];
        create_purchase_param.customer_id = await findCustomerId(info.customer, dbconn);
        await dbconn.execute(create_purchase, create_purchase_param);
        info.products.forEach(async product => {
            await dbconn.execute(purchased_product, {purchase_id:create_purchase_param.purchase_id , ...product});
            console.log("Or here ?");
        });
        await dbconn.commit();
        await dbconn.close();
        return true;
    }catch(err){
        console.log("An error occurred");
        console.log(err);
        if (dbconn){
            try{
                await dbconn.rollback();
            } catch(err){
                console.log(err);
            } finally{
                try{ dbconn.close(); }
                catch(err){ console.log(err);}
            }
        }
        await dbconn.rollback();
        await dbconn.close();
        return false;
    }
}

async function findTopSaleProductToday(shop_id){
    var query = `
        SELECT P.PRODUCT_ID, P.PRODUCT_NAME, (SELECT CATAGORY_NAME FROM CATAGORY WHERE CATAGORY_ID=P.CATAGORY_ID), 
        P.PRICE, GET_TOTAL_SALES(P.PRODUCT_ID, :shop_id, TO_TIMESTAMP(SYSDATE), CURRENT_TIMESTAMP) AS SALE
        FROM PRODUCTS P
        ORDER BY SALE DESC`;
    var connection;
    try{
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(query, {shop_id, shop_id});
        connection.close();
        return result.rows;
    } catch(err){
        console.log(err);
        if(connection) connection.close();
        return [];
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/', async function(req, res, next){
    var employee_id = req.session.user.id;
    if (req.session.user === undefined){
        res.redirect('/login?message='+encodeURIComponent("Varification required"));
        return;
    }
    employee = await get_employee_info(employee_id);
    console.log("new check: ");
    if(employee.length===0){
        console.log("Length is 0");
        res.redirect("/login?message="+encodeURIComponent("Whatever"));
        return;
    }
    employee = employee[0];
    req.session.employee_info = employee;
    console.log(employee);
    res.redirect('/cashier/dashboard');
    // res.render("user_cashier/cashier", {title:employee[6]});
})



router.post("/record-purchase", async function(req, res, next){
    console.log();
    console.log("Here I go");
    console.log();
    console.log(req.body);
    var shop_id = req.session.employee_info[req.session.employee_info.length-1]
    console.log(shop_id);
    var result = await insertPurchaseInfo(req.body, shop_id);
    // console.log(typeof req.body.products['0']);
    // console.log(req.body.productId[0]);
    res.status(200).json({success: result});
})



router.get('/cash_memo', function(req, res, next){
    if(req.session.employee_info === undefined){
        res.redirect("/login");
        return;
    }
    var username = req.session.employee_info[1];
    res.status(200).render("user_cashier/make_reciept2", {username, });
})


router.get('/dashboard', async function(req, res){
    if(req.session.employee_info === undefined){
        res.redirect("/login");
        return;
    }
    let shop_id = req.session.employee_info[req.session.employee_info.length-1];
    let username = req.session.employee_info[1];
    let products = await findTopSaleProductToday(shop_id)
    let requirements = {"order": null};
    let records = await getOrderInfoFromQuery(requirements, shop_id);
    console.log("rendering page with ", products);
    res.status(200).render('user_cashier/dashboard', {username, products, records});
})



router.get("/findProduct/:productId", async(req, res)=>{
    var pid = req.params.productId;
    if(pid===null){
        res.status(404).json({error: "No product Id"});
        return;
    }
    var id = parseInt(pid);
    var product = await fetchProductData(id);
    if (product.length == 1){
        res.status(200).json({productName: product[0], price: product[1]});
    }
    else res.status(404).json({erro: "No product found"});
})


router.post("/order_query", async(req, res)=>{
    var request = req.body;
    console.log(" Handling the request");
    console.log(request);
    // response format: order id, customer name, customer email, date, time, total cost
    var resonse = await getOrderInfoFromQuery(req.body, req.session.employee_info[req.session.employee_info.length-1]);
    // var resonse = [
    //     [1001, "Nafis Hussain", "nafis@gmail.com", "11/12/2022", "8:40 AM", 599.85],
    //     [1005, "Suprio Paul", "suprio@gmail.com", "21/12/2022", "7:40 PM", 599.85]
    // ]
    res.status(200).json(resonse);
})



router.get("/search_record", async(req, res)=>{
    if(req.session.employee_info === undefined){
        res.redirect("/login");
        return;
    }
    var username = req.session.employee_info[1];
    res.status(200).render("user_cashier/search_record", {username, });
})



router.post("/get_single_order", async(req, res)=>{
    var id = req.body.order_id;
    console.log("Order : ", id);
    var info = await findOrderById(id);
    res.status(200).json(info);
})


module.exports = router;