import { Card, CardContent } from "@/components/ui/card";
import { Users, Tractor, CalendarCheck, IndianRupee } from "lucide-react";
import type { DashboardMetrics } from "@/types";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      change: "+12% from last month",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Farms",
      value: metrics.activeFarms.toLocaleString(),
      change: "+8% from last month",
      icon: Tractor,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Booked Slots Today",
      value: metrics.bookedSlotsToday.toString(),
      change: "+15% from yesterday",
      icon: CalendarCheck,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Total Revenue",
      value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`,
      change: "+23% from last month",
      icon: IndianRupee,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="card-white p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{card.change}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} text-xl w-6 h-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
