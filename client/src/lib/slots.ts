export interface SlotCalculation {
  totalSlots: number;
  morningSlots: number;
  eveningSlots: number;
  cleaningHours: number;
}

export interface SlotTiming {
  startTime: string;
  endTime: string;
  type: 'morning' | 'evening';
}

export const SLOT_TIMINGS: SlotTiming[] = [
  { startTime: '06:00', endTime: '18:00', type: 'morning' },
  { startTime: '18:00', endTime: '06:00', type: 'evening' },
];

export const CLEANING_DURATION_MINUTES = 60;
export const SLOT_DURATION_HOURS = 12;
export const USABLE_HOURS_PER_SLOT = 11;

/**
 * Calculate number of slots based on duration
 * 1 day = 2 slots (morning + evening)
 * 2 days = 4 slots, etc.
 */
export function calculateSlots(days: number): SlotCalculation {
  const totalSlots = days * 2; // 2 slots per day
  const morningSlots = days;
  const eveningSlots = days;
  const cleaningHours = totalSlots * 1; // 1 hour cleaning per slot

  return {
    totalSlots,
    morningSlots,
    eveningSlots,
    cleaningHours,
  };
}

/**
 * Calculate total price based on slot count and price per slot
 */
export function calculateSlotPrice(numberOfSlots: number, pricePerSlot: number): number {
  return numberOfSlots * pricePerSlot;
}

/**
 * Check if slots overlap with cleaning buffer
 */
export function checkSlotConflict(
  checkInDate: Date,
  checkOutDate: Date,
  existingBookings: Array<{ checkInDate: string; checkOutDate: string; checkInTime: string; checkOutTime: string }>
): boolean {
  for (const booking of existingBookings) {
    const bookingStart = new Date(`${booking.checkInDate}T${booking.checkInTime}`);
    const bookingEnd = new Date(`${booking.checkOutDate}T${booking.checkOutTime}`);
    
    // Add cleaning buffer
    const bookingEndWithBuffer = new Date(bookingEnd.getTime() + CLEANING_DURATION_MINUTES * 60 * 1000);
    
    // Check for overlap
    if (checkInDate < bookingEndWithBuffer && checkOutDate > bookingStart) {
      return true; // Conflict detected
    }
  }
  
  return false; // No conflict
}

/**
 * Generate slot schedule for a date range
 */
export function generateSlotSchedule(startDate: Date, endDate: Date): Array<{
  date: string;
  slots: Array<{ type: 'morning' | 'evening'; startTime: string; endTime: string }>
}> {
  const schedule = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    schedule.push({
      date: dateStr,
      slots: [
        { type: 'morning', startTime: '06:00', endTime: '18:00' },
        { type: 'evening', startTime: '18:00', endTime: '06:00' },
      ],
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedule;
}

/**
 * Get slot status based on bookings and current time
 */
export function getSlotStatus(
  date: string,
  slotType: 'morning' | 'evening',
  bookings: Array<any>,
  currentTime: Date = new Date()
): 'available' | 'booked' | 'cleaning' | 'blocked' {
  const slotDate = new Date(date);
  const now = new Date(currentTime);
  
  // Check if slot is in the past
  if (slotType === 'morning' && slotDate < now && slotDate.toDateString() === now.toDateString() && now.getHours() >= 18) {
    return 'blocked';
  }
  if (slotType === 'evening' && slotDate < now) {
    return 'blocked';
  }
  
  // Check for bookings
  const hasBooking = bookings.some(booking => {
    const bookingDate = booking.checkInDate;
    const bookingSlotType = booking.slotType;
    return bookingDate === date && bookingSlotType === slotType && booking.status === 1; // Upcoming
  });
  
  if (hasBooking) {
    return 'booked';
  }
  
  // Check for cleaning (simplified - after a completed booking)
  const hadRecentBooking = bookings.some(booking => {
    const bookingDate = new Date(booking.checkOutDate);
    const timeDiff = slotDate.getTime() - bookingDate.getTime();
    return timeDiff > 0 && timeDiff <= CLEANING_DURATION_MINUTES * 60 * 1000 && booking.status === 0; // Complete
  });
  
  if (hadRecentBooking) {
    return 'cleaning';
  }
  
  return 'available';
}
