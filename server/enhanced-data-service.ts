import type { 
  User, 
  Farm, 
  Booking, 
  Transaction, 
  Review,
  Category,
  Amenity,
  City,
  Area,
  FAQ,
  SubProperty,
  Banner,
  FeaturedSection,
  Reel,
  RequestedFarm
} from '@shared/schema';

export class EnhancedDataService {
  // Comprehensive city and state data
  private readonly citiesData = [
    { name: "Mumbai", state: "Maharashtra", population: 12478447, tier: "Tier 1" },
    { name: "Delhi", state: "Delhi", population: 11007835, tier: "Tier 1" },
    { name: "Bangalore", state: "Karnataka", population: 8443675, tier: "Tier 1" },
    { name: "Hyderabad", state: "Telangana", population: 6809970, tier: "Tier 1" },
    { name: "Ahmedabad", state: "Gujarat", population: 5570585, tier: "Tier 1" },
    { name: "Chennai", state: "Tamil Nadu", population: 4681087, tier: "Tier 1" },
    { name: "Kolkata", state: "West Bengal", population: 4496694, tier: "Tier 1" },
    { name: "Pune", state: "Maharashtra", population: 3124458, tier: "Tier 2" },
    { name: "Jaipur", state: "Rajasthan", population: 3046163, tier: "Tier 2" },
    { name: "Surat", state: "Gujarat", population: 4467797, tier: "Tier 2" },
    { name: "Lucknow", state: "Uttar Pradesh", population: 2817105, tier: "Tier 2" },
    { name: "Kanpur", state: "Uttar Pradesh", population: 2767031, tier: "Tier 2" },
    { name: "Nagpur", state: "Maharashtra", population: 2405421, tier: "Tier 2" },
    { name: "Indore", state: "Madhya Pradesh", population: 1994397, tier: "Tier 2" },
    { name: "Thane", state: "Maharashtra", population: 1818872, tier: "Tier 2" },
    { name: "Bhopal", state: "Madhya Pradesh", population: 1798218, tier: "Tier 2" },
    { name: "Visakhapatnam", state: "Andhra Pradesh", population: 1730320, tier: "Tier 2" },
    { name: "Pimpri-Chinchwad", state: "Maharashtra", population: 1729359, tier: "Tier 2" },
    { name: "Patna", state: "Bihar", population: 1684222, tier: "Tier 2" },
    { name: "Vadodara", state: "Gujarat", population: 1666703, tier: "Tier 2" },
    { name: "Ghaziabad", state: "Uttar Pradesh", population: 1636068, tier: "Tier 2" },
    { name: "Ludhiana", state: "Punjab", population: 1618879, tier: "Tier 2" },
    { name: "Agra", state: "Uttar Pradesh", population: 1585704, tier: "Tier 2" },
    { name: "Nashik", state: "Maharashtra", population: 1486973, tier: "Tier 2" },
    { name: "Faridabad", state: "Haryana", population: 1414050, tier: "Tier 2" },
    { name: "Meerut", state: "Uttar Pradesh", population: 1305429, tier: "Tier 2" },
    { name: "Rajkot", state: "Gujarat", population: 1286995, tier: "Tier 2" },
    { name: "Kalyan-Dombivli", state: "Maharashtra", population: 1246381, tier: "Tier 2" },
    { name: "Vasai-Virar", state: "Maharashtra", population: 1221233, tier: "Tier 2" },
    { name: "Varanasi", state: "Uttar Pradesh", population: 1201815, tier: "Tier 2" }
  ];

  private readonly categoriesData = [
    { name: "Organic Farm", icon: "🌱", color: "#22c55e" },
    { name: "Luxury Resort", icon: "🏨", color: "#f59e0b" },
    { name: "Adventure Camp", icon: "🏕️", color: "#ef4444" },
    { name: "Wellness Retreat", icon: "🧘", color: "#8b5cf6" },
    { name: "Family Resort", icon: "👨‍👩‍👧‍👦", color: "#06b6d4" },
    { name: "Eco Lodge", icon: "🌿", color: "#10b981" },
    { name: "Heritage Property", icon: "🏛️", color: "#b45309" },
    { name: "Beach Resort", icon: "🏖️", color: "#0ea5e9" },
    { name: "Mountain Retreat", icon: "⛰️", color: "#64748b" },
    { name: "Vineyard", icon: "🍇", color: "#7c3aed" },
    { name: "Ranch", icon: "🐎", color: "#dc2626" },
    { name: "Plantation Stay", icon: "☕", color: "#a3a3a3" },
    { name: "Wildlife Safari", icon: "🦁", color: "#f97316" },
    { name: "Riverside Lodge", icon: "🏞️", color: "#059669" },
    { name: "Desert Camp", icon: "🐪", color: "#eab308" }
  ];

  private readonly amenitiesData = [
    { name: "Swimming Pool", icon: "🏊", category: "Recreation" },
    { name: "WiFi", icon: "📶", category: "Connectivity" },
    { name: "Parking", icon: "🚗", category: "Convenience" },
    { name: "Restaurant", icon: "🍽️", category: "Dining" },
    { name: "Spa", icon: "💆", category: "Wellness" },
    { name: "Gym", icon: "💪", category: "Fitness" },
    { name: "Conference Hall", icon: "📊", category: "Business" },
    { name: "Kids Play Area", icon: "🎪", category: "Family" },
    { name: "Garden", icon: "🌺", category: "Nature" },
    { name: "Bonfire", icon: "🔥", category: "Entertainment" },
    { name: "Cycling", icon: "🚴", category: "Activity" },
    { name: "Trekking", icon: "🥾", category: "Adventure" },
    { name: "Fishing", icon: "🎣", category: "Activity" },
    { name: "Yoga Hall", icon: "🧘", category: "Wellness" },
    { name: "Game Room", icon: "🎮", category: "Entertainment" },
    { name: "Library", icon: "📚", category: "Leisure" },
    { name: "Pet Friendly", icon: "🐕", category: "Special" },
    { name: "Laundry", icon: "👕", category: "Service" },
    { name: "Medical Aid", icon: "🏥", category: "Safety" },
    { name: "Security", icon: "🔒", category: "Safety" },
    { name: "Room Service", icon: "🛎️", category: "Service" },
    { name: "Airport Pickup", icon: "✈️", category: "Transport" },
    { name: "Organic Food", icon: "🥗", category: "Dining" },
    { name: "BBQ Area", icon: "🍖", category: "Dining" },
    { name: "Solar Power", icon: "☀️", category: "Eco" }
  ];

  private readonly farmNamesPool = [
    // Organic Farms
    "Green Valley Organic Farm", "Golden Harvest Farm", "Wildflower Farm", "Emerald Valley Farm", 
    "Tranquil Waters Farm", "Twilight Grove Farm", "Spring Blossom Farm", "Evening Star Farm",
    "River Bend Farm", "Sunshine Organic Farm", "Nature's Bounty Farm", "Earth Mother Farm",
    "Fresh Fields Farm", "Harvest Moon Farm", "Pure Soil Farm", "Evergreen Organic Farm",
    
    // Luxury Resorts & Hotels
    "Sunset Hills Resort", "Mountain View Retreat", "Pine Ridge Resort", "Serenity Springs Resort", 
    "Garden Paradise Resort", "Harmony Hills Resort", "Sapphire Lake Resort", "Autumn Leaves Resort",
    "Dawn Break Resort", "Lake Shore Resort", "Royal Heritage Resort", "Grand Palace Resort",
    "Majestic Mountain Resort", "Paradise Valley Resort", "Elite Escape Resort", "Premium Heights Resort",
    
    // Villas & Boutique Properties
    "Forest Edge Villa", "Summer Breeze Villa", "Rustic Charm Villa", "Coastal Retreat Villa",
    "Hillside Haven Villa", "Serene Sanctuary Villa", "Luxury Lakeside Villa", "Boutique Garden Villa",
    "Designer's Dream Villa", "Architect's Paradise Villa", "Infinity Pool Villa", "Sky Deck Villa",
    
    // Camps & Adventure Lodges
    "Riverside Camping", "Crystal Lake Lodge", "Bamboo Grove Retreat", "Misty Mountain Lodge",
    "Silver Stream Lodge", "Midnight Sky Lodge", "Valley Vista Lodge", "Rocky Mountain Lodge",
    "Adventure Base Camp", "Wilderness Lodge", "Expedition Camp", "Summit View Lodge",
    
    // Ranches & Estates
    "Blue Sky Ranch", "Meadow Brook Estate", "Thunder Peak Ranch", "Peaceful Valley Estate",
    "Aurora Hills Estate", "Starlight Ranch", "Morning Dew Ranch", "Highland Paradise",
    "Desert Bloom Ranch", "Whispering Pines Ranch", "Lavender Fields Estate", "Country Manor Estate",
    
    // Specialty Properties
    "Ocean Breeze Farm", "Moonlight Bay Farm", "Urban Oasis Farm", "Country Side Retreat",
    "Hill Top Paradise", "Zen Garden Retreat", "Wellness Sanctuary", "Yoga Retreat Center",
    "Artist's Colony Villa", "Writer's Retreat Lodge", "Photographer's Paradise", "Birdwatcher's Haven",
    
    // Sub-Properties & Apartments
    "Orchard View Apartment", "Garden Suite Complex", "Riverside Apartments", "Hillview Residency",
    "Farm Stay Cottages", "Heritage Quarters", "Modern Eco Pods", "Treehouse Suites",
    "Lakefront Cabins", "Mountain Chalets", "Valley View Flats", "Sunrise Apartments"
  ];

  private readonly ownerNamesPool = [
    "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Reddy", "Vikram Singh",
    "Anita Gupta", "Rohan Mehta", "Kavya Joshi", "Arjun Agarwal", "Deepika Rao",
    "Sanjay Verma", "Pooja Shah", "Karan Malhotra", "Nisha Khanna", "Dev Choudhary",
    "Riya Kapoor", "Rohit Bansal", "Shruti Pandey", "Akash Trivedi", "Meera Saxena",
    "Varun Tiwari", "Sunita Goel", "Nikhil Dixit", "Preeti Aggarwal", "Gaurav Mittal",
    "Swati Jindal", "Rahul Garg", "Neha Bhatnagar", "Manish Goyal", "Anusha Sinha",
    "Vivek Chopra", "Rashmi Arora", "Aditya Bhalla", "Simran Kaur", "Ashish Tandon",
    "Kritika Jain", "Suresh Iyer", "Lakshmi Menon", "Arya Nair", "Kiran Kumar",
    "Divya Reddy", "Manoj Singh", "Rekha Gupta", "Arun Sharma", "Usha Patel"
  ];

  private readonly customerNamesPool = [
    "Arjun Mehta", "Kavya Joshi", "Rohit Gupta", "Anita Singh", "Dev Sharma", "Pooja Patel",
    "Karan Shah", "Riya Agarwal", "Sanjay Kumar", "Nisha Rao", "Vikram Malhotra", "Deepika Verma",
    "Amit Khanna", "Priya Choudhary", "Rohan Kapoor", "Sneha Bansal", "Akash Pandey", "Meera Trivedi",
    "Varun Saxena", "Sunita Tiwari", "Nikhil Goel", "Preeti Dixit", "Gaurav Aggarwal", "Swati Mittal",
    "Rahul Jindal", "Neha Garg", "Manish Bhatnagar", "Anusha Goyal", "Vivek Sinha", "Rashmi Chopra",
    "Aditya Arora", "Simran Bhalla", "Ashish Kaur", "Kritika Tandon", "Rajesh Jain", "Anjali Sharma",
    "Naveen Gupta", "Shreya Reddy", "Kunal Singh", "Pallavi Patel", "Harish Shah", "Divya Agarwal",
    "Tarun Kumar", "Ritu Rao", "Ajay Malhotra", "Shweta Verma", "Mohan Khanna", "Geeta Choudhary",
    "Suresh Kapoor", "Madhuri Bansal", "Ramesh Pandey", "Lakshmi Trivedi", "Sunil Saxena", "Poonam Tiwari",
    "Vinay Sharma", "Seema Gupta", "Rakesh Patel", "Nandini Singh", "Yogesh Kumar", "Dipika Reddy"
  ];

  private readonly reviewCommentsPool = [
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
    "The organic farming demonstrations were educational.",
    "Clean rooms with traditional decor and modern facilities.",
    "Enjoyed the tractor rides around the property.",
    "The campfire evenings were magical and memorable.",
    "Helpful staff assisted with all our requirements promptly.",
    "The swimming pool area was well-maintained and clean."
  ];

  private readonly bannerData = [
    {
      title: "Welcome to Farm Paradise",
      description: "Experience the best farm stays across India with BookMyFarm",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Explore Now",
      buttonLink: "/farms"
    },
    {
      title: "Organic Living Experience",
      description: "Stay at certified organic farms and enjoy fresh, chemical-free produce",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Book Organic Stay",
      buttonLink: "/farms?category=organic"
    },
    {
      title: "Weekend Getaway Specials",
      description: "Special discounts on weekend bookings for families and groups",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "View Offers",
      buttonLink: "/offers"
    },
    {
      title: "Adventure Camps",
      description: "Thrilling outdoor activities and adventure sports at select locations",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Adventure Awaits",
      buttonLink: "/farms?category=adventure"
    },
    {
      title: "Luxury Farm Resorts",
      description: "Premium accommodations with five-star amenities in natural settings",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Luxury Experience",
      buttonLink: "/farms?category=luxury"
    }
  ];

  private readonly faqData = [
    {
      question: "How do I book a farm stay?",
      answer: "You can book a farm stay by browsing our farms, selecting your dates, and completing the booking process online. Payment can be made through various methods including UPI, cards, and net banking."
    },
    {
      question: "What is included in the farm stay package?",
      answer: "Farm stay packages typically include accommodation, meals (breakfast, lunch, dinner), basic farm activities, and access to common facilities. Specific inclusions vary by property."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking according to the property's cancellation policy. Free cancellation is usually available up to 24-48 hours before check-in."
    },
    {
      question: "Are pets allowed at farm stays?",
      answer: "Pet policies vary by property. Some farms are pet-friendly while others may not allow pets. Please check the property details or contact us for specific pet policies."
    },
    {
      question: "What activities are available at farms?",
      answer: "Activities vary by farm but commonly include farming activities, nature walks, bullock cart rides, bonfire nights, fishing, cycling, and various outdoor games and sports."
    },
    {
      question: "Is transportation provided to the farm?",
      answer: "Some farms offer pickup and drop services from nearby stations or airports. This service may be complimentary or chargeable depending on the property and distance."
    },
    {
      question: "What should I pack for a farm stay?",
      answer: "Pack comfortable clothing suitable for outdoor activities, sun protection, personal medications, and any specific items mentioned in your booking confirmation."
    },
    {
      question: "Are farm stays suitable for children?",
      answer: "Yes, most farm stays are family-friendly with activities designed for children. Many farms have dedicated play areas, kid-safe farm activities, and family-oriented programs."
    },
    {
      question: "What safety measures are in place?",
      answer: "Farms maintain safety protocols including first aid facilities, trained staff, safe activity areas, and emergency procedures. Specific safety measures vary by property."
    },
    {
      question: "How do I contact the farm directly?",
      answer: "Once you make a booking, you'll receive the farm's contact details in your booking confirmation. You can also contact farms through our platform for pre-booking queries."
    }
  ];

  // Generate cities with realistic area data
  generateCities(): City[] {
    return this.citiesData.map((city, index) => ({
      id: index + 1,
      name: city.name,
      state: city.state,
      isEnable: true,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Generate areas for cities
  generateAreas(cities: City[]): Area[] {
    const areas: Area[] = [];
    let areaId = 1;
    
    cities.forEach(city => {
      const cityData = this.citiesData.find(c => c.name === city.name);
      const areaCount = cityData?.tier === "Tier 1" ? 8 + Math.floor(Math.random() * 7) : 4 + Math.floor(Math.random() * 4);
      
      const areaNames = this.generateAreaNames(city.name, areaCount);
      
      areaNames.forEach(areaName => {
        areas.push({
          id: areaId++,
          name: areaName,
          cityId: city.id,
          isEnable: Math.random() > 0.1, // 90% enabled
          createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
    });
    
    return areas;
  }

  private generateAreaNames(cityName: string, count: number): string[] {
    const commonAreaSuffixes = ["Nagar", "Colony", "Park", "Gardens", "Heights", "Town", "City", "Puram", "Vihar"];
    const directions = ["North", "South", "East", "West", "Central"];
    const landmarks = ["Station Road", "Market", "Junction", "Circle", "Square"];
    
    const areas: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const type = Math.random();
      let areaName;
      
      if (type < 0.3) {
        // Direction based
        areaName = `${directions[Math.floor(Math.random() * directions.length)]} ${cityName}`;
      } else if (type < 0.6) {
        // Landmark based
        areaName = `${landmarks[Math.floor(Math.random() * landmarks.length)]}`;
      } else {
        // Random name with suffix
        const randomName = this.ownerNamesPool[Math.floor(Math.random() * this.ownerNamesPool.length)].split(' ')[0];
        areaName = `${randomName} ${commonAreaSuffixes[Math.floor(Math.random() * commonAreaSuffixes.length)]}`;
      }
      
      if (!areas.includes(areaName)) {
        areas.push(areaName);
      } else {
        i--; // Retry if duplicate
      }
    }
    
    return areas;
  }

  // Generate comprehensive categories
  generateCategories(): Category[] {
    return this.categoriesData.map((cat, index) => ({
      id: index + 1,
      name: cat.name,
      icon: cat.icon,
      isEnable: true,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Generate comprehensive amenities
  generateAmenities(): Amenity[] {
    return this.amenitiesData.map((amenity, index) => ({
      id: index + 1,
      name: amenity.name,
      icon: amenity.icon,
      isEnable: Math.random() > 0.05, // 95% enabled
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Generate comprehensive farm data
  generateFarms(categories: Category[], cities: City[], areas: Area[]): Farm[] {
    const farms: Farm[] = [];
    const farmCount = this.farmNamesPool.length; // Generate all available farms (60+)
    
    for (let i = 0; i < farmCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const cityAreas = areas.filter(area => area.cityId === city.id);
      const area = cityAreas[Math.floor(Math.random() * cityAreas.length)];
      
      const ownerName = this.ownerNamesPool[Math.floor(Math.random() * this.ownerNamesPool.length)];
      const performanceTier = i < 5 ? 'premium' : i < 15 ? 'good' : 'standard';
      
      // Pricing based on category and tier
      let basePrice = 5000;
      if (category.name.includes('Luxury') || category.name.includes('Resort')) basePrice = 15000;
      else if (category.name.includes('Heritage') || category.name.includes('Wellness')) basePrice = 12000;
      else if (category.name.includes('Adventure') || category.name.includes('Camp')) basePrice = 8000;
      
      if (performanceTier === 'premium') basePrice *= 1.5;
      else if (performanceTier === 'good') basePrice *= 1.2;
      
      const morningSlotPrice = basePrice + Math.floor(Math.random() * 3000);
      const eveningSlotPrice = Math.floor(morningSlotPrice * 1.2);
      
      farms.push({
        id: i + 1,
        name: this.farmNamesPool[i],
        description: `Experience authentic ${category.name.toLowerCase()} at ${this.farmNamesPool[i]}. Located in ${area?.name}, ${city.name}, this property offers a perfect blend of nature and comfort with modern amenities.`,
        categoryId: category.id,
        ownerName: ownerName,
        ownerEmail: `${ownerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        ownerPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        morningSlotPrice: morningSlotPrice,
        eveningSlotPrice: eveningSlotPrice,
        cityId: city.id,
        areaId: area?.id || city.id,
        maxGuests: 4 + Math.floor(Math.random() * 16), // 4-20 guests
        totalArea: 1000 + Math.floor(Math.random() * 9000), // 1000-10000 sq ft
        address: `${this.farmNamesPool[i]}, ${area?.name || 'Central Area'}, ${city.name}, ${city.state}`,
        latitude: 20 + (Math.random() * 15), // Realistic latitude for India
        longitude: 70 + (Math.random() * 25), // Realistic longitude for India
        images: [
          `/api/placeholder/800/600?text=${encodeURIComponent(this.farmNamesPool[i])}&bg=1`,
          `/api/placeholder/800/600?text=Room&bg=2`,
          `/api/placeholder/800/600?text=Garden&bg=3`,
          `/api/placeholder/800/600?text=Activities&bg=4`
        ],
        amenities: this.selectRandomAmenities(8, 15), // 8-15 amenities per farm
        isVerified: Math.random() > 0.15, // 85% verified
        isActive: Math.random() > 0.05, // 95% active
        rating: performanceTier === 'premium' ? 4.2 + Math.random() * 0.8 : 
                performanceTier === 'good' ? 3.8 + Math.random() * 0.9 : 
                3.2 + Math.random() * 1.0,
        totalReviews: performanceTier === 'premium' ? 150 + Math.floor(Math.random() * 200) :
                      performanceTier === 'good' ? 75 + Math.floor(Math.random() * 150) :
                      25 + Math.floor(Math.random() * 100),
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return farms;
  }

  private selectRandomAmenities(min: number, max: number): number[] {
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const amenityIds: number[] = [];
    
    while (amenityIds.length < count) {
      const amenityId = 1 + Math.floor(Math.random() * this.amenitiesData.length);
      if (!amenityIds.includes(amenityId)) {
        amenityIds.push(amenityId);
      }
    }
    
    return amenityIds;
  }

  // Generate comprehensive user data
  generateUsers(): User[] {
    const users: User[] = [];
    const userCount = Math.min(this.customerNamesPool.length, 100);
    
    for (let i = 0; i < userCount; i++) {
      const name = this.customerNamesPool[i];
      const role = i < 5 ? 'owner' : 'customer'; // First 5 are owners
      
      users.push({
        id: i + 1,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        role: role,
        isActive: Math.random() > 0.02, // 98% active
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return users;
  }

  // Generate banners
  generateBanners(): Banner[] {
    return this.bannerData.map((banner, index) => ({
      id: index + 1,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      order: index + 1,
      isActive: Math.random() > 0.1, // 90% active
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Generate FAQs
  generateFAQs(): FAQ[] {
    return this.faqData.map((faq, index) => ({
      id: index + 1,
      question: faq.question,
      answer: faq.answer,
      order: index + 1,
      isActive: true,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Get realistic review comments
  getRandomReviewComment(): string {
    return this.reviewCommentsPool[Math.floor(Math.random() * this.reviewCommentsPool.length)];
  }

  // Get random customer name
  getRandomCustomerName(): string {
    return this.customerNamesPool[Math.floor(Math.random() * this.customerNamesPool.length)];
  }

  // Get random owner name
  getRandomOwnerName(): string {
    return this.ownerNamesPool[Math.floor(Math.random() * this.ownerNamesPool.length)];
  }
}