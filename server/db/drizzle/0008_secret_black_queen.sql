CREATE TABLE `master_local_tree` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`master_tree_id` bigint unsigned NOT NULL,
	`local_name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `master_local_tree_id` PRIMARY KEY(`id`),
	CONSTRAINT `master_local_tree_local_name_unique` UNIQUE(`local_name`)
);
--> statement-breakpoint
ALTER TABLE `master_tree` ADD CONSTRAINT `master_tree_latin_name_unique` UNIQUE(`latin_name`);--> statement-breakpoint
ALTER TABLE `master_local_tree` ADD CONSTRAINT `master_local_tree_master_tree_id_master_tree_id_fk` FOREIGN KEY (`master_tree_id`) REFERENCES `master_tree`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `master_tree_id_idx_master_local_tree` ON `master_local_tree` (`master_tree_id`);--> statement-breakpoint
ALTER TABLE `master_tree` DROP COLUMN `local_name`;