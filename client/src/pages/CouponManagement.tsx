import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Copy,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CouponManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ["/api/coupons"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/coupons/analytics"],
  });

  const { data: refunds, isLoading: refundsLoading } = useQuery({
    queryKey: ["/api/refunds"],
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/coupons", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setCreateDialogOpen(false);
      toast({ title: "Coupon created successfully" });
    },
  });

  const toggleCouponMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/coupons/${id}/toggle`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      toast({ title: "Coupon status updated" });
    },
  });

  const createBulkCouponsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/coupons/bulk", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setBulkDialogOpen(false);
      toast({ title: "Bulk coupons created successfully" });
    },
  });

  const processRefundMutation = useMutation({
    mutationFn: (data: { id: number; status: string; notes?: string }) => 
      apiRequest(`/api/refunds/${data.id}/process`, "PUT", { status: data.status, notes: data.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refunds"] });
      toast({ title: "Refund processed successfully" });
    },
  });

  const filteredCoupons = coupons?.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && coupon.isActive && !coupon.isExpired) ||
                         (statusFilter === "expired" && coupon.isExpired) ||
                         (statusFilter === "inactive" && !coupon.isActive);
    const matchesType = typeFilter === "all" || coupon.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  if (couponsLoading || analyticsLoading || refundsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Coupon & Refund Management</h1>
          <div className="flex gap-2">
            <Button disabled><Plus className="h-4 w-4 mr-2" />Create Coupon</Button>
            <Button variant="outline" disabled><Upload className="h-4 w-4 mr-2" />Bulk Create</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
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
          <h1 className="text-3xl font-bold">Coupon & Refund Management</h1>
          <p className="text-muted-foreground">Manage discount coupons and process booking refunds</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
                <DialogDescription>Create a discount coupon for bookings</DialogDescription>
              </DialogHeader>
              <CouponForm onSubmit={(data) => createCouponMutation.mutate(data)} />
            </DialogContent>
          </Dialog>

          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Create Coupons</DialogTitle>
                <DialogDescription>Generate multiple coupons with a template</DialogDescription>
              </DialogHeader>
              <BulkCouponForm onSubmit={(data) => createBulkCouponsMutation.mutate(data)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalCoupons || 0}</div>
            <p className="text-xs text-muted-foreground">{analytics?.activeCoupons || 0} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalUsage || 0}</div>
            <p className="text-xs text-muted-foreground">Times used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics?.totalDiscount || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Discount given</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds?.filter(r => r.status === "pending").length || 0}</div>
            <p className="text-xs text-muted-foreground">Need processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="coupons" className="space-y-6">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="calculator">Booking Calculator</TabsTrigger>
        </TabsList>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Discount Coupons</CardTitle>
                  <CardDescription>Manage and monitor coupon performance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search coupons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCoupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-lg">{coupon.code}</span>
                          <Badge variant={
                            !coupon.isActive ? "secondary" :
                            coupon.isExpired ? "destructive" : "default"
                          }>
                            {!coupon.isActive ? "Inactive" : coupon.isExpired ? "Expired" : "Active"}
                          </Badge>
                          <Badge variant="outline">
                            {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                          </Badge>
                        </div>
                        <p className="font-medium">{coupon.title}</p>
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>Used: {coupon.usedCount}/{coupon.usageLimit || "∞"}</span>
                          <span>Valid until: {format(new Date(coupon.validUntil), "MMM dd, yyyy")}</span>
                          <span>Total discount: ₹{coupon.totalDiscount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCouponMutation.mutate(coupon.id)}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Refunds</CardTitle>
              <CardDescription>Process refund requests from customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refunds?.map((refund) => (
                  <div key={refund.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">#{refund.id}</span>
                          <Badge variant={
                            refund.status === "processed" ? "default" :
                            refund.status === "approved" ? "secondary" : "outline"
                          }>
                            {refund.status}
                          </Badge>
                          <Badge variant="outline">{refund.refundType}</Badge>
                        </div>
                        <p className="font-medium">{refund.booking.farmName}</p>
                        <p className="text-sm text-muted-foreground">{refund.reason}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>Customer: {refund.user.name}</span>
                          <span>Original: ₹{refund.originalAmount}</span>
                          <span>Refund: ₹{refund.refundAmount}</span>
                          <span>Method: {refund.refundMethod.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {refund.status === "pending" && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => processRefundMutation.mutate({ id: refund.id, status: "approved" })}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => processRefundMutation.mutate({ 
                              id: refund.id, 
                              status: "rejected", 
                              notes: "Rejected by admin" 
                            })}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <BookingCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Coupon Form Component
function CouponForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    userLimit: "1",
    validFrom: "",
    validUntil: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: 1,
      isActive: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Coupon Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="WELCOME20"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Discount Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Welcome Discount"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="20% off on your first booking"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">
            {formData.type === "percentage" ? "Percentage (%)" : "Amount (₹)"}
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder={formData.type === "percentage" ? "20" : "50"}
            required
          />
        </div>
        <div>
          <Label htmlFor="minOrderAmount">Min Order Amount (₹)</Label>
          <Input
            id="minOrderAmount"
            type="number"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validFrom">Valid From</Label>
          <Input
            id="validFrom"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Create Coupon</Button>
    </form>
  );
}

// Bulk Coupon Form Component
function BulkCouponForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    prefix: "BULK",
    count: "10",
    title: "Bulk Discount",
    type: "percentage",
    value: "10",
    validFrom: "",
    validUntil: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      template: {
        title: formData.title,
        description: `Bulk generated ${formData.type} discount`,
        type: formData.type,
        value: formData.value,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        userLimit: 1,
        createdBy: 1,
        isActive: true
      },
      count: parseInt(formData.count),
      prefix: formData.prefix
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prefix">Code Prefix</Label>
          <Input
            id="prefix"
            value={formData.prefix}
            onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
            placeholder="BULK"
            required
          />
        </div>
        <div>
          <Label htmlFor="count">Number of Coupons</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title Template</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Bulk Discount"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Discount Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">
            {formData.type === "percentage" ? "Percentage (%)" : "Amount (₹)"}
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validFrom">Valid From</Label>
          <Input
            id="validFrom"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Create {formData.count} Coupons</Button>
    </form>
  );
}

// Booking Calculator Component
function BookingCalculator() {
  const [calculation, setCalculation] = useState({
    amount: "",
    couponCode: "",
  });

  const [result, setResult] = useState<any>(null);

  const calculateTotal = async () => {
    try {
      const response = await apiRequest("/api/coupons/calculate", "POST", {
        bookingAmount: calculation.amount,
        couponCode: calculation.couponCode || undefined,
        userId: 1,
        farmId: 1
      });
      setResult(response);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Price Calculator</CardTitle>
        <CardDescription>Test coupon calculations with booking amounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Booking Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={calculation.amount}
              onChange={(e) => setCalculation({ ...calculation, amount: e.target.value })}
              placeholder="500"
            />
          </div>
          <div>
            <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
            <Input
              id="couponCode"
              value={calculation.couponCode}
              onChange={(e) => setCalculation({ ...calculation, couponCode: e.target.value.toUpperCase() })}
              placeholder="WELCOME20"
            />
          </div>
        </div>

        <Button onClick={calculateTotal} disabled={!calculation.amount}>
          Calculate Total
        </Button>

        {result && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Calculation Result</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{result.subtotal}</span>
              </div>
              {result.appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({result.appliedCoupon.code}):</span>
                  <span>-₹{result.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes (18% GST):</span>
                <span>₹{result.taxes}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{result.total}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}