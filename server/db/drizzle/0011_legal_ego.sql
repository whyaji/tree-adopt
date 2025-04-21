ALTER TABLE `adopt_history` MODIFY COLUMN `adopted_at` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `adopt_history` MODIFY COLUMN `end_date` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `survey_history` MODIFY COLUMN `survey_date` varchar(255) NOT NULL;