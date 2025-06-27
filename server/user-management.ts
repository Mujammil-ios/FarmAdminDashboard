export interface FirebaseUser {
  firebaseId: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'customer' | 'owner';
  isActive: boolean;
  profileImage?: string;
  joinDate: string;
  lastLoginDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

export interface CustomerProfile extends FirebaseUser {
  userType: 'customer';
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingBookings: number;
  totalSpent: number;
  favoriteLocations: string[];
  preferredAmenities: string[];
  loyaltyPoints: number;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  communicationPreferences: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
}

export interface OwnerProfile extends FirebaseUser {
  userType: 'owner';
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  gstNumber?: string;
  panNumber: string;
  aadhaarNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
    accountType: 'savings' | 'current';
  };
  commissionRate: number; // percentage
  totalEarnings: number;
  totalCommissionPaid: number;
  outstandingPayments: number;
  totalFarms: number;
  activeFarms: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  totalReviews: number;
  partnershipStartDate: string;
  contractStatus: 'active' | 'suspended' | 'terminated';
  kycStatus: 'verified' | 'pending' | 'rejected';
  documents: {
    panCard: string;
    aadhaarCard: string;
    gstCertificate?: string;
    bankPassbook: string;
    businessLicense?: string;
  };
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: {
    users: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      viewSensitive: boolean; // bank details, personal info
    };
    owners: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      managePayments: boolean;
      viewEarnings: boolean;
      manageContracts: boolean;
    };
    farms: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
    };
    bookings: {
      view: boolean;
      create: boolean;
      edit: boolean;
      cancel: boolean;
      refund: boolean;
    };
    payments: {
      view: boolean;
      process: boolean;
      refund: boolean;
      viewReports: boolean;
      exportData: boolean;
    };
    support: {
      viewTickets: boolean;
      respondToTickets: boolean;
      escalateTickets: boolean;
    };
    analytics: {
      viewDashboard: boolean;
      viewReports: boolean;
      exportReports: boolean;
    };
    system: {
      manageRoles: boolean;
      manageSettings: boolean;
      viewLogs: boolean;
    };
  };
  createdAt: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  department: string;
  isActive: boolean;
  lastLoginDate: string;
  createdAt: string;
  createdBy: string;
}

export interface BookingDetails {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  farmId: string;
  farmName: string;
  ownerId: string;
  ownerName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  slotType: 'morning' | 'evening' | 'full-day';
  numberOfSlots: number;
  numberOfGuests: number;
  totalAmount: number;
  ownerEarnings: number;
  commissionAmount: number;
  bookingStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially-refunded';
  bookingType: 'online' | 'offline' | 'walk-in';
  confirmationCode: string;
  specialRequests?: string;
  guestDetails: {
    adults: number;
    children: number;
    infants: number;
  };
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundDate?: string;
}

export interface PaymentTransaction {
  id: string;
  type: 'booking' | 'refund' | 'commission' | 'payout' | 'adjustment';
  bookingId?: string;
  customerId?: string;
  ownerId?: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash' | 'bank-transfer';
  gatewayTransactionId?: string;
  gatewayName?: string;
  description: string;
  reference: string;
  metadata: {
    farmName?: string;
    customerName?: string;
    ownerName?: string;
    bookingDates?: string;
  };
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  processedBy?: string; // admin user who processed
}

export interface OwnerPayout {
  id: string;
  ownerId: string;
  ownerName: string;
  period: {
    from: string;
    to: string;
  };
  totalEarnings: number;
  commissionDeducted: number;
  netPayout: number;
  bookingIds: string[];
  numberOfBookings: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'on-hold';
  payoutMethod: 'bank-transfer' | 'upi' | 'cheque';
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  transactionId?: string;
  processedAt?: string;
  processedBy: string; // admin user
  notes?: string;
  createdAt: string;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  activityType: 'booking_created' | 'booking_cancelled' | 'payment_made' | 'review_submitted' | 'profile_updated' | 'login' | 'logout';
  description: string;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface OwnerActivity {
  id: string;
  ownerId: string;
  activityType: 'farm_added' | 'farm_updated' | 'booking_confirmed' | 'payout_received' | 'document_uploaded' | 'profile_updated' | 'login' | 'logout';
  description: string;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userType: 'customer' | 'owner';
  userName: string;
  userEmail: string;
  userPhone: string;
  subject: string;
  description: string;
  category: 'booking' | 'payment' | 'technical' | 'complaint' | 'suggestion' | 'refund' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'pending-customer' | 'resolved' | 'closed';
  assignedTo?: string; // admin user id
  relatedBookingId?: string;
  attachments: string[];
  responses: {
    id: string;
    responderId: string;
    responderName: string;
    responderType: 'admin' | 'customer' | 'owner';
    message: string;
    timestamp: string;
    attachments: string[];
  }[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
}

export interface RevenueReport {
  period: {
    from: string;
    to: string;
  };
  totalRevenue: number;
  totalCommission: number;
  totalPayouts: number;
  netProfit: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  topPerformingFarms: {
    farmId: string;
    farmName: string;
    ownerId: string;
    ownerName: string;
    revenue: number;
    bookings: number;
  }[];
  topCustomers: {
    customerId: string;
    customerName: string;
    totalSpent: number;
    bookings: number;
  }[];
  paymentMethodBreakdown: {
    method: string;
    amount: number;
    percentage: number;
  }[];
  dailyRevenue: {
    date: string;
    revenue: number;
    bookings: number;
  }[];
}

export class UserManagementService {
  private customers: Map<string, CustomerProfile> = new Map();
  private owners: Map<string, OwnerProfile> = new Map();
  private adminRoles: Map<string, AdminRole> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();
  private bookings: Map<string, BookingDetails> = new Map();
  private payments: Map<string, PaymentTransaction> = new Map();
  private payouts: Map<string, OwnerPayout> = new Map();
  private customerActivities: Map<string, CustomerActivity[]> = new Map();
  private ownerActivities: Map<string, OwnerActivity[]> = new Map();
  private supportTickets: Map<string, SupportTicket> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize with comprehensive sample data
    this.createSampleRoles();
    this.createSampleAdminUsers();
    this.createSampleCustomers();
    this.createSampleOwners();
    this.createSampleBookings();
    this.createSamplePayments();
    this.createSamplePayouts();
    this.createSampleActivities();
    this.createSampleSupportTickets();
  }

  private createSampleRoles() {
    const superAdminRole: AdminRole = {
      id: 'role-super-admin',
      name: 'Super Administrator',
      permissions: {
        users: { view: true, create: true, edit: true, delete: true, viewSensitive: true },
        owners: { view: true, create: true, edit: true, delete: true, managePayments: true, viewEarnings: true, manageContracts: true },
        farms: { view: true, create: true, edit: true, delete: true, approve: true },
        bookings: { view: true, create: true, edit: true, cancel: true, refund: true },
        payments: { view: true, process: true, refund: true, viewReports: true, exportData: true },
        support: { viewTickets: true, respondToTickets: true, escalateTickets: true },
        analytics: { viewDashboard: true, viewReports: true, exportReports: true },
        system: { manageRoles: true, manageSettings: true, viewLogs: true }
      },
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true
    };

    const customerSupportRole: AdminRole = {
      id: 'role-customer-support',
      name: 'Customer Support',
      permissions: {
        users: { view: true, create: false, edit: true, delete: false, viewSensitive: false },
        owners: { view: true, create: false, edit: false, delete: false, managePayments: false, viewEarnings: true, manageContracts: false },
        farms: { view: true, create: false, edit: false, delete: false, approve: false },
        bookings: { view: true, create: true, edit: true, cancel: true, refund: false },
        payments: { view: true, process: false, refund: false, viewReports: false, exportData: false },
        support: { viewTickets: true, respondToTickets: true, escalateTickets: true },
        analytics: { viewDashboard: true, viewReports: false, exportReports: false },
        system: { manageRoles: false, manageSettings: false, viewLogs: false }
      },
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true
    };

    const financeRole: AdminRole = {
      id: 'role-finance',
      name: 'Finance Manager',
      permissions: {
        users: { view: true, create: false, edit: false, delete: false, viewSensitive: true },
        owners: { view: true, create: false, edit: false, delete: false, managePayments: true, viewEarnings: true, manageContracts: false },
        farms: { view: true, create: false, edit: false, delete: false, approve: false },
        bookings: { view: true, create: false, edit: false, cancel: false, refund: true },
        payments: { view: true, process: true, refund: true, viewReports: true, exportData: true },
        support: { viewTickets: false, respondToTickets: false, escalateTickets: false },
        analytics: { viewDashboard: true, viewReports: true, exportReports: true },
        system: { manageRoles: false, manageSettings: false, viewLogs: false }
      },
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true
    };

    this.adminRoles.set(superAdminRole.id, superAdminRole);
    this.adminRoles.set(customerSupportRole.id, customerSupportRole);
    this.adminRoles.set(financeRole.id, financeRole);
  }

  private createSampleAdminUsers() {
    const adminUsers: AdminUser[] = [
      {
        id: 'admin-001',
        name: 'John Smith',
        email: 'john@bookmyfarm.com',
        roleId: 'role-super-admin',
        department: 'Technology',
        isActive: true,
        lastLoginDate: '2024-06-26T14:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'system'
      },
      {
        id: 'admin-002',
        name: 'Sarah Johnson',
        email: 'sarah@bookmyfarm.com',
        roleId: 'role-customer-support',
        department: 'Customer Support',
        isActive: true,
        lastLoginDate: '2024-06-26T16:15:00Z',
        createdAt: '2024-01-15T00:00:00Z',
        createdBy: 'admin-001'
      },
      {
        id: 'admin-003',
        name: 'Michael Chen',
        email: 'michael@bookmyfarm.com',
        roleId: 'role-finance',
        department: 'Finance',
        isActive: true,
        lastLoginDate: '2024-06-26T10:45:00Z',
        createdAt: '2024-02-01T00:00:00Z',
        createdBy: 'admin-001'
      }
    ];

    adminUsers.forEach(admin => this.adminUsers.set(admin.id, admin));
  }

  private createSampleCustomers() {
    const customers: CustomerProfile[] = [
      {
        firebaseId: 'firebase-customer-001',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phoneNumber: '+919876543210',
        userType: 'customer',
        isActive: true,
        joinDate: '2024-01-15T00:00:00Z',
        lastLoginDate: '2024-06-25T18:30:00Z',
        verificationStatus: 'verified',
        totalBookings: 12,
        completedBookings: 10,
        cancelledBookings: 2,
        upcomingBookings: 1,
        totalSpent: 45600,
        favoriteLocations: ['Mumbai', 'Pune', 'Surat'],
        preferredAmenities: ['WiFi', 'Swimming Pool', 'Parking'],
        loyaltyPoints: 1200,
        membershipLevel: 'gold',
        emergencyContact: {
          name: 'Priya Kumar',
          phone: '+919876543211',
          relation: 'Spouse'
        },
        communicationPreferences: {
          sms: true,
          email: true,
          whatsapp: true
        }
      },
      {
        firebaseId: 'firebase-customer-002',
        name: 'Anita Sharma',
        email: 'anita@example.com',
        phoneNumber: '+919876543212',
        userType: 'customer',
        isActive: true,
        joinDate: '2024-02-20T00:00:00Z',
        lastLoginDate: '2024-06-26T12:15:00Z',
        verificationStatus: 'verified',
        totalBookings: 8,
        completedBookings: 7,
        cancelledBookings: 1,
        upcomingBookings: 2,
        totalSpent: 32400,
        favoriteLocations: ['Delhi', 'Gurgaon'],
        preferredAmenities: ['AC', 'Garden', 'Kitchen'],
        loyaltyPoints: 850,
        membershipLevel: 'silver',
        emergencyContact: {
          name: 'Amit Sharma',
          phone: '+919876543213',
          relation: 'Husband'
        },
        communicationPreferences: {
          sms: true,
          email: false,
          whatsapp: true
        }
      }
    ];

    customers.forEach(customer => this.customers.set(customer.firebaseId, customer));
  }

  private createSampleOwners() {
    const owners: OwnerProfile[] = [
      {
        firebaseId: 'firebase-owner-001',
        name: 'Vikram Patel',
        email: 'vikram@example.com',
        phoneNumber: '+919725005196',
        userType: 'owner',
        isActive: true,
        joinDate: '2023-12-01T00:00:00Z',
        lastLoginDate: '2024-06-26T09:30:00Z',
        verificationStatus: 'verified',
        businessName: 'Green Valley Farms',
        businessType: 'individual',
        panNumber: 'ABCDE1234F',
        aadhaarNumber: '1234-5678-9012',
        businessAddress: {
          street: '123 Farm Road',
          city: 'Surat',
          state: 'Gujarat',
          pincode: '395007'
        },
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          accountHolderName: 'Vikram Patel',
          accountType: 'savings'
        },
        commissionRate: 15,
        totalEarnings: 185000,
        totalCommissionPaid: 27750,
        outstandingPayments: 15600,
        totalFarms: 2,
        activeFarms: 2,
        totalBookings: 45,
        completedBookings: 38,
        cancelledBookings: 7,
        averageRating: 4.6,
        totalReviews: 32,
        partnershipStartDate: '2023-12-01T00:00:00Z',
        contractStatus: 'active',
        kycStatus: 'verified',
        documents: {
          panCard: 'doc_pan_001.pdf',
          aadhaarCard: 'doc_aadhaar_001.pdf',
          bankPassbook: 'doc_bank_001.pdf'
        }
      },
      {
        firebaseId: 'firebase-owner-002',
        name: 'Meera Shah',
        email: 'meera@example.com',
        phoneNumber: '+916353760057',
        userType: 'owner',
        isActive: true,
        joinDate: '2024-01-10T00:00:00Z',
        lastLoginDate: '2024-06-25T20:45:00Z',
        verificationStatus: 'verified',
        businessName: 'Moonlight Resort',
        businessType: 'company',
        gstNumber: '24ABCDE1234F1Z5',
        panNumber: 'ABCDE5678G',
        aadhaarNumber: '9876-5432-1098',
        businessAddress: {
          street: '456 Resort Lane',
          city: 'Udaipur',
          state: 'Rajasthan',
          pincode: '313001'
        },
        bankDetails: {
          accountNumber: '9876543210',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          accountHolderName: 'Moonlight Resort Pvt Ltd',
          accountType: 'current'
        },
        commissionRate: 12,
        totalEarnings: 95000,
        totalCommissionPaid: 11400,
        outstandingPayments: 8200,
        totalFarms: 1,
        activeFarms: 1,
        totalBookings: 28,
        completedBookings: 24,
        cancelledBookings: 4,
        averageRating: 4.8,
        totalReviews: 21,
        partnershipStartDate: '2024-01-10T00:00:00Z',
        contractStatus: 'active',
        kycStatus: 'verified',
        documents: {
          panCard: 'doc_pan_002.pdf',
          aadhaarCard: 'doc_aadhaar_002.pdf',
          gstCertificate: 'doc_gst_002.pdf',
          bankPassbook: 'doc_bank_002.pdf',
          businessLicense: 'doc_license_002.pdf'
        }
      }
    ];

    owners.forEach(owner => this.owners.set(owner.firebaseId, owner));
  }

  private createSampleBookings() {
    const bookings: BookingDetails[] = [
      {
        id: 'booking-001',
        customerId: 'firebase-customer-001',
        customerName: 'Rajesh Kumar',
        customerPhone: '+919876543210',
        farmId: 'farm-001',
        farmName: 'Green Valley Organic Farm',
        ownerId: 'firebase-owner-001',
        ownerName: 'Vikram Patel',
        checkInDate: '2024-06-28',
        checkOutDate: '2024-06-29',
        checkInTime: '11:00',
        checkOutTime: '10:00',
        slotType: 'full-day',
        numberOfSlots: 2,
        numberOfGuests: 6,
        totalAmount: 5400,
        ownerEarnings: 4590,
        commissionAmount: 810,
        bookingStatus: 'upcoming',
        paymentStatus: 'paid',
        bookingType: 'online',
        confirmationCode: 'BMF001234',
        specialRequests: 'Need barbecue setup',
        guestDetails: {
          adults: 4,
          children: 2,
          infants: 0
        },
        createdAt: '2024-06-20T10:30:00Z',
        updatedAt: '2024-06-20T10:30:00Z'
      },
      {
        id: 'booking-002',
        customerId: 'firebase-customer-002',
        customerName: 'Anita Sharma',
        customerPhone: '+919876543212',
        farmId: 'farm-002',
        farmName: 'Moonlight Nest',
        ownerId: 'firebase-owner-002',
        ownerName: 'Meera Shah',
        checkInDate: '2024-06-15',
        checkOutDate: '2024-06-16',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        slotType: 'evening',
        numberOfSlots: 1,
        numberOfGuests: 4,
        totalAmount: 2500,
        ownerEarnings: 2200,
        commissionAmount: 300,
        bookingStatus: 'completed',
        paymentStatus: 'paid',
        bookingType: 'online',
        confirmationCode: 'BMF001235',
        guestDetails: {
          adults: 2,
          children: 2,
          infants: 0
        },
        createdAt: '2024-06-10T15:45:00Z',
        updatedAt: '2024-06-16T12:00:00Z'
      }
    ];

    bookings.forEach(booking => this.bookings.set(booking.id, booking));
  }

  private createSamplePayments() {
    const payments: PaymentTransaction[] = [
      {
        id: 'payment-001',
        type: 'booking',
        bookingId: 'booking-001',
        customerId: 'firebase-customer-001',
        amount: 5400,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'upi',
        gatewayTransactionId: 'razorpay_12345',
        gatewayName: 'Razorpay',
        description: 'Booking payment for Green Valley Organic Farm',
        reference: 'BMF001234',
        metadata: {
          farmName: 'Green Valley Organic Farm',
          customerName: 'Rajesh Kumar',
          ownerName: 'Vikram Patel',
          bookingDates: '2024-06-28 to 2024-06-29'
        },
        createdAt: '2024-06-20T10:30:00Z',
        completedAt: '2024-06-20T10:31:00Z'
      },
      {
        id: 'payment-002',
        type: 'booking',
        bookingId: 'booking-002',
        customerId: 'firebase-customer-002',
        amount: 2500,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'card',
        gatewayTransactionId: 'razorpay_67890',
        gatewayName: 'Razorpay',
        description: 'Booking payment for Moonlight Nest',
        reference: 'BMF001235',
        metadata: {
          farmName: 'Moonlight Nest',
          customerName: 'Anita Sharma',
          ownerName: 'Meera Shah',
          bookingDates: '2024-06-15 to 2024-06-16'
        },
        createdAt: '2024-06-10T15:45:00Z',
        completedAt: '2024-06-10T15:46:00Z'
      }
    ];

    payments.forEach(payment => this.payments.set(payment.id, payment));
  }

  private createSamplePayouts() {
    const payouts: OwnerPayout[] = [
      {
        id: 'payout-001',
        ownerId: 'firebase-owner-001',
        ownerName: 'Vikram Patel',
        period: {
          from: '2024-06-01',
          to: '2024-06-15'
        },
        totalEarnings: 12400,
        commissionDeducted: 1860,
        netPayout: 10540,
        bookingIds: ['booking-003', 'booking-004', 'booking-005'],
        numberOfBookings: 3,
        status: 'completed',
        payoutMethod: 'bank-transfer',
        bankDetails: {
          accountNumber: '****7890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        },
        transactionId: 'TXN123456789',
        processedAt: '2024-06-16T14:30:00Z',
        processedBy: 'admin-003',
        notes: 'Regular monthly payout',
        createdAt: '2024-06-15T18:00:00Z'
      }
    ];

    payouts.forEach(payout => this.payouts.set(payout.id, payout));
  }

  private createSampleActivities() {
    // Customer activities
    const customerActivities: CustomerActivity[] = [
      {
        id: 'activity-001',
        customerId: 'firebase-customer-001',
        activityType: 'booking_created',
        description: 'Created booking for Green Valley Organic Farm',
        metadata: { bookingId: 'booking-001', farmName: 'Green Valley Organic Farm' },
        timestamp: '2024-06-20T10:30:00Z',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'activity-002',
        customerId: 'firebase-customer-001',
        activityType: 'payment_made',
        description: 'Payment completed for booking BMF001234',
        metadata: { amount: 5400, paymentMethod: 'upi' },
        timestamp: '2024-06-20T10:31:00Z',
        ipAddress: '192.168.1.100'
      }
    ];

    this.customerActivities.set('firebase-customer-001', customerActivities);

    // Owner activities
    const ownerActivities: OwnerActivity[] = [
      {
        id: 'activity-003',
        ownerId: 'firebase-owner-001',
        activityType: 'payout_received',
        description: 'Received payout of ₹10,540',
        metadata: { payoutId: 'payout-001', amount: 10540 },
        timestamp: '2024-06-16T14:30:00Z',
        ipAddress: '192.168.1.200'
      }
    ];

    this.ownerActivities.set('firebase-owner-001', ownerActivities);
  }

  private createSampleSupportTickets() {
    const tickets: SupportTicket[] = [
      {
        id: 'ticket-001',
        userId: 'firebase-customer-001',
        userType: 'customer',
        userName: 'Rajesh Kumar',
        userEmail: 'rajesh@example.com',
        userPhone: '+919876543210',
        subject: 'Refund request for cancelled booking',
        description: 'I had to cancel my booking due to emergency. Please process refund.',
        category: 'refund',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: 'admin-002',
        relatedBookingId: 'booking-006',
        attachments: [],
        responses: [
          {
            id: 'response-001',
            responderId: 'admin-002',
            responderName: 'Sarah Johnson',
            responderType: 'admin',
            message: 'We understand your situation. Processing your refund request now.',
            timestamp: '2024-06-25T14:30:00Z',
            attachments: []
          }
        ],
        createdAt: '2024-06-25T10:15:00Z',
        updatedAt: '2024-06-25T14:30:00Z',
        tags: ['refund', 'urgent']
      }
    ];

    tickets.forEach(ticket => this.supportTickets.set(ticket.id, ticket));
  }

  // User lookup methods
  getUserByFirebaseId(firebaseId: string): CustomerProfile | OwnerProfile | null {
    return this.customers.get(firebaseId) || this.owners.get(firebaseId) || null;
  }

  getUserByPhone(phoneNumber: string): CustomerProfile | OwnerProfile | null {
    const customers = Array.from(this.customers.values());
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].phoneNumber === phoneNumber) return customers[i];
    }
    
    const owners = Array.from(this.owners.values());
    for (let i = 0; i < owners.length; i++) {
      if (owners[i].phoneNumber === phoneNumber) return owners[i];
    }
    
    return null;
  }

  // Customer methods
  getAllCustomers(): CustomerProfile[] {
    return Array.from(this.customers.values());
  }

  getCustomerById(firebaseId: string): CustomerProfile | null {
    return this.customers.get(firebaseId) || null;
  }

  getCustomerBookings(customerId: string): BookingDetails[] {
    return Array.from(this.bookings.values()).filter(b => b.customerId === customerId);
  }

  getCustomerActivities(customerId: string): CustomerActivity[] {
    return this.customerActivities.get(customerId) || [];
  }

  // Owner methods
  getAllOwners(): OwnerProfile[] {
    return Array.from(this.owners.values());
  }

  getOwnerById(firebaseId: string): OwnerProfile | null {
    return this.owners.get(firebaseId) || null;
  }

  getOwnerBookings(ownerId: string): BookingDetails[] {
    return Array.from(this.bookings.values()).filter(b => b.ownerId === ownerId);
  }

  getOwnerPayouts(ownerId: string): OwnerPayout[] {
    return Array.from(this.payouts.values()).filter(p => p.ownerId === ownerId);
  }

  getOwnerActivities(ownerId: string): OwnerActivity[] {
    return this.ownerActivities.get(ownerId) || [];
  }

  // Admin and role methods
  getAllAdminRoles(): AdminRole[] {
    return Array.from(this.adminRoles.values());
  }

  getAllAdminUsers(): AdminUser[] {
    return Array.from(this.adminUsers.values());
  }

  getAdminUserById(id: string): AdminUser | null {
    return this.adminUsers.get(id) || null;
  }

  // Payment methods
  getAllPayments(): PaymentTransaction[] {
    return Array.from(this.payments.values());
  }

  getPaymentsByCustomer(customerId: string): PaymentTransaction[] {
    return Array.from(this.payments.values()).filter(p => p.customerId === customerId);
  }

  getPaymentsByOwner(ownerId: string): PaymentTransaction[] {
    return Array.from(this.payments.values()).filter(p => p.ownerId === ownerId);
  }

  // Support methods
  getAllSupportTickets(): SupportTicket[] {
    return Array.from(this.supportTickets.values());
  }

  getSupportTicketsByUser(userId: string): SupportTicket[] {
    return Array.from(this.supportTickets.values()).filter(t => t.userId === userId);
  }

  // Revenue methods
  generateRevenueReport(fromDate: string, toDate: string): RevenueReport {
    const periodBookings = Array.from(this.bookings.values()).filter(b => 
      b.createdAt >= fromDate && b.createdAt <= toDate
    );
    
    const totalRevenue = periodBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = periodBookings.reduce((sum, b) => sum + b.commissionAmount, 0);
    const completedBookings = periodBookings.filter(b => b.bookingStatus === 'completed').length;
    
    return {
      period: { from: fromDate, to: toDate },
      totalRevenue,
      totalCommission,
      totalPayouts: 0, // Calculate from payouts in period
      netProfit: totalCommission,
      totalBookings: periodBookings.length,
      completedBookings,
      cancelledBookings: periodBookings.filter(b => b.bookingStatus === 'cancelled').length,
      averageBookingValue: totalRevenue / periodBookings.length || 0,
      topPerformingFarms: [],
      topCustomers: [],
      paymentMethodBreakdown: [],
      dailyRevenue: []
    };
  }
}

export const userManagementService = new UserManagementService();