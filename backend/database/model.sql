CREATE TABLE `Airplane`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `number` INT NOT NULL,
    `type` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Airplane` ADD PRIMARY KEY `airplane_id_primary`(`id`);
ALTER TABLE
    `Airplane` ADD UNIQUE `airplane_number_unique`(`number`);
CREATE TABLE `Airport`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Airport` ADD PRIMARY KEY `airport_id_primary`(`id`);
ALTER TABLE
    `Airport` ADD UNIQUE `airport_code_unique`(`code`);
CREATE TABLE `Connection`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `departure_airport_id` INT NOT NULL,
    `arrival_airport_id` INT NOT NULL
);
ALTER TABLE
    `Connection` ADD PRIMARY KEY `connection_id_primary`(`id`);
CREATE TABLE `Flight`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `from` DATE NOT NULL,
    `to` DATE NOT NULL,
    `number` INT NOT NULL,
    `connection_id` INT NOT NULL,
    `airplane_id` INT NOT NULL,
    `departure_day` VARCHAR(255) NOT NULL,
    `arrival_day` VARCHAR(255) NOT NULL,
    `departure_time` TIME NOT NULL,
    `arrival_time` TIME NOT NULL
);
ALTER TABLE
    `Flight` ADD PRIMARY KEY `flight_id_primary`(`id`);
ALTER TABLE
    `Flight` ADD UNIQUE `flight_number_unique`(`number`);
CREATE TABLE `Departure`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `flight_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `pilot_id` INT NOT NULL,
    `optional_pilot_id` INT NOT NULL,
    `first_crew_member_id` INT NOT NULL,
    `second_crew_member_id` INT NOT NULL,
    `number_of_empty_seat` INT NOT NULL,
    `number_of_reserved_seat` INT NOT NULL
);
ALTER TABLE
    `Departure` ADD PRIMARY KEY `departure_id_primary`(`id`);
CREATE TABLE `Consumer`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `number` INT NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Consumer` ADD PRIMARY KEY `consumer_id_primary`(`id`);
ALTER TABLE
    `Consumer` ADD UNIQUE `consumer_number_unique`(`number`);
CREATE TABLE `Crew Member`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_id` INT NOT NULL,
    `role` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Crew Member` ADD PRIMARY KEY `crew member_id_primary`(`id`);
CREATE TABLE `Ticket`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `number` INT NOT NULL,
    `date_time_of_issue` DATETIME NOT NULL,
    `price` INT NOT NULL,
    `departure_id` INT NOT NULL,
    `consumer_id` INT NOT NULL
);
ALTER TABLE
    `Ticket` ADD PRIMARY KEY `ticket_id_primary`(`id`);
ALTER TABLE
    `Ticket` ADD UNIQUE `ticket_number_unique`(`number`);
CREATE TABLE `Employee`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `security_number` INT NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `salary` INT NOT NULL
);
ALTER TABLE
    `Employee` ADD PRIMARY KEY `employee_id_primary`(`id`);
ALTER TABLE
    `Employee` ADD UNIQUE `employee_security_number_unique`(`security_number`);
CREATE TABLE `Pilot`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_id` INT NOT NULL,
    `license_number` INT NOT NULL
);
ALTER TABLE
    `Pilot` ADD PRIMARY KEY `pilot_id_primary`(`id`);
ALTER TABLE
    `Pilot` ADD UNIQUE `pilot_license_number_unique`(`license_number`);
ALTER TABLE
    `Connection` ADD CONSTRAINT `connection_departure_airport_id_foreign` FOREIGN KEY(`departure_airport_id`) REFERENCES `Airport`(`id`);
ALTER TABLE
    `Connection` ADD CONSTRAINT `connection_arrival_airport_id_foreign` FOREIGN KEY(`arrival_airport_id`) REFERENCES `Airport`(`id`);
ALTER TABLE
    `Flight` ADD CONSTRAINT `flight_connection_id_foreign` FOREIGN KEY(`connection_id`) REFERENCES `Connection`(`id`);
ALTER TABLE
    `Flight` ADD CONSTRAINT `flight_airplane_id_foreign` FOREIGN KEY(`airplane_id`) REFERENCES `Airplane`(`id`);
ALTER TABLE
    `Departure` ADD CONSTRAINT `departure_flight_id_foreign` FOREIGN KEY(`flight_id`) REFERENCES `Flight`(`id`);
ALTER TABLE
    `Departure` ADD CONSTRAINT `departure_pilot_id_foreign` FOREIGN KEY(`pilot_id`) REFERENCES `Pilot`(`id`);
ALTER TABLE
    `Departure` ADD CONSTRAINT `departure_optional_pilot_id_foreign` FOREIGN KEY(`optional_pilot_id`) REFERENCES `Pilot`(`id`);
ALTER TABLE
    `Departure` ADD CONSTRAINT `departure_first_crew_member_id_foreign` FOREIGN KEY(`first_crew_member_id`) REFERENCES `Crew Member`(`id`);
ALTER TABLE
    `Departure` ADD CONSTRAINT `departure_second_crew_member_id_foreign` FOREIGN KEY(`second_crew_member_id`) REFERENCES `Crew Member`(`id`);
ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_departure_id_foreign` FOREIGN KEY(`departure_id`) REFERENCES `Departure`(`id`);
ALTER TABLE
    `Ticket` ADD CONSTRAINT `ticket_consumer_id_foreign` FOREIGN KEY(`consumer_id`) REFERENCES `Consumer`(`id`);
ALTER TABLE
    `Crew Member` ADD CONSTRAINT `crew member_employee_id_foreign` FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`);
ALTER TABLE
    `Pilot` ADD CONSTRAINT `pilot_employee_id_foreign` FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`);