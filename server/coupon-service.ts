import { 
  Coupon, 
  InsertCoupon, 
  CouponUsage, 
  InsertCouponUsage, 
  Refund, 
  InsertRefund, 
  BulkCouponOperation,
  InsertBulkCouponOperation,
  CouponWithStats,
  RefundWithDetails,
  BookingCalculation
} from "../shared/coupon-schema.js";

export class CouponService {
  private coupons: CouponWithStats[] = [];
  private couponUsage: CouponUsage[] = [];
  private refunds: RefundWithDetails[] = [];
  private bulkOperations: BulkCouponOperation[] = [];
  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample coupons
    this.coupons = [
      {
        id: 1,
        code: "WELCOME20",
        title: "Welcome Discount",
        description: "20% off on your first booking",
        type: "percentage",
        value: "20.00",
        minOrderAmount: "100.00",
        maxDiscount: "500.00",
        usageLimit: 1000,
        usedCount: 156,
        userLimit: 1,
        applicableCategories: null,
        applicableFarms: null,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
        isActive: true,
        createdBy: 1,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
        totalUsed: 156,
        totalDiscount: "15600.00",
        isExpired: false,
        canUse: true
      },
      {
        id: 2,
        code: "SUMMER50",
        title: "Summer Special",
        description: "₹50 off on weekend bookings",
        type: "fixed",
        value: "50.00",
        minOrderAmount: "200.00",
        maxDiscount: null,
        usageLimit: 500,
        usedCount: 89,
        userLimit: 3,
        applicableCategories: [1, 2], // Farm stays, Weekend getaways
        applicableFarms: null,
        validFrom: new Date("2024-06-01"),
        validUntil: new Date("2024-08-31"),
        isActive: true,
        createdBy: 1,
        createdAt: new Date("2024-05-15"),
        updatedAt: new Date(),
        totalUsed: 89,
        totalDiscount: "4450.00",
        isExpired: false,
        canUse: true
      },
      {
        id: 3,
        code: "MONSOON30",
        title: "Monsoon Discount",
        description: "30% off expired",
        type: "percentage",
        value: "30.00",
        minOrderAmount: "150.00",
        maxDiscount: "300.00",
        usageLimit: 200,
        usedCount: 198,
        userLimit: 1,
        applicableCategories: null,
        applicableFarms: [1, 2, 3], // Specific farms
        validFrom: new Date("2024-06-01"),
        validUntil: new Date("2024-09-30"),
        isActive: false,
        createdBy: 1,
        createdAt: new Date("2024-05-20"),
        updatedAt: new Date(),
        totalUsed: 198,
        totalDiscount: "29700.00",
        isExpired: true,
        canUse: false
      }
    ];

    // Initialize sample refunds
    this.refunds = [
      {
        id: 1,
        bookingId: 15,
        userId: 2,
        reason: "Weather conditions - farm flooded",
        refundType: "full",
        originalAmount: "500.00",
        refundAmount: "500.00",
        refundMethod: "original_payment",
        status: "processed",
        processedBy: 1,
        processedAt: new Date("2024-01-10"),
        notes: "Full refund due to unavoidable circumstances",
        metadata: { payment_gateway: "stripe", transaction_id: "txn_123" },
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-10"),
        booking: {
          id: 15,
          farmName: "Green Valley Farm",
          checkInDate: "2024-01-15",
          checkOutDate: "2024-01-16"
        },
        user: {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com"
        },
        processor: {
          id: 1,
          name: "Admin User",
          email: "admin@bookmyfarm.com"
        }
      },
      {
        id: 2,
        bookingId: 28,
        userId: 5,
        reason: "Customer emergency",
        refundType: "partial",
        originalAmount: "800.00",
        refundAmount: "400.00",
        refundMethod: "wallet",
        status: "approved",
        processedBy: 1,
        processedAt: new Date("2024-01-12"),
        notes: "50% refund to wallet as per policy",
        metadata: { cancellation_hours: 8 },
        createdAt: new Date("2024-01-11"),
        updatedAt: new Date("2024-01-12"),
        booking: {
          id: 28,
          farmName: "Mountain View Resort",
          checkInDate: "2024-01-20",
          checkOutDate: "2024-01-22"
        },
        user: {
          id: 5,
          name: "Mike Wilson",
          email: "mike@example.com"
        },
        processor: {
          id: 1,
          name: "Admin User",
          email: "admin@bookmyfarm.com"
        }
      }
    ];

    this.nextId = 1000;
  }

  // Coupon operations
  async getAllCoupons(isActive?: boolean): Promise<CouponWithStats[]> {
    let filtered = this.coupons;
    if (isActive !== undefined) {
      filtered = this.coupons.filter(c => c.isActive === isActive);
    }
    return filtered;
  }

  async getCoupon(id: number): Promise<CouponWithStats | undefined> {
    return this.coupons.find(c => c.id === id);
  }

  async getCouponByCode(code: string): Promise<CouponWithStats | undefined> {
    return this.coupons.find(c => c.code === code && c.isActive);
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const newCoupon: CouponWithStats = {
      id: this.nextId++,
      ...coupon,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalUsed: 0,
      totalDiscount: "0.00",
      isExpired: new Date() > new Date(coupon.validUntil),
      canUse: true
    };

    this.coupons.push(newCoupon);
    return newCoupon;
  }

  async updateCoupon(id: number, updates: Partial<InsertCoupon>): Promise<Coupon> {
    const coupon = this.coupons.find(c => c.id === id);
    if (!coupon) throw new Error("Coupon not found");

    Object.assign(coupon, updates, { updatedAt: new Date() });
    coupon.isExpired = new Date() > new Date(coupon.validUntil);
    
    return coupon;
  }

  async deleteCoupon(id: number): Promise<void> {
    const index = this.coupons.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Coupon not found");
    
    this.coupons.splice(index, 1);
  }

  async toggleCouponStatus(id: number): Promise<Coupon> {
    const coupon = this.coupons.find(c => c.id === id);
    if (!coupon) throw new Error("Coupon not found");

    coupon.isActive = !coupon.isActive;
    coupon.updatedAt = new Date();
    
    return coupon;
  }

  // Bulk operations
  async createBulkCoupons(template: InsertCoupon, count: number, prefix: string): Promise<BulkCouponOperation> {
    const operation: BulkCouponOperation = {
      id: this.nextId++,
      operationType: "create",
      totalCoupons: count,
      processedCoupons: 0,
      failedCoupons: 0,
      status: "processing",
      template,
      errors: null,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.bulkOperations.push(operation);

    // Simulate bulk creation
    for (let i = 1; i <= count; i++) {
      try {
        const couponCode = `${prefix}${String(i).padStart(4, '0')}`;
        await this.createCoupon({
          ...template,
          code: couponCode,
          title: `${template.title} #${i}`
        });
        operation.processedCoupons++;
      } catch (error) {
        operation.failedCoupons++;
      }
    }

    operation.status = operation.failedCoupons > 0 ? "completed" : "completed";
    operation.updatedAt = new Date();

    return operation;
  }

  // Coupon validation and calculation
  async validateCoupon(code: string, userId: number, bookingAmount: string, farmId?: number, categoryId?: number): Promise<{
    valid: boolean;
    coupon?: CouponWithStats;
    discountAmount?: string;
    error?: string;
  }> {
    const coupon = await this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, error: "Coupon not found or inactive" };
    }

    if (coupon.isExpired) {
      return { valid: false, error: "Coupon has expired" };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "Coupon usage limit reached" };
    }

    // Check user usage limit
    const userUsage = this.couponUsage.filter(u => u.couponId === coupon.id && u.userId === userId).length;
    if (coupon.userLimit && userUsage >= coupon.userLimit) {
      return { valid: false, error: "You have reached the usage limit for this coupon" };
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && parseFloat(bookingAmount) < parseFloat(coupon.minOrderAmount)) {
      return { valid: false, error: `Minimum order amount is ₹${coupon.minOrderAmount}` };
    }

    // Check applicable categories
    if (coupon.applicableCategories && categoryId) {
      const categories = Array.isArray(coupon.applicableCategories) ? coupon.applicableCategories : [];
      if (!categories.includes(categoryId)) {
        return { valid: false, error: "Coupon not applicable to this category" };
      }
    }

    // Check applicable farms
    if (coupon.applicableFarms && farmId) {
      const farms = Array.isArray(coupon.applicableFarms) ? coupon.applicableFarms : [];
      if (!farms.includes(farmId)) {
        return { valid: false, error: "Coupon not applicable to this farm" };
      }
    }

    // Calculate discount
    let discountAmount = 0;
    const amount = parseFloat(bookingAmount);

    if (coupon.type === "percentage") {
      discountAmount = (amount * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount && discountAmount > parseFloat(coupon.maxDiscount)) {
        discountAmount = parseFloat(coupon.maxDiscount);
      }
    } else if (coupon.type === "fixed") {
      discountAmount = parseFloat(coupon.value);
    }

    return {
      valid: true,
      coupon,
      discountAmount: discountAmount.toFixed(2)
    };
  }

  async calculateBookingTotal(bookingAmount: string, couponCode?: string, userId?: number, farmId?: number, categoryId?: number): Promise<BookingCalculation> {
    const subtotal = parseFloat(bookingAmount);
    let couponDiscount = 0;
    let appliedCoupon: any = undefined;

    if (couponCode && userId) {
      const validation = await this.validateCoupon(couponCode, userId, bookingAmount, farmId, categoryId);
      if (validation.valid && validation.discountAmount) {
        couponDiscount = parseFloat(validation.discountAmount);
        appliedCoupon = {
          code: couponCode,
          title: validation.coupon?.title || "",
          discountAmount: validation.discountAmount
        };
      }
    }

    const taxRate = 0.18; // 18% GST
    const afterDiscount = subtotal - couponDiscount;
    const taxes = afterDiscount * taxRate;
    const total = afterDiscount + taxes;

    return {
      subtotal: subtotal.toFixed(2),
      couponDiscount: couponDiscount.toFixed(2),
      taxes: taxes.toFixed(2),
      total: total.toFixed(2),
      appliedCoupon
    };
  }

  async applyCoupon(couponCode: string, userId: number, bookingId: number, discountAmount: string): Promise<CouponUsage> {
    const coupon = await this.getCouponByCode(couponCode);
    if (!coupon) throw new Error("Invalid coupon");

    const usage: CouponUsage = {
      id: this.nextId++,
      couponId: coupon.id,
      userId,
      bookingId,
      discountAmount,
      usedAt: new Date()
    };

    this.couponUsage.push(usage);
    
    // Update coupon usage count
    coupon.usedCount++;
    coupon.totalUsed++;
    coupon.totalDiscount = (parseFloat(coupon.totalDiscount) + parseFloat(discountAmount)).toFixed(2);

    return usage;
  }

  // Refund operations
  async getAllRefunds(status?: string): Promise<RefundWithDetails[]> {
    let filtered = this.refunds;
    if (status) {
      filtered = this.refunds.filter(r => r.status === status);
    }
    return filtered;
  }

  async getRefund(id: number): Promise<RefundWithDetails | undefined> {
    return this.refunds.find(r => r.id === id);
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const newRefund: RefundWithDetails = {
      id: this.nextId++,
      ...refund,
      createdAt: new Date(),
      updatedAt: new Date(),
      booking: {
        id: refund.bookingId,
        farmName: "Sample Farm",
        checkInDate: "2024-01-20",
        checkOutDate: "2024-01-21"
      },
      user: {
        id: refund.userId,
        name: "Sample User",
        email: "user@example.com"
      }
    };

    this.refunds.push(newRefund);
    return newRefund;
  }

  async updateRefundStatus(id: number, status: string, processedBy: number, notes?: string): Promise<Refund> {
    const refund = this.refunds.find(r => r.id === id);
    if (!refund) throw new Error("Refund not found");

    refund.status = status;
    refund.processedBy = processedBy;
    refund.processedAt = new Date();
    refund.updatedAt = new Date();
    if (notes) refund.notes = notes;

    return refund;
  }

  // Analytics
  async getCouponAnalytics(): Promise<{
    totalCoupons: number;
    activeCoupons: number;
    totalUsage: number;
    totalDiscount: string;
    topCoupons: CouponWithStats[];
  }> {
    const totalUsage = this.coupons.reduce((sum, c) => sum + c.totalUsed, 0);
    const totalDiscount = this.coupons.reduce((sum, c) => sum + parseFloat(c.totalDiscount), 0);
    const topCoupons = this.coupons
      .sort((a, b) => b.totalUsed - a.totalUsed)
      .slice(0, 5);

    return {
      totalCoupons: this.coupons.length,
      activeCoupons: this.coupons.filter(c => c.isActive).length,
      totalUsage,
      totalDiscount: totalDiscount.toFixed(2),
      topCoupons
    };
  }
}

export const couponService = new CouponService();