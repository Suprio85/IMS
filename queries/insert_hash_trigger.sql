
CREATE OR REPLACE TRIGGER hash_password_trigger
BEFORE INSERT ON EMPLOYEES
FOR EACH ROW
DECLARE
  v_hashed_password RAW(2000); -- Adjust size based on your requirements
BEGIN
  -- Hash the password using DBMS_OBFUSCATION_TOOLKIT
  DBMS_OBFUSCATION_TOOLKIT.md5(input => UTL_RAW.CAST_TO_RAW(:NEW.USER_PASSWORD), checksum => v_hashed_password);

  -- Store the hashed password in the new row
  :NEW.USER_PASSWORD := RAWTOHEX(v_hashed_password);
END;
/