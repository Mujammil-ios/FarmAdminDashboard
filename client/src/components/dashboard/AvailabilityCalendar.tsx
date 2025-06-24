import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSlotStatus } from "@/lib/slots";

// Sample data - in a real app this would come from props or API
const sampleFarms = [
  { id: 1, name: "Green Valley Farm" },
  { id: 2, name: "Sunset Ranch" },
];

const sampleBookings = [
  {
    farmId: 1,
    checkInDate: "2024-06-25",
    slotType: "morning",
    status: 1,
  },
  {
    farmId: 2,
    checkInDate: "2024-06-25",
    slotType: "evening",
    status: 1,
  },
];

export default function AvailabilityCalendar() {
  const days = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28', 'Sat 29', 'Sun 30'];
  const dates = ['2024-06-24', '2024-06-25', '2024-06-26', '2024-06-27', '2024-06-28', '2024-06-29', '2024-06-30'];

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'slot-available';
      case 'booked':
        return 'slot-booked';
      case 'cleaning':
        return 'slot-cleaning';
      case 'blocked':
        return 'slot-blocked';
      default:
        return 'slot-available';
    }
  };

  return (
    <Card className="card-white p-6 mb-8">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Slot Availability Calendar</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Cleaning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Blocked</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Header */}
          <div className="p-3 text-center font-medium text-gray-700">Farm/Time</div>
          {days.map((day, index) => (
            <div key={index} className="p-3 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}

          {/* Farm rows with slots */}
          {sampleFarms.map((farm) => (
            <>
              <div key={farm.id} className="p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
                {farm.name}
              </div>
              {dates.map((date, dateIndex) => (
                <div key={dateIndex} className="grid grid-cols-2 gap-1">
                  <div
                    className={`w-full h-6 rounded text-xs text-white flex items-center justify-center ${getSlotColor(
                      getSlotStatus(date, 'morning', sampleBookings.filter(b => b.farmId === farm.id))
                    )}`}
                  >
                    AM
                  </div>
                  <div
                    className={`w-full h-6 rounded text-xs text-white flex items-center justify-center ${getSlotColor(
                      getSlotStatus(date, 'evening', sampleBookings.filter(b => b.farmId === farm.id))
                    )}`}
                  >
                    PM
                  </div>
                </div>
              ))}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
