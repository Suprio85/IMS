
CREATE OR REPLACE PROCEDURE CALCULATE_PRODUCT_PRICE(RUN_DATE IN DATE) IS
    v_new_price NUMBER(10,5);
    v_total_new NUMBER;
    v_prev_stock NUMBER;
    v_current_price NUMBER(10, 5);
    prev_run_date DATE;
    curr_run_date DATE;
    running_day NUMBER;
BEGIN
    running_day := TO_NUMBER(TO_CHAR(RUN_DATE, 'DD'));
    IF running_day < 17 AND running_day >= 2 THEN
        prev_run_date := TO_DATE('17-'||TO_CHAR(ADD_MONTHS(RUN_DATE, -1), 'MM-YYYY'), 'DD-MM-YYYY');
        curr_run_date := TO_DATE('02-'||TO_CHAR(RUN_DATE, 'MM-YYYY'), 'DD-MM-YYYY');
    ELSE
        prev_run_date := TO_DATE('02-'||TO_CHAR(RUN_DATE, 'MM-YYYY'), 'DD-MM-YYYY');
        curr_run_date := TO_DATE('17-'||TO_CHAR(RUN_DATE, 'MM-YYYY'), 'DD-MM-YYYY');
    END IF;
    FOR PP IN (
        SELECT P.PRODUCT_ID PID, SUM(ILP.PRICE * 1.15 * ILP.QUANTITY) TOTAL_COST, SUM(ILP.QUANTITY) TOTAL_NEW
        FROM PRODUCTS P JOIN INVENTORY_LOT_PRODUCTS ILP ON ILP.PRODUCT_ID = P.PRODUCT_ID
        WHERE ILP.LOT_ID IN (SELECT LOT_ID FROM INVENTORY_LOT WHERE SUPPLY_DATE>=prev_run_date AND SUPPLY_DATE<curr_run_date)
        GROUP BY P.PRODUCT_ID
    ) LOOP
        SELECT NVL(SUM(QUANTITY), 0) INTO v_prev_stock FROM INVENTORY_PRODUCTS IP WHERE PRODUCT_ID=PP.PID;
        v_prev_stock := v_prev_stock-PP.TOTAL_NEW;
        SELECT PRICE INTO v_current_price FROM PRODUCTS WHERE PRODUCT_ID=PP.PID;
        v_new_price := (v_prev_stock * v_current_price + PP.TOTAL_COST) / (v_prev_stock+PP.TOTAL_NEW);
        v_new_price := (TRUNC(v_new_price/10, 0))*10 - FLOOR(DBMS_RANDOM.VALUE(0, 2));
        UPDATE PRODUCTS SET PRICE = v_new_price WHERE PRODUCT_ID = PP.PID;
    END LOOP;
        
END;
/