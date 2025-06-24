export interface DashboardMetrics {
  totalUsers: number;
  totalOwners: number;
  activeFarms: number;
  bookedSlotsToday: number;
  totalRevenue: number;
  pendingFarmRequests: number;
}

export interface SlotData {
  id: string;
  farmId: number;
  farmName: string;
  date: string;
  slotType: 'morning' | 'evening';
  status: 'available' | 'booked' | 'cleaning' | 'blocked';
  price?: number;
  bookingId?: number;
}

export interface SlotUtilizationData {
  morningSlots: number;
  eveningSlots: number;
  cleaningBuffer: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface BookingStatus {
  0: 'Complete';
  1: 'Upcoming';
  2: 'Cancelled';
}

export const BOOKING_STATUS: BookingStatus = {
  0: 'Complete',
  1: 'Upcoming',
  2: 'Cancelled',
};

export const SLOT_COLORS = {
  available: 'bg-green-500',
  booked: 'bg-blue-500',
  cleaning: 'bg-yellow-500',
  blocked: 'bg-red-500',
} as const;
