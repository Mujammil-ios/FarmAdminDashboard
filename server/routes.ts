import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAdminSchema, insertUserSchema, insertFarmSchema, insertBookingSchema, insertTransactionSchema, insertRequestedFarmSchema, insertCategorySchema, insertAmenitySchema, insertCitySchema, insertAreaSchema, insertFaqSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
