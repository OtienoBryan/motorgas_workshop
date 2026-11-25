-- Indexes for the paginated /sales/report/list query (date-range scans + station/client filters)
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales (sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_station_sale_date ON sales (station_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_conversion_client ON sales (conversion_client_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_key_account ON sales (key_account_id, sale_date);
