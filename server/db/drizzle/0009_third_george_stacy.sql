CREATE TABLE `adopt_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tree_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`adopted_at` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `adopt_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tree_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`survey_date` timestamp NOT NULL,
	`category` int NOT NULL,
	`diameter` float NOT NULL,
	`height` float NOT NULL,
	`serapan_co2` float NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `survey_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tree` DROP FOREIGN KEY `tree_adopted_by_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `kelompok_komunitas` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `master_tree` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `tree` ADD `surveyor_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `elevation` float NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `address` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `latitude` float NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `longitude` float NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `adopt_history` ADD CONSTRAINT `adopt_history_tree_id_tree_id_fk` FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adopt_history` ADD CONSTRAINT `adopt_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_tree_id_tree_id_fk` FOREIGN KEY (`tree_id`) REFERENCES `tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_surveyor_id_users_id_fk` FOREIGN KEY (`surveyor_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tree` DROP COLUMN `adopted_by`;--> statement-breakpoint
ALTER TABLE `tree` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `tree` DROP COLUMN `diameter`;--> statement-breakpoint
ALTER TABLE `tree` DROP COLUMN `serapan_co2`;