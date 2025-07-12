import { pgTable, text, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Coupons table
export const coupons = pgTable("coupons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'percentage' | 'fixed' | 'free_shipping'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"), // null for unlimited
  usedCount: integer("used_count").notNull().default(0),
  userLimit: integer("user_limit").default(1), // how many times one user can use
  applicableCategories: jsonb("applicable_categories"), // array of category IDs
  applicableFarms: jsonb("applicable_farms"), // array of farm IDs
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Coupon usage tracking
export const couponUsage = pgTable("coupon_usage", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  couponId: integer("coupon_id").notNull(),
  userId: integer("user_id").notNull(),
  bookingId: integer("booking_id"), // related booking
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").notNull().defaultNow(),
});

// Refunds table
export const refunds = pgTable("refunds", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  bookingId: integer("booking_id").notNull(),
  userId: integer("user_id").notNull(),
  reason: text("reason").notNull(),
  refundType: text("refund_type").notNull(), // 'full' | 'partial' | 'wallet'
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundMethod: text("refund_method").notNull(), // 'original_payment' | 'wallet' | 'bank_transfer'
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'processed' | 'rejected'
  processedBy: integer("processed_by"),
  processedAt: timestamp("processed_at"),
  notes: text("notes"),
  metadata: jsonb("metadata"), // additional refund data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Bulk coupon operations
export const bulkCouponOperations = pgTable("bulk_coupon_operations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  operationType: text("operation_type").notNull(), // 'create' | 'update' | 'delete'
  totalCoupons: integer("total_coupons").notNull(),
  processedCoupons: integer("processed_coupons").notNull().default(0),
  failedCoupons: integer("failed_coupons").notNull().default(0),
  status: text("status").notNull().default("pending"), // 'pending' | 'processing' | 'completed' | 'failed'
  template: jsonb("template"), // coupon template for bulk creation
  errors: jsonb("errors"), // error details
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertCoupon = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCouponUsage = createInsertSchema(couponUsage).omit({
  id: true,
  usedAt: true,
});

export const insertRefund = createInsertSchema(refunds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBulkCouponOperation = createInsertSchema(bulkCouponOperations).omit({
  id: true,
  processedCoupons: true,
  failedCoupons: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCoupon>;

export type CouponUsage = typeof couponUsage.$inferSelect;
export type InsertCouponUsage = z.infer<typeof insertCouponUsage>;

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = z.infer<typeof insertRefund>;

export type BulkCouponOperation = typeof bulkCouponOperations.$inferSelect;
export type InsertBulkCouponOperation = z.infer<typeof insertBulkCouponOperation>;

// Extended types with relations
export type CouponWithStats = Coupon & {
  totalUsed: number;
  totalDiscount: string;
  isExpired: boolean;
  canUse: boolean;
};

export type RefundWithDetails = Refund & {
  booking: {
    id: number;
    farmName: string;
    checkInDate: string;
    checkOutDate: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  processor?: {
    id: number;
    name: string;
    email: string;
  };
};

// Booking calculation types
export interface BookingCalculation {
  subtotal: string;
  couponDiscount: string;
  taxes: string;
  total: string;
  appliedCoupon?: {
    code: string;
    title: string;
    discountAmount: string;
  };
}