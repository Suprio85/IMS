
-- Inserting data of job table:
INSERT INTO JOBS(JOB_ID, JOB_TITLE, JOB_DESCRIPTION, MAX_SALARY, MIN_SALARY) 
VALUES  ('CASHIER', 'SHOP CASHIER', 'Handle Purchase Input', 10000, 6000);
INSERT INTO JOBS VALUES ('ShM', 'SHOP MANAGER', 'Manages a shop', 25000, 15000);
INSERT INTO JOBS VALUES ('MD', 'MAIN DIRECTOR', 'Owner of this Business', 2, 1);
INSERT INTO JOBS VALUES ('ZSM', 'ZONAL SUPPLY MANAGER', 'Manages supplies for regions Under a Zone', 100000, 85000);
INSERT INTO JOBS VALUES ('RSM', 'REGIONAL SUPPLY MANAGER', 'Manages Supplies for Shops under a Region', 45000, 35000);
INSERT INTO JOBS VALUES ('PM', 'PRODUCTION MANAGER', 'Manages production and Supplies to Inventory', 45000, 35000);
INSERT INTO JOBS VALUES ('STUF', 'SHOP STUFF', 'Handles Labours in Shops', 12000, 8000);

-- SELECT * FROM JOBS;



-- Inserting for region table
INSERT INTO REGION VALUES (101, 'Sylhet', NULL);
INSERT INTO REGION VALUES (102, 'Dhaka', NULL);
INSERT INTO REGION VALUES (103, 'Sunamganj', NULL);
INSERT INTO REGION VALUES (104, 'Gazipur', NULL);

-- SELECT * FROM REGION;


-- INSERT INTO AREAS (AREA_CODE, STREET_ADDRESS, CITY, REGION_ID) 
INSERT INTO AREAS VALUES (10001, 'Medical Road', 1000, 'Sylhet-Sadar', 101);
INSERT INTO AREAS VALUES (10002, 'Zindabazar Road', 1012, 'Sylhet-Sadar', 101);
INSERT INTO AREAS VALUES (10003, 'Dabanol Songshod Sorok', 1005, 'Khilgaon', 102);
INSERT INTO AREAS VALUES (10004, 'Elephant Road', 1200, 'Dhaka', 102);
INSERT INTO AREAS VALUES (10005, 'Zirani Kashimpur Road', 1800, 'Gazipur-Sadar', 104);
INSERT INTO AREAS VALUES (10006, 'Kapasia Bazar Road', 1900, 'Kapasia', 104);
INSERT INTO AREAS VALUES (10007, 'Somewhere in Kapasia', 1920, 'Kapasia', 104);
-- INSERT INTO AREAS VALUES (10007, 'Medical Road', 1000, 'Sylhet-Sadar', 103);

-- SELECT * FROM AREAS;

-- Inserting employee info

INSERT INTO EMPLOYEES
VALUES (2001, 'Zahid', 'Hasan', 85000, 12332145, TO_DATE('2021-09-12', 'YYYY-MM-DD'), 'brinto', '4321', 'No', 'ZSM', 10005, NULL);
INSERT INTO EMPLOYEES
VALUES (2002, 'Nafis', 'Hussain', 38000, 12312415, TO_DATE('2022-02-12', 'YYYY-MM-DD'), 'nafis', '1234', 'No', 'RSM', 10001, 2001);
INSERT INTO EMPLOYEES
VALUES (2003, 'Suprio', 'Paul', 41000, 13579246, TO_DATE('2022-04-12', 'YYYY-MM-DD'), 'suprio', '1357', 'No', 'RSM', 10004, 2001);
INSERT INTO EMPLOYEES
VALUES (2004, 'Prachurja', 'Dhar', 35000, 11223344, TO_DATE('2022-08-12', 'YYYY-MM-DD'), 'prachurja', '2468', 'No', 'RSM', 10004, 2001);
INSERT INTO EMPLOYEES
VALUES (2005, 'Nayeem', 'Uzzaman', 36000, 12123434, TO_DATE('2022-06-12', 'YYYY-MM-DD'), 'nayeem', '3333', 'No', 'RSM', 10002, 2001);
INSERT INTO EMPLOYEES
VALUES (2006, 'Rahman', 'Chowdhuri', 22000, 11112222, TO_DATE('2022-01-12', 'YYYY-MM-DD'), 'rahman', '3434', 'No', 'ShM', 10002, NULL);
INSERT INTO EMPLOYEES
VALUES (2007, 'Nasir', 'Ali', 21000, 22221111, TO_DATE('2022-04-12', 'YYYY-MM-DD'), 'nasir', '4343', 'No', 'ShM', 10004, NULL);
INSERT INTO EMPLOYEES
VALUES (2008, 'Amin', 'Chowdhuri', 20000, 21212121, TO_DATE('2022-02-12', 'YYYY-MM-DD'), 'amin', '4433', 'No', 'ShM', 10004, NULL);
INSERT INTO EMPLOYEES
VALUES (2009, 'Shahin', 'Mia', 19000, 33333222, TO_DATE('2022-04-22', 'YYYY-MM-DD'), 'shahin', '6655', 'No', 'CASHIER', 10002, 2006);
INSERT INTO EMPLOYEES
VALUES (2010, 'Shakil', 'Ahmed', 19500, 33345222, TO_DATE('2022-04-27', 'YYYY-MM-DD'), 'shakil', '6985', 'No', 'CASHIER', 10004, 2007);
INSERT INTO EMPLOYEES
VALUES (2011, 'Habib', 'Ullah', 18500, 22233344, TO_DATE('2022-01-22', 'YYYY-MM-DD'), 'habib', '6879', 'No', 'CASHIER', 10005, 2008);
INSERT INTO EMPLOYEES
VALUES (2012, 'Rahul', 'Hasan', 45000, 32132156, TO_DATE('2021-10-12', 'YYYY-MM-DD'), 'rahul', '9128', 'No', 'PM', 10005, NULL);
INSERT INTO EMPLOYEES
VALUES (2013, 'Rayhan', 'Hasnat', 1, 32333156, TO_DATE('2021-10-12', 'YYYY-MM-DD'), 'rayhan', '9484', 'No', 'MD', 10005, NULL);
-- SELECT * FROM EMPLOYEES;

-- Sypply Manager Table
INSERT INTO SUPPLY_MANAGER VALUES (2002);
INSERT INTO SUPPLY_MANAGER VALUES (2003);
INSERT INTO SUPPLY_MANAGER VALUES (2004);
INSERT INTO SUPPLY_MANAGER VALUES (2005);


-- Factory Table
INSERT INTO FACTORY VALUES(901, 'Liscenced by ABC LTD', TO_DATE('2021-01-01', 'YYYY-MM-DD'), NULL, 10007);

-- Inventory Table
INSERT INTO INVENTORY VALUES (501, 'Chirp Inventory', 3000, NULL, 10007);
INSERT INTO INVENTORY VALUES (502, 'Hills Invevtory', 5000, 'HUMID', 10002);

-- Shop table
INSERT INTO SHOPS VALUES (30001, 'Dawns Electronics', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'dawn.electronics@gmail.com', '121411678', 10001);
INSERT INTO SHOPS VALUES (30002, 'Leafs Electronics', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'leaf.electronics@gmail.com', '121413345', 10002);
INSERT INTO SHOPS VALUES (30003, 'Duha Electronics', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'duha.electronics@gmail.com', '189459234', 10002);
INSERT INTO SHOPS VALUES (30004, 'Tech Trek Electronics', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'techtrek.electronics@gmail.com', '111222333', 10003);
INSERT INTO SHOPS VALUES (30005, 'Sparks Shop', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'sparks@gmail.com', '989876675', 10004);
INSERT INTO SHOPS VALUES (30006, 'Electricraft Electronics', TO_TIMESTAMP('08:00 AM', 'HH:MI AM'), TO_TIMESTAMP('02:00 AM', 'HH:MI AM'),
                          'electricraft@gmail.com', '213564354', 10005);


--shop manager table:
INSERT INTO SHOP_MANAGER VALUES (2006, 30001);
INSERT INTO SHOP_MANAGER VALUES (2007, 30002);
INSERT INTO SHOP_MANAGER VALUES (2008, 30004);

-- CASHIER table
INSERT INTO CASHIER VALUES (2009, 30001, 'MORNING');
INSERT INTO CASHIER VALUES (2010, 30002, 'MORNING');
INSERT INTO CASHIER VALUES (2011, 30004, 'MORNING');


-- Production Manager:
INSERT INTO PRODUCTION_MANAGER VALUES (2012, 901);
-- SELECT * FROM PRODUCTION_MANAGER;


-- Inserting some product catagories
INSERT INTO CATAGORY VALUES (1, 'Calculator');
INSERT INTO CATAGORY VALUES (2, 'Smartphone');
INSERT INTO CATAGORY VALUES (3, 'Laptop');
INSERT INTO CATAGORY VALUES (4, 'TAB');

-- some PRODUCTS
INSERT INTO PRODUCTS VALUES(50001, 'Casio 991 Ex', 2499, 3, 'something.jpeg', 'continued', 1);
INSERT INTO PRODUCTS VALUES(50002, 'Casio 991 Ex-Plus', 3000, 3, 'something.jpeg', 'continued', 1);
INSERT INTO PRODUCTS VALUES(50003, 'Casio 991 Fx', 2000, 3, 'something.jpeg', 'continued', 1);
INSERT INTO PRODUCTS VALUES(50004, 'Casio 661 Fx', 2499, 3, 'something.jpeg', 'continued', 1);

INSERT INTO PRODUCTS VALUES(50005, 'Nova X5', 24999, 3, 'something.jpeg', 'continued', 2);
INSERT INTO PRODUCTS VALUES(50006, 'Nova X5 pro', 31999, 3, 'something.jpeg', 'continued', 2);
INSERT INTO PRODUCTS VALUES(50007, 'Nova X6', 26999, 3, 'something.jpeg', 'continued', 2);
INSERT INTO PRODUCTS VALUES(50008, 'Nova X6 Pro', 33999, 3, 'something.jpeg', 'continued', 2);
INSERT INTO PRODUCTS VALUES(50009, 'Nova X7 lite', 25999, 3, 'something.jpeg', 'continued', 2);
INSERT INTO PRODUCTS VALUES(50010, 'Nova X7', 28999, 3, 'something.jpeg', 'continued', 2);

INSERT INTO PRODUCTS VALUES(50011, 'Nova Galaxy TAB T4', 34999, 3, 'something.jpeg', 'continued', 4);
INSERT INTO PRODUCTS VALUES(50012, 'Nova Galaxy TAB T4 Ultra', 43999, 3, 'something.jpeg', 'continued', 4);
INSERT INTO PRODUCTS VALUES(50013, 'Nova Galaxy TAB T5', 39999, 3, 'something.jpeg', 'continued', 4);
INSERT INTO PRODUCTS VALUES(50014, 'Nova Galaxy TAB T5 lite', 33999, 3, 'something.jpeg', 'continued', 4);

-- SELECT FLOOR(DBMS_RANDOM.VALUE(1, 101)) as RANDOMS FROM DUAL;

-- Insert Inventory lots;
-- INSERT INTO INVENTORY_LOT VALUES (INVENTORY_LOT_ID_SEQ.NEXTVAL, )
-- For Assurance
SELECT INVENTORY_LOT_ID_SEQ.NEXTVAL FROM DUAL;
SELECT INVENTORY_LOT_ID_SEQ.NEXTVAL FROM DUAL;
SELECT INVENTORY_LOT_ID_SEQ.NEXTVAL FROM DUAL;
SELECT INVENTORY_LOT_ID_SEQ.NEXTVAL FROM DUAL;
SELECT INVENTORY_LOT_ID_SEQ.NEXTVAL FROM DUAL;

INSERT INTO INVENTORY_LOT VALUES 
(1002, TO_DATE('2021-12-12', 'YYYY-MM-DD'), 901, 501);
INSERT INTO INVENTORY_LOT VALUES 
(1003, TO_DATE('2021-12-12', 'YYYY-MM-DD'), 901, 502);
INSERT INTO INVENTORY_LOT VALUES 
(1004, TO_DATE('2022-01-12', 'YYYY-MM-DD'), 901, 501);
INSERT INTO INVENTORY_LOT VALUES 
(INVENTORY_LOT_ID_SEQ.NEXTVAL, TO_DATE('2022-01-12', 'YYYY-MM-DD'), 901, 502);
INSERT INTO INVENTORY_LOT VALUES 
(INVENTORY_LOT_ID_SEQ.NEXTVAL, TO_DATE('2022-02-12', 'YYYY-MM-DD'), 901, 501);



-- Inventory Lot Product Table;
INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
SELECT 1002, P.PRODUCT_ID, FLOOR(DBMS_RANDOM.VALUE(75, 151)), P.PRICE, TO_DATE('2021-11-12', 'YYYY-MM-DD')
FROM PRODUCTS P;

INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
SELECT 1003, P.PRODUCT_ID, FLOOR(DBMS_RANDOM.VALUE(75, 151)), P.PRICE, TO_DATE('2021-11-12', 'YYYY-MM-DD')
FROM PRODUCTS P;

INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
SELECT 1004, P.PRODUCT_ID, FLOOR(DBMS_RANDOM.VALUE(75, 151)), P.PRICE, TO_DATE('2021-12-12', 'YYYY-MM-DD')
FROM PRODUCTS P;

INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
SELECT 1005, P.PRODUCT_ID, FLOOR(DBMS_RANDOM.VALUE(75, 151)), P.PRICE, TO_DATE('2021-12-12', 'YYYY-MM-DD')
FROM PRODUCTS P;

INSERT INTO INVENTORY_LOT_PRODUCTS (LOT_ID, PRODUCT_ID, QUANTITY, PRICE, MANUFACTURING_DATE)
SELECT 1006, P.PRODUCT_ID, FLOOR(DBMS_RANDOM.VALUE(75, 151)), P.PRICE, TO_DATE('2021-12-12', 'YYYY-MM-DD')
FROM PRODUCTS P;



INSERT INTO INVENTORY_PRODUCTS(INVENTORY_ID, PRODUCT_ID, QUANTITY)
SELECT 501, P.PRODUCT_ID, 0
FROM PRODUCTS P;

INSERT INTO INVENTORY_PRODUCTS(INVENTORY_ID, PRODUCT_ID, QUANTITY)
SELECT 502, P.PRODUCT_ID, 0
FROM PRODUCTS P;

-- UPDATE INVENTORY_PRODUCTS NEW_IP
-- SET NEW_IP.QUANTITY = IP.QUANTITY + ILP.QUANTITY
-- FROM INVENTORY_PRODUCTS IP 
-- JOIN INVENTORY_LOT_PRODUCTS ILP ON(IP.PRODUCT_ID = ILP.PRODUCT_ID);
-- SELECT (
--     UPDATE INVENTORY_PRODUCTS IP
--     SET IP.QUANTITY = IP.QUANTITY + ILP.QUANTITY
--     WHERE IP.PRODUCT_ID = ILP.PRODUCT_ID

-- )
-- FROM INVENTORY_LOT_PRODUCTS ILP;



UPDATE INVENTORY_PRODUCTS NP SET
NP.QUANTITY = NP.QUANTITY + (
    SELECT LP.QUANTITY
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID AND LP.LOT_ID = 1002
)
WHERE EXISTS(
    SELECT 1
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID
    AND NP.INVENTORY_ID = (
        SELECT IL.INVENTORY_ID
        FROM INVENTORY_LOT IL
        WHERE IL.LOT_ID = 1002
    )
);

UPDATE INVENTORY_PRODUCTS NP SET
NP.QUANTITY = NP.QUANTITY + (
    SELECT LP.QUANTITY
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID AND LP.LOT_ID = 1003
)
WHERE EXISTS(
    SELECT 1
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID
    AND NP.INVENTORY_ID = (
        SELECT IL.INVENTORY_ID
        FROM INVENTORY_LOT IL
        WHERE IL.LOT_ID = 1003
    )
);

UPDATE INVENTORY_PRODUCTS NP SET
NP.QUANTITY = NP.QUANTITY + (
    SELECT LP.QUANTITY
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID AND LP.LOT_ID = 1004
)
WHERE EXISTS(
    SELECT 1
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID
    AND NP.INVENTORY_ID = (
        SELECT IL.INVENTORY_ID
        FROM INVENTORY_LOT IL
        WHERE IL.LOT_ID = 1004
    )
);

UPDATE INVENTORY_PRODUCTS NP SET
NP.QUANTITY = NP.QUANTITY + (
    SELECT LP.QUANTITY
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID AND LP.LOT_ID = 1005
)
WHERE EXISTS(
    SELECT 1
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID
    AND NP.INVENTORY_ID = (
        SELECT IL.INVENTORY_ID
        FROM INVENTORY_LOT IL
        WHERE IL.LOT_ID = 1005
    )
);

UPDATE INVENTORY_PRODUCTS NP SET
NP.QUANTITY = NP.QUANTITY + (
    SELECT LP.QUANTITY
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID AND LP.LOT_ID = 1006
)
WHERE EXISTS(
    SELECT 1
    FROM INVENTORY_LOT_PRODUCTS LP
    WHERE LP.PRODUCT_ID = NP.PRODUCT_ID
    AND NP.INVENTORY_ID = (
        SELECT IL.INVENTORY_ID
        FROM INVENTORY_LOT IL
        WHERE IL.LOT_ID = 1006
    )
);

-- We need a counter measure so that we accidently don't update data using same inventory_lot twice

-- ###############################################################################################
-- Shipment Request

INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-02-15', 'YYYY-MM-DD'), 'PROCESSED', 30001);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-03-15', 'YYYY-MM-DD'), 'PROCESSED', 30001);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-04-15', 'YYYY-MM-DD'), 'PROCESSED', 30001);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-05-15', 'YYYY-MM-DD'), 'PROCESSED', 30001);

INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-04-20', 'YYYY-MM-DD'), 'PROCESSED', 30002);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-05-15', 'YYYY-MM-DD'), 'PROCESSED', 30002);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-06-15', 'YYYY-MM-DD'), 'PROCESSED', 30002);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-07-15', 'YYYY-MM-DD'), 'PROCESSED', 30002);

INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-03-15', 'YYYY-MM-DD'), 'PROCESSED', 30004);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-04-15', 'YYYY-MM-DD'), 'PROCESSED', 30004);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-05-15', 'YYYY-MM-DD'), 'PROCESSED', 30004);
INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-06-15', 'YYYY-MM-DD'), 'PROCESSED', 30004);


-- ##########################################################
-- Shipment Request Product
INSERT INTO SHIPMENT_REQUEST_PRODUCT(PRODUCT_ID, REQUEST_ID, QUANTITY, SUPPLIABLE_AMOUNT)
SELECT P.PRODUCT_ID, SR.REQUEST_ID, FLOOR(DBMS_RANDOM.VALUE(10, 21)), FLOOR(DBMS_RANDOM.VALUE(5, 15))
FROM PRODUCTS P, SHIPMENT_REQUEST SR;
-- WHERE FLOOR(DBMS_RANDOM.VALUE(0,2)) = 1;


-- SELECT P.PRODUCT_ID, SR.REQUEST_ID
-- FROM PRODUCTS P, SHIPMENT_REQUEST SR

ALTER SEQUENCE SHIPMENT_ID_SEQ
RESTART START WITH 1000;


-- Shipment
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-02-19', 'YYYY-MM-DD'), TO_DATE('2022-02-21', 'YYYY-MM-DD'), 500, 'DELIVERED', 501, 30001);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-03-19', 'YYYY-MM-DD'), TO_DATE('2022-03-21', 'YYYY-MM-DD'), 500, 'DELIVERED', 501, 30001);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-04-19', 'YYYY-MM-DD'), TO_DATE('2022-04-21', 'YYYY-MM-DD'), 588, 'DELIVERED', 501, 30001);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-05-19', 'YYYY-MM-DD'), TO_DATE('2022-05-21', 'YYYY-MM-DD'), 689, 'DELIVERED', 501, 30001);

INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-04-24', 'YYYY-MM-DD'), TO_DATE('2022-04-26', 'YYYY-MM-DD'), 555, 'DELIVERED', 501, 30002);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-05-19', 'YYYY-MM-DD'), TO_DATE('2022-05-21', 'YYYY-MM-DD'), 565, 'DELIVERED', 501, 30002);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-06-19', 'YYYY-MM-DD'), TO_DATE('2022-06-21', 'YYYY-MM-DD'), 589, 'DELIVERED', 502, 30002);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-07-19', 'YYYY-MM-DD'), TO_DATE('2022-07-21', 'YYYY-MM-DD'), 545, 'DELIVERED', 502, 30002);

INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-03-19', 'YYYY-MM-DD'), TO_DATE('2022-03-21', 'YYYY-MM-DD'), 655, 'DELIVERED', 502, 30004);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-04-19', 'YYYY-MM-DD'), TO_DATE('2022-04-21', 'YYYY-MM-DD'), 645, 'DELIVERED', 502, 30004);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-05-19', 'YYYY-MM-DD'), TO_DATE('2022-05-21', 'YYYY-MM-DD'), 685, 'DELIVERED', 502, 30004);
INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-06-19', 'YYYY-MM-DD'), TO_DATE('2022-06-21', 'YYYY-MM-DD'), 569, 'DELIVERED', 502, 30004);


-- Inserting into 
-- SHIPMENT_ID, PRODUCT_ID, QUANTITY, RETURN_DATE, RETURN_AMOUNT
-- INSERT INTO SHIPMENT_PRODUCT SP 
-- SELECT  NULL, NULL

-- SELECT 1003, PP.PRODUCT_ID, PP.SUPPLIABLE_AMOUNT
-- FROM (
--     SELECT PRODUCT_ID, SUPPLIABLE_AMOUNT
--     FROM SHIPMENT_REQUEST_PRODUCT
--     WHERE REQUEST_ID = 1000
-- ) PP

INSERT INTO SHIPMENT_PRODUCT
SELECT S.SHIPMENT_ID, SRP.PRODUCT_ID, SRP.SUPPLIABLE_AMOUNT, NULL, NULL
FROM SHIPMENT S 
JOIN SHIPMENT_REQUEST_PRODUCT SRP ON(S.SHIPMENT_ID = SRP.REQUEST_ID);


-- SELECT S.SHIPMENT_ID, SRP.PRODUCT_ID, SRP.SUPPLIABLE_AMOUNT, NULL, NULL
-- FROM SHIPMENT S 
-- JOIN SHIPMENT_REQUEST_PRODUCT SRP ON(S.SHIPMENT_ID = SRP.REQUEST_ID)
-- WHERE S.SHIPMENT_ID = 

-- SELECT S.SHIPMENT_ID, SRP.PRODUCT_ID, count(*)
-- FROM SHIPMENT S 
-- JOIN SHIPMENT_REQUEST_PRODUCT SRP ON(S.SHIPMENT_ID = SRP.REQUEST_ID)
-- GROUP BY S.SHIPMENT_ID, SRP.PRODUCT_ID;

-- TRIGGER Testing

INSERT INTO SHIPMENT_REQUEST VALUES
(SHIPMENT_REQUEST_ID_SEQ.NEXTVAL, TO_DATE('2022-06-21', 'YYYY-MM-DD'), 'PROCESSED', 30004);

INSERT INTO SHIPMENT_REQUEST_PRODUCT VALUES (50001, 1012, 25, 25);

INSERT INTO SHIPMENT VALUES
(SHIPMENT_ID_SEQ.NEXTVAL, TO_DATE('2022-06-24', 'YYYY-MM-DD'), TO_DATE('2022-06-26', 'YYYY-MM-DD'), 569, 'DELIVERED', 502, 30004);

INSERT INTO SHIPMENT_PRODUCT VALUES (1012, 50001, 25, NULL, NULL);


-- Shop Product insersion
-- SHOP_ID, PRODUCT_ID QUANTITY
INSERT INTO SHOP_PRODUCTS
SELECT S.SHOP_ID, P.PRODUCT_ID, 0
FROM SHOPS S, PRODUCTS P;

-- Updating shop products
UPDATE SHOP_PRODUCTS SHP SET
SHP.QUANTITY = SHP.QUANTITY + NVL((
    SELECT NVL(SUM(SP.QUANTITY), 0)
    FROM SHIPMENT S JOIN SHIPMENT_PRODUCT SP
    ON(S.SHIPMENT_ID = SP.SHIPMENT_ID)
    WHERE SHP.SHOP_ID = S.SHOP_ID AND SHP.PRODUCT_ID = SP.PRODUCT_ID
), 0);

/* Test to check weather it works or not
SELECT SHP.SHOP_ID, SHP.PRODUCT_ID, (
    SELECT NVL(SUM(SP.QUANTITY), 0)
    FROM SHIPMENT S JOIN SHIPMENT_PRODUCT SP
    ON(S.SHIPMENT_ID = SP.SHIPMENT_ID)
    WHERE SHP.SHOP_ID = S.SHOP_ID AND SHP.PRODUCT_ID = SP.PRODUCT_ID
) COL
FROM SHOP_PRODUCTS SHP;

SELECT SHIPMENT_ID, SUM(QUANTITY)
FROM SHIPMENT_PRODUCT
WHERE PRODUCT_ID=50002
GROUP BY SHIPMENT_ID;
*/


-- UPDATE SHOP_PRODUCTS SHP SET
-- SHP.QUANTITY = SHP.QUANTITY + SUB.Q
-- FROM (
--     SELECT SP.QUANTITY AS Q, S.SHOP_ID AS SID, SP.PRODUCT_ID AS PID
--     FROM SHIPMENT S JOIN SHIPMENT_PRODUCT SP 
--     ON(S.SHIPMENT_ID = SP.SHIPMENT_ID)
-- ) SUB
-- WHERE SHP.SHOP_ID = SUB.SID AND SHP.PRODUCT_ID = SUB.PID;
-- WHERE S.SHOP_ID = 30001 AND SP.PRODUCT_ID = 50001;


ALTER SEQUENCE CUSTOMER_ID_SEQ
RESTART START WITH 1000;

-- INSERT INTO CUSTOMERS VALUES(CUSTOMER_ID_SEQ.NEXTVAL, )
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Rahim Ahmed', 'rahim@example.com', '1234567890');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Aliya Khan', 'aliya@example.com', '9876543210');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Kamrul Islam', 'kamrul@example.com', '5678901234');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Sabrina Akhtar', 'sabrina@example.com', '3456789012');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Mohammad Ali', 'mohammad@example.com', '9012345678');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Abul Hasan', 'abul@example.com', '6789012345');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Tasneema Begum', 'tasneema@example.com', '2345678901');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Rubel Mia', 'rubel@example.com', '7890123456');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Shahidul Islam', 'shahidul@example.com', '4567890123');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Fahima Khan', 'fahima@example.com', '8901234567');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Sakib Rahman', 'sakib@example.com', '3454489012');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Nadia Chowdhury', 'nadia@example.com', '6745451234');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Hasan Ali', 'hasan@example.com', '2309878901');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Tahmina Islam', 'tahmina@example.com', '7804455115');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Rafiqul Haque', 'rafiqul@example.com', '4555890123');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Sadia Khan', 'sadia@example.com', '1662345678');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Anisul Haque', 'anisul@example.com', '6789776345');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Farhana Akhter', 'farhana@example.com', '2345555551');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Mizanur Rahman', 'mizanur@example.com', '1122330099');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Ayesha Khan', 'ayesha@example.com', '4019290123');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Salman Khan', 'salman@example.com', '9011114567');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Fatema Begum', 'fatema@example.com', '4578012345');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Imran Khan', 'imran@example.com', '2345554401');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Nazrul Islam', 'nazrul@example.com', '0131517192');
INSERT INTO CUSTOMERS VALUES (CUSTOMER_ID_SEQ.NEXTVAL, 'Aisha Akhter', 'aisha@example.com', '0202890123');



ALTER SEQUENCE PURCHASE_ID_SEQ RESTART START WITH 1000;
DELETE PURCHASE;
-- Purchase for shop 300001 2022-2-25
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-02-25 09:45 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-02-28 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-11 07:45 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-15 06:45 pM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-21 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-25 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-01 09:36 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-06 03:45 pM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-13 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-16 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-20 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-23 01:45 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-28 02:45 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-30 05:25 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-06 08:15 PM', 'YYYY-MM-DD HH:MI PM'), 30001, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));

-- Purchase for shop 30002 start from : 
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-27 09:45 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-02 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-09 07:45 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-15 06:45 pM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-21 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-25 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-01 09:36 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-06 03:45 pM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-13 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-16 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-20 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-23 01:45 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-28 02:45 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-07-03 05:25 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-07-09 08:15 PM', 'YYYY-MM-DD HH:MI PM'), 30002, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));

-- purchase for shop 30004 start from 2022-03-
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-24 09:45 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-03-29 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-03 07:45 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-10 06:45 pM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-16 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-19 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-24 09:36 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-04-28 03:45 pM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-01 10:45 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-06 11:45 AM', 'YYYY-MM-DD HH:MI AM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-07 12:45 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-16 01:45 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-21 02:45 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-05-28 05:25 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));
INSERT INTO PURCHASE VALUES
(PURCHASE_ID_SEQ.NEXTVAL, TO_TIMESTAMP('2022-06-09 08:15 PM', 'YYYY-MM-DD HH:MI PM'), 30004, 1000+FLOOR(DBMS_RANDOM.VALUE(0, 25)));



-- Inserting purchase products
-- PURCHASE_ID, PRODUCT_ID, Product price, QUANTITY
INSERT INTO PURCHASED_PRODUCT VALUES (1000, 50014, 2499, 2);
INSERT INTO PURCHASED_PRODUCT VALUES (1001, 50014, 2499, 1);

INSERT INTO PURCHASED_PRODUCT
SELECT P.PURCHASE_ID, (50000 + FLOOR(DBMS_RANDOM.VALUE(1, 14))), 0, FLOOR(DBMS_RANDOM.VALUE(1,3))
FROM PURCHASE P;

UPDATE PURCHASED_PRODUCT PP SET
PP.PRODUCT_PRICE = (
    SELECT P.PRICE
    FROM PRODUCTS P
    WHERE PP.PRODUCT_ID = P.PRODUCT_ID
);


INSERT INTO PRODUCT_ALLOTEMENT
SELECT P.PRODUCT_ID, RG.REGION_ID, FLOOR(DBMS_RANDOM.VALUE(50, 75)), 0, CURRENT_TIMESTAMP, 'UPDATED'
FROM PRODUCTS P, REGION RG;

-- INSERT INTO PURCHASED_PRODUCT
-- SELECT P.PURCHASE_ID, (50000 + FLOOR(DBMS_RANDOM.VALUE(1, 14))), 0, FLOOR(DBMS_RANDOM.VALUE(1,2))
-- FROM PURCHASE P JOIN (
--     SELECT PS.PURCHASE_ID, FLOOR(DBMS_RANDOM.VALUE(1, 4)) RAND
--     FROM PURCHASE PS
-- ) P2 ON(P.PURCHASE_ID = P2.PURCHASE_ID)
-- WHERE P2.RAND = 1;


SELECT FLOOR(DBMS_RANDOM.VALUE(1, 14)) FROM PRODUCTS;
