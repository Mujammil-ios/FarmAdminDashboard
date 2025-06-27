import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Users, 
  Building, 
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Activity,
  Target,
  Clock
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

interface FarmPerformanceKPIs {
  totalBookings: number;
  totalRevenue: number;
  totalCommission: number;
  averageReviewScore: number;
  activeOwners: number;
  activeProperties: number;
  bookingTrend: Array<{
    date: string;
    bookings: number;
    cancellations: number;
  }>;
  topFarms: Array<{
    id: number;
    name: string;
    bookings7d: number;
    revenue: number;
    avgRating: number;
    cancellationRate: number;
    location: string;
  }>;
}

interface FarmDetailPerformance {
  farm: {
    id: number;
    name: string;
    owner: string;
    type: string;
    location: string;
    phone: string;
    email: string;
  };
  monthlyKPIs: {
    totalBookings: number;
    bookingRevenue: number;
    platformCommission: number;
    occupancyRate: number;
    cancellationRate: number;
    averageLeadTime: number;
    averageReviewScore: number;
  };
  calendarEvents: Array<{
    date: string;
    bookings: number;
    cancellations: number;
    ownerOfflineBookings: number;
  }>;
  bookingHistory: Array<{
    id: string;
    customerName: string;
    checkIn: string;
    checkOut: string;
    amountPaid: number;
    status: string;
  }>;
  transactions: Array<{
    id: string;
    date: string;
    type: string;
    amount: number;
    balanceDue: number;
  }>;
  reviews: Array<{
    id: string;
    reviewerName: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  ownerPayouts: Array<{
    id: string;
    payoutDate: string;
    amountPaid: number;
    outstandingCommission: number;
    paymentMethod: string;
  }>;
}

export default function FarmPerformance() {
  const [view, setView] = useState<'global' | 'farm'>('global');
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [kpiRange, setKpiRange] = useState<'7' | '30' | 'all'>('30');

  // Global dashboard data
  const { data: globalData, isLoading: globalLoading } = useQuery<FarmPerformanceKPIs>({
    queryKey: ['/api/admin/farms/summary', kpiRange],
    enabled: view === 'global'
  });

  // Individual farm data
  const { data: farmData, isLoading: farmLoading } = useQuery<FarmDetailPerformance>({
    queryKey: ['/api/admin/farms/performance', selectedFarmId, format(selectedMonth, 'yyyy-MM')],
    enabled: view === 'farm' && selectedFarmId !== null
  });

  const handleFarmDrillDown = (farmId: number) => {
    setSelectedFarmId(farmId);
    setView('farm');
  };

  const handleBackToGlobal = () => {
    setView('global');
    setSelectedFarmId(null);
  };

  const getCalendarCellStyle = (date: Date) => {
    if (!farmData?.calendarEvents) return '';
    
    const event = farmData.calendarEvents.find(e => 
      isSameDay(new Date(e.date), date)
    );
    
    if (!event) return '';
    
    let styles = [];
    if (event.bookings > 0) styles.push('border-b-2 border-green-500');
    if (event.cancellations > 0) styles.push('border-b-2 border-red-500');
    if (event.ownerOfflineBookings > 0) styles.push('border-b-2 border-blue-500');
    
    return styles.join(' ');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  if (view === 'global') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Performance Dashboard</h1>
            <p className="text-muted-foreground">Monitor and analyze performance across all properties</p>
          </div>
          <Select value={kpiRange} onValueChange={(value: '7' | '30' | 'all') => setKpiRange(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {globalLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalData?.totalBookings?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {kpiRange === '7' ? 'Last 7 days' : kpiRange === '30' ? 'Last 30 days' : 'All time'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{globalData?.totalRevenue?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Customer payments collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{globalData?.totalCommission?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Platform fees collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalData?.averageReviewScore?.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Across all properties</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalData?.activeOwners}</div>
                  <p className="text-xs text-muted-foreground">Property owners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalData?.activeProperties}</div>
                  <p className="text-xs text-muted-foreground">Live listings</p>
                </CardContent>
              </Card>
            </div>

            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Daily bookings vs cancellations over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={globalData?.bookingTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#22c55e" name="Bookings" />
                    <Line type="monotone" dataKey="cancellations" stroke="#ef4444" name="Cancellations" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 5 Farms */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Farms</CardTitle>
                <CardDescription>Best performing properties by bookings and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farm Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Bookings (7d)</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Rating</TableHead>
                      <TableHead>Cancellation Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalData?.topFarms?.map((farm) => (
                      <TableRow key={farm.id}>
                        <TableCell className="font-medium">{farm.name}</TableCell>
                        <TableCell>{farm.location}</TableCell>
                        <TableCell>{farm.bookings7d}</TableCell>
                        <TableCell>₹{farm.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {farm.avgRating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={farm.cancellationRate > 20 ? 'destructive' : 'secondary'}>
                            {farm.cancellationRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFarmDrillDown(farm.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // Farm Detail View
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToGlobal}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{farmData?.farm.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {farmData?.farm.owner}
              </span>
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {farmData?.farm.type}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {farmData?.farm.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium px-4">
            {format(selectedMonth, 'MMMM yyyy')}
          </span>
          <Button variant="outline" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {farmLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Monthly KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmData?.monthlyKPIs.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{farmData?.monthlyKPIs.bookingRevenue?.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{farmData?.monthlyKPIs.platformCommission?.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmData?.monthlyKPIs.occupancyRate?.toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{farmData?.monthlyKPIs.cancellationRate?.toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmData?.monthlyKPIs.averageLeadTime} days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  {farmData?.monthlyKPIs.averageReviewScore?.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3" />
                  {farmData?.farm.phone}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3" />
                  {farmData?.farm.email}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Calendar</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    Bookings
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-red-500"></div>
                    Cancellations
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    Offline Bookings
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {eachDayOfInterval({
                  start: startOfMonth(selectedMonth),
                  end: endOfMonth(selectedMonth)
                }).map(date => {
                  const event = farmData?.calendarEvents?.find(e => 
                    isSameDay(new Date(e.date), date)
                  );
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={`
                        aspect-square flex items-center justify-center text-sm border rounded-md cursor-pointer hover:bg-muted
                        ${!isSameMonth(date, selectedMonth) ? 'text-muted-foreground' : ''}
                        ${event?.bookings ? 'border-b-2 border-green-500' : ''}
                        ${event?.cancellations ? 'border-b-2 border-red-500' : ''}
                        ${event?.ownerOfflineBookings ? 'border-b-2 border-blue-500' : ''}
                      `}
                      title={
                        event 
                          ? `${event.bookings} bookings, ${event.cancellations} cancellations, ${event.ownerOfflineBookings} offline`
                          : 'No bookings'
                      }
                    >
                      {format(date, 'd')}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bookings">Booking History</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="payouts">Owner Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Check-in Date</TableHead>
                        <TableHead>Check-out Date</TableHead>
                        <TableHead>Amount Paid</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {farmData?.bookingHistory?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono">{booking.id}</TableCell>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{format(new Date(booking.checkIn), 'PPP')}</TableCell>
                          <TableCell>{format(new Date(booking.checkOut), 'PPP')}</TableCell>
                          <TableCell>₹{booking.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'cancelled' ? 'destructive' :
                              'secondary'
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
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
                      {farmData?.transactions?.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono">{transaction.id}</TableCell>
                          <TableCell>{format(new Date(transaction.date), 'PPP')}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>₹{transaction.balanceDue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farmData?.reviews?.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.reviewerName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.date), 'PPP')}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts">
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
                        <TableHead>Outstanding Commission</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {farmData?.ownerPayouts?.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{format(new Date(payout.payoutDate), 'PPP')}</TableCell>
                          <TableCell>₹{payout.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>₹{payout.outstandingCommission.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payout.paymentMethod}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}