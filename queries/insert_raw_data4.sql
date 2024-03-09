
DECLARE
    v_curr_date DATE;
    v_invntory_id NUMBER;
    v_quantity NUMBER;
    v_available NUMBER;
    v_cust NUMBER;
    v_price NUMBER(10, 5);
BEGIN
    v_curr_date := ADD_MONTHS(SYSDATE, 0);
    
    WHILE v_curr_date > ADD_MONTHS(SYSDATE, -12) LOOP

        FOR P IN (SELECT PRODUCT_ID PID, PRICE prc FROM PRODUCTS) LOOP
            FOR S IN (SELECT SHOP_ID SID FROM SHOPS WHERE SHOP_ID=30004) LOOP
                v_cust := FLOOR(DBMS_RANDOM.VALUE(1001, 1100));
                v_quantity := FLOOR(DBMS_RANDOM.VALUE(1,3));
                SELECT NVL(QUANTITY, 0) INTO v_available FROM SHOP_PRODUCTS WHERE SHOP_ID = S.SID AND PRODUCT_ID=P.PID;
                IF v_available > v_quantity THEN
                    INSERT INTO PURCHASE  VALUES (PURCHASE_ID_SEQ.NEXTVAL, 
                    TO_TIMESTAMP((TO_CHAR(v_curr_date, 'DD-MM-YYYY')), 'DD-MM-YYYY'), S.SID, v_cust);

                    INSERT INTO PURCHASED_PRODUCT VALUES(PURCHASE_ID_SEQ.CURRVAL, P.PID, P.PRC, v_quantity);

                    UPDATE SHOP_PRODUCTS SET QUANTITY = v_available-v_quantity
                    WHERE SHOP_ID=S.SID AND PRODUCT_ID = P.PID;
                END IF;
            END LOOP;
        END LOOP;
        v_curr_date := v_curr_date-1;

    END LOOP;
END;
/


