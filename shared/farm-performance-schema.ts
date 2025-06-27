import { z } from "zod";

// Farm Performance Metrics Schema
export const farmPerformanceMetricsSchema = z.object({
  totalBookings: z.number(),
  totalRevenue: z.number(),
  totalCommission: z.number(),
  averageReviewScore: z.number(),
  activeOwnersCount: z.number(),
  activePropertiesCount: z.number(),
  last7DaysBookings: z.number(),
  last30DaysBookings: z.number(),
  allTimeBookings: z.number(),
});

export type FarmPerformanceMetrics = z.infer<typeof farmPerformanceMetricsSchema>;

// Daily Booking Trend Schema
export const dailyBookingTrendSchema = z.object({
  date: z.string(),
  bookings: z.number(),
  cancellations: z.number(),
});

export type DailyBookingTrend = z.infer<typeof dailyBookingTrendSchema>;

// Top Farm Schema
export const topFarmSchema = z.object({
  id: z.number(),
  name: z.string(),
  bookingsLast7Days: z.number(),
  revenue: z.number(),
  averageRating: z.number(),
  cancellationRate: z.number(),
});

export type TopFarm = z.infer<typeof topFarmSchema>;

// Calendar Day Status Schema
export const calendarDayStatusSchema = z.object({
  date: z.string(),
  hasBookings: z.boolean(),
  hasCancellations: z.boolean(),
  hasOfflineBookings: z.boolean(),
  bookingCount: z.number(),
  cancellationCount: z.number(),
});

export type CalendarDayStatus = z.infer<typeof calendarDayStatusSchema>;

// Individual Farm Performance Schema
export const individualFarmPerformanceSchema = z.object({
  id: z.number(),
  name: z.string(),
  ownerName: z.string(),
  farmType: z.string(),
  location: z.string(),
  monthlyMetrics: z.object({
    totalBookings: z.number(),
    bookingRevenue: z.number(),
    platformCommission: z.number(),
    occupancyRate: z.number(),
    cancellationRate: z.number(),
    averageLeadTime: z.number(),
    averageReviewScore: z.number(),
  }),
});

export type IndividualFarmPerformance = z.infer<typeof individualFarmPerformanceSchema>;

// Booking History Schema
export const bookingHistorySchema = z.object({
  id: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  amountPaid: z.number(),
  status: z.enum(['confirmed', 'cancelled', 'completed']),
});

export type BookingHistory = z.infer<typeof bookingHistorySchema>;

// Transaction History Schema
export const transactionHistorySchema = z.object({
  id: z.number(),
  date: z.string(),
  type: z.enum(['customer_payment', 'commission_disbursement']),
  amount: z.number(),
  balanceDueToOwner: z.number(),
});

export type TransactionHistory = z.infer<typeof transactionHistorySchema>;

// Farm Review Schema
export const farmReviewSchema = z.object({
  id: z.number(),
  reviewerName: z.string(),
  rating: z.number(),
  date: z.string(),
  comment: z.string(),
});

export type FarmReview = z.infer<typeof farmReviewSchema>;

// Owner Payout Schema
export const ownerPayoutSchema = z.object({
  id: z.number(),
  payoutDate: z.string(),
  amountPaidOut: z.number(),
  outstandingCommission: z.number(),
  paymentMethod: z.string(),
});

export type OwnerPayout = z.infer<typeof ownerPayoutSchema>;