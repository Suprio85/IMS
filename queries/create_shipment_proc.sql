

CREATE OR REPLACE PROCEDURE CREATE_NEW_SHIPMENT(V_REQUEST_ID IN NUMBER, V_INVEN_ID IN NUMBER,
                                    V_REGION_ID IN NUMBER, v_success OUT NUMBER) IS
    v_shipment_id NUMBER;
    v_shop_id NUMBER;
    v_curr_amount NUMBER;
    v_shipping_amount NUMBER;
    v_status VARCHAR2(16);
    v_unprocessed EXCEPTION;
    v_closed_req EXCEPTION;
BEGIN
    v_shipment_id := -1;
    v_success := 0;
    SELECT STATUS INTO v_status FROM SHIPMENT_REQUEST WHERE REQUEST_ID=V_REQUEST_ID;
    IF v_status = 'CLOSED' THEN
        RAISE v_closed_req;
    ELSIF v_status <> 'PROCESSED' THEN
        RAISE v_unprocessed;
    END IF;


    DBMS_OUTPUT.PUT_LINE(v_shipment_id);
    SELECT SHOP_ID INTO v_shop_id FROM SHIPMENT_REQUEST WHERE REQUEST_ID=V_REQUEST_ID;
    FOR PR IN (SELECT PRODUCT_ID PID, NVL(SUPPLIABLE_AMOUNT,0) Q FROM SHIPMENT_REQUEST_PRODUCT WHERE REQUEST_ID=V_REQUEST_ID) LOOP
        SELECT QUANTITY INTO v_curr_amount FROM INVENTORY_PRODUCTS WHERE INVENTORY_ID=V_INVEN_ID AND PRODUCT_ID=PR.PID;
        IF PR.Q > 0 THEN
            IF v_shipment_id = -1 THEN
                v_shipment_id := SHIPMENT_ID_SEQ.NEXTVAL;
                INSERT INTO SHIPMENT VALUES(v_shipment_id, SYSDATE, SYSDATE, NULL, 'PENDING', V_INVEN_ID, v_shop_id);
                v_success := 1;
            END IF;
            IF v_curr_amount >= PR.Q THEN
                v_shipping_amount := PR.Q;
            ELSE
                v_shipping_amount := v_curr_amount;
            END IF;
            INSERT INTO SHIPMENT_PRODUCT VALUES(v_shipment_id, PR.PID, v_shipping_amount, NULL, NULL);
            UPDATE SHIPMENT_REQUEST_PRODUCT SET SUPPLIABLE_AMOUNT = (PR.Q-v_shipping_amount)
            WHERE REQUEST_ID=V_REQUEST_ID AND PRODUCT_ID=PR.PID;
            
            UPDATE PRODUCT_ALLOTEMENT SET USED_AMOUNT = USED_AMOUNT + (v_shipping_amount)
            WHERE REGION_ID=V_REGION_ID AND PRODUCT_ID=PR.PID;
        END IF;
    END LOOP;

EXCEPTION
    WHEN v_unprocessed THEN
        v_success := -1;
    WHEN v_closed_req THEN
        v_success := -2;

END;

/