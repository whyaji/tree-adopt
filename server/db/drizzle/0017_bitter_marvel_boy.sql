CREATE TABLE `tree_code` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`status` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `tree_code_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tree_code` ADD CONSTRAINT `tree_code_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;