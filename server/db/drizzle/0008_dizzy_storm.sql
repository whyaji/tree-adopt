ALTER TABLE `tree` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `tree` ADD `updated_at` timestamp DEFAULT (now());