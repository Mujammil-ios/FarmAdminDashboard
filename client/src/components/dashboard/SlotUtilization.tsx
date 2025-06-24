import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SlotUtilization() {
  const utilizationData = [
    {
      label: "Morning Slots (6 AM - 6 PM)",
      percentage: 78,
      color: "bg-primary",
    },
    {
      label: "Evening Slots (6 PM - 6 AM)",
      percentage: 65,
      color: "bg-blue-500",
    },
    {
      label: "Cleaning Buffer Time",
      percentage: 12,
      color: "bg-yellow-500",
    },
  ];

  return (
    <Card className="card-white p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Slot Utilization</h3>
          <span className="text-sm text-gray-500">Today's Performance</span>
        </div>
        <div className="space-y-4">
          {utilizationData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
