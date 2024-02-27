
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

