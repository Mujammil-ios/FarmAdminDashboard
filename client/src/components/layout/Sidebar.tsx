import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  ChartLine,
  Users,
  Tractor,
  CalendarCheck,
  Clock,
  CreditCard,
  HandHeart,
  Star,
  Megaphone,
  Tags,
  MapPin,
  HelpCircle,
  Waves,
  X,
  Building,
  Image,
  Video,
  Sparkles,
  Search,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartLine },
  { name: "Users Management", href: "/users", icon: Users },
  { name: "Farms Management", href: "/farms", icon: Tractor },
  { name: "Slot Bookings", href: "/bookings", icon: CalendarCheck },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Requested Farms", href: "/requested-farms", icon: HandHeart },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Availability Checker", href: "/availability-checker", icon: Search },
];

const businessNavigation = [
  { name: "Sub-Properties", href: "/sub-properties", icon: Building },
  { name: "Banners", href: "/banners", icon: Image },
  { name: "Featured Sections", href: "/featured-sections", icon: Sparkles },
  { name: "Reels", href: "/reels", icon: Video },
];

const settingsNavigation = [
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Amenities", href: "/amenities", icon: Waves },
  { name: "Cities & Areas", href: "/cities", icon: MapPin },
  { name: "FAQs", href: "/faqs", icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location === href;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">BookMyFarm</span>
              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                Admin
              </span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => onClose()}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* Business Features Section */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Business Features
              </h3>
              <div className="mt-2 space-y-1">
                {businessNavigation.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => onClose()}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Settings Section */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
              <div className="mt-2 space-y-1">
                {settingsNavigation.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => onClose()}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
