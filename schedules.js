var dbconfig = require("./dbconfig");
var oracledb = require("oracledb");


async function runPriceManagement(){
    
    console.log("Nothing is going on here");
}

async function runMonthlySaleProceedure() {
    let connection;
    let success=false;
    try{
        connection = await oracledb.getConnection(dbconfig);
        await connection.execute(`
            BEGIN
                CALCULATE_MONTHLY_SALE(36);
            END;
        `);
        connection.commit();
        success = true;
    } catch(err){
        console.log(err);
        connection.rollback();
    } finally{
        if(connection) connection.close();
    }
    return success;
}


async function updatePriceProcedure() {
    let connection;
    let success=false;
    try{
        connection = await oracledb.getConnection(dbconfig);
        await connection.execute(`
            BEGIN
                CALCULATE_PRODUCT_PRICE(SYSDATE);
            END;
        `);
        connection.commit();
        success = true;
    } catch(err){
        console.log(err);
        connection.rollback();
    } finally{
        if(connection) connection.close();
    }
    return success;
}


async function updateRequestStatus() {
    let connection;
    let success=false;
    try{
        connection = await oracledb.getConnection(dbconfig);
        await connection.execute(`
            UPDATE SHIPMENT_REQUEST SET STATUS='PROCESSING' WHERE STATUS <> 'CLOSED'
        `);
        connection.commit();
        success = true;
    } catch(err){
        console.log(err);
        connection.rollback();
    } finally{
        if(connection) connection.close();
    }
    return success;
}


module.exports = {
    runMonthlySaleProceedure, runPriceManagement, updatePriceProcedure, updateRequestStatus
};