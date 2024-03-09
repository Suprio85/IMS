CREATE OR REPLACE PROCEDURE CALCULATE_PRODUCT_ALLOTEMENT(p_date IN DATE )
IS
    v_past_sales NUMBER;
    v_allotment_amount NUMBER;
		v_shop_count NUMBER;
		v_region_allotment NUMBER;
		v_average NUMBER;
		v_region_sale NUMBER;
		v_region_id NUMBER;
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
		AND P.PURCHASE_TIME BETWEEN ADD_MONTHS(p_date, -3) AND p_date
		AND S.SHOP_ID = R.SHOP_ID;
				
		SELECT SUM(AMOUNT) INTO v_region_allotment
		FROM PRODUCT_ALLOTEMENT
		WHERE PRODUCT_ID = R.PRODUCT_ID;
				
		SELECT COUNT(*) INTO v_shop_count
		FROM SHOPS;
			
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
		) AND P.PURCHASE_TIME BETWEEN ADD_MONTHS(p_date, -3) AND p_date ;
		
	
		v_average := v_allotment_amount/v_shop_count;
		
		
		IF v_region_sale > 0 THEN 
		v_allotment_amount := ROUND((v_past_sales/v_region_sale)*v_region_allotment,0);
		ELSE 
		v_allotment_amount := ROUND(v_average,0);
		END IF;
		
		DBMS_OUTPUT.PUT_LINE(v_allotment_amount);
	
		INSERT INTO CONTINUES_PRODUCT_RECOMMENDATION (PRODUCT_ID, SHOP_ID, AMOUNT)
    VALUES (R.PRODUCT_ID,R.SHOP_ID, v_allotment_amount);
		END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
      --  RETURN NULL;
END CALCULATE_PRODUCT_ALLOTEMENT;

/