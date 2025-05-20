CREATE TABLE `adopt_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tree_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`adopted_at` varchar(255) NOT NULL,
	`end_date` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `adopt_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kelompok_komunitas` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`no_sk` varchar(255) NOT NULL,
	`kups` varchar(255) NOT NULL,
	`program_unggulan` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`image` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `kelompok_komunitas_id` PRIMARY KEY(`id`),
	CONSTRAINT `kelompok_komunitas_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `master_tree` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`latin_name` varchar(255) NOT NULL,
	`local_name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `master_tree_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tree_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`survey_date` varchar(255) NOT NULL,
	`survey_time` varchar(255) NOT NULL,
	`category` int NOT NULL,
	`circumference` float NOT NULL,
	`height` float NOT NULL,
	`serapan_co2` float NOT NULL,
	`tree_image` json NOT NULL,
	`leaf_image` json,
	`skin_image` json,
	`fruit_image` json,
	`flower_image` json,
	`sap_image` json,
	`other_image` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `survey_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tree_code` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`status` int DEFAULT 0,
	`tagged_by` bigint unsigned,
	`tagged_at` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `tree_code_id` PRIMARY KEY(`id`),
	CONSTRAINT `tree_code_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `tree` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`master_tree_id` bigint unsigned,
	`local_tree_name` varchar(255) NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`surveyor_id` bigint unsigned NOT NULL,
	`status` int DEFAULT 1,
	`elevation` float NOT NULL,
	`land_type` int NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `tree_id` PRIMARY KEY(`id`),
	CONSTRAINT `tree_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`avatar` varchar(255),
	`role` int DEFAULT 1,
	`group_id` bigint unsigned,
	`reset_token` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `adopt_history` ADD CONSTRAINT `adopt_history_tree_id_tree_id_fk` FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adopt_history` ADD CONSTRAINT `adopt_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_tree_id_tree_id_fk` FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree_code` ADD CONSTRAINT `tree_code_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree_code` ADD CONSTRAINT `tree_code_tagged_by_users_id_fk` FOREIGN KEY (`tagged_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_master_tree_id_master_tree_id_fk` FOREIGN KEY (`master_tree_id`) REFERENCES `master_tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_surveyor_id_users_id_fk` FOREIGN KEY (`surveyor_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_group_id_kelompok_komunitas_id_fk` FOREIGN KEY (`group_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_survey_history` ON `survey_history` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `tree_id_idx_survey_history` ON `survey_history` (`tree_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_tree_code` ON `tree_code` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_tree` ON `tree` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `group_id_idx_users` ON `users` (`group_id`);