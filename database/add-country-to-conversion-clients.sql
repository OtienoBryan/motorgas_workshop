-- Add country to conversion_clients table
ALTER TABLE conversion_clients
ADD COLUMN country VARCHAR(100) NULL AFTER address;
