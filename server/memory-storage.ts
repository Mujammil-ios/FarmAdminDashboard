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
import { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private admins: Admin[] = [];
  private categories: Category[] = [];
  private amenities: Amenity[] = [];
  private cities: City[] = [];
  private areas: Area[] = [];
  private users: User[] = [];
  private farms: Farm[] = [];
  private bookings: Booking[] = [];
  private transactions: Transaction[] = [];
  private requestedFarms: RequestedFarm[] = [];
  private reviews: Review[] = [];
  private faqs: FAQ[] = [];
  private subProperties: SubProperty[] = [];
  private banners: Banner[] = [];
  private featuredSections: FeaturedSection[] = [];
  private featuredSectionFarms: FeaturedSectionFarm[] = [];
  private reels: Reel[] = [];

  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Cities
    this.cities = [
      { id: 1, name: "Mumbai", state: "Maharashtra", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Delhi", state: "Delhi", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Bangalore", state: "Karnataka", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Pune", state: "Maharashtra", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Chennai", state: "Tamil Nadu", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Initialize Areas
    this.areas = [
      { id: 1, name: "Andheri", cityId: 1, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Bandra", cityId: 1, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Powai", cityId: 1, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Connaught Place", cityId: 2, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Karol Bagh", cityId: 2, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: "Koramangala", cityId: 3, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: "Whitefield", cityId: 3, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: "Hinjewadi", cityId: 4, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Initialize Categories
    this.categories = [
      { id: 1, name: "Organic Farm", icon: "🌱", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Dairy Farm", icon: "🥛", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Fruit Orchard", icon: "🍎", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Vegetable Farm", icon: "🥕", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Poultry Farm", icon: "🐔", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: "Flower Farm", icon: "🌸", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Initialize Amenities
    this.amenities = [
      { id: 1, name: "WiFi", icon: "📶", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Parking", icon: "🚗", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Swimming Pool", icon: "🏊", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Restaurant", icon: "🍽️", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Guided Tours", icon: "👨‍🏫", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: "Accommodation", icon: "🏠", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: "Farm Activities", icon: "🚜", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: "Pet Friendly", icon: "🐕", isEnable: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Initialize Users
    this.users = [
      { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+919876543210", isOwner: true, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Priya Sharma", email: "priya@example.com", phone: "+919876543211", isOwner: false, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Amit Patel", email: "amit@example.com", phone: "+919876543212", isOwner: true, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Sunita Singh", email: "sunita@example.com", phone: "+919876543213", isOwner: false, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Vikram Reddy", email: "vikram@example.com", phone: "+919876543214", isOwner: true, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: "Meera Gupta", email: "meera@example.com", phone: "+919876543215", isOwner: false, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: "Arjun Nair", email: "arjun@example.com", phone: "+919876543216", isOwner: true, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: "Kavya Iyer", email: "kavya@example.com", phone: "+919876543217", isOwner: false, isEnable: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    // Initialize Farms
    this.farms = [
      { 
        id: 1, 
        name: "Green Valley Organic Farm", 
        description: "Experience sustainable farming at its finest. Our organic farm offers fresh produce, peaceful environment, and educational tours about organic farming practices.",
        userId: 1, 
        categoryId: 1, 
        cityId: 1, 
        areaId: 1,
        address: "Plot 123, Green Valley Road, Andheri East, Mumbai",
        latitude: 19.1136,
        longitude: 72.8697,
        pricePerSlot: 2500,
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"],
        amenities: [1, 2, 4, 5, 7],
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Sunshine Dairy Farm",
        description: "Traditional dairy farm experience with fresh milk, cheese making workshops, and interaction with friendly cows. Perfect for families and children.",
        userId: 3,
        categoryId: 2,
        cityId: 3,
        areaId: 6,
        address: "456 Dairy Lane, Koramangala, Bangalore",
        latitude: 12.9279,
        longitude: 77.6271,
        pricePerSlot: 3000,
        images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500"],
        amenities: [1, 2, 4, 5, 6, 8],
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Mango Grove Paradise",
        description: "Sprawling mango orchard with over 15 varieties of mangoes. Seasonal fruit picking, mango processing workshop, and organic mango products.",
        userId: 5,
        categoryId: 3,
        cityId: 1,
        areaId: 2,
        address: "789 Orchard Street, Bandra West, Mumbai",
        latitude: 19.0596,
        longitude: 72.8295,
        pricePerSlot: 2800,
        images: ["https://images.unsplash.com/photo-1628191081676-73e4a2b2ae73?w=500"],
        amenities: [1, 2, 5, 7],
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: "Urban Vegetable Farm",
        description: "Modern hydroponic vegetable farm showcasing sustainable urban farming. Learn about soil-less cultivation and harvest fresh vegetables.",
        userId: 7,
        categoryId: 4,
        cityId: 2,
        areaId: 4,
        address: "321 Urban Farm Complex, CP, New Delhi",
        latitude: 28.6139,
        longitude: 77.2090,
        pricePerSlot: 3500,
        images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"],
        amenities: [1, 2, 4, 5, 7],
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: "Heritage Poultry Farm",
        description: "Free-range poultry farm with heritage breed chickens. Fresh eggs, poultry care workshops, and farm-to-table dining experience.",
        userId: 1,
        categoryId: 5,
        cityId: 4,
        areaId: 8,
        address: "555 Heritage Road, Hinjewadi, Pune",
        latitude: 18.5912,
        longitude: 73.7389,
        pricePerSlot: 2200,
        images: ["https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500"],
        amenities: [1, 2, 4, 6, 7, 8],
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    this.bookings = [
      {
        id: 1,
        userId: 2,
        farmId: 1,
        checkInDate: tomorrow.toISOString().split('T')[0],
        checkOutDate: tomorrow.toISOString().split('T')[0],
        numberOfSlots: 2,
        totalAmount: 5000,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 4,
        farmId: 2,
        checkInDate: nextWeek.toISOString().split('T')[0],
        checkOutDate: nextWeek.toISOString().split('T')[0],
        numberOfSlots: 1,
        totalAmount: 3000,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 6,
        farmId: 3,
        checkInDate: today.toISOString().split('T')[0],
        checkOutDate: today.toISOString().split('T')[0],
        numberOfSlots: 1,
        totalAmount: 2800,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Transactions
    this.transactions = [
      {
        id: 1,
        userId: 2,
        farmId: 1,
        bookingId: 1,
        amount: 5000,
        paymentMethod: "Credit Card",
        status: "Complete",
        transactionId: "TXN001",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 4,
        farmId: 2,
        bookingId: 2,
        amount: 3000,
        paymentMethod: "UPI",
        status: "Complete",
        transactionId: "TXN002",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 6,
        farmId: 3,
        bookingId: 3,
        amount: 2800,
        paymentMethod: "Net Banking",
        status: "Pending",
        transactionId: "TXN003",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Requested Farms
    this.requestedFarms = [
      {
        id: 1,
        userId: 3,
        name: "Mountain View Herb Farm",
        description: "Medicinal herb farm in the hills with therapeutic gardens",
        cityId: 2,
        areaId: 5,
        address: "789 Mountain Road, Karol Bagh, Delhi",
        phone: "+919876543220",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 5,
        name: "Coastal Coconut Plantation",
        description: "Traditional coconut plantation with coastal views",
        cityId: 5,
        areaId: 1,
        address: "Beach Road, ECR, Chennai",
        phone: "+919876543221",
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Reviews
    this.reviews = [
      {
        id: 1,
        userId: 2,
        farmId: 1,
        rating: 5,
        comment: "Amazing experience! The organic farm is beautiful and well-maintained. Learned so much about sustainable farming practices.",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 4,
        farmId: 2,
        rating: 4,
        comment: "Great dairy farm experience. Kids loved interacting with the cows. Fresh milk and cheese were delicious!",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 6,
        farmId: 3,
        rating: 5,
        comment: "Mango picking was so much fun! Variety of mangoes was impressive. Perfect family outing.",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 8,
        farmId: 4,
        rating: 4,
        comment: "Fascinating to see hydroponic farming in action. Very educational and informative tour.",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize FAQs
    this.faqs = [
      {
        id: 1,
        question: "What is the cancellation policy?",
        answer: "You can cancel your booking up to 24 hours before check-in for a full refund. Cancellations within 24 hours will incur a 25% cancellation fee.",
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        question: "Are pets allowed on the farms?",
        answer: "Pet policies vary by farm. Please check the farm's amenities for 'Pet Friendly' indication or contact the farm directly before booking.",
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        question: "What are the slot timings?",
        answer: "Morning slots are from 6:00 AM to 6:00 PM, and evening slots are from 6:00 PM to 6:00 AM the next day. Each slot includes 1 hour for cleaning between bookings.",
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        question: "Is food provided at the farms?",
        answer: "Farms with 'Restaurant' amenity provide meals. Other farms may offer farm-fresh produce for purchase. Check individual farm details for specific offerings.",
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        question: "How do I become a farm owner on the platform?",
        answer: "You can submit a farm request through our 'Requested Farms' section. Our team will review your application and get back to you within 3-5 business days.",
        isEnable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Admin
    this.admins = [
      {
        id: 1,
        email: "admin@farmbook.com",
        password: "hashed_password_123",
        name: "Admin User",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Sub-Properties with comprehensive data
    this.subProperties = [
      {
        id: 1,
        farmId: 1,
        name: "Luxury Villa A",
        description: "Premium villa with mountain view, private pool, and modern amenities. Perfect for couples and small families.",
        type: "villa",
        capacity: 4,
        pricePerSlot: 5500,
        amenities: [1, 2, 4, 5, 7, 8],
        images: ["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        farmId: 1,
        name: "Cozy Cottage B",
        description: "Rustic cottage surrounded by organic gardens. Experience farm life with modern comfort and traditional charm.",
        type: "cottage",
        capacity: 6,
        pricePerSlot: 3800,
        amenities: [1, 2, 5, 6, 7],
        images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        farmId: 2,
        name: "Resort Apartment 1",
        description: "Modern apartment in the heart of dairy farm. Wake up to fresh milk and cheese every morning.",
        type: "apartment",
        capacity: 3,
        pricePerSlot: 4200,
        amenities: [1, 2, 3, 5, 7],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        farmId: 2,
        name: "Family Suite 2",
        description: "Spacious family suite with kitchenette and living area. Perfect for extended farm stays.",
        type: "suite",
        capacity: 8,
        pricePerSlot: 6000,
        amenities: [1, 2, 4, 5, 6, 7, 8],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        farmId: 3,
        name: "Heritage Bungalow",
        description: "Traditional bungalow with ethnic decor and authentic rural experience. Connect with nature and tradition.",
        type: "bungalow",
        capacity: 5,
        pricePerSlot: 4800,
        amenities: [1, 2, 5, 6, 7],
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        farmId: 4,
        name: "Urban Loft",
        description: "Modern loft apartment in urban farm setting. Experience city farming with style and comfort.",
        type: "loft",
        capacity: 2,
        pricePerSlot: 4500,
        amenities: [1, 2, 4, 5, 7],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        farmId: 5,
        name: "Poultry Farm Cabin",
        description: "Charming cabin overlooking free-range poultry areas. Perfect for nature lovers and bird watchers.",
        type: "cabin",
        capacity: 4,
        pricePerSlot: 3200,
        amenities: [1, 2, 5, 6, 7],
        images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Banners with comprehensive data
    this.banners = [
      {
        id: 1,
        title: "Welcome to Farm Paradise",
        description: "Discover authentic farm experiences across India. Book your perfect getaway today!",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        actionText: "Explore Farms",
        actionUrl: "/farms",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: "50% Off Weekend Bookings",
        description: "Special weekend offer on all farm stays. Limited time offer - book now!",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        actionText: "Book Now",
        actionUrl: "/booking",
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: "Organic Food Festival",
        description: "Join our monthly organic food festival. Fresh produce, cooking workshops, and family fun!",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
        actionText: "Learn More",
        actionUrl: "/events",
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: "Corporate Team Building",
        description: "Perfect venue for corporate retreats and team building activities in natural settings.",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
        actionText: "Contact Us",
        actionUrl: "/corporate",
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: "Family Adventures Await",
        description: "Create unforgettable memories with your family. Educational tours, animal interactions, and more!",
        imageUrl: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800",
        actionText: "Plan Visit",
        actionUrl: "/family",
        displayOrder: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Featured Sections with comprehensive data
    this.featuredSections = [
      {
        id: 1,
        name: "Most Affordable",
        description: "Budget-friendly farm experiences without compromising on quality and fun.",
        icon: "💰",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Perfect for Couples",
        description: "Romantic farm getaways designed for couples seeking peaceful and intimate experiences.",
        icon: "💕",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Most Visited",
        description: "Popular farms loved by thousands of visitors. Top-rated experiences you can't miss.",
        icon: "⭐",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: "Luxury Experience",
        description: "Premium farm stays with world-class amenities and personalized service.",
        icon: "👑",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Featured Section Farms relationships
    this.featuredSectionFarms = [
      { id: 1, sectionId: 1, farmId: 5, createdAt: new Date(), updatedAt: new Date() }, // Most Affordable
      { id: 2, sectionId: 1, farmId: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, sectionId: 2, farmId: 1, createdAt: new Date(), updatedAt: new Date() }, // Perfect for Couples
      { id: 4, sectionId: 2, farmId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, sectionId: 3, farmId: 1, createdAt: new Date(), updatedAt: new Date() }, // Most Visited
      { id: 6, sectionId: 3, farmId: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, sectionId: 3, farmId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, sectionId: 4, farmId: 1, createdAt: new Date(), updatedAt: new Date() }, // Luxury Experience
      { id: 9, sectionId: 4, farmId: 4, createdAt: new Date(), updatedAt: new Date() }
    ];

    // Initialize Reels with comprehensive data
    this.reels = [
      {
        id: 1,
        farmId: 1,
        title: "Morning at Green Valley",
        description: "Experience the serenity of early morning farm activities. Fresh air, bird songs, and organic breakfast!",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
        duration: 45,
        farmAlias: "Green Paradise",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        farmId: 2,
        title: "Fresh Milk Collection",
        description: "Watch our daily milk collection process. From cow to table - the purest dairy experience.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400",
        duration: 60,
        farmAlias: "Dairy Delight",
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        farmId: 3,
        title: "Village Life Experience",
        description: "Immerse yourself in authentic village culture. Traditional cooking, folk music, and rural crafts.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1628191081676-73e4a2b2ae73?w=400",
        duration: 90,
        farmAlias: "Heritage Village",
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        farmId: 4,
        title: "Urban Farming Innovation",
        description: "Discover the future of farming in the city. Hydroponic systems and sustainable urban agriculture.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        duration: 75,
        farmAlias: "City Farm Hub",
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        farmId: 5,
        title: "Farm to Table Dining",
        description: "Experience fresh ingredients transformed into delicious meals. From garden to plate in minutes.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400",
        duration: 50,
        farmAlias: "Farm Kitchen",
        displayOrder: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        farmId: 1,
        title: "Kids Farm Adventure",
        description: "Children's favorite activities - animal feeding, treasure hunts, and nature exploration.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
        duration: 65,
        farmAlias: "Adventure Farm",
        displayOrder: 6,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.nextId = 1000;
  }

  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.find(admin => admin.id === id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return this.admins.find(admin => admin.email === email);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const newAdmin: Admin = {
      ...admin,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    const totalUsers = this.users.length;
    const totalOwners = this.users.filter(user => user.isOwner).length;
    const activeFarms = this.farms.filter(farm => farm.isEnable).length;
    const pendingFarmRequests = this.requestedFarms.filter(farm => farm.status === 'pending').length;
    
    const today = new Date().toISOString().split('T')[0];
    const bookedSlotsToday = this.bookings.filter(booking => 
      booking.checkInDate === today && booking.status === 1
    ).length;

    const totalRevenue = this.transactions
      .filter(transaction => transaction.status === 'Complete')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalUsers,
      totalOwners,
      activeFarms,
      bookedSlotsToday,
      totalRevenue,
      pendingFarmRequests,
    };
  }

  // Users
  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    return this.users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users.splice(userIndex, 1);
  }

  async toggleUserStatus(id: number): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex].isEnable = !this.users[userIndex].isEnable;
    this.users[userIndex].updatedAt = new Date();
    
    return this.users[userIndex];
  }

  // Farms
  async getAllFarms(limit = 50, offset = 0): Promise<FarmWithDetails[]> {
    return this.farms
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit)
      .map(farm => this.enrichFarmWithDetails(farm));
  }

  async getFarm(id: number): Promise<FarmWithDetails | undefined> {
    const farm = this.farms.find(farm => farm.id === id);
    return farm ? this.enrichFarmWithDetails(farm) : undefined;
  }

  private enrichFarmWithDetails(farm: Farm): FarmWithDetails {
    const user = this.users.find(u => u.id === farm.userId)!;
    const category = this.categories.find(c => c.id === farm.categoryId)!;
    const city = this.cities.find(c => c.id === farm.cityId)!;
    const area = this.areas.find(a => a.id === farm.areaId)!;
    
    return {
      ...farm,
      user,
      category,
      city,
      area,
      images: farm.images.map(image => ({ id: 1, farmId: farm.id, imageUrl: image, createdAt: new Date(), updatedAt: new Date() }))
    };
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const newFarm: Farm = {
      ...farm,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.farms.push(newFarm);
    return newFarm;
  }

  async updateFarm(id: number, farmData: Partial<InsertFarm>): Promise<Farm> {
    const farmIndex = this.farms.findIndex(farm => farm.id === id);
    if (farmIndex === -1) {
      throw new Error('Farm not found');
    }
    
    this.farms[farmIndex] = {
      ...this.farms[farmIndex],
      ...farmData,
      updatedAt: new Date()
    };
    
    return this.farms[farmIndex];
  }

  async deleteFarm(id: number): Promise<void> {
    const farmIndex = this.farms.findIndex(farm => farm.id === id);
    if (farmIndex === -1) {
      throw new Error('Farm not found');
    }
    this.farms.splice(farmIndex, 1);
  }

  async toggleFarmStatus(id: number): Promise<Farm> {
    const farmIndex = this.farms.findIndex(farm => farm.id === id);
    if (farmIndex === -1) {
      throw new Error('Farm not found');
    }
    
    this.farms[farmIndex].isEnable = !this.farms[farmIndex].isEnable;
    this.farms[farmIndex].updatedAt = new Date();
    
    return this.farms[farmIndex];
  }

  // Bookings
  async getAllBookings(limit = 50, offset = 0): Promise<BookingWithDetails[]> {
    return this.bookings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit)
      .map(booking => this.enrichBookingWithDetails(booking));
  }

  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const booking = this.bookings.find(booking => booking.id === id);
    return booking ? this.enrichBookingWithDetails(booking) : undefined;
  }

  private enrichBookingWithDetails(booking: Booking): BookingWithDetails {
    const user = this.users.find(u => u.id === booking.userId)!;
    const farm = this.enrichFarmWithDetails(this.farms.find(f => f.id === booking.farmId)!);
    
    return {
      ...booking,
      user,
      farm
    };
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBooking(id: number, bookingData: Partial<InsertBooking>): Promise<Booking> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...bookingData,
      updatedAt: new Date()
    };
    
    return this.bookings[bookingIndex];
  }

  async getRecentBookings(limit = 5): Promise<BookingWithDetails[]> {
    return this.bookings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map(booking => this.enrichBookingWithDetails(booking));
  }

  // Transactions
  async getAllTransactions(limit = 50, offset = 0): Promise<TransactionWithDetails[]> {
    return this.transactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit)
      .map(transaction => this.enrichTransactionWithDetails(transaction));
  }

  async getTransaction(id: number): Promise<TransactionWithDetails | undefined> {
    const transaction = this.transactions.find(transaction => transaction.id === id);
    return transaction ? this.enrichTransactionWithDetails(transaction) : undefined;
  }

  private enrichTransactionWithDetails(transaction: Transaction): TransactionWithDetails {
    const user = this.users.find(u => u.id === transaction.userId)!;
    const farm = this.farms.find(f => f.id === transaction.farmId)!;
    
    return {
      ...transaction,
      user,
      farm
    };
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    const transactionIndex = this.transactions.findIndex(transaction => transaction.id === id);
    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }
    
    this.transactions[transactionIndex] = {
      ...this.transactions[transactionIndex],
      ...transactionData,
      updatedAt: new Date()
    };
    
    return this.transactions[transactionIndex];
  }

  // Requested Farms
  async getAllRequestedFarms(limit = 50, offset = 0): Promise<RequestedFarm[]> {
    return this.requestedFarms
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getRequestedFarm(id: number): Promise<RequestedFarm | undefined> {
    return this.requestedFarms.find(farm => farm.id === id);
  }

  async createRequestedFarm(requestedFarm: InsertRequestedFarm): Promise<RequestedFarm> {
    const newRequestedFarm: RequestedFarm = {
      ...requestedFarm,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.requestedFarms.push(newRequestedFarm);
    return newRequestedFarm;
  }

  async updateRequestedFarm(id: number, requestedFarmData: Partial<InsertRequestedFarm>): Promise<RequestedFarm> {
    const farmIndex = this.requestedFarms.findIndex(farm => farm.id === id);
    if (farmIndex === -1) {
      throw new Error('Requested farm not found');
    }
    
    this.requestedFarms[farmIndex] = {
      ...this.requestedFarms[farmIndex],
      ...requestedFarmData,
      updatedAt: new Date()
    };
    
    return this.requestedFarms[farmIndex];
  }

  async approveRequestedFarm(id: number): Promise<void> {
    await this.updateRequestedFarm(id, { status: 'approved' });
  }

  async rejectRequestedFarm(id: number): Promise<void> {
    await this.updateRequestedFarm(id, { status: 'rejected' });
  }

  // Reviews
  async getAllReviews(limit = 50, offset = 0): Promise<Review[]> {
    return this.reviews
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.find(review => review.id === id);
  }

  async toggleReviewVisibility(id: number): Promise<Review> {
    const reviewIndex = this.reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }
    
    this.reviews[reviewIndex].isVisible = !this.reviews[reviewIndex].isVisible;
    this.reviews[reviewIndex].updatedAt = new Date();
    
    return this.reviews[reviewIndex];
  }

  async deleteReview(id: number): Promise<void> {
    const reviewIndex = this.reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }
    this.reviews.splice(reviewIndex, 1);
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.categories.filter(category => category.isEnable);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.find(category => category.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...categoryData,
      updatedAt: new Date()
    };
    
    return this.categories[categoryIndex];
  }

  async deleteCategory(id: number): Promise<void> {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    this.categories.splice(categoryIndex, 1);
  }

  // Amenities
  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenities.filter(amenity => amenity.isEnable);
  }

  async getAmenity(id: number): Promise<Amenity | undefined> {
    return this.amenities.find(amenity => amenity.id === id);
  }

  async createAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const newAmenity: Amenity = {
      ...amenity,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.amenities.push(newAmenity);
    return newAmenity;
  }

  async updateAmenity(id: number, amenityData: Partial<InsertAmenity>): Promise<Amenity> {
    const amenityIndex = this.amenities.findIndex(amenity => amenity.id === id);
    if (amenityIndex === -1) {
      throw new Error('Amenity not found');
    }
    
    this.amenities[amenityIndex] = {
      ...this.amenities[amenityIndex],
      ...amenityData,
      updatedAt: new Date()
    };
    
    return this.amenities[amenityIndex];
  }

  async deleteAmenity(id: number): Promise<void> {
    const amenityIndex = this.amenities.findIndex(amenity => amenity.id === id);
    if (amenityIndex === -1) {
      throw new Error('Amenity not found');
    }
    this.amenities.splice(amenityIndex, 1);
  }

  // Cities & Areas
  async getAllCities(): Promise<City[]> {
    return this.cities.filter(city => city.isEnable);
  }

  async getCity(id: number): Promise<City | undefined> {
    return this.cities.find(city => city.id === id);
  }

  async createCity(city: InsertCity): Promise<City> {
    const newCity: City = {
      ...city,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cities.push(newCity);
    return newCity;
  }

  async updateCity(id: number, cityData: Partial<InsertCity>): Promise<City> {
    const cityIndex = this.cities.findIndex(city => city.id === id);
    if (cityIndex === -1) {
      throw new Error('City not found');
    }
    
    this.cities[cityIndex] = {
      ...this.cities[cityIndex],
      ...cityData,
      updatedAt: new Date()
    };
    
    return this.cities[cityIndex];
  }

  async deleteCity(id: number): Promise<void> {
    const cityIndex = this.cities.findIndex(city => city.id === id);
    if (cityIndex === -1) {
      throw new Error('City not found');
    }
    this.cities.splice(cityIndex, 1);
  }

  async getAllAreas(): Promise<Area[]> {
    return this.areas.filter(area => area.isEnable);
  }

  async getAreasByCity(cityId: number): Promise<Area[]> {
    return this.areas.filter(area => area.cityId === cityId && area.isEnable);
  }

  async getArea(id: number): Promise<Area | undefined> {
    return this.areas.find(area => area.id === id);
  }

  async createArea(area: InsertArea): Promise<Area> {
    const newArea: Area = {
      ...area,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.areas.push(newArea);
    return newArea;
  }

  async updateArea(id: number, areaData: Partial<InsertArea>): Promise<Area> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) {
      throw new Error('Area not found');
    }
    
    this.areas[areaIndex] = {
      ...this.areas[areaIndex],
      ...areaData,
      updatedAt: new Date()
    };
    
    return this.areas[areaIndex];
  }

  async deleteArea(id: number): Promise<void> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) {
      throw new Error('Area not found');
    }
    this.areas.splice(areaIndex, 1);
  }

  // FAQs
  async getAllFAQs(): Promise<FAQ[]> {
    return this.faqs.filter(faq => faq.isEnable);
  }

  async getFAQ(id: number): Promise<FAQ | undefined> {
    return this.faqs.find(faq => faq.id === id);
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const newFAQ: FAQ = {
      ...faq,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  async updateFAQ(id: number, faqData: Partial<InsertFAQ>): Promise<FAQ> {
    const faqIndex = this.faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) {
      throw new Error('FAQ not found');
    }
    
    this.faqs[faqIndex] = {
      ...this.faqs[faqIndex],
      ...faqData,
      updatedAt: new Date()
    };
    
    return this.faqs[faqIndex];
  }

  async deleteFAQ(id: number): Promise<void> {
    const faqIndex = this.faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) {
      throw new Error('FAQ not found');
    }
    this.faqs.splice(faqIndex, 1);
  }

  // Sub-Properties methods
  async getAllSubProperties(farmId?: number): Promise<SubProperty[]> {
    if (farmId) {
      return this.subProperties.filter(sp => sp.farmId === farmId);
    }
    return this.subProperties;
  }

  async getSubProperty(id: number): Promise<SubProperty | undefined> {
    return this.subProperties.find(sp => sp.id === id);
  }

  async createSubProperty(subProperty: InsertSubProperty): Promise<SubProperty> {
    const newSubProperty: SubProperty = {
      ...subProperty,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subProperties.push(newSubProperty);
    return newSubProperty;
  }

  async updateSubProperty(id: number, subPropertyData: Partial<InsertSubProperty>): Promise<SubProperty> {
    const spIndex = this.subProperties.findIndex(sp => sp.id === id);
    if (spIndex === -1) {
      throw new Error('Sub-property not found');
    }
    
    this.subProperties[spIndex] = {
      ...this.subProperties[spIndex],
      ...subPropertyData,
      updatedAt: new Date()
    };
    
    return this.subProperties[spIndex];
  }

  async deleteSubProperty(id: number): Promise<void> {
    const spIndex = this.subProperties.findIndex(sp => sp.id === id);
    if (spIndex === -1) {
      throw new Error('Sub-property not found');
    }
    this.subProperties.splice(spIndex, 1);
  }

  async toggleSubPropertyStatus(id: number): Promise<SubProperty> {
    const sp = this.subProperties.find(sp => sp.id === id);
    if (!sp) {
      throw new Error('Sub-property not found');
    }
    
    sp.isActive = !sp.isActive;
    sp.updatedAt = new Date();
    
    return sp;
  }

  // Banners methods
  async getAllBanners(): Promise<Banner[]> {
    return this.banners.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getBanner(id: number): Promise<Banner | undefined> {
    return this.banners.find(banner => banner.id === id);
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const newBanner: Banner = {
      ...banner,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.banners.push(newBanner);
    return newBanner;
  }

  async updateBanner(id: number, bannerData: Partial<InsertBanner>): Promise<Banner> {
    const bannerIndex = this.banners.findIndex(banner => banner.id === id);
    if (bannerIndex === -1) {
      throw new Error('Banner not found');
    }
    
    this.banners[bannerIndex] = {
      ...this.banners[bannerIndex],
      ...bannerData,
      updatedAt: new Date()
    };
    
    return this.banners[bannerIndex];
  }

  async deleteBanner(id: number): Promise<void> {
    const bannerIndex = this.banners.findIndex(banner => banner.id === id);
    if (bannerIndex === -1) {
      throw new Error('Banner not found');
    }
    this.banners.splice(bannerIndex, 1);
  }

  async toggleBannerStatus(id: number): Promise<Banner> {
    const banner = this.banners.find(banner => banner.id === id);
    if (!banner) {
      throw new Error('Banner not found');
    }
    
    banner.isActive = !banner.isActive;
    banner.updatedAt = new Date();
    
    return banner;
  }

  async reorderBanner(id: number, direction: "up" | "down"): Promise<Banner> {
    const banner = this.banners.find(b => b.id === id);
    if (!banner) {
      throw new Error('Banner not found');
    }

    const sortedBanners = this.banners.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const currentIndex = sortedBanners.findIndex(b => b.id === id);
    
    if (direction === "up" && currentIndex > 0) {
      const temp = sortedBanners[currentIndex - 1].displayOrder;
      sortedBanners[currentIndex - 1].displayOrder = banner.displayOrder;
      banner.displayOrder = temp;
    } else if (direction === "down" && currentIndex < sortedBanners.length - 1) {
      const temp = sortedBanners[currentIndex + 1].displayOrder;
      sortedBanners[currentIndex + 1].displayOrder = banner.displayOrder;
      banner.displayOrder = temp;
    }

    banner.updatedAt = new Date();
    return banner;
  }

  // Featured Sections methods
  async getAllFeaturedSections(): Promise<FeaturedSection[]> {
    return this.featuredSections;
  }

  async getFeaturedSection(id: number): Promise<FeaturedSection | undefined> {
    return this.featuredSections.find(section => section.id === id);
  }

  async createFeaturedSection(section: InsertFeaturedSection): Promise<FeaturedSection> {
    const newSection: FeaturedSection = {
      ...section,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.featuredSections.push(newSection);
    return newSection;
  }

  async updateFeaturedSection(id: number, sectionData: Partial<InsertFeaturedSection>): Promise<FeaturedSection> {
    const sectionIndex = this.featuredSections.findIndex(section => section.id === id);
    if (sectionIndex === -1) {
      throw new Error('Featured section not found');
    }
    
    this.featuredSections[sectionIndex] = {
      ...this.featuredSections[sectionIndex],
      ...sectionData,
      updatedAt: new Date()
    };
    
    return this.featuredSections[sectionIndex];
  }

  async deleteFeaturedSection(id: number): Promise<void> {
    const sectionIndex = this.featuredSections.findIndex(section => section.id === id);
    if (sectionIndex === -1) {
      throw new Error('Featured section not found');
    }
    this.featuredSections.splice(sectionIndex, 1);
    
    // Remove associated farm relationships
    this.featuredSectionFarms = this.featuredSectionFarms.filter(fsf => fsf.sectionId !== id);
  }

  // Featured Section Farms methods
  async getFeaturedSectionFarms(sectionId: number): Promise<FeaturedSectionFarm[]> {
    return this.featuredSectionFarms.filter(fsf => fsf.sectionId === sectionId);
  }

  async addFarmsToSection(sectionId: number, farmIds: number[]): Promise<void> {
    for (const farmId of farmIds) {
      const existing = this.featuredSectionFarms.find(fsf => 
        fsf.sectionId === sectionId && fsf.farmId === farmId
      );
      
      if (!existing) {
        const newFeaturedSectionFarm: FeaturedSectionFarm = {
          id: this.nextId++,
          sectionId,
          farmId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.featuredSectionFarms.push(newFeaturedSectionFarm);
      }
    }
  }

  async removeFarmFromSection(sectionId: number, farmId: number): Promise<void> {
    const index = this.featuredSectionFarms.findIndex(fsf => 
      fsf.sectionId === sectionId && fsf.farmId === farmId
    );
    
    if (index !== -1) {
      this.featuredSectionFarms.splice(index, 1);
    }
  }

  // Reels methods
  async getAllReels(): Promise<Reel[]> {
    return this.reels.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getReel(id: number): Promise<Reel | undefined> {
    return this.reels.find(reel => reel.id === id);
  }

  async createReel(reel: InsertReel): Promise<Reel> {
    const newReel: Reel = {
      ...reel,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reels.push(newReel);
    return newReel;
  }

  async updateReel(id: number, reelData: Partial<InsertReel>): Promise<Reel> {
    const reelIndex = this.reels.findIndex(reel => reel.id === id);
    if (reelIndex === -1) {
      throw new Error('Reel not found');
    }
    
    this.reels[reelIndex] = {
      ...this.reels[reelIndex],
      ...reelData,
      updatedAt: new Date()
    };
    
    return this.reels[reelIndex];
  }

  async deleteReel(id: number): Promise<void> {
    const reelIndex = this.reels.findIndex(reel => reel.id === id);
    if (reelIndex === -1) {
      throw new Error('Reel not found');
    }
    this.reels.splice(reelIndex, 1);
  }

  async toggleReelStatus(id: number): Promise<Reel> {
    const reel = this.reels.find(reel => reel.id === id);
    if (!reel) {
      throw new Error('Reel not found');
    }
    
    reel.isActive = !reel.isActive;
    reel.updatedAt = new Date();
    
    return reel;
  }

  async reorderReel(id: number, direction: "up" | "down"): Promise<Reel> {
    const reel = this.reels.find(r => r.id === id);
    if (!reel) {
      throw new Error('Reel not found');
    }

    const sortedReels = this.reels.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const currentIndex = sortedReels.findIndex(r => r.id === id);
    
    if (direction === "up" && currentIndex > 0) {
      const temp = sortedReels[currentIndex - 1].displayOrder;
      sortedReels[currentIndex - 1].displayOrder = reel.displayOrder;
      reel.displayOrder = temp;
    } else if (direction === "down" && currentIndex < sortedReels.length - 1) {
      const temp = sortedReels[currentIndex + 1].displayOrder;
      sortedReels[currentIndex + 1].displayOrder = reel.displayOrder;
      reel.displayOrder = temp;
    }

    reel.updatedAt = new Date();
    return reel;
  }

  // Availability checker method
  async checkAvailability(checkInDate: string, checkOutDate: string): Promise<any[]> {
    const availableOptions: any[] = [];
    
    // Get all active farms
    const activeFarms = this.farms.filter(farm => farm.isEnable);
    
    // Get all active sub-properties
    const activeSubProperties = this.subProperties.filter(sp => sp.isActive);
    
    // Get existing bookings for the date range
    const existingBookings = this.bookings.filter(booking => {
      const bookingCheckIn = booking.checkInDate;
      const bookingCheckOut = booking.checkOutDate;
      
      // Check if dates overlap
      return !(checkOutDate <= bookingCheckIn || checkInDate >= bookingCheckOut);
    });
    
    // Check farm availability
    for (const farm of activeFarms) {
      const farmBookings = existingBookings.filter(b => b.farmId === farm.id);
      
      // Check morning slot (6 AM - 6 PM)
      const morningBooked = farmBookings.some(b => 
        b.slotType === 'morning' || b.slotType === 'full_day'
      );
      
      // Check evening slot (6 PM - 6 AM)
      const eveningBooked = farmBookings.some(b => 
        b.slotType === 'evening' || b.slotType === 'full_day'
      );
      
      if (!morningBooked) {
        availableOptions.push({
          type: 'farm',
          id: farm.id,
          name: farm.name,
          description: farm.description,
          slotType: 'morning',
          slotTime: '6:00 AM - 6:00 PM',
          pricePerSlot: farm.pricePerSlot,
          city: this.cities.find(c => c.id === farm.cityId)?.name,
          area: this.areas.find(a => a.id === farm.areaId)?.name,
          images: farm.images,
          amenities: farm.amenities?.map(id => this.amenities.find(a => a.id === id)?.name).filter(Boolean)
        });
      }
      
      if (!eveningBooked) {
        availableOptions.push({
          type: 'farm',
          id: farm.id,
          name: farm.name,
          description: farm.description,
          slotType: 'evening',
          slotTime: '6:00 PM - 6:00 AM',
          pricePerSlot: farm.pricePerSlot,
          city: this.cities.find(c => c.id === farm.cityId)?.name,
          area: this.areas.find(a => a.id === farm.areaId)?.name,
          images: farm.images,
          amenities: farm.amenities?.map(id => this.amenities.find(a => a.id === id)?.name).filter(Boolean)
        });
      }
    }
    
    // Check sub-property availability
    for (const subProperty of activeSubProperties) {
      const subPropertyBookings = existingBookings.filter(b => b.subPropertyId === subProperty.id);
      
      // Check morning slot
      const morningBooked = subPropertyBookings.some(b => 
        b.slotType === 'morning' || b.slotType === 'full_day'
      );
      
      // Check evening slot
      const eveningBooked = subPropertyBookings.some(b => 
        b.slotType === 'evening' || b.slotType === 'full_day'
      );
      
      const parentFarm = this.farms.find(f => f.id === subProperty.farmId);
      
      if (!morningBooked) {
        availableOptions.push({
          type: 'sub-property',
          id: subProperty.id,
          farmId: subProperty.farmId,
          farmName: parentFarm?.name,
          name: subProperty.name,
          description: subProperty.description,
          propertyType: subProperty.type,
          capacity: subProperty.capacity,
          slotType: 'morning',
          slotTime: '6:00 AM - 6:00 PM',
          pricePerSlot: subProperty.pricePerSlot,
          city: this.cities.find(c => c.id === parentFarm?.cityId)?.name,
          area: this.areas.find(a => a.id === parentFarm?.areaId)?.name,
          images: subProperty.images,
          amenities: subProperty.amenities?.map(id => this.amenities.find(a => a.id === id)?.name).filter(Boolean)
        });
      }
      
      if (!eveningBooked) {
        availableOptions.push({
          type: 'sub-property',
          id: subProperty.id,
          farmId: subProperty.farmId,
          farmName: parentFarm?.name,
          name: subProperty.name,
          description: subProperty.description,
          propertyType: subProperty.type,
          capacity: subProperty.capacity,
          slotType: 'evening',
          slotTime: '6:00 PM - 6:00 AM',
          pricePerSlot: subProperty.pricePerSlot,
          city: this.cities.find(c => c.id === parentFarm?.cityId)?.name,
          area: this.areas.find(a => a.id === parentFarm?.areaId)?.name,
          images: subProperty.images,
          amenities: subProperty.amenities?.map(id => this.amenities.find(a => a.id === id)?.name).filter(Boolean)
        });
      }
    }
    
    // Sort by price (cheapest first)
    return availableOptions.sort((a, b) => a.pricePerSlot - b.pricePerSlot);
  }
}