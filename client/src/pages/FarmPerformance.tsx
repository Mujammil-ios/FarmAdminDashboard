import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Users, 
  Building, 
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import type { 
  FarmPerformanceMetrics, 
  DailyBookingTrend, 
  TopFarm, 
  CalendarDayStatus 
} from "@shared/farm-performance-schema";
import IndividualFarmView from "@/components/farm-performance/IndividualFarmView";

export default function FarmPerformance() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  // Fetch global metrics
  const { data: globalMetrics } = useQuery<FarmPerformanceMetrics>({
    queryKey: ["/api/farm-performance/global-metrics"],
  });

  // Fetch daily trends
  const { data: dailyTrends } = useQuery<DailyBookingTrend[]>({
    queryKey: ["/api/farm-performance/daily-trends"],
  });

  // Fetch top farms
  const { data: topFarms } = useQuery<TopFarm[]>({
    queryKey: ["/api/farm-performance/top-farms"],
  });

  // Fetch global calendar data
  const { data: globalCalendarData } = useQuery<CalendarDayStatus[]>({
    queryKey: [
      "/api/farm-performance/global-calendar",
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
    ],
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
    const classes = ["w-8 h-8 text-xs flex items-center justify-center rounded relative"];
    
    if (day.hasBookings) {
      classes.push("border-b-2 border-green-500");
    }
    if (day.hasCancellations) {
      classes.push("border-b-2 border-red-500");
    }
    if (day.hasOfflineBookings) {
      classes.push("border-b-2 border-blue-500");
    }
    
    return classes.join(" ");
  };

  const renderCalendarMonth = () => {
    if (!globalCalendarData) return null;

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before month start
    const startDayOfWeek = monthStart.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    
    daysInMonth.forEach((day, index) => {
      const dayData = globalCalendarData.find(
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
          <div key={weeks.length} className="flex gap-1 justify-center">
            {currentWeek}
          </div>
        );
        currentWeek = [];
      }
    });
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-semibold">
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
        
        <div className="flex gap-1 justify-center text-xs text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="w-8 h-6 flex items-center justify-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {weeks}
        </div>
        
        <div className="flex gap-4 text-xs text-muted-foreground justify-center mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500 rounded" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-red-500 rounded" />
            <span>Cancelled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-blue-500 rounded" />
            <span>Offline</span>
          </div>
        </div>
      </div>
    );
  };

  if (selectedFarmId) {
    return (
      <IndividualFarmView 
        farmId={selectedFarmId} 
        onBack={() => setSelectedFarmId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farm Performance</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights across all farms
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days: {globalMetrics?.last7DaysBookings || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics ? formatCompactCurrency(globalMetrics.totalRevenue) : "₹0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer payments collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics ? formatCompactCurrency(globalMetrics.totalCommission) : "₹0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform fees collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Review Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMetrics?.averageReviewScore?.toFixed(1) || "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics?.activeOwnersCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Farm owners registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalMetrics?.activePropertiesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Listed and active farms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Bookings"
                />
                <Line 
                  type="monotone" 
                  dataKey="cancellations" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Cancellations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Global Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Global Calendar Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {renderCalendarMonth()}
          </CardContent>
        </Card>
      </div>

      {/* Top Farms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Performing Farms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFarms?.map((farm, index) => (
              <div key={farm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <h3 className="font-semibold">{farm.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Last 7 days: {farm.bookingsLast7Days} bookings</span>
                      <span>Revenue: {formatCompactCurrency(farm.revenue)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{farm.averageRating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {farm.cancellationRate}% cancellation
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFarmId(farm.id)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}