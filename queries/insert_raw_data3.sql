-- Creating new shipments
DECLARE
    v_curr_date DATE;
    v_invntory_id NUMBER;
BEGIN
    v_curr_date := TRUNC(ADD_MONTHS(SYSDATE, -36), 'MONTH') + 2;
    
    FOR SR IN (SELECT REQUEST_ID, REQUEST_DATE, SHOP_ID FROM SHIPMENT_REQUEST) LOOP
        v_invntory_id := 501 + FLOOR(DBMS_RANDOM.VALUE(0, 2));
        INSERT INTO SHIPMENT VALUES(SHIPMENT_ID_SEQ.NEXTVAL, SR.REQUEST_DATE+1, SR.REQUEST_DATE+2, 
        FLOOR(DBMS_RANDOM.VALUE(700, 1300)), 'DELIVERED', v_invntory_id, SR.SHOP_ID);

        INSERT INTO SHIPMENT_PRODUCT
        SELECT SHIPMENT_ID_SEQ.CURRVAL, PRODUCT_ID, SUPPLIABLE_AMOUNT, NULL, NULL
        FROM SHIPMENT_REQUEST_PRODUCT WHERE REQUEST_ID = SR.REQUEST_ID;
    END LOOP;
END;
/


DECLARE
    v_curr_date DATE;
    v_invntory_id NUMBER;
BEGIN
    v_curr_date := TRUNC(ADD_MONTHS(SYSDATE, -36), 'MONTH') + 2;
    
    FOR RS IN (SELECT S.SHOP_ID SHID, S.SHIPMENT_ID SID, S.INVENTORY_ID IID, SP.PRODUCT_ID PID, SP.QUANTITY Q
            FROM SHIPMENT S JOIN SHIPMENT_PRODUCT SP ON(S.SHIPMENT_ID=SP.SHIPMENT_ID)) LOOP

        UPDATE INVENTORY_PRODUCTS SET QUANTITY=QUANTITY-RS.Q
        WHERE INVENTORY_ID = RS.IID AND PRODUCT_ID=RS.PID;

        UPDATE SHOP_PRODUCTS SET QUANTITY=QUANTITY+RS.Q
        WHERE SHOP_ID = RS.SHID AND PRODUCT_ID=RS.IID;
        
    END LOOP;
END;


DECLARE
    v_curr_date DATE;
    v_invntory_id NUMBER;
BEGIN
    v_curr_date := TRUNC(ADD_MONTHS(SYSDATE, -36), 'MONTH') + 2;
    DELETE SHOP_PRODUCTS;
    insert into SHOP_PRODUCTS
    SELECT S.SHOP_ID, P.PRODUCT_ID, 0
    FROM SHOPS S, PRODUCTS P;
    
    FOR RS IN (SELECT S.SHOP_ID SHID, S.SHIPMENT_ID SID, S.INVENTORY_ID IID, SP.PRODUCT_ID PID, SP.QUANTITY Q
            FROM SHIPMENT S JOIN SHIPMENT_PRODUCT SP ON(S.SHIPMENT_ID=SP.SHIPMENT_ID)) LOOP

        UPDATE SHOP_PRODUCTS SET QUANTITY=QUANTITY+RS.Q
        WHERE SHOP_ID = RS.SHID AND PRODUCT_ID=RS.PID;
        
    END LOOP;
END;
