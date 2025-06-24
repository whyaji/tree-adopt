CREATE TABLE `group_coordinate_area` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`coordinates` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `group_coordinate_area_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `group_coordinate_area` ADD CONSTRAINT `kk_gca_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_group_coordinate_area` ON `group_coordinate_area` (`kelompok_komunitas_id`);