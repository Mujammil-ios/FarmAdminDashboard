import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Home, DollarSign, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AvailabilityOption {
  type: 'farm' | 'sub-property';
  id: number;
  farmId?: number;
  farmName?: string;
  name: string;
  description: string;
  propertyType?: string;
  capacity?: number;
  slotType: 'morning' | 'evening';
  slotTime: string;
  pricePerSlot: number;
  city: string;
  area: string;
  images: string[];
  amenities: string[];
}

export default function AvailabilityChecker() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [searchResults, setSearchResults] = useState<AvailabilityOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    try {
      const response = await fetch("/api/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkInDate,
          checkOutDate
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to check availability");
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Failed to check availability. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Available Options ({searchResults.length})
            </h2>
            <Badge variant="secondary">
              Sorted by price (lowest first)
            </Badge>
          </div>

          <div className="grid gap-4">
            {searchResults.map((option, index) => (
              <Card key={`${option.type}-${option.id}-${option.slotType}`} className="overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={option.images[0] || "/placeholder-farm.jpg"}
                      alt={option.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{option.name}</h3>
                          <Badge variant={option.type === 'farm' ? 'default' : 'secondary'}>
                            {option.type === 'farm' ? 'Farm' : 'Sub-Property'}
                          </Badge>
                          {option.farmName && (
                            <Badge variant="outline">
                              @ {option.farmName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {option.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(option.pricePerSlot)}
                        </div>
                        <div className="text-xs text-muted-foreground">per slot</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{option.slotTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{option.area}, {option.city}</span>
                      </div>
                      {option.capacity && (
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Up to {option.capacity} guests</span>
                        </div>
                      )}
                      {option.propertyType && (
                        <div className="flex items-center gap-1 text-sm">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{option.propertyType}</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {option.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {option.amenities.slice(0, 4).map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {option.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{option.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && checkInDate && checkOutDate && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Available Options</h3>
            <p className="text-muted-foreground">
              No farms or sub-properties are available for the selected dates.
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
                  all available farms and sub-properties. Results are sorted by price 
                  to help you offer the best options.
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