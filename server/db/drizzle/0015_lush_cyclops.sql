ALTER TABLE `survey_history` RENAME COLUMN `image` TO `tree_image`;--> statement-breakpoint
ALTER TABLE `survey_history` MODIFY COLUMN `tree_image` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `survey_history` ADD `survey_time` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `survey_history` ADD `leaf_image` varchar(255);--> statement-breakpoint
ALTER TABLE `survey_history` ADD `skin_image` varchar(255);--> statement-breakpoint
ALTER TABLE `survey_history` ADD `fruit_image` varchar(255);--> statement-breakpoint
ALTER TABLE `survey_history` ADD `flower_image` varchar(255);--> statement-breakpoint
ALTER TABLE `survey_history` ADD `sap_image` varchar(255);--> statement-breakpoint
ALTER TABLE `survey_history` ADD `other_image` varchar(255);