import { pgTable, text, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Wallet system
export const wallets = pgTable("wallets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  userType: text("user_type").notNull(), // 'customer' | 'owner'
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).notNull().default("0.00"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Points and rewards transactions
export const walletTransactions = pgTable("wallet_transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  walletId: integer("wallet_id").notNull(),
  type: text("type").notNull(), // 'earn' | 'spend' | 'refund' | 'adjustment'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // 'booking' | 'referral' | 'campaign' | 'manual' | 'cancellation'
  sourceId: integer("source_id"), // related booking/campaign/etc ID
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // additional data like campaign details
  adminId: integer("admin_id"), // if manual adjustment
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Rewards campaigns
export const rewardsCampaigns = pgTable("rewards_campaigns", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'signup' | 'booking' | 'referral' | 'loyalty'
  status: text("status").notNull().default("draft"), // 'draft' | 'active' | 'paused' | 'ended'
  rules: jsonb("rules").notNull(), // campaign rules and conditions
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }).notNull(),
  maxRewards: integer("max_rewards"), // null for unlimited
  usedRewards: integer("used_rewards").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// System configuration for rewards
export const rewardsConfig = pgTable("rewards_config", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedBy: integer("updated_by").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// API documentation
export const apiDocs = pgTable("api_docs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  filename: text("filename").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'rewards' | 'bookings' | 'users' | etc
  version: text("version").notNull().default("1.0"),
  isPublic: boolean("is_public").notNull().default(false),
  lastEditedBy: integer("last_edited_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Audit trail for admin actions
export const auditLogs = pgTable("audit_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  module: text("module").notNull(), // 'rewards' | 'bookings' | 'users' | etc
  entityType: text("entity_type"), // 'wallet' | 'campaign' | 'user' | etc
  entityId: integer("entity_id"),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertWallet = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletTransaction = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertRewardsCampaign = createInsertSchema(rewardsCampaigns).omit({
  id: true,
  usedRewards: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRewardsConfig = createInsertSchema(rewardsConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertApiDoc = createInsertSchema(apiDocs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLog = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWallet>;

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransaction>;

export type RewardsCampaign = typeof rewardsCampaigns.$inferSelect;
export type InsertRewardsCampaign = z.infer<typeof insertRewardsCampaign>;

export type RewardsConfig = typeof rewardsConfig.$inferSelect;
export type InsertRewardsConfig = z.infer<typeof insertRewardsConfig>;

export type ApiDoc = typeof apiDocs.$inferSelect;
export type InsertApiDoc = z.infer<typeof insertApiDoc>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLog>;

// Extended types with relations
export type WalletWithUser = Wallet & {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export type WalletTransactionWithDetails = WalletTransaction & {
  wallet: WalletWithUser;
  admin?: {
    id: number;
    name: string;
    email: string;
  };
};

export type RewardsCampaignWithStats = RewardsCampaign & {
  creator: {
    id: number;
    name: string;
    email: string;
  };
  totalEarned: string;
  activeUsers: number;
};