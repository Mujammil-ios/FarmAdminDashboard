import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RotateCcw,
  Clock,
  User,
  Database,
  FileEdit,
  Trash2,
  Plus,
  Settings
} from "lucide-react";
import { format } from "date-fns";

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7");

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["/api/audit-logs", moduleFilter, actionFilter, dateRange],
  });

  const modules = ["rewards", "bookings", "users", "farms", "campaigns", "config"];
  const actions = ["create", "update", "delete", "view", "login", "export"];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create": return <Plus className="h-4 w-4" />;
      case "update": return <FileEdit className="h-4 w-4" />;
      case "delete": return <Trash2 className="h-4 w-4" />;
      case "view": return <Eye className="h-4 w-4" />;
      case "login": return <User className="h-4 w-4" />;
      case "export": return <Download className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create": return "default";
      case "update": return "secondary";
      case "delete": return "destructive";
      case "view": return "outline";
      case "login": return "default";
      case "export": return "secondary";
      default: return "outline";
    }
  };

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.adminId?.toString().includes(searchTerm);
    return matchesSearch;
  }) || [];

  // Mock data for demonstration
  const mockLogs = [
    {
      id: 1,
      adminId: 1,
      adminName: "John Admin",
      action: "update",
      module: "rewards",
      entityType: "campaign",
      entityId: 1,
      oldData: { status: "draft" },
      newData: { status: "active" },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date("2024-01-15T10:30:00Z"),
      description: "Activated Summer Booking Bonus campaign"
    },
    {
      id: 2,
      adminId: 1,
      adminName: "John Admin",
      action: "create",
      module: "rewards",
      entityType: "wallet_transaction",
      entityId: 101,
      oldData: null,
      newData: { amount: "50.00", type: "earn", description: "Manual adjustment" },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date("2024-01-15T09:15:00Z"),
      description: "Added ₹50 to user wallet #1"
    },
    {
      id: 3,
      adminId: 2,
      adminName: "Sarah Manager",
      action: "delete",
      module: "users",
      entityType: "user",
      entityId: 55,
      oldData: { name: "Test User", email: "test@example.com" },
      newData: null,
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date("2024-01-15T08:45:00Z"),
      description: "Deleted spam user account"
    },
    {
      id: 4,
      adminId: 1,
      adminName: "John Admin",
      action: "update",
      module: "config",
      entityType: "rewards_config",
      entityId: 1,
      oldData: { value: { amount: 100 } },
      newData: { value: { amount: 150 } },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date("2024-01-14T16:20:00Z"),
      description: "Updated welcome bonus from ₹100 to ₹150"
    },
    {
      id: 5,
      adminId: 3,
      adminName: "Mike Support",
      action: "view",
      module: "users",
      entityType: "wallet",
      entityId: 25,
      oldData: null,
      newData: null,
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date("2024-01-14T14:10:00Z"),
      description: "Viewed customer wallet details"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Audit Trail</h1>
          <Button disabled>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Trail</h1>
          <p className="text-muted-foreground">Track all administrative actions and system changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Audit Logs</CardTitle>
          <CardDescription>Search and filter administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions, modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module} value={module}>
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-3">
        {mockLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActionColor(log.action) as any}>
                        {log.action.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{log.module}</Badge>
                      {log.entityType && (
                        <Badge variant="secondary">{log.entityType}</Badge>
                      )}
                    </div>
                    <p className="font-medium mb-1">{log.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.adminName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
                      </div>
                      <div>IP: {log.ipAddress}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  {(log.action === "update" || log.action === "delete") && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Revert
                    </Button>
                  )}
                </div>
              </div>

              {/* Data Changes */}
              {(log.oldData || log.newData) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.oldData && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Previous Data</h4>
                        <pre className="text-xs bg-red-50 dark:bg-red-950/20 p-2 rounded border">
                          {JSON.stringify(log.oldData, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.newData && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">New Data</h4>
                        <pre className="text-xs bg-green-50 dark:bg-green-950/20 p-2 rounded border">
                          {JSON.stringify(log.newData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Logs</Button>
      </div>
    </div>
  );
}