import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  businessName: varchar("business_name"),
  sellerType: varchar("seller_type", { enum: ["private", "business"] }),
  location: varchar("location"), // Format: "Area, City"
  phoneNumber: varchar("phone_number"),
  whatsappNumber: varchar("whatsapp_number"),
  isVerified: boolean("is_verified").default(false),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parts table
export const parts = pgTable("parts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  vehicleType: varchar("vehicle_type"),
  year: integer("year"),
  make: varchar("make"),
  model: varchar("model"),
  condition: varchar("condition", { enum: ["new", "used"] }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  images: text("images").array().default([]), // Array of image URLs
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  buyerId: varchar("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  parts: many(parts),
  ratingsGiven: many(ratings, { relationName: "buyer" }),
  ratingsReceived: many(ratings, { relationName: "seller" }),
}));

export const partsRelations = relations(parts, ({ one }) => ({
  seller: one(users, {
    fields: [parts.sellerId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  seller: one(users, {
    fields: [ratings.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  buyer: one(users, {
    fields: [ratings.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartSchema = createInsertSchema(parts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPart = z.infer<typeof insertPartSchema>;
export type Part = typeof parts.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

// Extended types for API responses
export type PartWithSeller = Part & {
  seller: Pick<User, 'id' | 'businessName' | 'firstName' | 'lastName' | 'sellerType' | 'location' | 'isVerified'>;
};

export type UserWithStats = User & {
  totalListings: number;
  averageRating: number;
  totalRatings: number;
};
