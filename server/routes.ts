import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userManagementService } from "./user-management";
import { FarmPerformanceDataService } from "./farm-performance-data";
import { rewardsService } from "./rewards-service";
import { couponService } from "./coupon-service";
import { insertAdminSchema, insertUserSchema, insertFarmSchema, insertBookingSchema, insertTransactionSchema, insertRequestedFarmSchema, insertCategorySchema, insertAmenitySchema, insertCitySchema, insertAreaSchema, insertFaqSchema, insertSubPropertySchema, insertBannerSchema, insertFeaturedSectionSchema, insertReelSchema } from "@shared/schema";
import { insertWallet, insertWalletTransaction, insertRewardsCampaign, insertRewardsConfig, insertApiDoc } from "@shared/rewards-schema";
import { insertCoupon, insertRefund } from "@shared/coupon-schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const users = await storage.getAllUsers(parseInt(limit as string), parseInt(offset as string));
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/users/:id/toggle-status", async (req, res) => {
    try {
      const user = await storage.toggleUserStatus(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(400).json({ message: "Failed to toggle user status" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(400).json({ message: "Failed to delete user" });
    }
  });

  // Farms routes
  app.get("/api/farms", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const farms = await storage.getAllFarms(parseInt(limit as string), parseInt(offset as string));
      res.json(farms);
    } catch (error) {
      console.error("Error fetching farms:", error);
      res.status(500).json({ message: "Failed to fetch farms" });
    }
  });

  app.get("/api/farms/:id", async (req, res) => {
    try {
      const farm = await storage.getFarm(parseInt(req.params.id));
      if (!farm) {
        return res.status(404).json({ message: "Farm not found" });
      }
      res.json(farm);
    } catch (error) {
      console.error("Error fetching farm:", error);
      res.status(500).json({ message: "Failed to fetch farm" });
    }
  });

  app.post("/api/farms", async (req, res) => {
    try {
      const farmData = insertFarmSchema.parse(req.body);
      const farm = await storage.createFarm(farmData);
      res.status(201).json(farm);
    } catch (error) {
      console.error("Error creating farm:", error);
      res.status(400).json({ message: "Failed to create farm" });
    }
  });

  app.put("/api/farms/:id", async (req, res) => {
    try {
      const farmData = insertFarmSchema.partial().parse(req.body);
      const farm = await storage.updateFarm(parseInt(req.params.id), farmData);
      res.json(farm);
    } catch (error) {
      console.error("Error updating farm:", error);
      res.status(400).json({ message: "Failed to update farm" });
    }
  });

  app.post("/api/farms/:id/toggle-status", async (req, res) => {
    try {
      const farm = await storage.toggleFarmStatus(parseInt(req.params.id));
      res.json(farm);
    } catch (error) {
      console.error("Error toggling farm status:", error);
      res.status(400).json({ message: "Failed to toggle farm status" });
    }
  });

  app.delete("/api/farms/:id", async (req, res) => {
    try {
      await storage.deleteFarm(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting farm:", error);
      res.status(400).json({ message: "Failed to delete farm" });
    }
  });

  // Bookings routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const bookings = await storage.getAllBookings(parseInt(limit as string), parseInt(offset as string));
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/recent", async (req, res) => {
    try {
      const { limit = "5" } = req.query;
      const bookings = await storage.getRecentBookings(parseInt(limit as string));
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      res.status(500).json({ message: "Failed to fetch recent bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Failed to create booking" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(parseInt(req.params.id), bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(400).json({ message: "Failed to update booking" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const transactions = await storage.getAllTransactions(parseInt(limit as string), parseInt(offset as string));
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Requested Farms routes
  app.get("/api/requested-farms", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const requestedFarms = await storage.getAllRequestedFarms(parseInt(limit as string), parseInt(offset as string));
      res.json(requestedFarms);
    } catch (error) {
      console.error("Error fetching requested farms:", error);
      res.status(500).json({ message: "Failed to fetch requested farms" });
    }
  });

  app.post("/api/requested-farms/:id/approve", async (req, res) => {
    try {
      await storage.approveRequestedFarm(parseInt(req.params.id));
      res.json({ message: "Farm request approved successfully" });
    } catch (error) {
      console.error("Error approving farm request:", error);
      res.status(400).json({ message: "Failed to approve farm request" });
    }
  });

  app.post("/api/requested-farms/:id/reject", async (req, res) => {
    try {
      await storage.rejectRequestedFarm(parseInt(req.params.id));
      res.json({ message: "Farm request rejected successfully" });
    } catch (error) {
      console.error("Error rejecting farm request:", error);
      res.status(400).json({ message: "Failed to reject farm request" });
    }
  });

  // Reviews routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { limit = "50", offset = "0" } = req.query;
      const reviews = await storage.getAllReviews(parseInt(limit as string), parseInt(offset as string));
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews/:id/toggle-visibility", async (req, res) => {
    try {
      const review = await storage.toggleReviewVisibility(parseInt(req.params.id));
      res.json(review);
    } catch (error) {
      console.error("Error toggling review visibility:", error);
      res.status(400).json({ message: "Failed to toggle review visibility" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      await storage.deleteReview(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(400).json({ message: "Failed to delete review" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(parseInt(req.params.id), categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(400).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(400).json({ message: "Failed to delete category" });
    }
  });

  // Amenities routes
  app.get("/api/amenities", async (req, res) => {
    try {
      const amenities = await storage.getAllAmenities();
      res.json(amenities);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      res.status(500).json({ message: "Failed to fetch amenities" });
    }
  });

  app.post("/api/amenities", async (req, res) => {
    try {
      const amenityData = insertAmenitySchema.parse(req.body);
      const amenity = await storage.createAmenity(amenityData);
      res.status(201).json(amenity);
    } catch (error) {
      console.error("Error creating amenity:", error);
      res.status(400).json({ message: "Failed to create amenity" });
    }
  });

  app.put("/api/amenities/:id", async (req, res) => {
    try {
      const amenityData = insertAmenitySchema.partial().parse(req.body);
      const amenity = await storage.updateAmenity(parseInt(req.params.id), amenityData);
      res.json(amenity);
    } catch (error) {
      console.error("Error updating amenity:", error);
      res.status(400).json({ message: "Failed to update amenity" });
    }
  });

  app.delete("/api/amenities/:id", async (req, res) => {
    try {
      await storage.deleteAmenity(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting amenity:", error);
      res.status(400).json({ message: "Failed to delete amenity" });
    }
  });

  // Cities routes
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.post("/api/cities", async (req, res) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(cityData);
      res.status(201).json(city);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(400).json({ message: "Failed to create city" });
    }
  });

  app.put("/api/cities/:id", async (req, res) => {
    try {
      const cityData = insertCitySchema.partial().parse(req.body);
      const city = await storage.updateCity(parseInt(req.params.id), cityData);
      res.json(city);
    } catch (error) {
      console.error("Error updating city:", error);
      res.status(400).json({ message: "Failed to update city" });
    }
  });

  app.delete("/api/cities/:id", async (req, res) => {
    try {
      await storage.deleteCity(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting city:", error);
      res.status(400).json({ message: "Failed to delete city" });
    }
  });

  // Areas routes
  app.get("/api/areas", async (req, res) => {
    try {
      const areas = await storage.getAllAreas();
      res.json(areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      res.status(500).json({ message: "Failed to fetch areas" });
    }
  });

  app.get("/api/cities/:cityId/areas", async (req, res) => {
    try {
      const areas = await storage.getAreasByCity(parseInt(req.params.cityId));
      res.json(areas);
    } catch (error) {
      console.error("Error fetching areas by city:", error);
      res.status(500).json({ message: "Failed to fetch areas by city" });
    }
  });

  app.post("/api/areas", async (req, res) => {
    try {
      const areaData = insertAreaSchema.parse(req.body);
      const area = await storage.createArea(areaData);
      res.status(201).json(area);
    } catch (error) {
      console.error("Error creating area:", error);
      res.status(400).json({ message: "Failed to create area" });
    }
  });

  app.put("/api/areas/:id", async (req, res) => {
    try {
      const areaData = insertAreaSchema.partial().parse(req.body);
      const area = await storage.updateArea(parseInt(req.params.id), areaData);
      res.json(area);
    } catch (error) {
      console.error("Error updating area:", error);
      res.status(400).json({ message: "Failed to update area" });
    }
  });

  app.delete("/api/areas/:id", async (req, res) => {
    try {
      await storage.deleteArea(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting area:", error);
      res.status(400).json({ message: "Failed to delete area" });
    }
  });

  // FAQs routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFAQs();
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const faqData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFAQ(faqData);
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(400).json({ message: "Failed to create FAQ" });
    }
  });

  app.put("/api/faqs/:id", async (req, res) => {
    try {
      const faqData = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFAQ(parseInt(req.params.id), faqData);
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(400).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      await storage.deleteFAQ(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(400).json({ message: "Failed to delete FAQ" });
    }
  });

  // Sub-Properties routes
  app.get("/api/sub-properties", async (req, res) => {
    try {
      const { farmId } = req.query;
      const subProperties = await storage.getAllSubProperties(farmId ? parseInt(farmId as string) : undefined);
      res.json(subProperties);
    } catch (error) {
      console.error("Error fetching sub-properties:", error);
      res.status(500).json({ message: "Failed to fetch sub-properties" });
    }
  });

  app.get("/api/sub-properties/:id", async (req, res) => {
    try {
      const subProperty = await storage.getSubProperty(parseInt(req.params.id));
      if (!subProperty) {
        return res.status(404).json({ message: "Sub-property not found" });
      }
      res.json(subProperty);
    } catch (error) {
      console.error("Error fetching sub-property:", error);
      res.status(500).json({ message: "Failed to fetch sub-property" });
    }
  });

  app.post("/api/sub-properties", async (req, res) => {
    try {
      const subPropertyData = insertSubPropertySchema.parse(req.body);
      const subProperty = await storage.createSubProperty(subPropertyData);
      res.status(201).json(subProperty);
    } catch (error) {
      console.error("Error creating sub-property:", error);
      res.status(400).json({ message: "Failed to create sub-property" });
    }
  });

  app.put("/api/sub-properties/:id", async (req, res) => {
    try {
      const subPropertyData = insertSubPropertySchema.partial().parse(req.body);
      const subProperty = await storage.updateSubProperty(parseInt(req.params.id), subPropertyData);
      res.json(subProperty);
    } catch (error) {
      console.error("Error updating sub-property:", error);
      res.status(400).json({ message: "Failed to update sub-property" });
    }
  });

  app.delete("/api/sub-properties/:id", async (req, res) => {
    try {
      await storage.deleteSubProperty(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sub-property:", error);
      res.status(400).json({ message: "Failed to delete sub-property" });
    }
  });

  app.post("/api/sub-properties/:id/toggle-status", async (req, res) => {
    try {
      const subProperty = await storage.toggleSubPropertyStatus(parseInt(req.params.id));
      res.json(subProperty);
    } catch (error) {
      console.error("Error toggling sub-property status:", error);
      res.status(400).json({ message: "Failed to toggle sub-property status" });
    }
  });

  // Banners routes
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getAllBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  app.get("/api/banners/:id", async (req, res) => {
    try {
      const banner = await storage.getBanner(parseInt(req.params.id));
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      console.error("Error fetching banner:", error);
      res.status(500).json({ message: "Failed to fetch banner" });
    }
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(400).json({ message: "Failed to create banner" });
    }
  });

  app.put("/api/banners/:id", async (req, res) => {
    try {
      const bannerData = insertBannerSchema.partial().parse(req.body);
      const banner = await storage.updateBanner(parseInt(req.params.id), bannerData);
      res.json(banner);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(400).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    try {
      await storage.deleteBanner(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(400).json({ message: "Failed to delete banner" });
    }
  });

  app.post("/api/banners/:id/toggle-status", async (req, res) => {
    try {
      const banner = await storage.toggleBannerStatus(parseInt(req.params.id));
      res.json(banner);
    } catch (error) {
      console.error("Error toggling banner status:", error);
      res.status(400).json({ message: "Failed to toggle banner status" });
    }
  });

  app.post("/api/banners/:id/reorder", async (req, res) => {
    try {
      const { direction } = req.body;
      const banner = await storage.reorderBanner(parseInt(req.params.id), direction);
      res.json(banner);
    } catch (error) {
      console.error("Error reordering banner:", error);
      res.status(400).json({ message: "Failed to reorder banner" });
    }
  });

  // Featured Sections routes
  app.get("/api/featured-sections", async (req, res) => {
    try {
      const featuredSections = await storage.getAllFeaturedSections();
      res.json(featuredSections);
    } catch (error) {
      console.error("Error fetching featured sections:", error);
      res.status(500).json({ message: "Failed to fetch featured sections" });
    }
  });

  app.get("/api/featured-sections/:id", async (req, res) => {
    try {
      const featuredSection = await storage.getFeaturedSection(parseInt(req.params.id));
      if (!featuredSection) {
        return res.status(404).json({ message: "Featured section not found" });
      }
      res.json(featuredSection);
    } catch (error) {
      console.error("Error fetching featured section:", error);
      res.status(500).json({ message: "Failed to fetch featured section" });
    }
  });

  app.post("/api/featured-sections", async (req, res) => {
    try {
      const sectionData = insertFeaturedSectionSchema.parse(req.body);
      const featuredSection = await storage.createFeaturedSection(sectionData);
      res.status(201).json(featuredSection);
    } catch (error) {
      console.error("Error creating featured section:", error);
      res.status(400).json({ message: "Failed to create featured section" });
    }
  });

  app.put("/api/featured-sections/:id", async (req, res) => {
    try {
      const sectionData = insertFeaturedSectionSchema.partial().parse(req.body);
      const featuredSection = await storage.updateFeaturedSection(parseInt(req.params.id), sectionData);
      res.json(featuredSection);
    } catch (error) {
      console.error("Error updating featured section:", error);
      res.status(400).json({ message: "Failed to update featured section" });
    }
  });

  app.delete("/api/featured-sections/:id", async (req, res) => {
    try {
      await storage.deleteFeaturedSection(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting featured section:", error);
      res.status(400).json({ message: "Failed to delete featured section" });
    }
  });

  // Featured Section Farms routes
  app.get("/api/featured-sections/:id/farms", async (req, res) => {
    try {
      const sectionFarms = await storage.getFeaturedSectionFarms(parseInt(req.params.id));
      res.json(sectionFarms);
    } catch (error) {
      console.error("Error fetching featured section farms:", error);
      res.status(500).json({ message: "Failed to fetch featured section farms" });
    }
  });

  app.post("/api/featured-sections/:id/farms", async (req, res) => {
    try {
      const { farmIds } = req.body;
      await storage.addFarmsToSection(parseInt(req.params.id), farmIds);
      res.status(201).json({ message: "Farms added to section successfully" });
    } catch (error) {
      console.error("Error adding farms to section:", error);
      res.status(400).json({ message: "Failed to add farms to section" });
    }
  });

  app.delete("/api/featured-sections/:sectionId/farms/:farmId", async (req, res) => {
    try {
      await storage.removeFarmFromSection(parseInt(req.params.sectionId), parseInt(req.params.farmId));
      res.status(204).send();
    } catch (error) {
      console.error("Error removing farm from section:", error);
      res.status(400).json({ message: "Failed to remove farm from section" });
    }
  });

  // Reels routes
  app.get("/api/reels", async (req, res) => {
    try {
      const reels = await storage.getAllReels();
      res.json(reels);
    } catch (error) {
      console.error("Error fetching reels:", error);
      res.status(500).json({ message: "Failed to fetch reels" });
    }
  });

  app.get("/api/reels/:id", async (req, res) => {
    try {
      const reel = await storage.getReel(parseInt(req.params.id));
      if (!reel) {
        return res.status(404).json({ message: "Reel not found" });
      }
      res.json(reel);
    } catch (error) {
      console.error("Error fetching reel:", error);
      res.status(500).json({ message: "Failed to fetch reel" });
    }
  });

  app.post("/api/reels", async (req, res) => {
    try {
      const reelData = insertReelSchema.parse(req.body);
      const reel = await storage.createReel(reelData);
      res.status(201).json(reel);
    } catch (error) {
      console.error("Error creating reel:", error);
      res.status(400).json({ message: "Failed to create reel" });
    }
  });

  app.put("/api/reels/:id", async (req, res) => {
    try {
      const reelData = insertReelSchema.partial().parse(req.body);
      const reel = await storage.updateReel(parseInt(req.params.id), reelData);
      res.json(reel);
    } catch (error) {
      console.error("Error updating reel:", error);
      res.status(400).json({ message: "Failed to update reel" });
    }
  });

  app.delete("/api/reels/:id", async (req, res) => {
    try {
      await storage.deleteReel(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting reel:", error);
      res.status(400).json({ message: "Failed to delete reel" });
    }
  });

  app.post("/api/reels/:id/toggle-status", async (req, res) => {
    try {
      const reel = await storage.toggleReelStatus(parseInt(req.params.id));
      res.json(reel);
    } catch (error) {
      console.error("Error toggling reel status:", error);
      res.status(400).json({ message: "Failed to toggle reel status" });
    }
  });

  app.post("/api/reels/:id/reorder", async (req, res) => {
    try {
      const { direction } = req.body;
      const reel = await storage.reorderReel(parseInt(req.params.id), direction);
      res.json(reel);
    } catch (error) {
      console.error("Error reordering reel:", error);
      res.status(400).json({ message: "Failed to reorder reel" });
    }
  });

  // Availability checker route
  app.post("/api/check-availability", async (req, res) => {
    try {
      const { checkInDate, checkOutDate } = req.body;
      
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ message: "Check-in and check-out dates are required" });
      }
      
      const availableOptions = await storage.checkAvailability(checkInDate, checkOutDate);
      res.json(availableOptions);
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // ===== USER MANAGEMENT API ROUTES =====

  // Search users by Firebase ID or phone
  app.get("/api/user-management/search", async (req, res) => {
    try {
      const { firebaseId, phone } = req.query;
      
      let user = null;
      if (firebaseId) {
        user = userManagementService.getUserByFirebaseId(firebaseId as string);
      } else if (phone) {
        user = userManagementService.getUserByPhone(phone as string);
      }
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).json({ message: "Failed to search user" });
    }
  });

  // Customer Management Routes
  app.get("/api/user-management/customers", async (req, res) => {
    try {
      const customers = userManagementService.getAllCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/user-management/customers/:id", async (req, res) => {
    try {
      const customer = userManagementService.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.get("/api/user-management/customers/:id/bookings", async (req, res) => {
    try {
      const bookings = userManagementService.getCustomerBookings(req.params.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      res.status(500).json({ message: "Failed to fetch customer bookings" });
    }
  });

  app.get("/api/user-management/customers/:id/activities", async (req, res) => {
    try {
      const activities = userManagementService.getCustomerActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching customer activities:", error);
      res.status(500).json({ message: "Failed to fetch customer activities" });
    }
  });

  app.get("/api/user-management/customers/:id/payments", async (req, res) => {
    try {
      const payments = userManagementService.getPaymentsByCustomer(req.params.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching customer payments:", error);
      res.status(500).json({ message: "Failed to fetch customer payments" });
    }
  });

  // Owner Management Routes
  app.get("/api/user-management/owners", async (req, res) => {
    try {
      const owners = userManagementService.getAllOwners();
      res.json(owners);
    } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Failed to fetch owners" });
    }
  });

  app.get("/api/user-management/owners/:id", async (req, res) => {
    try {
      const owner = userManagementService.getOwnerById(req.params.id);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.json(owner);
    } catch (error) {
      console.error("Error fetching owner:", error);
      res.status(500).json({ message: "Failed to fetch owner" });
    }
  });

  app.get("/api/user-management/owners/:id/bookings", async (req, res) => {
    try {
      const bookings = userManagementService.getOwnerBookings(req.params.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      res.status(500).json({ message: "Failed to fetch owner bookings" });
    }
  });

  app.get("/api/user-management/owners/:id/payouts", async (req, res) => {
    try {
      const payouts = userManagementService.getOwnerPayouts(req.params.id);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching owner payouts:", error);
      res.status(500).json({ message: "Failed to fetch owner payouts" });
    }
  });

  app.get("/api/user-management/owners/:id/activities", async (req, res) => {
    try {
      const activities = userManagementService.getOwnerActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching owner activities:", error);
      res.status(500).json({ message: "Failed to fetch owner activities" });
    }
  });

  app.get("/api/user-management/owners/:id/payments", async (req, res) => {
    try {
      const payments = userManagementService.getPaymentsByOwner(req.params.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching owner payments:", error);
      res.status(500).json({ message: "Failed to fetch owner payments" });
    }
  });

  // Admin Role Management Routes
  app.get("/api/user-management/admin-roles", async (req, res) => {
    try {
      const roles = userManagementService.getAllAdminRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching admin roles:", error);
      res.status(500).json({ message: "Failed to fetch admin roles" });
    }
  });

  app.get("/api/user-management/admin-users", async (req, res) => {
    try {
      const adminUsers = userManagementService.getAllAdminUsers();
      res.json(adminUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch admin users" });
    }
  });

  app.get("/api/user-management/admin-users/:id", async (req, res) => {
    try {
      const adminUser = userManagementService.getAdminUserById(req.params.id);
      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      res.json(adminUser);
    } catch (error) {
      console.error("Error fetching admin user:", error);
      res.status(500).json({ message: "Failed to fetch admin user" });
    }
  });

  // Payment Management Routes
  app.get("/api/user-management/payments", async (req, res) => {
    try {
      const payments = userManagementService.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Support Ticket Management Routes
  app.get("/api/user-management/support-tickets", async (req, res) => {
    try {
      const tickets = userManagementService.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/user-management/support-tickets/user/:userId", async (req, res) => {
    try {
      const tickets = userManagementService.getSupportTicketsByUser(req.params.userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching user support tickets:", error);
      res.status(500).json({ message: "Failed to fetch user support tickets" });
    }
  });

  // Revenue Report Routes
  app.get("/api/user-management/revenue-report", async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(400).json({ message: "From date and to date are required" });
      }
      
      const report = userManagementService.generateRevenueReport(fromDate as string, toDate as string);
      res.json(report);
    } catch (error) {
      console.error("Error generating revenue report:", error);
      res.status(500).json({ message: "Failed to generate revenue report" });
    }
  });

  // Farm Performance Routes
  const farmPerformanceService = new FarmPerformanceDataService();

  // Global farm performance metrics
  app.get("/api/farm-performance/global-metrics", async (req, res) => {
    try {
      const metrics = farmPerformanceService.getGlobalMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching global performance metrics:", error);
      res.status(500).json({ message: "Failed to fetch global performance metrics" });
    }
  });

  // Daily booking trends for the last 30 days
  app.get("/api/farm-performance/daily-trends", async (req, res) => {
    try {
      const trends = farmPerformanceService.getDailyTrends();
      res.json(trends);
    } catch (error) {
      console.error("Error fetching daily trends:", error);
      res.status(500).json({ message: "Failed to fetch daily trends" });
    }
  });

  // Top 5 performing farms
  app.get("/api/farm-performance/top-farms", async (req, res) => {
    try {
      const topFarms = farmPerformanceService.getTopFarms();
      res.json(topFarms);
    } catch (error) {
      console.error("Error fetching top farms:", error);
      res.status(500).json({ message: "Failed to fetch top farms" });
    }
  });

  // Global calendar data for a specific month
  app.get("/api/farm-performance/global-calendar/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const calendarData = farmPerformanceService.getGlobalCalendarData(
        parseInt(month), 
        parseInt(year)
      );
      res.json(calendarData);
    } catch (error) {
      console.error("Error fetching global calendar data:", error);
      res.status(500).json({ message: "Failed to fetch global calendar data" });
    }
  });

  // Individual farm performance for a specific month
  app.get("/api/farm-performance/farm/:farmId/:year/:month", async (req, res) => {
    try {
      const { farmId, year, month } = req.params;
      const farmPerformance = farmPerformanceService.getIndividualFarmPerformance(
        parseInt(farmId),
        parseInt(month),
        parseInt(year)
      );
      res.json(farmPerformance);
    } catch (error) {
      console.error("Error fetching farm performance:", error);
      res.status(500).json({ message: "Failed to fetch farm performance" });
    }
  });

  // Farm calendar data for a specific month
  app.get("/api/farm-performance/farm/:farmId/calendar/:year/:month", async (req, res) => {
    try {
      const { farmId, year, month } = req.params;
      const calendarData = farmPerformanceService.getFarmCalendarData(
        parseInt(farmId),
        parseInt(month),
        parseInt(year)
      );
      res.json(calendarData);
    } catch (error) {
      console.error("Error fetching farm calendar data:", error);
      res.status(500).json({ message: "Failed to fetch farm calendar data" });
    }
  });

  // Farm booking history for a specific month
  app.get("/api/farm-performance/farm/:farmId/bookings/:year/:month", async (req, res) => {
    try {
      const { farmId, year, month } = req.params;
      const bookingHistory = farmPerformanceService.getFarmBookingHistory(
        parseInt(farmId),
        parseInt(month),
        parseInt(year)
      );
      res.json(bookingHistory);
    } catch (error) {
      console.error("Error fetching farm booking history:", error);
      res.status(500).json({ message: "Failed to fetch farm booking history" });
    }
  });

  // Farm transaction history for a specific month
  app.get("/api/farm-performance/farm/:farmId/transactions/:year/:month", async (req, res) => {
    try {
      const { farmId, year, month } = req.params;
      const transactionHistory = farmPerformanceService.getFarmTransactionHistory(
        parseInt(farmId),
        parseInt(month),
        parseInt(year)
      );
      res.json(transactionHistory);
    } catch (error) {
      console.error("Error fetching farm transaction history:", error);
      res.status(500).json({ message: "Failed to fetch farm transaction history" });
    }
  });

  // Farm reviews
  app.get("/api/farm-performance/farm/:farmId/reviews", async (req, res) => {
    try {
      const { farmId } = req.params;
      const reviews = farmPerformanceService.getFarmReviews(parseInt(farmId));
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching farm reviews:", error);
      res.status(500).json({ message: "Failed to fetch farm reviews" });
    }
  });

  // Farm owner payouts
  app.get("/api/farm-performance/farm/:farmId/payouts", async (req, res) => {
    try {
      const { farmId } = req.params;
      const payouts = farmPerformanceService.getOwnerPayouts(parseInt(farmId));
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching farm payouts:", error);
      res.status(500).json({ message: "Failed to fetch farm payouts" });
    }
  });

  // Rewards & Wallet Routes
  app.get("/api/rewards/metrics", async (req, res) => {
    try {
      const metrics = await rewardsService.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching rewards metrics:", error);
      res.status(500).json({ message: "Failed to fetch rewards metrics" });
    }
  });

  app.get("/api/rewards/wallets", async (req, res) => {
    try {
      const { limit = "50", offset = "0", userType } = req.query;
      const result = await rewardsService.getAllWallets(
        parseInt(limit as string), 
        parseInt(offset as string),
        userType as string
      );
      res.json(result);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.get("/api/rewards/campaigns", async (req, res) => {
    try {
      const campaigns = await rewardsService.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/rewards/config", async (req, res) => {
    try {
      const config = await rewardsService.getAllConfig();
      res.json(config);
    } catch (error) {
      console.error("Error fetching rewards config:", error);
      res.status(500).json({ message: "Failed to fetch rewards config" });
    }
  });

  // API Documentation Routes
  app.get("/api/docs", async (req, res) => {
    try {
      const docs = await rewardsService.getAllApiDocs();
      res.json(docs);
    } catch (error) {
      console.error("Error fetching API docs:", error);
      res.status(500).json({ message: "Failed to fetch API docs" });
    }
  });

  app.get("/api/docs/:id", async (req, res) => {
    try {
      const doc = await rewardsService.getApiDoc(parseInt(req.params.id));
      if (!doc) {
        return res.status(404).json({ message: "API doc not found" });
      }
      res.json(doc);
    } catch (error) {
      console.error("Error fetching API doc:", error);
      res.status(500).json({ message: "Failed to fetch API doc" });
    }
  });

  // Coupon Management Routes
  app.get("/api/coupons", async (req, res) => {
    try {
      const { isActive } = req.query;
      const coupons = await couponService.getAllCoupons(
        isActive ? isActive === "true" : undefined
      );
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get("/api/coupons/analytics", async (req, res) => {
    try {
      const analytics = await couponService.getCouponAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching coupon analytics:", error);
      res.status(500).json({ message: "Failed to fetch coupon analytics" });
    }
  });

  app.get("/api/coupons/:id", async (req, res) => {
    try {
      const coupon = await couponService.getCoupon(parseInt(req.params.id));
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const couponData = insertCoupon.parse(req.body);
      const coupon = await couponService.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(400).json({ message: "Failed to create coupon" });
    }
  });

  app.put("/api/coupons/:id", async (req, res) => {
    try {
      const couponData = insertCoupon.partial().parse(req.body);
      const coupon = await couponService.updateCoupon(parseInt(req.params.id), couponData);
      res.json(coupon);
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(400).json({ message: "Failed to update coupon" });
    }
  });

  app.post("/api/coupons/:id/toggle", async (req, res) => {
    try {
      const coupon = await couponService.toggleCouponStatus(parseInt(req.params.id));
      res.json(coupon);
    } catch (error) {
      console.error("Error toggling coupon status:", error);
      res.status(400).json({ message: "Failed to toggle coupon status" });
    }
  });

  app.post("/api/coupons/bulk", async (req, res) => {
    try {
      const { template, count, prefix } = req.body;
      const operation = await couponService.createBulkCoupons(template, count, prefix);
      res.json(operation);
    } catch (error) {
      console.error("Error creating bulk coupons:", error);
      res.status(400).json({ message: "Failed to create bulk coupons" });
    }
  });

  app.post("/api/coupons/calculate", async (req, res) => {
    try {
      const { bookingAmount, couponCode, userId, farmId, categoryId } = req.body;
      const calculation = await couponService.calculateBookingTotal(
        bookingAmount,
        couponCode,
        userId,
        farmId,
        categoryId
      );
      res.json(calculation);
    } catch (error) {
      console.error("Error calculating booking total:", error);
      res.status(400).json({ message: "Failed to calculate booking total" });
    }
  });

  // Refund Management Routes
  app.get("/api/refunds", async (req, res) => {
    try {
      const { status } = req.query;
      const refunds = await couponService.getAllRefunds(status as string);
      res.json(refunds);
    } catch (error) {
      console.error("Error fetching refunds:", error);
      res.status(500).json({ message: "Failed to fetch refunds" });
    }
  });

  app.get("/api/refunds/:id", async (req, res) => {
    try {
      const refund = await couponService.getRefund(parseInt(req.params.id));
      if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
      }
      res.json(refund);
    } catch (error) {
      console.error("Error fetching refund:", error);
      res.status(500).json({ message: "Failed to fetch refund" });
    }
  });

  app.post("/api/refunds", async (req, res) => {
    try {
      const refundData = insertRefund.parse(req.body);
      const refund = await couponService.createRefund(refundData);
      res.status(201).json(refund);
    } catch (error) {
      console.error("Error creating refund:", error);
      res.status(400).json({ message: "Failed to create refund" });
    }
  });

  app.put("/api/refunds/:id/process", async (req, res) => {
    try {
      const { status, notes } = req.body;
      const adminId = 1; // TODO: Get from authenticated user
      const refund = await couponService.updateRefundStatus(
        parseInt(req.params.id),
        status,
        adminId,
        notes
      );
      res.json(refund);
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(400).json({ message: "Failed to process refund" });
    }
  });

  // Audit Trail Routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      // Mock audit logs for demonstration
      const mockLogs = [
        {
          id: 1,
          adminId: 1,
          adminName: "John Admin",
          action: "update",
          module: "rewards",
          entityType: "campaign",
          entityId: 1,
          oldData: { status: "draft" },
          newData: { status: "active" },
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0...",
          createdAt: new Date("2024-01-15T10:30:00Z"),
          description: "Activated Summer Booking Bonus campaign"
        }
      ];
      res.json(mockLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
