import {
  admins,
  categories,
  amenities,
  cities,
  areas,
  users,
  farms,
  bookings,
  transactions,
  requestedFarms,
  reviews,
  faqs,
  farmImages,
  type Admin,
  type InsertAdmin,
  type Category,
  type InsertCategory,
  type Amenity,
  type InsertAmenity,
  type City,
  type InsertCity,
  type Area,
  type InsertArea,
  type User,
  type InsertUser,
  type Farm,
  type InsertFarm,
  type Booking,
  type InsertBooking,
  type Transaction,
  type InsertTransaction,
  type RequestedFarm,
  type InsertRequestedFarm,
  type Review,
  type InsertReview,
  type FAQ,
  type InsertFAQ,
  type FarmWithDetails,
  type BookingWithDetails,
  type TransactionWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, gte, lte, like, or } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    totalUsers: number;
    totalOwners: number;
    activeFarms: number;
    bookedSlotsToday: number;
    totalRevenue: number;
    pendingFarmRequests: number;
  }>;

  // Users
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  toggleUserStatus(id: number): Promise<User>;

  // Farms
  getAllFarms(limit?: number, offset?: number): Promise<FarmWithDetails[]>;
  getFarm(id: number): Promise<FarmWithDetails | undefined>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  updateFarm(id: number, farm: Partial<InsertFarm>): Promise<Farm>;
  deleteFarm(id: number): Promise<void>;
  toggleFarmStatus(id: number): Promise<Farm>;

  // Bookings
  getAllBookings(limit?: number, offset?: number): Promise<BookingWithDetails[]>;
  getBooking(id: number): Promise<BookingWithDetails | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;
  getRecentBookings(limit?: number): Promise<BookingWithDetails[]>;

  // Transactions
  getAllTransactions(limit?: number, offset?: number): Promise<TransactionWithDetails[]>;
  getTransaction(id: number): Promise<TransactionWithDetails | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction>;

  // Requested Farms
  getAllRequestedFarms(limit?: number, offset?: number): Promise<RequestedFarm[]>;
  getRequestedFarm(id: number): Promise<RequestedFarm | undefined>;
  createRequestedFarm(requestedFarm: InsertRequestedFarm): Promise<RequestedFarm>;
  updateRequestedFarm(id: number, requestedFarm: Partial<InsertRequestedFarm>): Promise<RequestedFarm>;
  approveRequestedFarm(id: number): Promise<void>;
  rejectRequestedFarm(id: number): Promise<void>;

  // Reviews
  getAllReviews(limit?: number, offset?: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  toggleReviewVisibility(id: number): Promise<Review>;
  deleteReview(id: number): Promise<void>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Amenities
  getAllAmenities(): Promise<Amenity[]>;
  getAmenity(id: number): Promise<Amenity | undefined>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;
  updateAmenity(id: number, amenity: Partial<InsertAmenity>): Promise<Amenity>;
  deleteAmenity(id: number): Promise<void>;

  // Cities & Areas
  getAllCities(): Promise<City[]>;
  getCity(id: number): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: number, city: Partial<InsertCity>): Promise<City>;
  deleteCity(id: number): Promise<void>;

  getAllAreas(): Promise<Area[]>;
  getAreasByCity(cityId: number): Promise<Area[]>;
  getArea(id: number): Promise<Area | undefined>;
  createArea(area: InsertArea): Promise<Area>;
  updateArea(id: number, area: Partial<InsertArea>): Promise<Area>;
  deleteArea(id: number): Promise<void>;

  // FAQs
  getAllFAQs(): Promise<FAQ[]>;
  getFAQ(id: number): Promise<FAQ | undefined>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  updateFAQ(id: number, faq: Partial<InsertFAQ>): Promise<FAQ>;
  deleteFAQ(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [totalOwnersResult] = await db.select({ count: count() }).from(users).where(eq(users.isOwner, true));
    const [activeFarmsResult] = await db.select({ count: count() }).from(farms).where(eq(farms.isEnable, true));
    const [pendingFarmRequestsResult] = await db.select({ count: count() }).from(requestedFarms).where(eq(requestedFarms.status, 'pending'));
    
    const today = new Date().toISOString().split('T')[0];
    const [bookedSlotsTodayResult] = await db.select({ count: count() }).from(bookings)
      .where(and(eq(bookings.checkInDate, today), eq(bookings.status, 1)));

    const [totalRevenueResult] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` 
    }).from(transactions).where(eq(transactions.status, 'Complete'));

    return {
      totalUsers: totalUsersResult.count,
      totalOwners: totalOwnersResult.count,
      activeFarms: activeFarmsResult.count,
      bookedSlotsToday: bookedSlotsTodayResult.count,
      totalRevenue: totalRevenueResult.total || 0,
      pendingFarmRequests: pendingFarmRequestsResult.count,
    };
  }

  // Users
  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async toggleUserStatus(id: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error('User not found');
    
    const [updatedUser] = await db.update(users)
      .set({ isActive: !user.isActive })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Farms
  async getAllFarms(limit = 50, offset = 0): Promise<FarmWithDetails[]> {
    return db.select({
      id: farms.id,
      userId: farms.userId,
      categoryId: farms.categoryId,
      cityId: farms.cityId,
      areaId: farms.areaId,
      name: farms.name,
      description: farms.description,
      address: farms.address,
      latitude: farms.latitude,
      longitude: farms.longitude,
      pricePerSlot: farms.pricePerSlot,
      maxGuests: farms.maxGuests,
      isEnable: farms.isEnable,
      isBooking: farms.isBooking,
      policies: farms.policies,
      checkInTime: farms.checkInTime,
      checkOutTime: farms.checkOutTime,
      cleaningDuration: farms.cleaningDuration,
      createdAt: farms.createdAt,
      updatedAt: farms.updatedAt,
      deletedAt: farms.deletedAt,
      user: users,
      category: categories,
      city: cities,
      area: areas,
      images: sql<any[]>`array_agg(${farmImages})`,
    })
    .from(farms)
    .leftJoin(users, eq(farms.userId, users.id))
    .leftJoin(categories, eq(farms.categoryId, categories.id))
    .leftJoin(cities, eq(farms.cityId, cities.id))
    .leftJoin(areas, eq(farms.areaId, areas.id))
    .leftJoin(farmImages, eq(farms.id, farmImages.farmId))
    .groupBy(farms.id, users.id, categories.id, cities.id, areas.id)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(farms.createdAt)) as any;
  }

  async getFarm(id: number): Promise<FarmWithDetails | undefined> {
    const [farm] = await db.select({
      id: farms.id,
      userId: farms.userId,
      categoryId: farms.categoryId,
      cityId: farms.cityId,
      areaId: farms.areaId,
      name: farms.name,
      description: farms.description,
      address: farms.address,
      latitude: farms.latitude,
      longitude: farms.longitude,
      pricePerSlot: farms.pricePerSlot,
      maxGuests: farms.maxGuests,
      isEnable: farms.isEnable,
      isBooking: farms.isBooking,
      policies: farms.policies,
      checkInTime: farms.checkInTime,
      checkOutTime: farms.checkOutTime,
      cleaningDuration: farms.cleaningDuration,
      createdAt: farms.createdAt,
      updatedAt: farms.updatedAt,
      deletedAt: farms.deletedAt,
      user: users,
      category: categories,
      city: cities,
      area: areas,
      images: sql<any[]>`array_agg(${farmImages})`,
    })
    .from(farms)
    .leftJoin(users, eq(farms.userId, users.id))
    .leftJoin(categories, eq(farms.categoryId, categories.id))
    .leftJoin(cities, eq(farms.cityId, cities.id))
    .leftJoin(areas, eq(farms.areaId, areas.id))
    .leftJoin(farmImages, eq(farms.id, farmImages.farmId))
    .where(eq(farms.id, id))
    .groupBy(farms.id, users.id, categories.id, cities.id, areas.id) as any;
    
    return farm;
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const [newFarm] = await db.insert(farms).values(farm).returning();
    return newFarm;
  }

  async updateFarm(id: number, farmData: Partial<InsertFarm>): Promise<Farm> {
    const [updatedFarm] = await db.update(farms).set(farmData).where(eq(farms.id, id)).returning();
    return updatedFarm;
  }

  async deleteFarm(id: number): Promise<void> {
    await db.update(farms).set({ deletedAt: new Date() }).where(eq(farms.id, id));
  }

  async toggleFarmStatus(id: number): Promise<Farm> {
    const farm = await this.getFarm(id);
    if (!farm) throw new Error('Farm not found');
    
    const [updatedFarm] = await db.update(farms)
      .set({ isEnable: !farm.isEnable })
      .where(eq(farms.id, id))
      .returning();
    return updatedFarm;
  }

  // Bookings
  async getAllBookings(limit = 50, offset = 0): Promise<BookingWithDetails[]> {
    return db.select({
      id: bookings.id,
      userId: bookings.userId,
      farmId: bookings.farmId,
      transactionId: bookings.transactionId,
      checkInDate: bookings.checkInDate,
      checkInTime: bookings.checkInTime,
      checkOutDate: bookings.checkOutDate,
      checkOutTime: bookings.checkOutTime,
      slotType: bookings.slotType,
      numberOfSlots: bookings.numberOfSlots,
      noOfGuest: bookings.noOfGuest,
      totalPrice: bookings.totalPrice,
      ownerBooked: bookings.ownerBooked,
      confirmationCode: bookings.confirmationCode,
      description: bookings.description,
      status: bookings.status,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      deletedAt: bookings.deletedAt,
      user: users,
      farm: farms,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .leftJoin(farms, eq(bookings.farmId, farms.id))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(bookings.createdAt)) as any;
  }

  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const [booking] = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      farmId: bookings.farmId,
      transactionId: bookings.transactionId,
      checkInDate: bookings.checkInDate,
      checkInTime: bookings.checkInTime,
      checkOutDate: bookings.checkOutDate,
      checkOutTime: bookings.checkOutTime,
      slotType: bookings.slotType,
      numberOfSlots: bookings.numberOfSlots,
      noOfGuest: bookings.noOfGuest,
      totalPrice: bookings.totalPrice,
      ownerBooked: bookings.ownerBooked,
      confirmationCode: bookings.confirmationCode,
      description: bookings.description,
      status: bookings.status,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      deletedAt: bookings.deletedAt,
      user: users,
      farm: farms,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .leftJoin(farms, eq(bookings.farmId, farms.id))
    .where(eq(bookings.id, id)) as any;
    
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, bookingData: Partial<InsertBooking>): Promise<Booking> {
    const [updatedBooking] = await db.update(bookings).set(bookingData).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }

  async getRecentBookings(limit = 5): Promise<BookingWithDetails[]> {
    return this.getAllBookings(limit, 0);
  }

  // Transactions
  async getAllTransactions(limit = 50, offset = 0): Promise<TransactionWithDetails[]> {
    return db.select({
      id: transactions.id,
      userId: transactions.userId,
      farmId: transactions.farmId,
      orderId: transactions.orderId,
      amount: transactions.amount,
      paymentMethod: transactions.paymentMethod,
      transactionDetails: transactions.transactionDetails,
      status: transactions.status,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      user: users,
      farm: farms,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .leftJoin(farms, eq(transactions.farmId, farms.id))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(transactions.createdAt)) as any;
  }

  async getTransaction(id: number): Promise<TransactionWithDetails | undefined> {
    const [transaction] = await db.select({
      id: transactions.id,
      userId: transactions.userId,
      farmId: transactions.farmId,
      orderId: transactions.orderId,
      amount: transactions.amount,
      paymentMethod: transactions.paymentMethod,
      transactionDetails: transactions.transactionDetails,
      status: transactions.status,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      user: users,
      farm: farms,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .leftJoin(farms, eq(transactions.farmId, farms.id))
    .where(eq(transactions.id, id)) as any;
    
    return transaction;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    const [updatedTransaction] = await db.update(transactions).set(transactionData).where(eq(transactions.id, id)).returning();
    return updatedTransaction;
  }

  // Requested Farms
  async getAllRequestedFarms(limit = 50, offset = 0): Promise<RequestedFarm[]> {
    return db.select().from(requestedFarms).limit(limit).offset(offset).orderBy(desc(requestedFarms.createdAt));
  }

  async getRequestedFarm(id: number): Promise<RequestedFarm | undefined> {
    const [requestedFarm] = await db.select().from(requestedFarms).where(eq(requestedFarms.id, id));
    return requestedFarm;
  }

  async createRequestedFarm(requestedFarm: InsertRequestedFarm): Promise<RequestedFarm> {
    const [newRequestedFarm] = await db.insert(requestedFarms).values(requestedFarm).returning();
    return newRequestedFarm;
  }

  async updateRequestedFarm(id: number, requestedFarmData: Partial<InsertRequestedFarm>): Promise<RequestedFarm> {
    const [updatedRequestedFarm] = await db.update(requestedFarms).set(requestedFarmData).where(eq(requestedFarms.id, id)).returning();
    return updatedRequestedFarm;
  }

  async approveRequestedFarm(id: number): Promise<void> {
    await db.update(requestedFarms).set({ status: 'approved' }).where(eq(requestedFarms.id, id));
  }

  async rejectRequestedFarm(id: number): Promise<void> {
    await db.update(requestedFarms).set({ status: 'rejected' }).where(eq(requestedFarms.id, id));
  }

  // Reviews
  async getAllReviews(limit = 50, offset = 0): Promise<Review[]> {
    return db.select().from(reviews).limit(limit).offset(offset).orderBy(desc(reviews.createdAt));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async toggleReviewVisibility(id: number): Promise<Review> {
    const review = await this.getReview(id);
    if (!review) throw new Error('Review not found');
    
    const [updatedReview] = await db.update(reviews)
      .set({ isVisible: !review.isVisible })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).where(sql`${categories.deletedAt} IS NULL`).orderBy(categories.name);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db.update(categories).set(categoryData).where(eq(categories.id, id)).returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.update(categories).set({ deletedAt: new Date() }).where(eq(categories.id, id));
  }

  // Amenities
  async getAllAmenities(): Promise<Amenity[]> {
    return db.select().from(amenities).where(sql`${amenities.deletedAt} IS NULL`).orderBy(amenities.name);
  }

  async getAmenity(id: number): Promise<Amenity | undefined> {
    const [amenity] = await db.select().from(amenities).where(eq(amenities.id, id));
    return amenity;
  }

  async createAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const [newAmenity] = await db.insert(amenities).values(amenity).returning();
    return newAmenity;
  }

  async updateAmenity(id: number, amenityData: Partial<InsertAmenity>): Promise<Amenity> {
    const [updatedAmenity] = await db.update(amenities).set(amenityData).where(eq(amenities.id, id)).returning();
    return updatedAmenity;
  }

  async deleteAmenity(id: number): Promise<void> {
    await db.update(amenities).set({ deletedAt: new Date() }).where(eq(amenities.id, id));
  }

  // Cities & Areas
  async getAllCities(): Promise<City[]> {
    return db.select().from(cities).where(sql`${cities.deletedAt} IS NULL`).orderBy(cities.name);
  }

  async getCity(id: number): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city;
  }

  async createCity(city: InsertCity): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }

  async updateCity(id: number, cityData: Partial<InsertCity>): Promise<City> {
    const [updatedCity] = await db.update(cities).set(cityData).where(eq(cities.id, id)).returning();
    return updatedCity;
  }

  async deleteCity(id: number): Promise<void> {
    await db.update(cities).set({ deletedAt: new Date() }).where(eq(cities.id, id));
  }

  async getAllAreas(): Promise<Area[]> {
    return db.select().from(areas).where(sql`${areas.deletedAt} IS NULL`).orderBy(areas.name);
  }

  async getAreasByCity(cityId: number): Promise<Area[]> {
    return db.select().from(areas).where(and(eq(areas.cityId, cityId), sql`${areas.deletedAt} IS NULL`)).orderBy(areas.name);
  }

  async getArea(id: number): Promise<Area | undefined> {
    const [area] = await db.select().from(areas).where(eq(areas.id, id));
    return area;
  }

  async createArea(area: InsertArea): Promise<Area> {
    const [newArea] = await db.insert(areas).values(area).returning();
    return newArea;
  }

  async updateArea(id: number, areaData: Partial<InsertArea>): Promise<Area> {
    const [updatedArea] = await db.update(areas).set(areaData).where(eq(areas.id, id)).returning();
    return updatedArea;
  }

  async deleteArea(id: number): Promise<void> {
    await db.update(areas).set({ deletedAt: new Date() }).where(eq(areas.id, id));
  }

  // FAQs
  async getAllFAQs(): Promise<FAQ[]> {
    return db.select().from(faqs).where(sql`${faqs.deletedAt} IS NULL`).orderBy(desc(faqs.createdAt));
  }

  async getFAQ(id: number): Promise<FAQ | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const [newFAQ] = await db.insert(faqs).values(faq).returning();
    return newFAQ;
  }

  async updateFAQ(id: number, faqData: Partial<InsertFAQ>): Promise<FAQ> {
    const [updatedFAQ] = await db.update(faqs).set(faqData).where(eq(faqs.id, id)).returning();
    return updatedFAQ;
  }

  async deleteFAQ(id: number): Promise<void> {
    await db.update(faqs).set({ deletedAt: new Date() }).where(eq(faqs.id, id));
  }
}

export const storage = new DatabaseStorage();
