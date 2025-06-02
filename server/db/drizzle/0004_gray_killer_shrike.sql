CREATE TABLE `group_activity` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`code` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`date` varchar(255) NOT NULL,
	`time` varchar(255) NOT NULL,
	`description` varchar(255),
	`image` varchar(255),
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`created_by` bigint unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `group_activity_id` PRIMARY KEY(`id`),
	CONSTRAINT `group_activity_code_unique` UNIQUE(`code`),
	CONSTRAINT `group_activity_image_unique` UNIQUE(`image`)
);
--> statement-breakpoint
ALTER TABLE `group_activity` ADD CONSTRAINT `group_activity_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_activity` ADD CONSTRAINT `group_activity_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_group_activity` ON `group_activity` (`kelompok_komunitas_id`);