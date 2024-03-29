-- Project:
-- Inventory Management System
-- 2105085, 2105086



CREATE TABLE CATAGORY(
    CATAGORY_ID NUMBER,
    CATAGORY_NAME VARCHAR2(25) NOT NULL,
    CONSTRAINT CATAGORY_PK PRIMARY KEY (CATAGORY_ID)
);


CREATE TABLE PRODUCTS(
    PRODUCT_ID NUMBER,
    PRODUCT_NAME VARCHAR2(75) NOT NULL UNIQUE,
    PRICE NUMBER(12, 2) NOT NULL,
    WARRANTY_YEARS NUMBER(4,2),
    IMAGE VARCHAR2(250) NOT NULL,
    STATUS VARCHAR(15) NOT NULL,
    CATAGORY_ID NUMBER NOT NULL,
    CONSTRAINT PRODUCT_PK PRIMARY KEY (PRODUCT_ID),
    CONSTRAINT CATAGORY_FK FOREIGN KEY (CATAGORY_ID) REFERENCES CATAGORY(CATAGORY_ID),
    CONSTRAINT PRICE_STATUS CHECK(
        PRICE > 0 AND (STATUS='continued' OR STATUS='discontinued')
        AND WARRANTY_YEARS > 0.5
    )
);


CREATE TABLE JOBS(
    JOB_ID VARCHAR2(10),
    JOB_TITLE VARCHAR2(45) NOT NULL UNIQUE,
    JOB_DESCRIPTION VARCHAR2(85),
    MAX_SALARY NUMBER NOT NULL,
    MIN_SALARY NUMBER NOT NULL,
    CONSTRAINT JOB_PK PRIMARY KEY (JOB_ID),
    CONSTRAINT SALARY_CHECK CHECK(
        MAX_SALARY > 0 AND MIN_SALARY > 0 AND MAX_SALARY > MIN_SALARY
    )
);

-- ALTER TABLE JOBS
-- ADD JOB_DESCRIPTION VARCHAR2(75);


CREATE TABLE REGION(
    REGION_ID NUMBER,
    REGION_NAME VARCHAR2(45) NOT NULL UNIQUE,
    SUPPLY_MANAGER_ID NUMBER,
    CONSTRAINT REGION_PK PRIMARY KEY (REGION_ID)
);


CREATE TABLE AREAS(
    AREA_CODE NUMBER,
    STREET_ADDRESS VARCHAR2(50) NOT NULL,
    POSTAL_CODE NUMBER NOT NULL UNIQUE,
    CITY VARCHAR2(25) NOT NULL,
    REGION_ID NUMBER NOT NULL,
    CONSTRAINT AREA_PK PRIMARY KEY (AREA_CODE),
    CONSTRAINT REGION_FK FOREIGN KEY (REGION_ID) REFERENCES REGION(REGION_ID)
);

CREATE TABLE SHOPS(
    SHOP_ID NUMBER,
    SHOP_NAME VARCHAR2(75) NOT NULL,
    OPENING_TIME TIMESTAMP WITH TIME ZONE NOT NULL,
    CLOSING_TIME TIMESTAMP WITH TIME ZONE NOT NULL,
    EMAIL VARCHAR2(100) NOT NULL UNIQUE,
    PHONE_NUMBER VARCHAR2(15) UNIQUE,
    AREA_CODE NUMBER NOT NULL,
    CONSTRAINT SHOP_PK PRIMARY KEY (SHOP_ID),
    CONSTRAINT AREA_FK FOREIGN KEY (AREA_CODE) REFERENCES AREAS(AREA_CODE)
);


CREATE TABLE FACTORY(
    FACTORY_ID NUMBER,
    FACTORY_LISCENCE VARCHAR2(500) NOT NULL,
    OPENING_DATE DATE NOT NULL,
    CLOSING_DATE DATE,
    AREA_CODE NUMBER NOT NULL,
    CONSTRAINT FACTORY_PK PRIMARY KEY (FACTORY_ID),
    CONSTRAINT FACTORY_AREA_FK FOREIGN KEY (AREA_CODE) REFERENCES AREAS(AREA_CODE),
    CONSTRAINT DATE_CHECK CHECK(
        CLOSING_DATE IS NULL OR CLOSING_DATE>OPENING_DATE
    )
);


CREATE TABLE EMPLOYEES(
    EMPLOYEE_ID NUMBER,
    FIRST_NAME VARCHAR2(25) NOT NULL,
    LAST_NAME VARCHAR2(25) NOT NULL,
    SALARY NUMBER NOT NULL,
    BANK_ACCOUNT NUMBER NOT NULL UNIQUE,
    HIRING_DATE DATE NOT NULL,
    USERNAME VARCHAR2(100) NOT NULL UNIQUE,
    USER_PASSWORD VARCHAR2(1000) NOT NULL UNIQUE,
    IMAGE VARCHAR2(250) NOT NULL,
    JOB_ID VARCHAR2(10) NOT NULL,
    ADDRESS_AREA_CODE NUMBER NOT NULL,
    MANAGER_ID NUMBER,
    CONSTRAINT EMPLOYEE_PK PRIMARY KEY (EMPLOYEE_ID),
    CONSTRAINT JOB_FK FOREIGN KEY (JOB_ID) REFERENCES JOBS(JOB_ID),
    CONSTRAINT EMP_MANAGER_FK FOREIGN KEY (MANAGER_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID),
    CONSTRAINT EMP_ADDRESS_FK FOREIGN KEY (ADDRESS_AREA_CODE)
    REFERENCES AREAS(AREA_CODE),
    CONSTRAINT EMP_SALARY_CHECK CHECK( SALARY>0 )
);


CREATE TABLE CASHIER(
    EMPLOYEE_ID NUMBER,
    SHOP_ID NUMBER NOT NULL,
    WORK_SHIFT VARCHAR2(8) NOT NULL,
    CONSTRAINT CASHIER_PK PRIMARY KEY (EMPLOYEE_ID),
    CONSTRAINT C_EMPLOYEE_FK FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID),
    CONSTRAINT C_SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID),
    CONSTRAINT SHIFT_CHECK CHECK(
        WORK_SHIFT='MORNING' OR WORK_SHIFT='NIGHT'
    )
);

CREATE TABLE SHOP_MANAGER(
    EMPLOYEE_ID NUMBER,
    SHOP_ID NUMBER NOT NULL UNIQUE,
    CONSTRAINT SHOP_MANAGER_PK PRIMARY KEY (EMPLOYEE_ID),
    CONSTRAINT EMPLOYEE_FK FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID),
    CONSTRAINT SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID)
);


CREATE TABLE PRODUCTION_MANAGER(
    EMPLOYEE_ID NUMBER,
    FACTORY_ID NUMBER NOT NULL UNIQUE,
    CONSTRAINT PRODUCTION_MANAGER_PK PRIMARY KEY (EMPLOYEE_ID),
    CONSTRAINT PM_EMPLOYEE_FK FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID),
    CONSTRAINT PM_FACTORY_FK FOREIGN KEY (FACTORY_ID) REFERENCES FACTORY(FACTORY_ID)
);


CREATE TABLE SUPPLY_MANAGER(
    EMPLOYEE_ID NUMBER PRIMARY KEY,
    CONSTRAINT SM_EMPLOYEE_FK FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID)
);


ALTER TABLE REGION
ADD CONSTRAINT SUPPLY_MANAGER_FK
FOREIGN KEY(SUPPLY_MANAGER_ID) REFERENCES SUPPLY_MANAGER(EMPLOYEE_ID);


CREATE TABLE INVENTORY(
    INVENTORY_ID NUMBER PRIMARY KEY,
    INVENTORY_NAME VARCHAR2(100) NOT NULL UNIQUE,
    VOLUME NUMBER NOT NULL,
    SPECIALITY VARCHAR2(30),
    AREA_CODE NUMBER,
    CONSTRAINT INV_AREA_FK FOREIGN KEY (AREA_CODE) REFERENCES AREAS(AREA_CODE),
    CONSTRAINT VOLUME_CHECK CHECK( VOLUME > 0)
);


CREATE TABLE INVENTORY_LOT(
    LOT_ID NUMBER PRIMARY KEY,
    SUPPLY_DATE DATE NOT NULL,
    FACTORY_ID NUMBER NOT NULL,
    INVENTORY_ID NUMBER NOT NULL,
    CONSTRAINT FACTORY_FK FOREIGN KEY (FACTORY_ID) REFERENCES FACTORY(FACTORY_ID),
    CONSTRAINT INVENTORY_FK FOREIGN KEY (INVENTORY_ID) REFERENCES INVENTORY(INVENTORY_ID)
);


CREATE TABLE PRODUCT_ALLOTEMENT(
    PRODUCT_ID NUMBER NOT NULL,
    REGION_ID NUMBER NOT NULL,
    AMOUNT NUMBER NOT NULL,
    USED_AMOUNT NUMBER NOT NULL,
    LAST_UPDATED TIMESTAMP WITH TIME ZONE NOT NULL,
    STATUS VARCHAR2(15),
    CONSTRAINT ALLOTEMENT_PK PRIMARY KEY (PRODUCT_ID, REGION_ID),
    CONSTRAINT ALLOT_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT ALLOT_REGION_FK FOREIGN KEY (REGION_ID) REFERENCES REGION(REGION_ID),
    -- check amount should be more that or equal to 0
    CONSTRAINT AMOUNT_CHECK CHECK( AMOUNT>=0 AND USED_AMOUNT>=0 ),
    CONSTRAINT ALLOTMENT_STATUS CHECK(
        STATUS = 'OLD' OR STATUS = 'ON PROCESS' OR STATUS = 'UPDATED'
    )
);


CREATE TABLE INVENTORY_PRODUCTS(
    INVENTORY_ID NUMBER NOT NULL,
    PRODUCT_ID NUMBER NOT NULL,
    QUANTITY NUMBER NOT NULL,
    CONSTRAINT INVENTORY_PRODUCT_PK PRIMARY KEY (PRODUCT_ID, INVENTORY_ID),
    CONSTRAINT INV_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT INV_PR_INVENTORY_FK FOREIGN KEY (INVENTORY_ID) REFERENCES INVENTORY(INVENTORY_ID),
    CONSTRAINT INV_QUANTITY_CHECK CHECK( QUANTITY>=0 )
);


CREATE TABLE INVENTORY_LOT_PRODUCTS(
    LOT_ID NUMBER NOT NULL,
    PRODUCT_ID NUMBER NOT NULL,
    QUANTITY NUMBER NOT NULL,
    PRICE NUMBER(12, 2) NOT NULL,
    MANUFACTURING_DATE DATE NOT NULL,
    -- Add a new status Attribute
    CONSTRAINT INV_LOT_PRODUCT_PK PRIMARY KEY (PRODUCT_ID, LOT_ID),
    CONSTRAINT LOT_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT INVENTORY_LOT_FK FOREIGN KEY (LOT_ID) REFERENCES INVENTORY_LOT(LOT_ID),
    CONSTRAINT LOT_QUANTITY_CHECK CHECK( QUANTITY>0 )
);


CREATE TABLE SHOP_PRODUCTS(
    SHOP_ID NUMBER NOT NULL,
    PRODUCT_ID NUMBER NOT NULL,
    QUANTITY NUMBER NOT NULL,
    CONSTRAINT SHOP_PRODUCT_PK PRIMARY KEY (SHOP_ID, PRODUCT_ID),
    CONSTRAINT P_SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID),
    CONSTRAINT S_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT SHOP_QUANTITY_CHECK CHECK( QUANTITY >= 0)
);


CREATE TABLE SHIPMENT_REQUEST(
    REQUEST_ID NUMBER PRIMARY KEY,
    REQUEST_DATE DATE NOT NULL,
    STATUS VARCHAR2(15) NOT NULL,
    SHOP_ID NUMBER NOT NULL,
    CONSTRAINT REQ_SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID),
    CONSTRAINT STATUS_CHECK CHECK (STATUS='PENDING' OR STATUS='PROCESSED' OR STATUS='PROCESSING' OR STATUS='CLOSED')
);


CREATE TABLE SHIPMENT_REQUEST_PRODUCT(
    PRODUCT_ID NUMBER NOT NULL,
    REQUEST_ID NUMBER NOT NULL,
    QUANTITY NUMBER NOT NULL,
    -- New Attribute
    SUPPLIABLE_AMOUNT NUMBER,
    CONSTRAINT SHIPMENT_REQUEST_PRODUCT_PK PRIMARY KEY (REQUEST_ID, PRODUCT_ID),
    CONSTRAINT SHIP_REQ_FK FOREIGN KEY (REQUEST_ID) REFERENCES SHIPMENT_REQUEST(REQUEST_ID),
    CONSTRAINT REQ_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT REQ_QUANTITY_CHECK CHECK( QUANTITY >= 0),
    CONSTRAINT SUPPLIABLE_AMOUNT_CHECK CHECK( SUPPLIABLE_AMOUNT >=0 OR SUPPLIABLE_AMOUNT IS NULL)
);


CREATE TABLE SHIPMENT(
    SHIPMENT_ID NUMBER PRIMARY KEY,
    SHIPPING_DATE DATE NOT NULL,
    RECEIVING_DATE DATE NOT NULL,
    SHIPPING_COST NUMBER(10, 2),
    DELIVERY_STATUS VARCHAR2(10),
    INVENTORY_ID NUMBER NOT NULL,
    SHOP_ID NUMBER NOT NULL,
    CONSTRAINT SHIP_INV_FK FOREIGN KEY(INVENTORY_ID) REFERENCES INVENTORY(INVENTORY_ID),
    CONSTRAINT SHIP_SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID),
    CONSTRAINT SHIP_STATUS_CHECK CHECK(
        DELIVERY_STATUS='PENDING' OR DELIVERY_STATUS='SHIPPED' OR DELIVERY_STATUS='DELIVERED'
    )
);


CREATE TABLE SHIPMENT_PRODUCT(
    SHIPMENT_ID NUMBER,
    PRODUCT_ID NUMBER,
    QUANTITY NUMBER NOT NULL,
    RETURN_DATE DATE,
    RETURN_AMOUNT NUMBER,
    CONSTRAINT SHIPMENT_PRODUCTS_PK PRIMARY KEY (SHIPMENT_ID, PRODUCT_ID),
    CONSTRAINT SHIPMENT_FK FOREIGN KEY (SHIPMENT_ID) REFERENCES SHIPMENT(SHIPMENT_ID),
    CONSTRAINT SHIP_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT QUANTITY_RETURN_CHECK CHECK(
        ((RETURN_DATE IS NULL AND RETURN_AMOUNT IS NULL) OR
        (RETURN_DATE IS NOT NULL AND RETURN_AMOUNT IS NOT NULL)) AND
        QUANTITY >= 0
    )
);


CREATE TABLE CUSTOMERS(
    CUSTOMER_ID NUMBER PRIMARY KEY,
    CUSTOMER_NAME VARCHAR2(25) NOT NULL,
    EMAIL VARCHAR2(75) NOT NULL UNIQUE,
    MOBILE_NO VARCHAR2(75) UNIQUE
);

CREATE TABLE PURCHASE(
    PURCHASE_ID NUMBER PRIMARY KEY,
    PURCHASE_TIME TIMESTAMP WITH TIME ZONE NOT NULL,
    SHOP_ID NUMBER NOT NULL,
    CUSTOMER_ID NUMBER NOT NULL,
    CONSTRAINT CUSTOMER_FK FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMERS(CUSTOMER_ID),
    CONSTRAINT PUR_SHOP_FK FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID)
);


CREATE TABLE PURCHASED_PRODUCT(
    PURCHASE_ID NUMBER,
    PRODUCT_ID NUMBER,
    -- Missed product price
    PRODUCT_PRICE NUMBER(12, 3),
    QUANTITY NUMBER NOT NULL,
    CONSTRAINT PURCHASE_PRODUCT_PK PRIMARY KEY (PURCHASE_ID, PRODUCT_ID),
    CONSTRAINT PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT PURCHASE_FK FOREIGN KEY (PURCHASE_ID) REFERENCES PURCHASE(PURCHASE_ID) ON DELETE CASCADE,
    CONSTRAINT QUANTITY_CHECK CHECK( QUANTITY>0)
);

-- we need 5 seqences
CREATE SEQUENCE PURCHASE_ID_SEQ
    INCREMENT BY 1
    START WITH 1000
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;


CREATE SEQUENCE SHIPMENT_REQUEST_ID_SEQ
    INCREMENT BY 1
    START WITH 1000
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;


CREATE SEQUENCE SHIPMENT_ID_SEQ
    INCREMENT BY 1
    START WITH 1000
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;

    
CREATE SEQUENCE INVENTORY_LOT_ID_SEQ
    INCREMENT BY 1
    START WITH 1000
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;
    
CREATE SEQUENCE CUSTOMER_ID_SEQ
    INCREMENT BY 1
    START WITH 1000
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;




CREATE TABLE TEMP_MONTHLY_SALE(
    MONTH_YEAR DATE,
    SHOP_ID NUMBER,
    PRODUCT_ID NUMBER,
    TOTAL_SALE NUMBER,
    CONSTRAINT MONTHLY_SALE_Pk PRIMARY KEY (MONTH_YEAR, SHOP_ID, PRODUCT_ID),
    CONSTRAINT SALE_SHOP_Fk FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID),
    CONSTRAINT SALE_PRODUCT_FK FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID)
);

CREATE TABLE CONTINUES_PRODUCT_RECOMMENDATION (
    PRODUCT_ID NUMBER,
    SHOP_ID NUMBER,
    AMOUNT NUMBER CHECK (AMOUNT >= 0),
    CONSTRAINT PK_CONTINUES_PRODUCT_RECOMMENDATION PRIMARY KEY (PRODUCT_ID, SHOP_ID),
    CONSTRAINT FK_CONTINUES_PRODUCT_RECOMMENDATION_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID),
    CONSTRAINT FK_CONTINUES_PRODUCT_RECOMMENDATION_SHOP FOREIGN KEY (SHOP_ID) REFERENCES SHOPS(SHOP_ID)
);


