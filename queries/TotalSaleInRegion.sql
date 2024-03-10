CREATE OR REPLACE FUNCTION get_total_quantity(
    p_product_id NUMBER,
    p_region_id NUMBER,
		start_month VARCHAR2,
		end_month VARCHAR2
   
) RETURN NUMBER
IS
    v_total_quantity NUMBER;
BEGIN
    SELECT SUM(pp.quantity)
    INTO v_total_quantity
    FROM PURCHASED_PRODUCT pp
    LEFT JOIN PURCHASE p ON pp.purchase_id = p.purchase_id
    LEFT JOIN SHOPS s ON p.shop_id = s.shop_id
    LEFT JOIN AREAS a ON a.AREA_CODE = s.AREA_CODE
    WHERE pp.PRODUCT_ID = p_product_id
      AND a.REGION_ID = p_region_id
			 AND TO_CHAR(p.PURCHASE_TIME, 'YYYY-MM') BETWEEN start_month AND end_month;
  
    RETURN NVL(v_total_quantity, 0);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END get_total_quantity; 
-- FOR OWNER PRODUCT VS REGION GRAPH;
/