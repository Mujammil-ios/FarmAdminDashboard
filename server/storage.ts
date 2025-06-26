import {
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
  type SubProperty,
  type InsertSubProperty,
  type Banner,
  type InsertBanner,
  type FeaturedSection,
  type InsertFeaturedSection,
  type FeaturedSectionFarm,
  type InsertFeaturedSectionFarm,
  type Reel,
  type InsertReel,
  type FarmWithDetails,
  type BookingWithDetails,
  type TransactionWithDetails,
} from "@shared/schema";

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

  // Sub-Properties
  getAllSubProperties(farmId?: number): Promise<SubProperty[]>;
  getSubProperty(id: number): Promise<SubProperty | undefined>;
  createSubProperty(subProperty: InsertSubProperty): Promise<SubProperty>;
  updateSubProperty(id: number, subProperty: Partial<InsertSubProperty>): Promise<SubProperty>;
  deleteSubProperty(id: number): Promise<void>;
  toggleSubPropertyStatus(id: number): Promise<SubProperty>;

  // Banners
  getAllBanners(): Promise<Banner[]>;
  getBanner(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner>;
  deleteBanner(id: number): Promise<void>;
  toggleBannerStatus(id: number): Promise<Banner>;
  reorderBanner(id: number, direction: "up" | "down"): Promise<Banner>;

  // Featured Sections
  getAllFeaturedSections(): Promise<FeaturedSection[]>;
  getFeaturedSection(id: number): Promise<FeaturedSection | undefined>;
  createFeaturedSection(section: InsertFeaturedSection): Promise<FeaturedSection>;
  updateFeaturedSection(id: number, section: Partial<InsertFeaturedSection>): Promise<FeaturedSection>;
  deleteFeaturedSection(id: number): Promise<void>;
  
  // Featured Section Farms
  getFeaturedSectionFarms(sectionId: number): Promise<FeaturedSectionFarm[]>;
  addFarmsToSection(sectionId: number, farmIds: number[]): Promise<void>;
  removeFarmFromSection(sectionId: number, farmId: number): Promise<void>;

  // Reels
  getAllReels(): Promise<Reel[]>;
  getReel(id: number): Promise<Reel | undefined>;
  createReel(reel: InsertReel): Promise<Reel>;
  updateReel(id: number, reel: Partial<InsertReel>): Promise<Reel>;
  deleteReel(id: number): Promise<void>;
  toggleReelStatus(id: number): Promise<Reel>;
  reorderReel(id: number, direction: "up" | "down"): Promise<Reel>;
}

// Import MemoryStorage implementation
import { MemoryStorage } from "./memory-storage";

export const storage = new MemoryStorage();