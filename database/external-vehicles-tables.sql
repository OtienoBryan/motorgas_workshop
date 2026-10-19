-- External Vehicle Database
-- Owners are stored separately so one owner (individual / company / sacco) can be linked to many vehicles
CREATE TABLE IF NOT EXISTS external_vehicle_owners (
  id INT(11) NOT NULL AUTO_INCREMENT,
  ownership_type ENUM('individual', 'company', 'sacco') NOT NULL DEFAULT 'individual',
  name VARCHAR(255) NOT NULL,
  id_number VARCHAR(100) NULL COMMENT 'National ID (individual), KRA PIN (company) or registration no. (sacco)',
  contact_person VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  address TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_type (ownership_type),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS external_vehicles (
  id INT(11) NOT NULL AUTO_INCREMENT,
  registration_number VARCHAR(50) NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(255) NOT NULL,
  fuel_type ENUM('Petrol', 'Diesel', 'LPG', 'Petrol/LPG', 'Hybrid', 'Electric') NOT NULL,
  location VARCHAR(255) NULL COMMENT 'Location / operating area',
  owner_id INT(11) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_registration_number (registration_number),
  INDEX idx_owner_id (owner_id),
  CONSTRAINT fk_external_vehicles_owner FOREIGN KEY (owner_id) REFERENCES external_vehicle_owners(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
