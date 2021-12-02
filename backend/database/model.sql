CREATE TABLE `user`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE `airport`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `airplane`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `type` VARCHAR(255) NOT NULL
);

CREATE TABLE `employee`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `security_number` INT NOT NULL UNIQUE,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `salary` INT NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
);

CREATE TABLE `consumer`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `surname` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
);

CREATE TABLE `connection`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `departure_airport_id` INT UNSIGNED NOT NULL,
    `arrival_airport_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY(`departure_airport_id`) REFERENCES `airport`(`id`),
    FOREIGN KEY(`arrival_airport_id`) REFERENCES `airport`(`id`)
);

CREATE TABLE `pilot`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT UNSIGNED NOT NULL,
    `license_number` INT NOT NULL UNIQUE,
    FOREIGN KEY(`employee_id`) REFERENCES `employee`(`id`)
);

CREATE TABLE `crewmember`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT UNSIGNED NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    FOREIGN KEY(`employee_id`) REFERENCES `employee`(`id`)
);


CREATE TABLE `flight`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `from` DATE NOT NULL,
    `to` DATE NOT NULL,
    `number` INT NOT NULL UNIQUE,
    `connection_id` INT UNSIGNED NOT NULL,
    `airplane_id` INT UNSIGNED NOT NULL,
    `departure_day` VARCHAR(255) NOT NULL,
    `arrival_day` VARCHAR(255) NOT NULL,
    `departure_time` TIME NOT NULL,
    `arrival_time` TIME NOT NULL,
    FOREIGN KEY(`connection_id`) REFERENCES `connection`(`id`),
    FOREIGN KEY(`airplane_id`) REFERENCES `airplane`(`id`)
);

CREATE TABLE `departure`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `flight_id` INT UNSIGNED NOT NULL,
    `date` DATE NOT NULL,
    `pilot_id` INT UNSIGNED NOT NULL,
    `optional_pilot_id` INT UNSIGNED NOT NULL,
    `first_crew_member_id` INT UNSIGNED NOT NULL,
    `second_crew_member_id` INT UNSIGNED NOT NULL,
    `number_of_empty_seat` INT UNSIGNED NOT NULL,
    `number_of_reserved_seat` INT UNSIGNED NOT NULL,
    FOREIGN KEY(`flight_id`) REFERENCES `flight`(`id`),
    FOREIGN KEY(`pilot_id`) REFERENCES `pilot`(`id`),
    FOREIGN KEY(`optional_pilot_id`) REFERENCES `pilot`(`id`),
    FOREIGN KEY(`first_crew_member_id`) REFERENCES `crewmember`(`id`),
    FOREIGN KEY(`second_crew_member_id`) REFERENCES `crewmember`(`id`)
);

CREATE TABLE `ticket`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `number` INT NOT NULL UNIQUE,
    `date_time_of_issue` DATETIME NOT NULL,
    `price` INT NOT NULL,
    `departure_id` INT UNSIGNED NOT NULL,
    `consumer_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY(`departure_id`) REFERENCES `departure`(`id`),
    FOREIGN KEY(`consumer_id`) REFERENCES `consumer`(`id`)
);