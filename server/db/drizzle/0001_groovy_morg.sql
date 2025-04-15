CREATE TABLE `kelompok_komunitas` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`no_sk` varchar(255) NOT NULL,
	`kups` varchar(255) NOT NULL,
	`program_unggulan` varchar(255) NOT NULL,
	`latitude` varchar(255) NOT NULL,
	`longitude` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `kelompok_komunitas_id` PRIMARY KEY(`id`)
);
