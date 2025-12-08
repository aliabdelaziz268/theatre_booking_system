import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Add new theatre booking tables
export const movies = sqliteTable("movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  genre: text("genre").notNull(),
  rating: text("rating").notNull(),
  posterImage: text("poster_image"),
  trailerUrl: text("trailer_url"),
  releaseDate: text("release_date").notNull(),
  createdAt: text("created_at").notNull(),
});

export const showtimes = sqliteTable("showtimes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  movieId: integer("movie_id").notNull().references(() => movies.id),
  showDate: text("show_date").notNull(),
  showTime: text("show_time").notNull(),
  screenNumber: integer("screen_number").notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  price: integer("price").notNull(),
  createdAt: text("created_at").notNull(),
});

export const seats = sqliteTable("seats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  seatNumber: text("seat_number").notNull(),
  row: text("row").notNull(),
  isBooked: integer("is_booked", { mode: "boolean" }).notNull().default(false),
  bookingId: integer("booking_id").references(() => bookings.id),
  createdAt: text("created_at").notNull(),
});

export const foodItems = sqliteTable("food_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id),
  showtimeId: integer("showtime_id").notNull().references(() => showtimes.id),
  totalSeats: integer("total_seats").notNull(),
  totalAmount: integer("total_amount").notNull(),
  bookingDate: text("booking_date").notNull(),
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").notNull(),
  createdAt: text("created_at").notNull(),
});

export const bookingSeats = sqliteTable("booking_seats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  seatId: integer("seat_id").notNull().references(() => seats.id),
  createdAt: text("created_at").notNull(),
});

export const bookingFood = sqliteTable("booking_food", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  foodItemId: integer("food_item_id").notNull().references(() => foodItems.id),
  quantity: integer("quantity").notNull(),
  createdAt: text("created_at").notNull(),
});
