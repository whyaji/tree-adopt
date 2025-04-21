ALTER TABLE `tree` RENAME COLUMN `tree_id` TO `master_tree_id`;--> statement-breakpoint
ALTER TABLE `tree` DROP FOREIGN KEY `tree_tree_id_master_tree_id_fk`;
--> statement-breakpoint
ALTER TABLE `tree` ADD CONSTRAINT `tree_master_tree_id_master_tree_id_fk` FOREIGN KEY (`master_tree_id`) REFERENCES `master_tree`(`id`) ON DELETE no action ON UPDATE no action;