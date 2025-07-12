import { 
  Wallet, 
  InsertWallet, 
  WalletTransaction, 
  InsertWalletTransaction, 
  RewardsCampaign, 
  InsertRewardsCampaign,
  RewardsConfig,
  InsertRewardsConfig,
  ApiDoc,
  InsertApiDoc,
  AuditLog,
  InsertAuditLog,
  WalletWithUser,
  WalletTransactionWithDetails,
  RewardsCampaignWithStats
} from "../shared/rewards-schema.js";

export class RewardsService {
  private wallets: WalletWithUser[] = [];
  private walletTransactions: WalletTransactionWithDetails[] = [];
  private rewardsCampaigns: RewardsCampaignWithStats[] = [];
  private rewardsConfig: RewardsConfig[] = [];
  private apiDocs: ApiDoc[] = [];
  private auditLogs: AuditLog[] = [];
  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize default rewards configuration
    this.rewardsConfig = [
      {
        id: 1,
        key: "welcome_points",
        value: { amount: 100, description: "Points awarded on signup" },
        description: "Welcome bonus for new users",
        updatedBy: 1,
        updatedAt: new Date(),
      },
      {
        id: 2,
        key: "booking_reward_rate",
        value: { rate: 0.05, description: "5% cashback on bookings" },
        description: "Reward rate for successful bookings",
        updatedBy: 1,
        updatedAt: new Date(),
      },
      {
        id: 3,
        key: "referral_bonus",
        value: { referrer: 50, referee: 25, description: "Referral reward structure" },
        description: "Points for successful referrals",
        updatedBy: 1,
        updatedAt: new Date(),
      },
      {
        id: 4,
        key: "cancellation_policy",
        value: { 
          full_refund_hours: 24, 
          partial_refund_hours: 12,
          partial_rate: 0.5,
          description: "Cancellation and refund policy"
        },
        description: "Cancellation and refund rules",
        updatedBy: 1,
        updatedAt: new Date(),
      }
    ];

    // Initialize sample wallets
    this.wallets = [
      {
        id: 1,
        userId: 1,
        userType: "customer",
        balance: "150.75",
        totalEarned: "500.00",
        totalSpent: "349.25",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: "John Smith",
          email: "john@example.com",
          role: "customer"
        }
      },
      {
        id: 2,
        userId: 2,
        userType: "customer",
        balance: "75.50",
        totalEarned: "200.00",
        totalSpent: "124.50",
        isActive: true,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date(),
        user: {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "customer"
        }
      },
      {
        id: 3,
        userId: 5,
        userType: "owner",
        balance: "1250.00",
        totalEarned: "2500.00",
        totalSpent: "1250.00",
        isActive: true,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date(),
        user: {
          id: 5,
          name: "Green Valley Farm",
          email: "owner@greenvalley.com",
          role: "owner"
        }
      }
    ];

    // Initialize sample campaigns
    this.rewardsCampaigns = [
      {
        id: 1,
        name: "Summer Booking Bonus",
        description: "Extra 10% cashback on summer bookings",
        type: "booking",
        status: "active",
        rules: {
          season: "summer",
          min_booking_amount: 100,
          bonus_rate: 0.10,
          max_bonus: 50
        },
        rewardAmount: "50.00",
        maxRewards: 1000,
        usedRewards: 245,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-31"),
        createdBy: 1,
        createdAt: new Date("2024-05-15"),
        updatedAt: new Date(),
        creator: {
          id: 1,
          name: "Admin User",
          email: "admin@bookmyfarm.com"
        },
        totalEarned: "12250.00",
        activeUsers: 245
      },
      {
        id: 2,
        name: "Referral Boost",
        description: "Double referral rewards for new customers",
        type: "referral",
        status: "active",
        rules: {
          referrer_bonus: 100,
          referee_bonus: 50,
          max_referrals: 10
        },
        rewardAmount: "100.00",
        maxRewards: 500,
        usedRewards: 89,
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-12-31"),
        createdBy: 1,
        createdAt: new Date("2024-06-20"),
        updatedAt: new Date(),
        creator: {
          id: 1,
          name: "Admin User",
          email: "admin@bookmyfarm.com"
        },
        totalEarned: "8900.00",
        activeUsers: 89
      }
    ];

    // Initialize sample transactions
    this.walletTransactions = [
      {
        id: 1,
        walletId: 1,
        type: "earn",
        amount: "100.00",
        source: "campaign",
        sourceId: 1,
        description: "Welcome bonus",
        metadata: { campaign: "signup_bonus" },
        adminId: null,
        createdAt: new Date("2024-01-15"),
        wallet: this.wallets[0],
      },
      {
        id: 2,
        walletId: 1,
        type: "earn",
        amount: "25.00",
        source: "booking",
        sourceId: 101,
        description: "Booking cashback",
        metadata: { booking_amount: 500, rate: 0.05 },
        adminId: null,
        createdAt: new Date("2024-01-20"),
        wallet: this.wallets[0],
      },
      {
        id: 3,
        walletId: 1,
        type: "spend",
        amount: "50.00",
        source: "booking",
        sourceId: 102,
        description: "Applied to booking payment",
        metadata: { booking_id: 102 },
        adminId: null,
        createdAt: new Date("2024-01-25"),
        wallet: this.wallets[0],
      }
    ];

    // Initialize API documentation
    this.apiDocs = [
      {
        id: 1,
        filename: "rewards-api.md",
        title: "Rewards & Wallet API",
        content: `# Rewards & Wallet API

## Overview
The Rewards & Wallet API allows you to manage user wallets, process transactions, and handle rewards campaigns.

## Authentication
All API endpoints require admin authentication via bearer token.

## Endpoints

### GET /api/rewards/wallets
Retrieve all user wallets with pagination.

**Parameters:**
- \`limit\` (integer): Number of results per page (default: 50)
- \`offset\` (integer): Number of results to skip (default: 0)
- \`userType\` (string): Filter by user type ('customer' | 'owner')

**Response:**
\`\`\`json
{
  "wallets": [
    {
      "id": 1,
      "userId": 1,
      "userType": "customer",
      "balance": "150.75",
      "totalEarned": "500.00",
      "totalSpent": "349.25",
      "user": {
        "id": 1,
        "name": "John Smith",
        "email": "john@example.com"
      }
    }
  ],
  "total": 150
}
\`\`\`

### POST /api/rewards/wallets/{id}/adjust
Manually adjust a wallet balance.

**Body:**
\`\`\`json
{
  "amount": "25.00",
  "type": "earn|spend",
  "description": "Manual adjustment reason"
}
\`\`\``,
        category: "rewards",
        version: "1.0",
        isPublic: false,
        lastEditedBy: 1,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
      {
        id: 2,
        filename: "campaigns-api.md",
        title: "Campaigns API",
        content: `# Campaigns API

## Overview
Manage rewards campaigns and track their performance.

## Endpoints

### GET /api/rewards/campaigns
Retrieve all campaigns with stats.

### POST /api/rewards/campaigns
Create a new rewards campaign.

### PUT /api/rewards/campaigns/{id}
Update an existing campaign.

### DELETE /api/rewards/campaigns/{id}
Delete a campaign (only if no rewards issued).`,
        category: "rewards",
        version: "1.0",
        isPublic: false,
        lastEditedBy: 1,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      }
    ];

    this.nextId = 1000;
  }

  // Wallet operations
  async getAllWallets(limit = 50, offset = 0, userType?: string): Promise<{ wallets: WalletWithUser[], total: number }> {
    let filtered = this.wallets;
    if (userType) {
      filtered = this.wallets.filter(w => w.userType === userType);
    }
    return {
      wallets: filtered.slice(offset, offset + limit),
      total: filtered.length
    };
  }

  async getWallet(id: number): Promise<WalletWithUser | undefined> {
    return this.wallets.find(w => w.id === id);
  }

  async adjustWallet(id: number, amount: string, type: "earn" | "spend", description: string, adminId: number): Promise<WalletTransaction> {
    const wallet = this.wallets.find(w => w.id === id);
    if (!wallet) throw new Error("Wallet not found");

    const transaction: WalletTransactionWithDetails = {
      id: this.nextId++,
      walletId: id,
      type,
      amount,
      source: "manual",
      sourceId: null,
      description,
      metadata: { admin_adjustment: true },
      adminId,
      createdAt: new Date(),
      wallet,
      admin: {
        id: adminId,
        name: "Admin User",
        email: "admin@bookmyfarm.com"
      }
    };

    this.walletTransactions.push(transaction);

    // Update wallet balance
    const currentBalance = parseFloat(wallet.balance);
    const adjustAmount = parseFloat(amount);
    
    if (type === "earn") {
      wallet.balance = (currentBalance + adjustAmount).toFixed(2);
      wallet.totalEarned = (parseFloat(wallet.totalEarned) + adjustAmount).toFixed(2);
    } else {
      wallet.balance = (currentBalance - adjustAmount).toFixed(2);
      wallet.totalSpent = (parseFloat(wallet.totalSpent) + adjustAmount).toFixed(2);
    }
    
    wallet.updatedAt = new Date();

    return transaction;
  }

  async getWalletTransactions(walletId: number, limit = 50, offset = 0): Promise<WalletTransactionWithDetails[]> {
    return this.walletTransactions
      .filter(t => t.walletId === walletId)
      .slice(offset, offset + limit);
  }

  // Campaign operations
  async getAllCampaigns(): Promise<RewardsCampaignWithStats[]> {
    return this.rewardsCampaigns;
  }

  async getCampaign(id: number): Promise<RewardsCampaignWithStats | undefined> {
    return this.rewardsCampaigns.find(c => c.id === id);
  }

  async createCampaign(campaign: InsertRewardsCampaign): Promise<RewardsCampaign> {
    const newCampaign: RewardsCampaignWithStats = {
      id: this.nextId++,
      ...campaign,
      usedRewards: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      creator: {
        id: campaign.createdBy,
        name: "Admin User",
        email: "admin@bookmyfarm.com"
      },
      totalEarned: "0.00",
      activeUsers: 0
    };

    this.rewardsCampaigns.push(newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<InsertRewardsCampaign>): Promise<RewardsCampaign> {
    const campaign = this.rewardsCampaigns.find(c => c.id === id);
    if (!campaign) throw new Error("Campaign not found");

    Object.assign(campaign, updates, { updatedAt: new Date() });
    return campaign;
  }

  // Configuration operations
  async getAllConfig(): Promise<RewardsConfig[]> {
    return this.rewardsConfig;
  }

  async updateConfig(key: string, value: any, updatedBy: number): Promise<RewardsConfig> {
    const config = this.rewardsConfig.find(c => c.key === key);
    if (!config) throw new Error("Config not found");

    config.value = value;
    config.updatedBy = updatedBy;
    config.updatedAt = new Date();
    
    return config;
  }

  // API Documentation operations
  async getAllApiDocs(): Promise<ApiDoc[]> {
    return this.apiDocs;
  }

  async getApiDoc(id: number): Promise<ApiDoc | undefined> {
    return this.apiDocs.find(doc => doc.id === id);
  }

  async createApiDoc(doc: InsertApiDoc): Promise<ApiDoc> {
    const newDoc: ApiDoc = {
      id: this.nextId++,
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.apiDocs.push(newDoc);
    return newDoc;
  }

  async updateApiDoc(id: number, updates: Partial<InsertApiDoc>): Promise<ApiDoc> {
    const doc = this.apiDocs.find(d => d.id === id);
    if (!doc) throw new Error("API doc not found");

    Object.assign(doc, updates, { updatedAt: new Date() });
    return doc;
  }

  // Analytics
  async getDashboardMetrics(): Promise<{
    totalWallets: number;
    totalBalance: string;
    activeCampaigns: number;
    pointsIssuedToday: string;
    topSpenders: WalletWithUser[];
  }> {
    const totalBalance = this.wallets.reduce((sum, w) => sum + parseFloat(w.balance), 0);
    const activeCampaigns = this.rewardsCampaigns.filter(c => c.status === "active").length;
    
    // Mock points issued today
    const pointsIssuedToday = "1250.00";
    
    const topSpenders = this.wallets
      .sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent))
      .slice(0, 5);

    return {
      totalWallets: this.wallets.length,
      totalBalance: totalBalance.toFixed(2),
      activeCampaigns,
      pointsIssuedToday,
      topSpenders
    };
  }
}

export const rewardsService = new RewardsService();