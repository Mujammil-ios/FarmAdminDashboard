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

  // Generate comprehensive booking data with detailed information
  generateBookings(farms: Farm[], users: User[]): Booking[] {
    const bookings: Booking[] = [];
    const bookingCount = 150; // Generate 150+ detailed bookings
    
    const bookingStatuses = ['confirmed', 'pending', 'cancelled', 'completed', 'checked_in', 'checked_out'];
    const paymentMethods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash'];
    const paymentStatuses = ['completed', 'pending', 'failed', 'refunded', 'partial'];
    const specialRequests = [
      'Early check-in requested',
      'Late check-out needed',
      'Vegetarian meals only',
      'Anniversary celebration setup',
      'Birthday party arrangements',
      'Corporate team building activities',
      'Pet-friendly accommodation',
      'Wheelchair accessibility needed',
      'Organic food preferences',
      'Photography session planned',
      'Yoga session arrangement',
      'Bonfire evening setup'
    ];

    for (let i = 0; i < bookingCount; i++) {
      const farm = farms[Math.floor(Math.random() * farms.length)];
      const user = users.filter(u => u.role === 'customer')[Math.floor(Math.random() * users.filter(u => u.role === 'customer').length)];
      const checkInDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const checkOutDate = new Date(checkInDate.getTime() + (1 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
      const slotType = Math.random() > 0.5 ? 'morning' : 'evening';
      const guestCount = 1 + Math.floor(Math.random() * (farm.maxGuests || 10));
      const pricePerSlot = slotType === 'morning' ? farm.morningSlotPrice : farm.eveningSlotPrice;
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (24 * 60 * 60 * 1000));
      const subtotal = (pricePerSlot || 5000) * nights;
      const taxAmount = Math.round(subtotal * 0.18); // 18% GST
      const discountAmount = Math.random() > 0.7 ? Math.round(subtotal * (0.05 + Math.random() * 0.15)) : 0;
      const totalAmount = subtotal + taxAmount - discountAmount;

      bookings.push({
        id: i + 1,
        userId: user?.id || 1,
        farmId: farm.id,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        slotType: slotType,
        guestCount: guestCount,
        totalAmount: totalAmount,
        subtotal: subtotal,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        advanceAmount: Math.round(totalAmount * (0.2 + Math.random() * 0.3)), // 20-50% advance
        remainingAmount: Math.round(totalAmount * (0.5 + Math.random() * 0.3)),
        status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)] as any,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as any,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] as any,
        specialRequests: Math.random() > 0.6 ? specialRequests[Math.floor(Math.random() * specialRequests.length)] : null,
        cancellationReason: Math.random() > 0.85 ? 'Emergency came up' : null,
        customerNotes: Math.random() > 0.7 ? 'Looking forward to a peaceful stay with family' : null,
        adminNotes: Math.random() > 0.8 ? 'VIP customer - provide extra care' : null,
        confirmationCode: `BK${String(i + 1).padStart(6, '0')}`,
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        updatedAt: new Date()
      });
    }
    
    return bookings;
  }

  // Generate comprehensive transaction data with detailed payment information
  generateTransactions(bookings: Booking[], farms: Farm[], users: User[]): Transaction[] {
    const transactions: Transaction[] = [];
    const transactionTypes = ['booking_payment', 'refund', 'cancellation_fee', 'additional_charges', 'security_deposit'];
    const paymentGateways = ['razorpay', 'payu', 'ccavenue', 'stripe', 'phonepe', 'googlepay'];
    const bankNames = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Yes Bank', 'IDFC Bank'];
    
    // Create transactions for each booking
    bookings.forEach((booking, index) => {
      const farm = farms.find(f => f.id === booking.farmId);
      const user = users.find(u => u.id === booking.userId);
      
      // Primary booking payment
      transactions.push({
        id: (index * 3) + 1,
        userId: booking.userId,
        farmId: booking.farmId,
        bookingId: booking.id,
        amount: booking.totalAmount || 5000,
        transactionType: 'booking_payment',
        paymentMethod: booking.paymentMethod || 'credit_card',
        paymentGateway: paymentGateways[Math.floor(Math.random() * paymentGateways.length)],
        gatewayTransactionId: `TXN${String(Date.now() + index).slice(-10)}`,
        gatewayResponse: '{"status":"success","message":"Payment completed successfully"}',
        bankReference: `BANK${String(Date.now() + index).slice(-8)}`,
        bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
        cardLast4: Math.random() > 0.5 ? String(Math.floor(Math.random() * 10000)).padStart(4, '0') : null,
        upiId: booking.paymentMethod === 'upi' ? `${user?.name?.toLowerCase().replace(/\s+/g, '')}@paytm` : null,
        status: booking.paymentStatus || 'completed',
        processingFee: Math.round((booking.totalAmount || 5000) * 0.02), // 2% processing fee
        gstAmount: Math.round((booking.totalAmount || 5000) * 0.18),
        netAmount: Math.round((booking.totalAmount || 5000) * 0.98),
        settlementDate: booking.status === 'completed' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        description: `Payment for booking at ${farm?.name} from ${booking.checkInDate} to ${booking.checkOutDate}`,
        failureReason: booking.paymentStatus === 'failed' ? 'Insufficient funds' : null,
        refundAmount: booking.paymentStatus === 'refunded' ? booking.totalAmount : null,
        refundDate: booking.paymentStatus === 'refunded' ? new Date() : null,
        createdAt: new Date(booking.createdAt || new Date()),
        updatedAt: new Date()
      });

      // Additional charges (random)
      if (Math.random() > 0.7) {
        transactions.push({
          id: (index * 3) + 2,
          userId: booking.userId,
          farmId: booking.farmId,
          bookingId: booking.id,
          amount: 500 + Math.floor(Math.random() * 2000),
          transactionType: 'additional_charges',
          paymentMethod: 'cash',
          description: 'Additional services and amenities',
          status: 'completed',
          createdAt: new Date(booking.createdAt || new Date()),
          updatedAt: new Date()
        });
      }

      // Security deposit (for premium bookings)
      if ((booking.totalAmount || 0) > 10000) {
        transactions.push({
          id: (index * 3) + 3,
          userId: booking.userId,
          farmId: booking.farmId,
          bookingId: booking.id,
          amount: 2000,
          transactionType: 'security_deposit',
          paymentMethod: booking.paymentMethod,
          description: 'Refundable security deposit',
          status: booking.status === 'completed' ? 'refunded' : 'held',
          refundAmount: booking.status === 'completed' ? 2000 : null,
          refundDate: booking.status === 'completed' ? new Date() : null,
          createdAt: new Date(booking.createdAt || new Date()),
          updatedAt: new Date()
        });
      }
    });
    
    return transactions.filter(t => t.id); // Remove undefined transactions
  }

  // Generate comprehensive customer data with detailed profiles
  generateDetailedCustomers(): any[] {
    const customers: any[] = [];
    const customerSegments = ['Premium', 'Gold', 'Silver', 'Bronze', 'New'];
    const occupations = ['Software Engineer', 'Doctor', 'Business Owner', 'Teacher', 'Lawyer', 'Consultant', 'Manager', 'Architect', 'Designer', 'Entrepreneur'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];
    const interests = ['Nature Photography', 'Organic Farming', 'Adventure Sports', 'Wellness', 'Family Time', 'Corporate Retreats', 'Yoga', 'Meditation', 'Cycling', 'Trekking'];
    
    for (let i = 0; i < 80; i++) {
      const name = this.customerNamesPool[i % this.customerNamesPool.length];
      const segment = customerSegments[Math.floor(Math.random() * customerSegments.length)];
      const joinDate = new Date(2023, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
      const totalBookings = Math.floor(Math.random() * 15) + 1;
      const totalSpent = totalBookings * (3000 + Math.random() * 12000);
      
      customers.push({
        id: i + 1,
        firebaseId: `firebase-customer-${String(i + 1).padStart(3, '0')}`,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        alternatePhone: Math.random() > 0.6 ? `+91${Math.floor(Math.random() * 9000000000) + 1000000000}` : null,
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 35), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        annualIncome: (3 + Math.floor(Math.random() * 20)) * 100000, // 3-25 lakhs
        address: {
          street: `${Math.floor(Math.random() * 500) + 1}, ${name.split(' ')[0]} Street`,
          city: cities[Math.floor(Math.random() * cities.length)],
          state: 'Maharashtra',
          pincode: String(400000 + Math.floor(Math.random() * 99999)),
          country: 'India'
        },
        emergencyContact: {
          name: this.customerNamesPool[Math.floor(Math.random() * this.customerNamesPool.length)],
          relation: Math.random() > 0.5 ? 'Spouse' : 'Parent',
          phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
        },
        preferences: {
          foodType: Math.random() > 0.3 ? 'Vegetarian' : 'Non-Vegetarian',
          roomType: Math.random() > 0.7 ? 'Premium' : 'Standard',
          interests: interests.slice(0, 2 + Math.floor(Math.random() * 3)),
          notifications: {
            email: Math.random() > 0.2,
            sms: Math.random() > 0.3,
            whatsapp: Math.random() > 0.1
          }
        },
        loyaltyProgram: {
          segment: segment,
          points: Math.floor(totalSpent / 100),
          tier: segment,
          nextTierPoints: segment === 'Premium' ? 0 : 1000 - (Math.floor(totalSpent / 100) % 1000),
          benefits: segment === 'Premium' ? ['Priority Booking', 'Free Cancellation', '20% Discount'] : ['Standard Booking']
        },
        bookingHistory: {
          totalBookings: totalBookings,
          completedBookings: Math.floor(totalBookings * 0.85),
          cancelledBookings: Math.floor(totalBookings * 0.1),
          noShowBookings: Math.floor(totalBookings * 0.05),
          totalSpent: Math.round(totalSpent),
          averageBookingValue: Math.round(totalSpent / totalBookings),
          lastBookingDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          favoriteProperties: [1, 3, 5].slice(0, Math.floor(Math.random() * 3) + 1)
        },
        paymentInfo: {
          preferredMethod: ['credit_card', 'debit_card', 'upi', 'net_banking'][Math.floor(Math.random() * 4)],
          savedCards: Math.floor(Math.random() * 3),
          defaultUpiId: `${name.toLowerCase().replace(/\s+/g, '')}@paytm`,
          creditScore: 650 + Math.floor(Math.random() * 200)
        },
        communication: {
          preferredLanguage: Math.random() > 0.7 ? 'Hindi' : 'English',
          lastContactDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          supportTickets: Math.floor(Math.random() * 5),
          feedbackRating: 3.5 + Math.random() * 1.5
        },
        verification: {
          emailVerified: Math.random() > 0.05,
          phoneVerified: Math.random() > 0.02,
          kycStatus: Math.random() > 0.3 ? 'verified' : 'pending',
          documentType: 'Aadhar Card',
          documentNumber: `****-****-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
        },
        status: Math.random() > 0.02 ? 'active' : 'inactive',
        registrationDate: joinDate,
        lastLoginDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        referralCode: `REF${String(i + 1).padStart(6, '0')}`,
        referredBy: Math.random() > 0.8 ? `REF${String(Math.floor(Math.random() * i) + 1).padStart(6, '0')}` : null,
        createdAt: joinDate,
        updatedAt: new Date()
      });
    }
    
    return customers;
  }

  // Generate comprehensive farm owner data
  generateDetailedOwners(): any[] {
    const owners: any[] = [];
    const businessTypes = ['Individual', 'Partnership', 'Private Limited', 'LLP', 'Sole Proprietorship'];
    const bankNames = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Yes Bank'];
    
    for (let i = 0; i < 25; i++) {
      const name = this.ownerNamesPool[i % this.ownerNamesPool.length];
      const businessName = `${name.split(' ')[0]} Farms & Resorts`;
      const joinDate = new Date(2022, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
      const totalEarnings = 50000 + Math.random() * 500000;
      
      owners.push({
        id: i + 1,
        firebaseId: `firebase-owner-${String(i + 1).padStart(3, '0')}`,
        personalInfo: {
          name: name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@business.com`,
          phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          alternatePhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          dateOfBirth: new Date(1960 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.7 ? 'Female' : 'Male',
          address: {
            street: `${Math.floor(Math.random() * 200) + 1}, Farm Road`,
            city: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].name,
            state: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].state,
            pincode: String(400000 + Math.floor(Math.random() * 99999)),
            country: 'India'
          }
        },
        businessInfo: {
          businessName: businessName,
          businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
          gstNumber: `27ABCDE${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}F1Z5`,
          panNumber: `ABCDE${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}F`,
          businessAddress: {
            street: `Plot ${Math.floor(Math.random() * 100) + 1}, Industrial Area`,
            city: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].name,
            state: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].state,
            pincode: String(400000 + Math.floor(Math.random() * 99999)),
            country: 'India'
          },
          yearEstablished: 2015 + Math.floor(Math.random() * 8),
          totalProperties: 1 + Math.floor(Math.random() * 5),
          businessLicense: `BL${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
        },
        bankDetails: {
          accountHolderName: name,
          bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
          accountNumber: `****${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          ifscCode: `HDFC0${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
          branchName: `${this.citiesData[Math.floor(Math.random() * this.citiesData.length)].name} Branch`,
          accountType: Math.random() > 0.5 ? 'Current' : 'Savings',
          verified: Math.random() > 0.1
        },
        financialInfo: {
          totalEarnings: Math.round(totalEarnings),
          totalBookings: Math.floor(totalEarnings / 5000),
          averageRating: 3.5 + Math.random() * 1.5,
          commissionRate: 15 + Math.floor(Math.random() * 10), // 15-25%
          pendingPayouts: Math.round(totalEarnings * 0.1),
          lastPayoutDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          nextPayoutDate: new Date(Date.now() + (7 - new Date().getDay()) * 24 * 60 * 60 * 1000),
          taxDeducted: Math.round(totalEarnings * 0.05), // 5% TDS
          monthlyEarnings: Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            earnings: Math.round(totalEarnings / 12 + (Math.random() - 0.5) * totalEarnings * 0.3),
            bookings: Math.floor(Math.random() * 20) + 5
          }))
        },
        properties: Array.from({length: 1 + Math.floor(Math.random() * 3)}, (_, j) => ({
          id: (i * 3) + j + 1,
          name: this.farmNamesPool[(i * 3) + j % this.farmNamesPool.length],
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          averageRating: 3.5 + Math.random() * 1.5,
          totalBookings: Math.floor(Math.random() * 50) + 10,
          monthlyRevenue: Math.round(totalEarnings / 3)
        })),
        kycInfo: {
          status: Math.random() > 0.2 ? 'verified' : 'pending',
          documentsSubmitted: {
            aadharCard: Math.random() > 0.05,
            panCard: Math.random() > 0.05,
            bankPassbook: Math.random() > 0.1,
            businessLicense: Math.random() > 0.2,
            gstCertificate: Math.random() > 0.3
          },
          verificationDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
          rejectionReason: Math.random() > 0.9 ? 'Document quality not clear' : null
        },
        communication: {
          preferredLanguage: Math.random() > 0.6 ? 'Hindi' : 'English',
          whatsappEnabled: Math.random() > 0.2,
          emailEnabled: Math.random() > 0.1,
          smsEnabled: Math.random() > 0.3,
          lastContactDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
          supportTickets: Math.floor(Math.random() * 3),
          responseTime: Math.floor(Math.random() * 120) + 30 // 30-150 minutes
        },
        performance: {
          rating: 3.5 + Math.random() * 1.5,
          totalReviews: Math.floor(Math.random() * 100) + 20,
          responseRate: Math.floor(Math.random() * 30) + 70, // 70-100%
          cancellationRate: Math.floor(Math.random() * 5) + 1, // 1-5%
          onTimeCheckIn: Math.floor(Math.random() * 20) + 80, // 80-100%
          qualityScore: Math.floor(Math.random() * 20) + 80, // 80-100%
          repeatCustomerRate: Math.floor(Math.random() * 40) + 20 // 20-60%
        },
        status: Math.random() > 0.02 ? 'active' : 'suspended',
        registrationDate: joinDate,
        lastLoginDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        contractSigned: Math.random() > 0.05,
        contractExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        createdAt: joinDate,
        updatedAt: new Date()
      });
    }
    
    return owners;
  }

  // Generate comprehensive review data
  generateDetailedReviews(farms: Farm[], users: User[]): any[] {
    const reviews: any[] = [];
    const reviewCount = 200; // Generate 200+ detailed reviews
    
    const reviewCategories = ['Overall Experience', 'Cleanliness', 'Food Quality', 'Staff Behavior', 'Value for Money', 'Amenities'];
    const positiveComments = [
      'Amazing experience! Everything was perfect.',
      'Beautiful property with excellent facilities.',
      'Staff was very helpful and friendly.',
      'Food quality was outstanding.',
      'Perfect place for family vacation.',
      'Great value for money.',
      'Clean and well-maintained facilities.',
      'Peaceful environment, exactly what we needed.',
      'Kids loved the activities.',
      'Will definitely visit again.'
    ];
    
    const negativeComments = [
      'Room could have been cleaner.',
      'Food options were limited.',
      'Staff response was slow.',
      'Wi-Fi connectivity issues.',
      'Overpriced for the facilities provided.',
      'Maintenance needed for some amenities.',
      'Parking space was insufficient.',
      'Check-in process took too long.'
    ];
    
    for (let i = 0; i < reviewCount; i++) {
      const farm = farms[Math.floor(Math.random() * farms.length)];
      const user = users.filter(u => u.role === 'customer')[Math.floor(Math.random() * users.filter(u => u.role === 'customer').length)];
      const rating = Math.floor(Math.random() * 5) + 1;
      const isPositive = rating >= 4;
      
      reviews.push({
        id: i + 1,
        userId: user?.id || 1,
        farmId: farm.id,
        bookingId: Math.floor(Math.random() * 150) + 1,
        rating: rating,
        comment: isPositive ? 
          positiveComments[Math.floor(Math.random() * positiveComments.length)] :
          negativeComments[Math.floor(Math.random() * negativeComments.length)],
        categories: {
          cleanliness: Math.floor(Math.random() * 5) + 1,
          foodQuality: Math.floor(Math.random() * 5) + 1,
          staffBehavior: Math.floor(Math.random() * 5) + 1,
          valueForMoney: Math.floor(Math.random() * 5) + 1,
          amenities: Math.floor(Math.random() * 5) + 1
        },
        photos: Math.random() > 0.7 ? [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
        ] : [],
        helpfulVotes: Math.floor(Math.random() * 20),
        reportedCount: Math.random() > 0.95 ? Math.floor(Math.random() * 3) : 0,
        reviewType: Math.random() > 0.8 ? 'verified_stay' : 'general',
        stayDuration: Math.floor(Math.random() * 5) + 1,
        travelType: ['Solo', 'Couple', 'Family', 'Business', 'Friends'][Math.floor(Math.random() * 5)],
        isVisible: Math.random() > 0.02, // 98% visible
        adminResponse: Math.random() > 0.8 ? 'Thank you for your feedback. We appreciate your visit!' : null,
        adminResponseDate: Math.random() > 0.8 ? new Date() : null,
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        updatedAt: new Date()
      });
    }
    
    return reviews;
  }

  // Generate comprehensive sub-property data
  generateDetailedSubProperties(farms: Farm[]): any[] {
    const subProperties: any[] = [];
    const roomTypes = ['Deluxe Room', 'Premium Villa', 'Standard Cottage', 'Luxury Suite', 'Family Room', 'Dormitory', 'Treehouse', 'Tent'];
    const amenityFeatures = ['AC', 'Heater', 'Wi-Fi', 'TV', 'Mini Fridge', 'Balcony', 'Garden View', 'Private Bathroom'];
    
    farms.forEach((farm, farmIndex) => {
      const subPropertyCount = 2 + Math.floor(Math.random() * 4); // 2-5 sub-properties per farm
      
      for (let i = 0; i < subPropertyCount; i++) {
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
        const maxGuests = 2 + Math.floor(Math.random() * 8);
        const basePrice = 1000 + Math.random() * 4000;
        
        subProperties.push({
          id: (farmIndex * 5) + i + 1,
          farmId: farm.id,
          name: `${roomType} ${i + 1}`,
          type: roomType,
          description: `Comfortable ${roomType.toLowerCase()} with modern amenities and beautiful views.`,
          maxGuests: maxGuests,
          bedrooms: Math.floor(maxGuests / 2) || 1,
          bathrooms: Math.floor(maxGuests / 3) || 1,
          amenities: amenityFeatures.slice(0, 3 + Math.floor(Math.random() * 5)),
          pricing: {
            basePrice: Math.round(basePrice),
            weekendSurcharge: Math.round(basePrice * 0.2),
            holidaySurcharge: Math.round(basePrice * 0.5),
            cleaningFee: Math.round(basePrice * 0.1),
            securityDeposit: Math.round(basePrice * 0.5)
          },
          area: `${200 + Math.floor(Math.random() * 500)} sq ft`,
          floor: Math.floor(Math.random() * 3) + 1,
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'
          ],
          features: {
            hasAC: Math.random() > 0.3,
            hasWiFi: Math.random() > 0.1,
            hasTV: Math.random() > 0.4,
            hasKitchen: Math.random() > 0.6,
            hasBalcony: Math.random() > 0.5,
            petFriendly: Math.random() > 0.7,
            smokingAllowed: Math.random() > 0.9
          },
          availability: {
            isActive: Math.random() > 0.1, // 90% active
            minimumStay: Math.floor(Math.random() * 3) + 1,
            maximumStay: 7 + Math.floor(Math.random() * 8),
            advanceBookingDays: 30 + Math.floor(Math.random() * 60),
            checkInTime: '14:00',
            checkOutTime: '11:00'
          },
          bookingStats: {
            totalBookings: Math.floor(Math.random() * 50),
            averageRating: 3.5 + Math.random() * 1.5,
            occupancyRate: Math.floor(Math.random() * 40) + 60, // 60-100%
            lastBookedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          },
          isActive: Math.random() > 0.05, // 95% active
          createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          updatedAt: new Date()
        });
      }
    });
    
    return subProperties;
  }

  // Generate comprehensive reels data
  generateDetailedReels(farms: Farm[]): any[] {
    const reels: any[] = [];
    const reelTitles = [
      'Morning Sunrise at the Farm',
      'Fresh Organic Harvest',
      'Farm to Table Experience',
      'Peaceful Evening Vibes',
      'Kids Having Fun',
      'Farm Animals Up Close',
      'Traditional Farming Methods',
      'Cooking with Fresh Ingredients',
      'Nature Walk Tour',
      'Sunset Photography'
    ];
    
    const reelDescriptions = [
      'Witness the breathtaking sunrise over our organic fields',
      'From farm to your plate - fresh and healthy',
      'Experience authentic farm life',
      'Relax and unwind in nature\'s embrace',
      'Creating memories that last a lifetime',
      'Meet our friendly farm animals',
      'Preserving traditional farming practices',
      'Taste the difference of fresh ingredients',
      'Explore the beauty of rural landscape',
      'Capture the perfect golden hour moments'
    ];
    
    for (let i = 0; i < 50; i++) {
      const farm = farms[Math.floor(Math.random() * farms.length)];
      const titleIndex = Math.floor(Math.random() * reelTitles.length);
      
      reels.push({
        id: i + 1,
        farmId: farm.id,
        title: reelTitles[titleIndex],
        description: reelDescriptions[titleIndex],
        videoUrl: `https://videos.unsplash.com/video-${i + 1}.mp4`,
        thumbnailUrl: `https://images.unsplash.com/photo-${1542314831068 + i}?w=400`,
        duration: 15 + Math.floor(Math.random() * 45), // 15-60 seconds
        category: ['Nature', 'Food', 'Activities', 'Animals', 'Lifestyle'][Math.floor(Math.random() * 5)],
        tags: ['farm', 'organic', 'nature', 'fresh', 'peaceful'].slice(0, 3 + Math.floor(Math.random() * 3)),
        engagement: {
          views: Math.floor(Math.random() * 10000) + 500,
          likes: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5
        },
        uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        isActive: Math.random() > 0.05, // 95% active
        isFeatured: Math.random() > 0.8, // 20% featured
        displayOrder: i + 1,
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        updatedAt: new Date()
      });
    }
    
    return reels.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Generate comprehensive requested farms data
  generateDetailedRequestedFarms(users: User[]): any[] {
    const requestedFarms: any[] = [];
    const farmTypes = ['Organic Farm', 'Dairy Farm', 'Poultry Farm', 'Fruit Orchard', 'Vegetable Farm', 'Herb Garden', 'Flower Farm', 'Fish Farm'];
    const statuses = ['pending', 'under_review', 'approved', 'rejected', 'requires_documents'];
    
    for (let i = 0; i < 25; i++) {
      const owner = users.filter(u => u.role === 'owner')[Math.floor(Math.random() * users.filter(u => u.role === 'owner').length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const farmType = farmTypes[Math.floor(Math.random() * farmTypes.length)];
      
      requestedFarms.push({
        id: i + 1,
        userId: owner?.id || 1,
        ownerName: owner?.name || 'Unknown Owner',
        ownerPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        ownerEmail: owner?.email || 'owner@email.com',
        farmDetails: {
          name: `${this.farmNamesPool[i % this.farmNamesPool.length]} ${farmType}`,
          type: farmType,
          description: `A beautiful ${farmType.toLowerCase()} with modern facilities and traditional farming practices.`,
          totalArea: `${5 + Math.floor(Math.random() * 45)} acres`,
          cultivatedArea: `${3 + Math.floor(Math.random() * 25)} acres`,
          establishedYear: 2010 + Math.floor(Math.random() * 15),
          certifications: Math.random() > 0.5 ? ['Organic Certified', 'FSSAI Approved'] : ['Under Process']
        },
        location: {
          address: `Plot ${Math.floor(Math.random() * 500) + 1}, Farm Road`,
          city: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].name,
          state: this.citiesData[Math.floor(Math.random() * this.citiesData.length)].state,
          pincode: String(400000 + Math.floor(Math.random() * 99999)),
          coordinates: {
            latitude: 18.5 + Math.random() * 10,
            longitude: 72.8 + Math.random() * 10
          }
        },
        facilities: {
          accommodation: Math.random() > 0.3,
          restaurant: Math.random() > 0.6,
          parking: Math.random() > 0.2,
          wifi: Math.random() > 0.4,
          electricityBackup: Math.random() > 0.5,
          firstAid: Math.random() > 0.7,
          guidedTours: Math.random() > 0.3,
          playArea: Math.random() > 0.6
        },
        pricing: {
          proposedDayRate: Math.round(2000 + Math.random() * 8000),
          seasonalVariation: Math.random() > 0.5,
          groupDiscounts: Math.random() > 0.6,
          corporateRates: Math.random() > 0.7
        },
        documents: {
          landOwnershipProof: Math.random() > 0.1,
          businessLicense: Math.random() > 0.2,
          taxDocuments: Math.random() > 0.3,
          farmCertificates: Math.random() > 0.5,
          insurancePolicy: Math.random() > 0.6,
          bankDetails: Math.random() > 0.1
        },
        status: status,
        applicationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        reviewDate: status !== 'pending' ? new Date() : null,
        reviewedBy: status !== 'pending' ? 'Admin Team' : null,
        approvalDate: status === 'approved' ? new Date() : null,
        rejectionReason: status === 'rejected' ? 'Incomplete documentation' : null,
        requiredActions: status === 'requires_documents' ? ['Submit land ownership proof', 'Provide business license'] : [],
        estimatedProcessingTime: '7-14 business days',
        priority: Math.random() > 0.8 ? 'high' : 'normal',
        notes: 'Application under review by our verification team.',
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        updatedAt: new Date()
      });
    }
    
    return requestedFarms;
  }
}