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
  private readonly farmNames = [
    "Green Valley Organic Farm", "Sunset Hills Resort", "Mountain View Retreat", "Riverside Camping",
    "Forest Edge Villa", "Golden Harvest Farm", "Blue Sky Ranch", "Meadow Brook Estate",
    "Pine Ridge Resort", "Wildflower Farm", "Crystal Lake Lodge", "Bamboo Grove Retreat",
    "Highland Paradise", "Ocean Breeze Farm", "Desert Bloom Ranch", "Misty Mountain Lodge",
    "Rainbow Valley Farm", "Serenity Springs Resort", "Thunder Peak Ranch", "Peaceful Valley Estate",
    "Sunrise Meadows Farm", "Silver Stream Lodge", "Garden Paradise Resort", "Moonlight Bay Farm",
    "Whispering Pines Ranch", "Aurora Hills Estate", "Zen Garden Retreat", "Emerald Valley Farm",
    "Crimson Sunset Lodge", "Harmony Hills Resort", "Starlight Ranch", "Tranquil Waters Farm",
    "Rocky Mountain Lodge", "Lavender Fields Estate", "Sapphire Lake Resort", "Twilight Grove Farm"
  ];

  private readonly ownerNames = [
    "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Reddy", "Vikram Singh",
    "Anita Gupta", "Rohan Mehta", "Kavya Joshi", "Arjun Agarwal", "Deepika Rao",
    "Sanjay Verma", "Pooja Shah", "Karan Malhotra", "Nisha Khanna", "Dev Choudhary",
    "Riya Kapoor", "Rohit Bansal", "Shruti Pandey", "Akash Trivedi", "Meera Saxena",
    "Varun Tiwari", "Sunita Goel", "Nikhil Dixit", "Preeti Aggarwal", "Gaurav Mittal",
    "Swati Jindal", "Rahul Garg", "Neha Bhatnagar", "Manish Goyal", "Anusha Sinha",
    "Vivek Chopra", "Rashmi Arora", "Aditya Bhalla", "Simran Kaur", "Ashish Tandon",
    "Kritika Jain"
  ];

  private readonly farmTypes = [
    "Organic Farm", "Resort", "Villa", "Camping", "Ranch", "Lodge", "Estate", "Retreat"
  ];

  private readonly locations = [
    "Lonavala, Maharashtra", "Manali, Himachal Pradesh", "Ooty, Tamil Nadu", "Rishikesh, Uttarakhand",
    "Coorg, Karnataka", "Munnar, Kerala", "Goa", "Mount Abu, Rajasthan", "Darjeeling, West Bengal",
    "Shimla, Himachal Pradesh", "Mussoorie, Uttarakhand", "Kodaikanal, Tamil Nadu", "Wayanad, Kerala",
    "Mahabaleshwar, Maharashtra", "Nainital, Uttarakhand", "Kasauli, Himachal Pradesh",
    "Yercaud, Tamil Nadu", "Chikmagalur, Karnataka", "Sakleshpur, Karnataka", "Kufri, Himachal Pradesh",
    "Lansdowne, Uttarakhand", "Coonoor, Tamil Nadu", "Thekkady, Kerala", "Panchgani, Maharashtra",
    "Dehradun, Uttarakhand", "Kasol, Himachal Pradesh", "Hampi, Karnataka", "Alleppey, Kerala",
    "Udaipur, Rajasthan", "Jaipur, Rajasthan", "Pushkar, Rajasthan", "Jodhpur, Rajasthan",
    "Jaisalmer, Rajasthan", "Bharatpur, Rajasthan", "Ranthambore, Rajasthan", "Agra, Uttar Pradesh"
  ];

  private readonly customerNames = [
    "Arjun Mehta", "Kavya Joshi", "Rohit Gupta", "Anita Singh", "Dev Sharma", "Pooja Patel",
    "Karan Shah", "Riya Agarwal", "Sanjay Kumar", "Nisha Rao", "Vikram Malhotra", "Deepika Verma",
    "Amit Khanna", "Priya Choudhary", "Rohan Kapoor", "Sneha Bansal", "Akash Pandey", "Meera Trivedi",
    "Varun Saxena", "Sunita Tiwari", "Nikhil Goel", "Preeti Dixit", "Gaurav Aggarwal", "Swati Mittal",
    "Rahul Jindal", "Neha Garg", "Manish Bhatnagar", "Anusha Goyal", "Vivek Sinha", "Rashmi Chopra",
    "Aditya Arora", "Simran Bhalla", "Ashish Kaur", "Kritika Tandon", "Rajesh Jain", "Anjali Sharma",
    "Naveen Gupta", "Shreya Reddy", "Kunal Singh", "Pallavi Patel", "Harish Shah", "Divya Agarwal",
    "Tarun Kumar", "Ritu Rao", "Ajay Malhotra", "Shweta Verma", "Mohan Khanna", "Geeta Choudhary",
    "Suresh Kapoor", "Madhuri Bansal", "Ramesh Pandey", "Lakshmi Trivedi", "Sunil Saxena", "Poonam Tiwari"
  ];

  private readonly reviewComments = [
    "Amazing experience! The farm is well-maintained and the staff is very friendly.",
    "Beautiful location with great amenities. Highly recommended for families.",
    "Perfect getaway from city life. Clean facilities and delicious organic food.",
    "Loved the peaceful environment. Great for meditation and relaxation.",
    "Excellent service and hospitality. Will definitely visit again.",
    "Good value for money. The sunrise view from the farm is breathtaking.",
    "Well-organized activities for kids. They had a fantastic time.",
    "The organic vegetables and fruits were fresh and tasty.",
    "Nice place but could improve the WiFi connectivity.",
    "Wonderful weekend spent with family. Very refreshing experience.",
    "Outstanding farm stay with authentic rural experience.",
    "Exceptional hospitality and delicious home-cooked meals.",
    "Serene atmosphere perfect for corporate retreats.",
    "Great facilities for team building activities.",
    "The nature walks and bird watching were amazing.",
    "Comfortable accommodation with all modern amenities.",
    "Staff went above and beyond to make our stay memorable.",
    "Perfect blend of adventure and relaxation.",
    "The farm-to-table dining experience was incredible.",
    "Beautiful sunset views and starry nights.",
    "Excellent arrangements for special occasions.",
    "The bullock cart rides were a hit with children.",
    "Authentic village experience with modern comforts.",
    "Great location for photography enthusiasts.",
    "The organic farming demonstrations were educational."
  ];

  private readonly paymentMethods = [
    "Bank Transfer", "UPI", "Credit Card", "Debit Card", "Digital Wallet", "Cash", "Cheque"
  ];

  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  private getRandomBookingCount(isWeekend: boolean = false): number {
    const baseMin = isWeekend ? 8 : 3;
    const baseMax = isWeekend ? 25 : 15;
    return Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;
  }

  private getRandomCancellationCount(bookingCount: number): number {
    const cancellationRate = 0.05 + Math.random() * 0.1; // 5-15% cancellation rate
    return Math.floor(bookingCount * cancellationRate);
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  getGlobalMetrics(): FarmPerformanceMetrics {
    // Calculate dynamic metrics based on realistic data
    const totalFarms = this.farmNames.length;
    const avgBookingsPerFarm = 145;
    const totalBookings = totalFarms * avgBookingsPerFarm;
    const avgRevenuePerBooking = 18500;
    const totalRevenue = totalBookings * avgRevenuePerBooking;
    const commissionRate = 0.12; // 12% commission
    
    return {
      totalBookings: totalBookings, // ~5,220 bookings
      totalRevenue: totalRevenue, // ₹9.65 crores
      totalCommission: Math.floor(totalRevenue * commissionRate), // ₹1.16 crores
      averageReviewScore: 4.2,
      activeOwnersCount: this.ownerNames.length,
      activePropertiesCount: totalFarms,
      last7DaysBookings: Math.floor(totalBookings * 0.035), // ~183 bookings
      last30DaysBookings: Math.floor(totalBookings * 0.15), // ~783 bookings
      allTimeBookings: totalBookings,
    };
  }

  getDailyTrends(): DailyBookingTrend[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    const dates = this.generateDateRange(startDate, endDate);
    
    return dates.map(date => {
      const currentDate = new Date(date);
      const isWeekendDay = this.isWeekend(currentDate);
      const bookings = this.getRandomBookingCount(isWeekendDay);
      const cancellations = this.getRandomCancellationCount(bookings);
      
      return {
        date,
        bookings,
        cancellations,
      };
    });
  }

  getTopFarms(): TopFarm[] {
    const topFarmIndices = [0, 1, 2, 3, 4]; // Top performing farms
    
    return topFarmIndices.map((index, rank) => {
      const baseBookings = 35 - (rank * 4); // Decreasing bookings from top performers
      const weekendBonus = Math.floor(Math.random() * 8);
      const bookingsLast7Days = baseBookings + weekendBonus;
      
      const avgRevenuePerBooking = 22000 + (Math.random() * 8000); // ₹22k-30k per booking
      const monthlyBookings = bookingsLast7Days * 4.3; // Approximate monthly from weekly
      const revenue = Math.floor(monthlyBookings * avgRevenuePerBooking);
      
      const rating = 4.2 + (Math.random() * 0.7); // 4.2-4.9 rating
      const cancellationRate = 2 + (Math.random() * 6); // 2-8% cancellation
      
      return {
        id: index + 1,
        name: this.farmNames[index],
        bookingsLast7Days,
        revenue,
        averageRating: parseFloat(rating.toFixed(1)),
        cancellationRate: parseFloat(cancellationRate.toFixed(1)),
      };
    });
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
    const farmIndex = (farmId - 1) % this.farmNames.length;
    const ownerIndex = farmIndex % this.ownerNames.length;
    const typeIndex = farmIndex % this.farmTypes.length;
    const locationIndex = farmIndex % this.locations.length;
    
    const farm = {
      id: farmId,
      name: this.farmNames[farmIndex],
      ownerName: this.ownerNames[ownerIndex],
      farmType: this.farmTypes[typeIndex],
      location: this.locations[locationIndex]
    };

    // Generate realistic monthly metrics based on farm performance tier
    const performanceTier = farmIndex < 5 ? 'premium' : farmIndex < 15 ? 'good' : 'standard';
    
    let baseBookings, baseRevenue, baseOccupancy;
    switch (performanceTier) {
      case 'premium':
        baseBookings = 85 + Math.floor(Math.random() * 25); // 85-110 bookings
        baseRevenue = 28000 + Math.floor(Math.random() * 12000); // ₹28k-40k per booking
        baseOccupancy = 85 + Math.floor(Math.random() * 15); // 85-100%
        break;
      case 'good':
        baseBookings = 55 + Math.floor(Math.random() * 25); // 55-80 bookings
        baseRevenue = 18000 + Math.floor(Math.random() * 10000); // ₹18k-28k per booking
        baseOccupancy = 70 + Math.floor(Math.random() * 20); // 70-90%
        break;
      default:
        baseBookings = 25 + Math.floor(Math.random() * 25); // 25-50 bookings
        baseRevenue = 12000 + Math.floor(Math.random() * 8000); // ₹12k-20k per booking
        baseOccupancy = 45 + Math.floor(Math.random() * 25); // 45-70%
    }

    const totalRevenue = baseBookings * baseRevenue;
    const commissionRate = 0.12;
    
    return {
      ...farm,
      monthlyMetrics: {
        totalBookings: baseBookings,
        bookingRevenue: totalRevenue,
        platformCommission: Math.floor(totalRevenue * commissionRate),
        occupancyRate: baseOccupancy,
        cancellationRate: 3 + Math.floor(Math.random() * 8), // 3-11%
        averageLeadTime: 8 + Math.floor(Math.random() * 15), // 8-23 days
        averageReviewScore: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // 4.0-5.0
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
    const bookings: BookingHistory[] = [];
    const farmIndex = (farmId - 1) % this.farmNames.length;
    const performanceTier = farmIndex < 5 ? 'premium' : farmIndex < 15 ? 'good' : 'standard';
    
    // Determine booking volume based on farm tier
    let bookingCount;
    switch (performanceTier) {
      case 'premium':
        bookingCount = 65 + Math.floor(Math.random() * 30); // 65-95 bookings
        break;
      case 'good':
        bookingCount = 35 + Math.floor(Math.random() * 25); // 35-60 bookings
        break;
      default:
        bookingCount = 15 + Math.floor(Math.random() * 20); // 15-35 bookings
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let i = 1; i <= bookingCount; i++) {
      const checkInDay = Math.floor(Math.random() * daysInMonth) + 1;
      const stayDuration = 1 + Math.floor(Math.random() * 4); // 1-4 nights
      const checkOutDay = Math.min(checkInDay + stayDuration, daysInMonth);
      
      const checkInDate = new Date(year, month - 1, checkInDay).toISOString().split('T')[0];
      const checkOutDate = new Date(year, month - 1, checkOutDay).toISOString().split('T')[0];
      
      // Pricing based on tier and stay duration
      let basePrice;
      switch (performanceTier) {
        case 'premium':
          basePrice = 25000 + Math.floor(Math.random() * 15000); // ₹25k-40k
          break;
        case 'good':
          basePrice = 15000 + Math.floor(Math.random() * 10000); // ₹15k-25k
          break;
        default:
          basePrice = 8000 + Math.floor(Math.random() * 7000); // ₹8k-15k
      }
      
      const amountPaid = basePrice * stayDuration;
      const isWeekend = new Date(year, month - 1, checkInDay).getDay() % 6 === 0;
      const finalAmount = isWeekend ? Math.floor(amountPaid * 1.2) : amountPaid;
      
      // Status distribution: 92% confirmed, 5% cancelled, 3% completed
      let status: 'confirmed' | 'cancelled' | 'completed';
      const statusRand = Math.random();
      if (statusRand < 0.03) status = 'completed';
      else if (statusRand < 0.08) status = 'cancelled';
      else status = 'confirmed';
      
      bookings.push({
        id: i,
        customerId: Math.floor(Math.random() * 1000) + 1,
        customerName: this.customerNames[Math.floor(Math.random() * this.customerNames.length)],
        checkInDate,
        checkOutDate,
        amountPaid: finalAmount,
        status,
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
    const reviews: FarmReview[] = [];
    const farmIndex = (farmId - 1) % this.farmNames.length;
    const performanceTier = farmIndex < 5 ? 'premium' : farmIndex < 15 ? 'good' : 'standard';
    
    // Review count based on farm popularity
    let reviewCount;
    switch (performanceTier) {
      case 'premium':
        reviewCount = 150 + Math.floor(Math.random() * 100); // 150-250 reviews
        break;
      case 'good':
        reviewCount = 75 + Math.floor(Math.random() * 75); // 75-150 reviews
        break;
      default:
        reviewCount = 25 + Math.floor(Math.random() * 50); // 25-75 reviews
    }

    for (let i = 1; i <= reviewCount; i++) {
      // Reviews spread over last 2 years
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 730));
      
      // Rating distribution based on tier
      let rating;
      switch (performanceTier) {
        case 'premium':
          // Premium farms: 60% 5-star, 30% 4-star, 10% 3-star
          const premiumRand = Math.random();
          if (premiumRand < 0.6) rating = 5;
          else if (premiumRand < 0.9) rating = 4;
          else rating = 3;
          break;
        case 'good':
          // Good farms: 40% 5-star, 45% 4-star, 15% 3-star
          const goodRand = Math.random();
          if (goodRand < 0.4) rating = 5;
          else if (goodRand < 0.85) rating = 4;
          else rating = 3;
          break;
        default:
          // Standard farms: 25% 5-star, 50% 4-star, 20% 3-star, 5% 2-star
          const standardRand = Math.random();
          if (standardRand < 0.25) rating = 5;
          else if (standardRand < 0.75) rating = 4;
          else if (standardRand < 0.95) rating = 3;
          else rating = 2;
      }
      
      reviews.push({
        id: i,
        reviewerName: this.customerNames[Math.floor(Math.random() * this.customerNames.length)],
        rating,
        date: randomDate.toISOString().split('T')[0],
        comment: this.reviewComments[Math.floor(Math.random() * this.reviewComments.length)],
      });
    }

    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getOwnerPayouts(farmId: number): OwnerPayout[] {
    const payouts: OwnerPayout[] = [];
    const farmIndex = (farmId - 1) % this.farmNames.length;
    const performanceTier = farmIndex < 5 ? 'premium' : farmIndex < 15 ? 'good' : 'standard';
    
    // Payout frequency and amounts based on farm tier
    let payoutCount, basePayoutAmount;
    switch (performanceTier) {
      case 'premium':
        payoutCount = 18 + Math.floor(Math.random() * 12); // 18-30 payouts (last 2 years)
        basePayoutAmount = 180000; // ₹1.8L base
        break;
      case 'good':
        payoutCount = 12 + Math.floor(Math.random() * 8); // 12-20 payouts
        basePayoutAmount = 120000; // ₹1.2L base
        break;
      default:
        payoutCount = 8 + Math.floor(Math.random() * 6); // 8-14 payouts
        basePayoutAmount = 60000; // ₹60k base
    }

    for (let i = 1; i <= payoutCount; i++) {
      // Payouts spread over last 24 months, more frequent for recent months
      const daysBack = Math.floor(Math.random() * 730);
      const payoutDate = new Date();
      payoutDate.setDate(payoutDate.getDate() - daysBack);
      
      // Seasonal variations in payouts (higher during peak months)
      const month = payoutDate.getMonth();
      const isPeakSeason = [9, 10, 11, 0, 1, 2, 3].includes(month); // Oct-Mar peak season
      const seasonalMultiplier = isPeakSeason ? 1.3 : 0.8;
      
      const amountVariation = 0.7 + (Math.random() * 0.6); // 70%-130% of base
      const amountPaidOut = Math.floor(basePayoutAmount * seasonalMultiplier * amountVariation);
      
      // Outstanding commission typically 10-15% of payout amount
      const outstandingCommission = Math.floor(amountPaidOut * (0.08 + Math.random() * 0.1));
      
      payouts.push({
        id: i,
        payoutDate: payoutDate.toISOString().split('T')[0],
        amountPaidOut,
        outstandingCommission,
        paymentMethod: this.paymentMethods[Math.floor(Math.random() * this.paymentMethods.length)],
      });
    }

    return payouts.sort((a, b) => new Date(b.payoutDate).getTime() - new Date(a.payoutDate).getTime());
  }
}