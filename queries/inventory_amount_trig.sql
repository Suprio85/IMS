
CREATE OR REPLACE TRIGGER check_inventory_amount_trigger
BEFORE INSERT ON SHIPMENT_PRODUCT
FOR EACH ROW
DECLARE
    v_current_inventory_amount NUMBER;
    current_inventory_id NUMBER;
BEGIN
    SELECT S.INVENTORY_ID INTO current_inventory_id
    FROM SHIPMENT S WHERE S.SHIPMENT_ID = :NEW.SHIPMENT_ID;

    SELECT QUANTITY INTO v_current_inventory_amount
    FROM INVENTORY_PRODUCTS
    WHERE PRODUCT_ID = :NEW.PRODUCT_ID AND INVENTORY_ID = current_inventory_id;
    
    IF :NEW.QUANTITY > v_current_inventory_amount THEN
        RAISE_APPLICATION_ERROR(-20001, 'Shipment amount exceeds current inventory amount');
    ELSE
        UPDATE INVENTORY_PRODUCTS
        SET QUANTITY = v_current_inventory_amount - :NEW.QUANTITY
        WHERE PRODUCT_ID = :NEW.PRODUCT_ID AND INVENTORY_ID = current_inventory_id;
    END IF;
END;

/