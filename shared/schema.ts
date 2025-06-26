import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  date,
  time,
  decimal,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin users
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Amenities
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  icon: varchar("icon", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Cities
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Areas
export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").references(() => cities.id),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  password: varchar("password", { length: 255 }),
  isOwner: boolean("is_owner").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Farms
export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  cityId: integer("city_id").references(() => cities.id),
  areaId: integer("area_id").references(() => areas.id),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  pricePerSlot: integer("price_per_slot"), // Price per 12-hour slot
  maxGuests: integer("max_guests"),
  isEnable: boolean("is_enable").default(true),
  isBooking: boolean("is_booking").default(true),
  policies: text("policies"),
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),
  cleaningDuration: integer("cleaning_duration").default(60), // minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Farm Images
export const farmImages = pgTable("farm_images", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  imageUrl: varchar("image_url", { length: 500 }),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings with slot-based system
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  farmId: integer("farm_id").references(() => farms.id),
  transactionId: integer("transaction_id"),
  checkInDate: date("check_in_date"),
  checkInTime: time("check_in_time"),
  checkOutDate: date("check_out_date"),
  checkOutTime: time("check_out_time"),
  slotType: varchar("slot_type", { length: 20 }), // 'morning' or 'evening'
  numberOfSlots: integer("number_of_slots"),
  noOfGuest: integer("no_of_guest"),
  totalPrice: integer("total_price"),
  ownerBooked: integer("owner_booked").default(0), // 0 - No | 1 - Yes
  confirmationCode: varchar("confirmation_code", { length: 255 }),
  description: text("description"),
  status: integer("status"), // 0 - Complete | 1 - Upcoming | 2 - Cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  farmId: integer("farm_id").references(() => farms.id),
  orderId: varchar("order_id", { length: 255 }),
  amount: integer("amount"),
  paymentMethod: varchar("payment_method", { length: 100 }),
  transactionDetails: jsonb("transaction_details"),
  status: varchar("status", { length: 50 }), // Pending, Complete, Failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Requested Farms
export const requestedFarms = pgTable("requested_farms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  ownerName: varchar("owner_name", { length: 255 }),
  farmName: varchar("farm_name", { length: 255 }),
  city: varchar("city", { length: 255 }),
  area: varchar("area", { length: 255 }),
  description: text("description"),
  contactNumber: varchar("contact_number", { length: 20 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  farmId: integer("farm_id").references(() => farms.id),
  rating: integer("rating"),
  comment: text("comment"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FAQs
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 255 }),
  answer: text("answer"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Farm FAQs
export const farmFaqs = pgTable("farm_faqs", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  question: varchar("question", { length: 255 }),
  answer: text("answer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sub-Properties (for resorts, villas, apartments within a farm)
export const subProperties = pgTable("sub_properties", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 100 }), // villa, apartment, resort, etc.
  maxGuests: integer("max_guests"),
  pricePerSlot: decimal("price_per_slot", { precision: 10, scale: 2 }),
  amenities: jsonb("amenities"), // Array of amenity IDs
  images: jsonb("images"), // Array of image URLs
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),
  morningCheckIn: time("morning_check_in"),
  morningCheckOut: time("morning_check_out"),
  eveningCheckIn: time("evening_check_in"),
  eveningCheckOut: time("evening_check_out"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sub-property availability management
export const subPropertySlots = pgTable("sub_property_slots", {
  id: serial("id").primaryKey(),
  subPropertyId: integer("sub_property_id").references(() => subProperties.id),
  date: date("date"),
  slotType: varchar("slot_type", { length: 50 }), // morning, evening
  isBlocked: boolean("is_blocked").default(false),
  isBooked: boolean("is_booked").default(false),
  blockReason: text("block_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Home Section Banners
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  linkType: varchar("link_type", { length: 50 }), // farm, category, external
  targetId: integer("target_id"), // farm or category ID
  displayOrder: integer("display_order"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom Featured Sections
export const featuredSections = pgTable("featured_sections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  displayName: varchar("display_name", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 50 }), // affordable, couples, visited, luxury
  iconUrl: text("icon_url"),
  displayOrder: integer("display_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Farms in Featured Sections
export const featuredSectionFarms = pgTable("featured_section_farms", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => featuredSections.id),
  farmId: integer("farm_id").references(() => farms.id),
  displayOrder: integer("display_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reels Management
export const reels = pgTable("reels", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  farmAliasName: varchar("farm_alias_name", { length: 255 }),
  duration: integer("duration"), // in seconds
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  tags: jsonb("tags"), // Array of tags
  displayOrder: integer("display_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content Management for Home Feed
export const homeContent = pgTable("home_content", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }), // banner, featured_section, promotion
  contentId: integer("content_id"), // Reference to banner, section, etc.
  title: varchar("title", { length: 255 }),
  displayOrder: integer("display_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Slot Timing Configuration
export const slotConfigurations = pgTable("slot_configurations", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").references(() => farms.id),
  subPropertyId: integer("sub_property_id").references(() => subProperties.id),
  dayOfWeek: integer("day_of_week"), // 0=Sunday, 1=Monday, etc.
  morningStartTime: time("morning_start_time"),
  morningEndTime: time("morning_end_time"),
  eveningStartTime: time("evening_start_time"),
  eveningEndTime: time("evening_end_time"),
  cleaningDuration: integer("cleaning_duration"), // minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const citiesRelations = relations(cities, ({ many }) => ({
  areas: many(areas),
  farms: many(farms),
}));

export const areasRelations = relations(areas, ({ one, many }) => ({
  city: one(cities, { fields: [areas.cityId], references: [cities.id] }),
  farms: many(farms),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  farms: many(farms),
}));

export const usersRelations = relations(users, ({ many }) => ({
  farms: many(farms),
  bookings: many(bookings),
  transactions: many(transactions),
  requestedFarms: many(requestedFarms),
  reviews: many(reviews),
}));

export const farmsRelations = relations(farms, ({ one, many }) => ({
  user: one(users, { fields: [farms.userId], references: [users.id] }),
  category: one(categories, { fields: [farms.categoryId], references: [categories.id] }),
  city: one(cities, { fields: [farms.cityId], references: [cities.id] }),
  area: one(areas, { fields: [farms.areaId], references: [areas.id] }),
  images: many(farmImages),
  bookings: many(bookings),
  transactions: many(transactions),
  reviews: many(reviews),
  farmFaqs: many(farmFaqs),
  subProperties: many(subProperties),
  reels: many(reels),
  slotConfigurations: many(slotConfigurations),
}));

export const subPropertiesRelations = relations(subProperties, ({ one, many }) => ({
  farm: one(farms, { fields: [subProperties.farmId], references: [farms.id] }),
  slots: many(subPropertySlots),
  slotConfigurations: many(slotConfigurations),
}));

export const subPropertySlotsRelations = relations(subPropertySlots, ({ one }) => ({
  subProperty: one(subProperties, { fields: [subPropertySlots.subPropertyId], references: [subProperties.id] }),
}));

export const featuredSectionsRelations = relations(featuredSections, ({ many }) => ({
  farms: many(featuredSectionFarms),
}));

export const featuredSectionFarmsRelations = relations(featuredSectionFarms, ({ one }) => ({
  section: one(featuredSections, { fields: [featuredSectionFarms.sectionId], references: [featuredSections.id] }),
  farm: one(farms, { fields: [featuredSectionFarms.farmId], references: [farms.id] }),
}));

export const reelsRelations = relations(reels, ({ one }) => ({
  farm: one(farms, { fields: [reels.farmId], references: [farms.id] }),
}));

export const slotConfigurationsRelations = relations(slotConfigurations, ({ one }) => ({
  farm: one(farms, { fields: [slotConfigurations.farmId], references: [farms.id] }),
  subProperty: one(subProperties, { fields: [slotConfigurations.subPropertyId], references: [subProperties.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  farm: one(farms, { fields: [bookings.farmId], references: [farms.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  farm: one(farms, { fields: [transactions.farmId], references: [farms.id] }),
}));

// Insert schemas
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAmenitySchema = createInsertSchema(amenities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCitySchema = createInsertSchema(cities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAreaSchema = createInsertSchema(areas).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFarmSchema = createInsertSchema(farms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRequestedFarmSchema = createInsertSchema(requestedFarms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFaqSchema = createInsertSchema(faqs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubPropertySchema = createInsertSchema(subProperties).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubPropertySlotSchema = createInsertSchema(subPropertySlots).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBannerSchema = createInsertSchema(banners).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFeaturedSectionSchema = createInsertSchema(featuredSections).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFeaturedSectionFarmSchema = createInsertSchema(featuredSectionFarms).omit({ id: true, createdAt: true });
export const insertReelSchema = createInsertSchema(reels).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHomeContentSchema = createInsertSchema(homeContent).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSlotConfigurationSchema = createInsertSchema(slotConfigurations).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type Area = typeof areas.$inferSelect;
export type InsertArea = z.infer<typeof insertAreaSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type RequestedFarm = typeof requestedFarms.$inferSelect;
export type InsertRequestedFarm = z.infer<typeof insertRequestedFarmSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

export type SubProperty = typeof subProperties.$inferSelect;
export type InsertSubProperty = z.infer<typeof insertSubPropertySchema>;

export type SubPropertySlot = typeof subPropertySlots.$inferSelect;
export type InsertSubPropertySlot = z.infer<typeof insertSubPropertySlotSchema>;

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export type FeaturedSection = typeof featuredSections.$inferSelect;
export type InsertFeaturedSection = z.infer<typeof insertFeaturedSectionSchema>;

export type FeaturedSectionFarm = typeof featuredSectionFarms.$inferSelect;
export type InsertFeaturedSectionFarm = z.infer<typeof insertFeaturedSectionFarmSchema>;

export type Reel = typeof reels.$inferSelect;
export type InsertReel = z.infer<typeof insertReelSchema>;

export type HomeContent = typeof homeContent.$inferSelect;
export type InsertHomeContent = z.infer<typeof insertHomeContentSchema>;

export type SlotConfiguration = typeof slotConfigurations.$inferSelect;
export type InsertSlotConfiguration = z.infer<typeof insertSlotConfigurationSchema>;

// Extended types with relations
export type FarmWithDetails = Farm & {
  user: User;
  category: Category;
  city: City;
  area: Area;
  images: Array<typeof farmImages.$inferSelect>;
};

export type BookingWithDetails = Booking & {
  user: User;
  farm: FarmWithDetails;
};

export type TransactionWithDetails = Transaction & {
  user: User;
  farm: Farm;
};
