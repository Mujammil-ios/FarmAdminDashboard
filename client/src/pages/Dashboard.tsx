import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import MetricsCards from "@/components/dashboard/MetricsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import SlotUtilization from "@/components/dashboard/SlotUtilization";
import AvailabilityCalendar from "@/components/dashboard/AvailabilityCalendar";
import RecentBookings from "@/components/dashboard/RecentBookings";
import PendingFarms from "@/components/dashboard/PendingFarms";
import type { DashboardMetrics } from "@/types";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (metricsLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-white p-6">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <SlotUtilization />
      </div>

      {/* Slot Availability Calendar */}
      <AvailabilityCalendar />

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings />
        <PendingFarms />
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-white p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Payment Success Rate</h4>
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 text-sm">💳</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">94.8%</div>
            <div className="text-sm text-green-600">+2.1% from last week</div>
          </CardContent>
        </Card>

        <Card className="card-white p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Avg. Slot Duration</h4>
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 text-sm">⏰</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">11.2 hrs</div>
            <div className="text-sm text-gray-500">Per booking session</div>
          </CardContent>
        </Card>

        <Card className="card-white p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
              <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                <span className="text-yellow-600 text-sm">⭐</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">4.7/5</div>
            <div className="text-sm text-green-600">Based on 1,240 reviews</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
