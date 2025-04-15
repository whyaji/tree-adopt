CREATE TABLE `master_tree` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`latin_name` varchar(255) NOT NULL,
	`local_name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `master_tree_id` PRIMARY KEY(`id`)
);
