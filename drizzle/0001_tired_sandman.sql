CREATE TABLE `booking_food` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` integer NOT NULL,
	`food_item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_item_id`) REFERENCES `food_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `booking_seats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` integer NOT NULL,
	`seat_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`showtime_id` integer NOT NULL,
	`total_seats` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`booking_date` text NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`payment_method` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`showtime_id`) REFERENCES `showtimes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `food_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`image_url` text,
	`available` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration` integer NOT NULL,
	`genre` text NOT NULL,
	`rating` text NOT NULL,
	`poster_image` text,
	`trailer_url` text,
	`release_date` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`showtime_id` integer NOT NULL,
	`seat_number` text NOT NULL,
	`row` text NOT NULL,
	`is_booked` integer DEFAULT false NOT NULL,
	`booking_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`showtime_id`) REFERENCES `showtimes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `showtimes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`movie_id` integer NOT NULL,
	`show_date` text NOT NULL,
	`show_time` text NOT NULL,
	`screen_number` integer NOT NULL,
	`total_seats` integer NOT NULL,
	`available_seats` integer NOT NULL,
	`price` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;