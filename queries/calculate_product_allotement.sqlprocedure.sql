CREATE OR REPLACE PROCEDURE CALCULATE_PRODUCT_ALLOTEMENT
IS
    v_past_sales NUMBER;
    v_current_demand NUMBER;
    v_previous_requests NUMBER;
    v_previous_shipments NUMBER;
    v_allotment_amount NUMBER;
		v_shop_count NUMBER;
		v_region_allotment NUMBER;
		v_average NUMBER;
		v_region_sale NUMBER;
		v_region_id NUMBER;
		
		
		 v_avg_weight NUMBER :=0.8;
		 v_avg_adder NUMBER :=0;
BEGIN

FOR R IN (SELECT DISTINCT S.SHOP_ID,SP.PRODUCT_ID,S.AREA_CODE FROM SHOPS S JOIN SHOP_PRODUCTS SP ON S.SHOP_ID=SP.SHOP_ID)
LOOP
    DELETE FROM CONTINUES_PRODUCT_RECOMMENDATION WHERE PRODUCT_ID = R.PRODUCT_ID AND SHOP_ID = R.SHOP_ID;


    SELECT NVL(SUM(PR.QUANTITY), 0)
		Into v_past_sales
    FROM PURCHASED_PRODUCT PR
    LEFT JOIN PURCHASE P ON PR.PURCHASE_ID = P.PURCHASE_ID
    LEFT JOIN SHOPS S ON P.SHOP_ID = S.SHOP_ID
    WHERE PR.PRODUCT_ID = R.PRODUCT_ID
		AND P.PURCHASE_TIME BETWEEN ADD_MONTHS(SYSDATE+300-730, -12) AND SYSDATE+300-730
		AND S.SHOP_ID = R.SHOP_ID;

  
		
		  SELECT NVL(AVG(PR.QUANTITY), 0)
			INTO v_current_demand
    FROM PURCHASED_PRODUCT PR
    LEFT JOIN PURCHASE P ON PR.PURCHASE_ID = P.PURCHASE_ID
    WHERE PR.PRODUCT_ID = R.PRODUCT_ID
    AND P.PURCHASE_TIME BETWEEN ADD_MONTHS(SYSDATE+300-730, -12) AND SYSDATE+300-730;
	
		
		
   
    -- Get previous requests 
    SELECT COUNT(*)
    INTO v_previous_requests
    FROM SHIPMENT_REQUEST_PRODUCT SRP
    WHERE SRP.PRODUCT_ID = R.PRODUCT_ID
        AND SRP.REQUEST_ID IN (
            SELECT REQUEST_ID
            FROM SHIPMENT_REQUEST SR
            LEFT JOIN SHOPS S ON SR.SHOP_ID = S.SHOP_ID
						WHERE S.SHOP_ID = R.SHOP_ID
             AND SR.REQUEST_DATE BETWEEN ADD_MONTHS(SYSDATE+300-730, -12) AND SYSDATE+300-730
        );

    SELECT COUNT(*)
    INTO v_previous_shipments
    FROM SHIPMENT_PRODUCT SP
    WHERE SP.PRODUCT_ID = R.PRODUCT_ID
        AND SP.SHIPMENT_ID IN (
            SELECT SHIPMENT_ID
            FROM SHIPMENT SH
            WHERE SH.SHOP_ID = R.SHOP_ID
            AND SH.SHIPPING_DATE BETWEEN ADD_MONTHS(SYSDATE+300-730, -12) AND SYSDATE+300-730
        );
				
		SELECT SUM(AMOUNT) INTO v_region_allotment
		FROM PRODUCT_ALLOTEMENT
		WHERE PRODUCT_ID = R.PRODUCT_ID;
				
		SELECT COUNT(*) INTO v_shop_count
		FROM SHOPS;
		
		v_average := v_region_allotment/v_shop_count;
		
		SELECT REGION_ID INTO v_region_id
		FROM AREAS A
		WHERE A.AREA_CODE = R.AREA_CODE;
		
		
		SELECT COUNT(PR.QUANTITY) INTO v_region_sale
		FROM PURCHASED_PRODUCT PR LEFT JOIN PURCHASE P ON P.PURCHASE_ID =PR.PURCHASE_ID
		WHERE PR.PRODUCT_ID = R.PRODUCT_ID
		AND P.SHOP_ID IN (
		SELECT S.SHOP_ID
		FROM SHOPS S LEFT JOIN AREAS A ON (S.AREA_CODE=A.AREA_CODE)
		WHERE A.REGION_ID = v_region_id
		) AND P.PURCHASE_TIME BETWEEN ADD_MONTHS(SYSDATE+300-730, -12) AND SYSDATE+300-730;
		
		DBMS_OUTPUT.PUT_LINE(v_region_sale);
		DBMS_OUTPUT.PUT_LINE(v_current_demand);
		
		
		
 IF (v_region_sale > 0 AND v_current_demand>0 and  (v_past_sales / v_region_sale > 0.5 OR v_past_sales / v_current_demand >= 0.5)) THEN
        v_avg_weight := 1.2;
    ELSIF v_previous_shipments> 0 and v_past_sales / v_previous_shipments > 0.5 THEN
	      v_avg_weight :=1.1;
		ELSIF	v_previous_shipments < v_previous_requests THEN
        v_avg_adder := v_average/3;
    END IF;
    v_allotment_amount := ROUND((v_average*v_avg_weight)+v_avg_adder,0);   
		DBMS_OUTPUT.PUT_LINE('Allotment Amount: ' || v_allotment_amount);
		
		INSERT INTO CONTINUES_PRODUCT_RECOMMENDATION (PRODUCT_ID, SHOP_ID, AMOUNT)
    VALUES (R.PRODUCT_ID,R.SHOP_ID, v_allotment_amount);
		END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
      --  RETURN NULL;
END CALCULATE_PRODUCT_ALLOTEMENT;