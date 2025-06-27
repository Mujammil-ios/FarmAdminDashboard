import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Home, DollarSign, Search, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FarmSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface FarmAvailability {
  id: number;
  name: string;
  location: string;
  ownerNumber: string;
  dayStay: number;
  nightStay: number;
  pricing: {
    weekDay: { "12H": number; "24H": number };
    weekendDay: { "12H": number; "24H": number };
    aboveWillCharge: number;
  };
  slots: FarmSlot[];
}

export default function AvailabilityChecker() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [farmResults, setFarmResults] = useState<FarmAvailability[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample data for demonstration - matches the design from the image
  const sampleFarms: FarmAvailability[] = [
    {
      id: 1,
      name: "Rosebury Villa",
      location: "New Dandi, Surat",
      ownerNumber: "9725005196",
      dayStay: 12,
      nightStay: 12,
      pricing: {
        weekDay: { "12H": 3900, "24H": 5400 },
        weekendDay: { "12H": 5100, "24H": 6600 },
        aboveWillCharge: 600
      },
      slots: [
        { date: "2025-06-27", startTime: "11:00 AM", endTime: "10:00 PM", isAvailable: true },
        { date: "2025-06-27", startTime: "11:00 PM", endTime: "10:00 AM", isAvailable: true },
        { date: "2025-06-28", startTime: "11:00 AM", endTime: "10:00 PM", isAvailable: true },
        { date: "2025-06-28", startTime: "11:00 PM", endTime: "10:00 AM", isAvailable: true }
      ]
    },
    {
      id: 2,
      name: "The USA Stay",
      location: "New Dandi, Surat",
      ownerNumber: "6353760057",
      dayStay: 7,
      nightStay: 7,
      pricing: {
        weekDay: { "12H": 4000, "24H": 8000 },
        weekendDay: { "12H": 8000, "24H": 8000 },
        aboveWillCharge: 700
      },
      slots: [
        { date: "2025-06-27", startTime: "1:00 AM", endTime: "11:00 PM", isAvailable: true },
        { date: "2025-06-27", startTime: "1:00 PM", endTime: "11:00 AM", isAvailable: true },
        { date: "2025-06-28", startTime: "1:00 AM", endTime: "11:00 PM", isAvailable: true },
        { date: "2025-06-28", startTime: "1:00 PM", endTime: "11:00 AM", isAvailable: true }
      ]
    },
    {
      id: 3,
      name: "Moonlight Nest",
      location: "New Dandi, Surat",
      ownerNumber: "7211199865",
      dayStay: 4,
      nightStay: 4,
      pricing: {
        weekDay: { "12H": 1000, "24H": 2000 },
        weekendDay: { "12H": 1250, "24H": 2500 },
        aboveWillCharge: 500
      },
      slots: [
        { date: "2025-06-27", startTime: "2:00 AM", endTime: "1:00 PM", isAvailable: true },
        { date: "2025-06-27", startTime: "2:00 PM", endTime: "1:00 AM", isAvailable: true },
        { date: "2025-06-28", startTime: "2:00 AM", endTime: "1:00 PM", isAvailable: true },
        { date: "2025-06-28", startTime: "2:00 PM", endTime: "1:00 AM", isAvailable: true }
      ]
    }
  ];

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    if (checkInDate >= checkOutDate) {
      alert("Check-out date must be after check-in date");
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay and use sample data
    setTimeout(() => {
      setFarmResults(sampleFarms);
      setIsSearching(false);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return `₹${price}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability Checker</h1>
        <p className="text-muted-foreground">
          Check available farms and properties for customer inquiries
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Available Slots
          </CardTitle>
          <CardDescription>
            Enter dates to find all available farms and sub-properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Check-in Date</label>
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Check-out Date</label>
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="w-full"
              >
                {isSearching ? "Searching..." : "Check Availability"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Results */}
      {farmResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Available Farms ({farmResults.length})
            </h2>
            <Badge variant="secondary">
              Slot-wise availability
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmResults.map((farm) => (
              <Card key={farm.id} className="p-4 border border-gray-200 bg-white shadow-sm">
                <div className="space-y-4">
                  {/* Farm Header */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      <span className="text-sm text-gray-600">Farm Name:</span> {farm.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {farm.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Owner No. No.:</span> {farm.ownerNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Day Stay:</span> {farm.dayStay} <span className="font-medium">Night Stay:</span> {farm.nightStay}
                    </p>
                  </div>

                  {/* Pricing Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-700">
                        <div>Day</div>
                        <div className="text-center">12 H</div>
                        <div className="text-center">24 H</div>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Week Day</div>
                        <div className="text-center">{formatPrice(farm.pricing.weekDay["12H"])}</div>
                        <div className="text-center">{formatPrice(farm.pricing.weekDay["24H"])}</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Weekend Day</div>
                        <div className="text-center">{formatPrice(farm.pricing.weekendDay["12H"])}</div>
                        <div className="text-center">{formatPrice(farm.pricing.weekendDay["24H"])}</div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">4 Above Will charge</span> {formatPrice(farm.pricing.aboveWillCharge)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slots Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Slots</h4>
                    
                    <div className="space-y-3">
                      {farm.slots.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {slot.startTime}
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <div className="text-sm font-medium text-gray-900">
                              {slot.endTime}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            {formatDate(slot.date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {farmResults.length === 0 && checkInDate && checkOutDate && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Available Farms</h3>
            <p className="text-muted-foreground">
              No farms are available for the selected dates.
              Try different dates or contact customers with alternative suggestions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!checkInDate && !checkOutDate && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Service Tool</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  When customers call with specific dates, use this tool to quickly find 
                  all available farms with detailed pricing and slot information.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium">Select Dates</div>
                  <div className="text-xs text-muted-foreground">Customer's preferred dates</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Search className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium">Find Options</div>
                  <div className="text-xs text-muted-foreground">All available properties</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium">Best Prices</div>
                  <div className="text-xs text-muted-foreground">Sorted by affordability</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}