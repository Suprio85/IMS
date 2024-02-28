SELECT P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL,
    TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(P.PURCHASE_TIME, 'HH:MI PM'),
    SUM(PR.PRODUCT_PRICE) 
FROM 
    (SELECT * FROM PURCHASE WHERE PURCHASE_TIME >= TO_TIMESTAMP(:start, 'YYYY-MM-DD HH24:MI') AND PURCHASE_TIME <= TO_TIMESTAMP(:ending, 'YYYY-MM-DD HH24:MI') P
    jOIN CUSTOMER C ON(P.CUSTOMER_ID=C.CUSTOMER_ID) 
    LEFT OUTER JOIN PURCHASED_PRODUCT PR ON(P.PURCHASE_ID=PR.PURCHASE_ID)
GROUP BY 
    P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY');
    

SELECT
    P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL,
    TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(P.PURCHASE_TIME, 'HH:MI PM'),
    SUM(PR.PRODUCT_PRICE)
FROM
    (SELECT * FROM PURCHASE WHERE PURCHASE_TIME >= TO_TIMESTAMP('2022-20-01', 'YYYY-DD-MM HH24:MI') AND PURCHASE_TIME <= TO_TIMESTAMP('2022-20-05', 'YYYY-DD-MM HH24:MI') AND SHOP_ID=30001) P
    JOIN CUSTOMERS C ON(P.CUSTOMER_ID=C.CUSTOMER_ID)
    LEFT OUTER JOIN PURCHASED_PRODUCT PR ON(P.PURCHASE_ID=PR.PURCHASE_ID)
GROUP BY
    P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, P.PURCHASE_TIME;
    

SELECT P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(P.PURCHASE_TIME, 'HH:MI PM'), SUM(PR.PRODUCT_PRICE) FROM (SELECT * FROM PURCHASE WHERE PURCHASE_TIME >= TO_TIMESTAMP('2022-20-01 00:00', 'YYYY-DD-MM HH24:MI') AND PURCHASE_TIME <= TO_TIMESTAMP('2022-20-04 00:00', 'YYYY-DD-MM HH24:MI')) P JOIN CUSTOMERS C ON(P.CUSTOMER_ID=C.CUSTOMER_ID) LEFT OUTER JOIN PURCHASED_PRODUCT PR ON(P.PURCHASE_ID=PR.PURCHASE_ID) GROUP BY P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, P.PURCHASE_TIME;


SELECT P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, TO_CHAR(P.PURCHASE_TIME, 'DD-MM-YYYY'), TO_CHAR(P.PURCHASE_TIME, 'HH:MI PM'), SUM(PR.PRODUCT_PRICE) FROM (SELECT * FROM PURCHASE WHERE PURCHASE_TIME >= TO_TIMESTAMP('2022-20-01 00:00', 'YYYY-DD-MM HH24:MI') AND PURCHASE_TIME <= TO_TIMESTAMP('2022-20-04 00:00', 'YYYY-DD-MM HH24:MI')) P JOIN CUSTOMERS C ON(P.CUSTOMER_ID=C.CUSTOMER_ID) LEFT OUTER JOIN PURCHASED_PRODUCT PR ON(P.PURCHASE_ID=PR.PURCHASE_ID) GROUP BY P.PURCHASE_ID, C.CUSTOMER_NAME, C.EMAIL, P.PURCHASE_TIME;

SELECT PRODUCT_NAME, PRICE FROM PRODUCTS WHERE PRODUCT_ID = 50001;


SELECT E.*, SHM.SHOP_ID
FROM EMPLOYEES E JOIN SHOP_MANAGER SHM ON (E.EMPLOYEE_ID = SHM.EMPLOYEE_ID)
-- WHERE E.EMPLOYEE_ID = 2009;

SELECT CURRENT_TIMESTAMP FROM DUAL;

SELECT SYSTIMESTAMP FROM DUAL;

SELECT * FROM CUSTOMERS;

SELECT * FROM PURCHASE ORDER BY PURCHASE_ID DESC;

SELECT CURRENT_TIMESTAMP FROM DUAL;

SELECT GET_TOTAL_SALES(
    50001,
    30001,
    TO_TIMESTAMP('2022-01-12 00:00', 'YYYY_MM_DD HH24:MI'),
    TO_TIMESTAMP('2022-05-12 00:00', 'YYYY_MM_DD HH24:MI')
) FROM DUAL;


SELECT * FROM PURCHASE WHERE PURCHASE_ID = 1035;
SELECT * FROM SHOPS WHERE SHOP_ID = 30002;
SELECT * FROM CUSTOMERS WHERE CUSTOMER_ID = 1003;
SELECT * FROM PURCHASED_PRODUCT WHERE PURCHASE_ID = 1035;

SELECT TO_TIMESTAMP('2024-04-24',  'YYYY-MM-DD') FROM DUAL;

SELECT TO_CHAR(TO_TIMESTAMP('2024-04-24', 'YYYY-MM-DD'), 'YYYY-MM-DD HH24:MI') FROM DUAL;
SELECT TO_CHAR(TO_TIMESTAMP(SYSDATE), 'YYYY-MM-DD HH24:MI') FROM DUAL;
SELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI') FROM DUAL;
SELECT CURRENT_TIMESTAMP FROM DUAL;

SELECT TO_TIMESTAMP(SYSDATE) FROM DUAL;


SELECT PP.PRODUCT_ID, P.PRODUCT_NAME, (SELECT CATAGORY_NAME FROM CATAGORY WHERE CATAGORY_ID=P.CATAGORY_ID), 
P.PRICE, GET_TOTAL_SALES(PP.PRODUCT_ID, 30001, TO_TIMESTAMP(SYSDATE), CURRENT_TIMESTAMP) AS SALE
FROM PURCHASED_PRODUCT PP JOIN
(SELECT * FROM PURCHASE WHERE SHOP_ID=30001) P
ON PP.PURCHASE_ID = P.PURCHASE_ID
JOIN PRODUCTS P ON PP.PRODUCT_ID = P.PRODUCT_ID 
ORDER BY SALE

SELECT P.PRODUCT_ID, P.PRODUCT_NAME, (SELECT CATAGORY_NAME FROM CATAGORY WHERE CATAGORY_ID=P.CATAGORY_ID), 
P.PRICE, GET_TOTAL_SALES(P.PRODUCT_ID, 30001, TO_TIMESTAMP(SYSDATE), CURRENT_TIMESTAMP) AS SALE
FROM PRODUCTS P JOIN (SELECT * FROM SHOP_PRODUCTS WHERE SHOP_ID=30001) SP
ON SP.PRODUCT_ID = P.PRODUCT_ID
