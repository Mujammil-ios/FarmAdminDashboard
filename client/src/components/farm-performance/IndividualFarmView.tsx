import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Percent
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import type { 
  IndividualFarmPerformance,
  CalendarDayStatus,
  BookingHistory,
  TransactionHistory,
  FarmReview,
  OwnerPayout
} from "@shared/farm-performance-schema";

interface IndividualFarmViewProps {
  farmId: number;
  onBack: () => void;
}

export default function IndividualFarmView({ farmId, onBack }: IndividualFarmViewProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Fetch individual farm performance
  const { data: farmPerformance } = useQuery<IndividualFarmPerformance>({
    queryKey: [`/api/farm-performance/farm/${farmId}/${selectedMonth.getFullYear()}/${selectedMonth.getMonth() + 1}`],
  });

  // Fetch farm calendar data
  const { data: calendarData } = useQuery<CalendarDayStatus[]>({
    queryKey: [`/api/farm-performance/farm/${farmId}/calendar/${selectedMonth.getFullYear()}/${selectedMonth.getMonth() + 1}`],
  });

  // Fetch booking history
  const { data: bookingHistory } = useQuery<BookingHistory[]>({
    queryKey: [`/api/farm-performance/farm/${farmId}/bookings/${selectedMonth.getFullYear()}/${selectedMonth.getMonth() + 1}`],
  });

  // Fetch transaction history
  const { data: transactionHistory } = useQuery<TransactionHistory[]>({
    queryKey: [`/api/farm-performance/farm/${farmId}/transactions/${selectedMonth.getFullYear()}/${selectedMonth.getMonth() + 1}`],
  });

  // Fetch reviews
  const { data: reviews } = useQuery<FarmReview[]>({
    queryKey: [`/api/farm-performance/farm/${farmId}/reviews`],
  });

  // Fetch payouts
  const { data: payouts } = useQuery<OwnerPayout[]>({
    queryKey: [`/api/farm-performance/farm/${farmId}/payouts`],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const getCalendarDayClass = (day: CalendarDayStatus) => {
    const baseClasses = "w-10 h-10 text-sm flex items-center justify-center rounded relative border";
    const borderClasses = [];
    
    if (day.hasBookings) {
      borderClasses.push("border-b-4 border-b-green-500");
    }
    if (day.hasCancellations) {
      borderClasses.push("border-t-4 border-t-red-500");
    }
    if (day.hasOfflineBookings) {
      borderClasses.push("border-l-4 border-l-blue-500");
    }
    
    return `${baseClasses} ${borderClasses.join(" ")}`;
  };

  const renderFarmCalendar = () => {
    if (!calendarData) return null;

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before month start
    const startDayOfWeek = monthStart.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }
    
    daysInMonth.forEach((day, index) => {
      const dayData = calendarData.find(
        d => d.date === format(day, "yyyy-MM-dd")
      );
      
      currentWeek.push(
        <div
          key={index}
          className={getCalendarDayClass(dayData || {
            date: format(day, "yyyy-MM-dd"),
            hasBookings: false,
            hasCancellations: false,
            hasOfflineBookings: false,
            bookingCount: 0,
            cancellationCount: 0,
          })}
          title={`${format(day, "MMM d")}: ${dayData?.bookingCount || 0} bookings, ${dayData?.cancellationCount || 0} cancellations`}
        >
          {day.getDate()}
        </div>
      );
      
      if (currentWeek.length === 7 || index === daysInMonth.length - 1) {
        weeks.push(
          <div key={weeks.length} className="flex gap-2 justify-center">
            {currentWeek}
          </div>
        );
        currentWeek = [];
      }
    });
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(selectedMonth, "MMMM yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 justify-center text-sm text-muted-foreground mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="w-10 h-8 flex items-center justify-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          {weeks}
        </div>
        
        <div className="flex gap-6 text-sm text-muted-foreground justify-center mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded" />
            <span>Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded" />
            <span>Offline</span>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      cancelled: "destructive", 
      completed: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTransactionTypeBadge = (type: string) => {
    const variants = {
      customer_payment: "default",
      commission_disbursement: "secondary"
    } as const;
    
    const labels = {
      customer_payment: "Customer Payment",
      commission_disbursement: "Commission"
    };
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || "default"}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  if (!farmPerformance) {
    return <div>Loading farm performance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{farmPerformance.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Owner: {farmPerformance.ownerName}</span>
            <span>•</span>
            <span>Type: {farmPerformance.farmType}</span>
            <span>•</span>
            <span>Location: {farmPerformance.location}</span>
          </div>
        </div>
      </div>

      {/* Monthly Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmPerformance.monthlyMetrics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {format(selectedMonth, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCompactCurrency(farmPerformance.monthlyMetrics.bookingRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Booking revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCompactCurrency(farmPerformance.monthlyMetrics.platformCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmPerformance.monthlyMetrics.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Days booked ratio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmPerformance.monthlyMetrics.cancellationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Booking cancellations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmPerformance.monthlyMetrics.averageLeadTime}</div>
            <p className="text-xs text-muted-foreground">
              Days advance booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmPerformance.monthlyMetrics.averageReviewScore}</div>
            <p className="text-xs text-muted-foreground">
              Customer reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          {renderFarmCalendar()}
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="payouts">Owner Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking History - {format(selectedMonth, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingHistory?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{format(new Date(booking.checkInDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(booking.checkOutDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{formatCurrency(booking.amountPaid)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History - {format(selectedMonth, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionHistory?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">#{transaction.id}</TableCell>
                      <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{formatCurrency(transaction.balanceDueToOwner)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.reviewerName}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout Date</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts?.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{format(new Date(payout.payoutDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{formatCurrency(payout.amountPaidOut)}</TableCell>
                      <TableCell>{formatCurrency(payout.outstandingCommission)}</TableCell>
                      <TableCell>{payout.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}