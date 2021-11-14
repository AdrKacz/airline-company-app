CREATE TABLE `Airport`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `Airplane`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `type` VARCHAR(255) NOT NULL
);

CREATE TABLE `Employee`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `security_number` INT NOT NULL UNIQUE,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `salary` INT NOT NULL
);

CREATE TABLE `Consumer`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    FOREIGN KEY(`departure_id`) REFERENCES `Departure`(`id`),
    FOREIGN KEY(`consumer_id`) REFERENCES `Consumer`(`id`)
);

CREATE TABLE `Connection`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `departure_airport_id` INT NOT NULL,
    `arrival_airport_id` INT NOT NULL,
    FOREIGN KEY(`departure_airport_id`) REFERENCES `Airport`(`id`),
    FOREIGN KEY(`arrival_airport_id`) REFERENCES `Airport`(`id`)
);

CREATE TABLE `Pilot`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `license_number` INT NOT NULL UNIQUE,
    FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`)
);

CREATE TABLE `CrewMember`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`)
);

CREATE TABLE `Flight`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `from` DATE NOT NULL,
    `to` DATE NOT NULL,
    `number` INT NOT NULL UNIQUE,
    `connection_id` INT NOT NULL,
    `airplane_id` INT NOT NULL,
    `departure_day` VARCHAR(255) NOT NULL,
    `arrival_day` VARCHAR(255) NOT NULL,
    `departure_time` TIME NOT NULL,
    `arrival_time` TIME NOT NULL,
    FOREIGN KEY(`connection_id`) REFERENCES `Connection`(`id`),
    FOREIGN KEY(`airplane_id`) REFERENCES `Airplane`(`id`)
);

CREATE TABLE `Departure`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `flight_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `pilot_id` INT NOT NULL,
    `optional_pilot_id` INT NOT NULL,
    `first_crew_member_id` INT NOT NULL,
    `second_crew_member_id` INT NOT NULL,
    `number_of_empty_seat` INT NOT NULL,
    `number_of_reserved_seat` INT NOT NULL,
    FOREIGN KEY(`flight_id`) REFERENCES `Flight`(`id`),
    FOREIGN KEY(`pilot_id`) REFERENCES `Pilot`(`id`),
    FOREIGN KEY(`optional_pilot_id`) REFERENCES `Pilot`(`id`),
    FOREIGN KEY(`first_crew_member_id`) REFERENCES `CrewMember`(`id`),
    FOREIGN KEY(`second_crew_member_id`) REFERENCES `CrewMember`(`id`)
);

CREATE TABLE `Ticket`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `date_time_of_issue` DATETIME NOT NULL,
    `price` INT NOT NULL,
    `departure_id` INT NOT NULL,
    `consumer_id` INT NOT NULL
);