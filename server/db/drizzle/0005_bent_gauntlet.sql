CREATE TABLE `boundary_marker_code` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`status` int DEFAULT 0,
	`tagged_by` bigint unsigned,
	`tagged_at` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `boundary_marker_code_id` PRIMARY KEY(`id`),
	CONSTRAINT `boundary_marker_code_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `boundary_marker` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`checker_id` bigint unsigned NOT NULL,
	`install_year` int NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`description` varchar(255),
	`status` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `boundary_marker_id` PRIMARY KEY(`id`),
	CONSTRAINT `boundary_marker_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `check_boundary_marker_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`kelompok_komunitas_id` bigint unsigned NOT NULL,
	`boundary_marker_id` bigint unsigned NOT NULL,
	`boundary_marker_code` varchar(255),
	`checker_id` bigint unsigned NOT NULL,
	`condition` json NOT NULL,
	`action` json NOT NULL,
	`image` json NOT NULL,
	`check_date` varchar(255) NOT NULL,
	`check_time` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `check_boundary_marker_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `boundary_marker_code` ADD CONSTRAINT `kk_bmc_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boundary_marker_code` ADD CONSTRAINT `tagged_bmc_id_fk` FOREIGN KEY (`tagged_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boundary_marker` ADD CONSTRAINT `kk_bm_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boundary_marker` ADD CONSTRAINT `checker_bm_id_fk` FOREIGN KEY (`checker_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `check_boundary_marker_history` ADD CONSTRAINT `kk_cbmh_id_fk` FOREIGN KEY (`kelompok_komunitas_id`) REFERENCES `kelompok_komunitas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `check_boundary_marker_history` ADD CONSTRAINT `bm_cbmh_id_fk` FOREIGN KEY (`boundary_marker_id`) REFERENCES `boundary_marker`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `check_boundary_marker_history` ADD CONSTRAINT `checker_cbmh_id_fk` FOREIGN KEY (`checker_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_boundary_marker_code` ON `boundary_marker_code` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_boundary_marker` ON `boundary_marker` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `kelompok_komunitas_id_idx_check_boundary_marker_history` ON `check_boundary_marker_history` (`kelompok_komunitas_id`);--> statement-breakpoint
CREATE INDEX `boundary_marker_id_idx_check_boundary_     marker_history` ON `check_boundary_marker_history` (`boundary_marker_id`);