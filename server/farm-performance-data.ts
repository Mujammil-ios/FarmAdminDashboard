import { 
  FarmPerformanceMetrics, 
  DailyBookingTrend, 
  TopFarm, 
  CalendarDayStatus, 
  IndividualFarmPerformance,
  BookingHistory,
  TransactionHistory,
  FarmReview,
  OwnerPayout
} from '../shared/farm-performance-schema';

export class FarmPerformanceDataService {
  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  private getRandomBookingCount(): number {
    return Math.floor(Math.random() * 15) + 1; // 1-15 bookings
  }

  private getRandomCancellationCount(): number {
    return Math.floor(Math.random() * 3); // 0-2 cancellations
  }

  getGlobalMetrics(): FarmPerformanceMetrics {
    return {
      totalBookings: 1247,
      totalRevenue: 8450000, // ₹84.5 lakhs
      totalCommission: 845000, // ₹8.45 lakhs (10%)
      averageReviewScore: 4.3,
      activeOwnersCount: 156,
      activePropertiesCount: 89,
      last7DaysBookings: 87,
      last30DaysBookings: 324,
      allTimeBookings: 1247,
    };
  }

  getDailyTrends(): DailyBookingTrend[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    const dates = this.generateDateRange(startDate, endDate);
    
    return dates.map(date => ({
      date,
      bookings: this.getRandomBookingCount(),
      cancellations: this.getRandomCancellationCount(),
    }));
  }

  getTopFarms(): TopFarm[] {
    return [
      {
        id: 1,
        name: "Green Valley Organic Farm",
        bookingsLast7Days: 12,
        revenue: 450000,
        averageRating: 4.8,
        cancellationRate: 5.2,
      },
      {
        id: 2,
        name: "Sunset Hills Resort",
        bookingsLast7Days: 9,
        revenue: 380000,
        averageRating: 4.6,
        cancellationRate: 3.1,
      },
      {
        id: 3,
        name: "Mountain View Retreat",
        bookingsLast7Days: 8,
        revenue: 320000,
        averageRating: 4.5,
        cancellationRate: 7.8,
      },
      {
        id: 4,
        name: "Riverside Camping",
        bookingsLast7Days: 7,
        revenue: 280000,
        averageRating: 4.4,
        cancellationRate: 4.5,
      },
      {
        id: 5,
        name: "Forest Edge Villa",
        bookingsLast7Days: 6,
        revenue: 250000,
        averageRating: 4.7,
        cancellationRate: 2.9,
      },
    ];
  }

  getGlobalCalendarData(month: number, year: number): CalendarDayStatus[] {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendarData: CalendarDayStatus[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      const hasBookings = Math.random() > 0.4; // 60% chance of bookings
      const hasCancellations = Math.random() > 0.8; // 20% chance of cancellations
      const hasOfflineBookings = Math.random() > 0.9; // 10% chance of offline bookings
      
      calendarData.push({
        date,
        hasBookings,
        hasCancellations,
        hasOfflineBookings,
        bookingCount: hasBookings ? Math.floor(Math.random() * 8) + 1 : 0,
        cancellationCount: hasCancellations ? Math.floor(Math.random() * 2) + 1 : 0,
      });
    }
    
    return calendarData;
  }

  getIndividualFarmPerformance(farmId: number, month: number, year: number): IndividualFarmPerformance {
    const farms = [
      { id: 1, name: "Green Valley Organic Farm", ownerName: "Rajesh Kumar", farmType: "Organic Farm", location: "Lonavala, Maharashtra" },
      { id: 2, name: "Sunset Hills Resort", ownerName: "Priya Sharma", farmType: "Resort", location: "Manali, Himachal Pradesh" },
      { id: 3, name: "Mountain View Retreat", ownerName: "Amit Patel", farmType: "Villa", location: "Ooty, Tamil Nadu" },
      { id: 4, name: "Riverside Camping", ownerName: "Sneha Reddy", farmType: "Camping", location: "Rishikesh, Uttarakhand" },
      { id: 5, name: "Forest Edge Villa", ownerName: "Vikram Singh", farmType: "Villa", location: "Coorg, Karnataka" },
    ];

    const farm = farms.find(f => f.id === farmId) || farms[0];
    
    return {
      ...farm,
      monthlyMetrics: {
        totalBookings: Math.floor(Math.random() * 25) + 15, // 15-40 bookings
        bookingRevenue: Math.floor(Math.random() * 200000) + 150000, // ₹1.5-3.5 lakhs
        platformCommission: Math.floor(Math.random() * 20000) + 15000, // ₹15k-35k
        occupancyRate: Math.floor(Math.random() * 40) + 60, // 60-100%
        cancellationRate: Math.floor(Math.random() * 10) + 2, // 2-12%
        averageLeadTime: Math.floor(Math.random() * 20) + 5, // 5-25 days
        averageReviewScore: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0
      },
    };
  }

  getFarmCalendarData(farmId: number, month: number, year: number): CalendarDayStatus[] {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendarData: CalendarDayStatus[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      const hasBookings = Math.random() > 0.3; // 70% chance of bookings for individual farms
      const hasCancellations = Math.random() > 0.85; // 15% chance of cancellations
      const hasOfflineBookings = Math.random() > 0.92; // 8% chance of offline bookings
      
      calendarData.push({
        date,
        hasBookings,
        hasCancellations,
        hasOfflineBookings,
        bookingCount: hasBookings ? Math.floor(Math.random() * 3) + 1 : 0,
        cancellationCount: hasCancellations ? Math.floor(Math.random() * 2) + 1 : 0,
      });
    }
    
    return calendarData;
  }

  getFarmBookingHistory(farmId: number, month: number, year: number): BookingHistory[] {
    const customers = [
      "Arjun Mehta", "Kavya Joshi", "Rohit Gupta", "Anita Singh", "Dev Sharma",
      "Pooja Patel", "Karan Shah", "Riya Agarwal", "Sanjay Kumar", "Nisha Rao"
    ];

    const bookings: BookingHistory[] = [];
    const bookingCount = Math.floor(Math.random() * 15) + 10; // 10-25 bookings

    for (let i = 1; i <= bookingCount; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const checkInDate = new Date(year, month - 1, randomDay).toISOString().split('T')[0];
      const checkOutDay = randomDay + Math.floor(Math.random() * 3) + 1;
      const checkOutDate = new Date(year, month - 1, Math.min(checkOutDay, 30)).toISOString().split('T')[0];
      
      bookings.push({
        id: i,
        customerId: Math.floor(Math.random() * 100) + 1,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        checkInDate,
        checkOutDate,
        amountPaid: Math.floor(Math.random() * 25000) + 5000, // ₹5k-30k
        status: Math.random() > 0.1 ? 'confirmed' : 'cancelled',
      });
    }

    return bookings.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
  }

  getFarmTransactionHistory(farmId: number, month: number, year: number): TransactionHistory[] {
    const transactions: TransactionHistory[] = [];
    const transactionCount = Math.floor(Math.random() * 20) + 15; // 15-35 transactions

    for (let i = 1; i <= transactionCount; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const date = new Date(year, month - 1, randomDay).toISOString().split('T')[0];
      
      transactions.push({
        id: i,
        date,
        type: Math.random() > 0.3 ? 'customer_payment' : 'commission_disbursement',
        amount: Math.floor(Math.random() * 15000) + 2000, // ₹2k-17k
        balanceDueToOwner: Math.floor(Math.random() * 50000) + 10000, // ₹10k-60k
      });
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getFarmReviews(farmId: number): FarmReview[] {
    const reviewers = [
      "Aarav Patel", "Isha Sharma", "Rohan Gupta", "Priya Singh", "Aryan Kumar",
      "Diya Agarwal", "Vihaan Shah", "Ananya Rao", "Reyansh Joshi", "Saanvi Mehta"
    ];

    const comments = [
      "Amazing experience! The farm is well-maintained and the staff is very friendly.",
      "Beautiful location with great amenities. Highly recommended for families.",
      "Perfect getaway from city life. Clean facilities and delicious organic food.",
      "Loved the peaceful environment. Great for meditation and relaxation.",
      "Excellent service and hospitality. Will definitely visit again.",
      "Good value for money. The sunrise view from the farm is breathtaking.",
      "Well-organized activities for kids. They had a fantastic time.",
      "The organic vegetables and fruits were fresh and tasty.",
      "Nice place but could improve the WiFi connectivity.",
      "Wonderful weekend spent with family. Very refreshing experience."
    ];

    const reviews: FarmReview[] = [];
    const reviewCount = Math.floor(Math.random() * 15) + 5; // 5-20 reviews

    for (let i = 1; i <= reviewCount; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
      
      reviews.push({
        id: i,
        reviewerName: reviewers[Math.floor(Math.random() * reviewers.length)],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
        date: randomDate.toISOString().split('T')[0],
        comment: comments[Math.floor(Math.random() * comments.length)],
      });
    }

    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getOwnerPayouts(farmId: number): OwnerPayout[] {
    const paymentMethods = ["Bank Transfer", "UPI", "Cheque", "Digital Wallet"];
    const payouts: OwnerPayout[] = [];
    const payoutCount = Math.floor(Math.random() * 8) + 4; // 4-12 payouts

    for (let i = 1; i <= payoutCount; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 180)); // Last 6 months
      
      payouts.push({
        id: i,
        payoutDate: randomDate.toISOString().split('T')[0],
        amountPaidOut: Math.floor(Math.random() * 80000) + 20000, // ₹20k-1L
        outstandingCommission: Math.floor(Math.random() * 15000) + 5000, // ₹5k-20k
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      });
    }

    return payouts.sort((a, b) => new Date(b.payoutDate).getTime() - new Date(a.payoutDate).getTime());
  }
}