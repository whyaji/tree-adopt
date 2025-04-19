CREATE TABLE `tree` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`tree_id` bigint unsigned NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`status` int DEFAULT 1,
	`adopted_by` bigint unsigned,
	`category` int NOT NULL,
	`diameter` int NOT NULL,
	`serapan_co2` int NOT NULL,
	`land_type` int NOT NULL,
	CONSTRAINT `tree_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_tree_id_master_tree_id_fk` FOREIGN KEY (`tree_id`) REFERENCES `master_tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_adopted_by_users_id_fk` FOREIGN KEY (`adopted_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;