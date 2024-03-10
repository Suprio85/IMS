const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const { session } = require('passport');

let id = 2001;

router.get('/', async function (req, res, next) {
    if(req.session.user === undefined){
        res.redirect('/login');
        return;
    }
    id = req.session.user.id;
    
    const query =   `SELECT E.EMPLOYEE_ID, E.FIRST_NAME, E.LAST_NAME, E.SALARY, E.BANK_ACCOUNT,
                     J.JOB_TITLE, J.JOB_DESCRIPTION, A.STREET_ADDRESS,A.POSTAL_CODE, A.CITY,
                     ROUND((SYSDATE - E.HIRING_DATE)/365, 0) AS EXPERIENCE
                     FROM EMPLOYEES E LEFT JOIN JOBS J ON E.JOB_ID = J.JOB_ID
                     LEFT JOIN AREAS A ON A.AREA_CODE =E.ADDRESS_AREA_CODE
                     WHERE E.EMPLOYEE_ID = ${id}` 
     
    console.log(id);
    const connection = oracledb.getConnection(dbConfig);
  //  let 



    const result = (await connection).execute(query);

   console.log((await result).rows)

   employee ={
    id : (await result).rows[0][0],
    first_name : (await result).rows[0][1],
    last_name : (await result).rows[0][2],
    salary : (await result).rows[0][3],
    bank_number : (await result).rows[0][4],
    job_name : (await result).rows[0][5],
    job_description : (await result).rows[0][6],
    street_address : (await result).rows[0][7],
    postal_code : (await result).rows[0][8],
    city : (await result).rows[0][9],
    experience : (await result).rows[0][10]
   }

    console.log(employee);


    


    res.render('profile', { title: 'Profile', employee: employee});
});

router.post('/', async function (req, res, next) {
    if(req.session.user === undefined){
        res.redirect('/login');
        return;
    }
    console.log(req.body);
    id = req.session.user.id;
    const connection = oracledb.getConnection(dbConfig);
    const query = `UPDATE EMPLOYEES SET FIRST_NAME = '${req.body.firstname}', LAST_NAME='${req.body.lastname}', BANK_ACCOUNT = ${req.body.banknumber} WHERE EMPLOYEE_ID = ${id}`;
    console.log(query);

    const result = (await connection).execute(query);
    console.log((await result).rowsAffected? "Updated" : "Not Updated");
})



module.exports = router;    