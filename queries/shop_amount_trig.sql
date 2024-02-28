
CREATE OR REPLACE TRIGGER update_shop_product_quantity
BEFORE INSERT ON PURCHASED_PRODUCT
FOR EACH ROW
DECLARE
    v_available_quantity NUMBER;
    curr_shop_id NUMBER;
BEGIN
    -- Get the available quantity in SHOP_PRODUCTS for the specific product and shop
    SELECT SHOP_ID INTO curr_shop_id FROM PURCHASE WHERE PURCHASE_ID=:NEW.PURCHASE_ID;

    SELECT QUANTITY INTO v_available_quantity
    FROM SHOP_PRODUCTS
    WHERE PRODUCT_ID = :NEW.PRODUCT_ID AND SHOP_ID = curr_shop_id;

    -- Check if the purchase quantity exceeds the available quantity
    IF :NEW.QUANTITY > v_available_quantity THEN
        -- Raise an exception if the quantity exceeds the available quantity
        RAISE_APPLICATION_ERROR(-20001, 'Purchase quantity exceeds available quantity');
    ELSE
        -- Subtract the purchase quantity from the available quantity
        UPDATE SHOP_PRODUCTS
        SET QUANTITY = v_available_quantity - :NEW.QUANTITY
        WHERE PRODUCT_ID = :NEW.PRODUCT_ID AND SHOP_ID = curr_shop_id;
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- Handle the case where no corresponding SHOP_PRODUCTS record is found
        RAISE_APPLICATION_ERROR(-20002, 'Product not found in SHOP_PRODUCTS');
END;

/