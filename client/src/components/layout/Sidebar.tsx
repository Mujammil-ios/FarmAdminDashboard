import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  BarChart3,
  UserCog,
  ShoppingCart,
  Settings,
  Crown,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

interface NavigationGroup {
  name: string;
  icon: any;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    name: "Analytics",
    icon: BarChart3,
    items: [
      { name: "Dashboard", href: "/dashboard", icon: ChartLine },
      { name: "Farm Performance", href: "/farm-performance", icon: TrendingUp },
      { name: "Availability Checker", href: "/availability-checker", icon: Search },
    ],
  },
  {
    name: "User Management",
    icon: UserCog,
    items: [
      { name: "User Search & Overview", href: "/user-management", icon: UserCog },
      { name: "Customer Management", href: "/customer-management", icon: Users },
      { name: "Owner Management", href: "/owner-management", icon: Building },
      { name: "Payment Management", href: "/payment-management", icon: CreditCard },
      { name: "Basic Users", href: "/users", icon: Users },
      { name: "Reviews", href: "/reviews", icon: Star },
    ],
  },
  {
    name: "Farm Operations",
    icon: Tractor,
    items: [
      { name: "Farms", href: "/farms", icon: Tractor },
      { name: "Requested Farms", href: "/requested-farms", icon: HandHeart },
      { name: "Sub-Properties", href: "/sub-properties", icon: Building },
    ],
  },
  {
    name: "Bookings & Payments",
    icon: ShoppingCart,
    items: [
      { name: "Slot Bookings", href: "/bookings", icon: CalendarCheck },
      { name: "Transactions", href: "/transactions", icon: CreditCard },
    ],
  },
  {
    name: "Content Management",
    icon: Sparkles,
    items: [
      { name: "Banners", href: "/banners", icon: Image },
      { name: "Featured Sections", href: "/featured-sections", icon: Sparkles },
      { name: "Reels", href: "/reels", icon: Video },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    items: [
      { name: "Categories", href: "/categories", icon: Tags },
      { name: "Amenities", href: "/amenities", icon: Waves },
      { name: "Cities & Areas", href: "/cities", icon: MapPin },
      { name: "FAQs", href: "/faqs", icon: HelpCircle },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Analytics: true,
    "User Management": false,
    "Farm Operations": false,
    "Bookings & Payments": false,
    "Content Management": false,
    Settings: false,
  });

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location === href;
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isGroupActive = (group: NavigationGroup) => {
    return group.items.some(item => isActiveRoute(item.href));
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
          <nav className="mt-8 flex-1 px-2 space-y-2">
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups[group.name];
              const isActive = isGroupActive(group);
              
              return (
                <div key={group.name} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center">
                      <group.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-4 w-4",
                          isActive ? "text-primary" : "text-gray-500"
                        )}
                      />
                      <span className="font-semibold">{group.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Group Items */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                      {group.items.map((item) => {
                        const isItemActive = isActiveRoute(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                              isItemActive
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={() => onClose()}
                          >
                            <item.icon
                              className={cn(
                                "mr-3 flex-shrink-0 h-4 w-4",
                                isItemActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                              )}
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
