ALTER TABLE `survey_history` ADD `kelompok_komunitas_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `survey_history` ADD CONSTRAINT `survey_history_kelompok_komunitas_id_kelompok_komunitas_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx` ON `survey_history` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx` ON `tree_code` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx` ON `tree` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `group_id_idx` ON `users` (`group_id`);