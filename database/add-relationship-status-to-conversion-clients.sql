-- Add relationship (marital) status to conversion_clients table
ALTER TABLE conversion_clients
ADD COLUMN relationship_status ENUM('single', 'married', 'divorced', 'widowed', 'other') NULL AFTER surname;
