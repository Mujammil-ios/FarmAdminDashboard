import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BookingWithDetails } from "@shared/schema";
import { BOOKING_STATUS } from "@/types";

export default function RecentBookings() {
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings/recent"],
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "bg-green-100 text-green-800"; // Complete
      case 1: return "bg-blue-100 text-blue-800"; // Upcoming
      case 2: return "bg-red-100 text-red-800"; // Cancelled
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <CalendarCheck className="w-5 h-5 text-green-600" />;
      case 1: return <CalendarCheck className="w-5 h-5 text-blue-600" />;
      case 2: return <Clock className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="card-white p-6">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-white p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Slot Bookings</h3>
          <a href="/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
            View All
          </a>
        </div>
        <div className="space-y-4">
          {bookings?.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {getStatusIcon(booking.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.farm?.name || 'Unknown Farm'}</p>
                  <p className="text-sm text-gray-500">by {booking.user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">
                    {booking.slotType === 'morning' ? 'Morning Slot (6 AM - 6 PM)' : 'Evening Slot (6 PM - 6 AM)'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(booking.status)} text-xs font-semibold px-2 py-1 rounded-full`}>
                  {BOOKING_STATUS[booking.status as keyof typeof BOOKING_STATUS]}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'No date'}
                </p>
              </div>
            </div>
          ))}
          
          {!bookings?.length && (
            <div className="text-center text-gray-500 py-8">
              No recent bookings found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
