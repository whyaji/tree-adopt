ALTER TABLE `tree` MODIFY COLUMN `master_tree_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `tree` MODIFY COLUMN `elevation` float;--> statement-breakpoint
ALTER TABLE `tree` MODIFY COLUMN `land_type` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `local_tree_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tree` ADD `latin_tree_name` varchar(255);--> statement-breakpoint
ALTER TABLE `tree` ADD `sitter_name` varchar(255);