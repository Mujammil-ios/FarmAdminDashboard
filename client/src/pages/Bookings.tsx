import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, CalendarCheck, Clock, Plus, Eye, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BOOKING_STATUS } from "@/types";
import type { BookingWithDetails } from "@shared/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings"],
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: number }) => {
      await apiRequest("PUT", `/api/bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    },
  });

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.farm?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         booking.confirmationCode?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status.toString() === statusFilter;
    
    const bookingDate = booking.checkInDate ? new Date(booking.checkInDate) : null;
    const matchesDateRange = !dateRange.from || !dateRange.to || !bookingDate ||
                            (bookingDate >= dateRange.from && bookingDate <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  }) || [];

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
      case 0: return <CalendarCheck className="w-4 h-4" />;
      case 1: return <Clock className="w-4 h-4" />;
      case 2: return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const totalBookings = bookings?.length || 0;
  const upcomingBookings = bookings?.filter(b => b.status === 1).length || 0;
  const completedBookings = bookings?.filter(b => b.status === 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Slot Bookings</h1>
          <p className="text-gray-600">Manage farm slot bookings and reservations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings}</div>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by farm, customer, or confirmation code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="1">Upcoming</SelectItem>
                <SelectItem value="0">Complete</SelectItem>
                <SelectItem value="2">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full lg:w-72 justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="card-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Confirmation Code</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Slot Details</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">
                      {booking.confirmationCode || "N/A"}
                    </TableCell>
                    <TableCell>{booking.user?.name || "N/A"}</TableCell>
                    <TableCell>{booking.farm?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {booking.slotType === 'morning' ? 'Morning (6 AM - 6 PM)' : 'Evening (6 PM - 6 AM)'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.noOfGuest}</TableCell>
                    <TableCell>₹{booking.totalPrice?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(booking.status)} text-xs font-semibold px-2 py-1 rounded-full`}>
                        {BOOKING_STATUS[booking.status as keyof typeof BOOKING_STATUS]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 0 })}
                              disabled={updateBookingMutation.isPending}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 2 })}
                              disabled={updateBookingMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Customer Information</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedBooking.user?.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.user?.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Farm Information</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedBooking.farm?.name}</p>
                    <p><span className="font-medium">Address:</span> {selectedBooking.farm?.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Booking Details</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Confirmation Code:</span> {selectedBooking.confirmationCode}</p>
                    <p><span className="font-medium">Check-in:</span> {selectedBooking.checkInDate} {selectedBooking.checkInTime}</p>
                    <p><span className="font-medium">Check-out:</span> {selectedBooking.checkOutDate} {selectedBooking.checkOutTime}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Slot Type:</span> {selectedBooking.slotType === 'morning' ? 'Morning Slot' : 'Evening Slot'}</p>
                    <p><span className="font-medium">Number of Guests:</span> {selectedBooking.noOfGuest}</p>
                    <p><span className="font-medium">Total Price:</span> ₹{selectedBooking.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.description && (
                <div>
                  <h4 className="font-semibold text-gray-900">Special Requests</h4>
                  <p className="mt-2 text-gray-700">{selectedBooking.description}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={`${getStatusColor(selectedBooking.status)} text-sm font-semibold px-3 py-1 rounded-full`}>
                  {BOOKING_STATUS[selectedBooking.status as keyof typeof BOOKING_STATUS]}
                </Badge>
                <div className="text-sm text-gray-500">
                  Created: {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : "N/A"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
