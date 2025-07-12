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
import { 
  Ticket, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SimpleCouponManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ["/api/coupons"],
  });

  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/coupons/analytics"],
  });

  const { data: refunds = [], isLoading: refundsLoading } = useQuery({
    queryKey: ["/api/refunds"],
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/coupons", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setCreateDialogOpen(false);
      toast({ title: "Coupon created" });
    },
  });

  const toggleCouponMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/coupons/${id}/toggle`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      toast({ title: "Status updated" });
    },
  });

  const processRefundMutation = useMutation({
    mutationFn: (data: { id: number; status: string }) => 
      apiRequest(`/api/refunds/${data.id}/process`, "PUT", { status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refunds"] });
      toast({ title: "Refund processed" });
    },
  });

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (couponsLoading || analyticsLoading || refundsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupon & Refund Management</h1>
          <p className="text-muted-foreground">Simple coupon and refund tools</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
            </DialogHeader>
            <SimpleCouponForm onSubmit={(data) => createCouponMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{analytics.totalCoupons || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{analytics.activeCoupons || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{analytics.totalUsage || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{refunds.filter(r => r.status === "pending").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="coupons">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        {/* Coupons */}
        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Coupons</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCoupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">{coupon.code}</span>
                      <Badge variant={!coupon.isActive ? "secondary" : coupon.isExpired ? "destructive" : "default"}>
                        {!coupon.isActive ? "Inactive" : coupon.isExpired ? "Expired" : "Active"}
                      </Badge>
                      <span className="text-sm">{coupon.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCouponMutation.mutate(coupon.id)}
                      >
                        {coupon.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds */}
        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {refunds.map((refund) => (
                  <div key={refund.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">#{refund.id}</span>
                      <Badge variant={refund.status === "processed" ? "default" : "outline"}>
                        {refund.status}
                      </Badge>
                      <span className="text-sm">{refund.user.name}</span>
                      <span className="text-sm text-muted-foreground">₹{refund.refundAmount}</span>
                      <span className="text-sm text-muted-foreground">{refund.reason}</span>
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
                            onClick={() => processRefundMutation.mutate({ id: refund.id, status: "rejected" })}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator */}
        <TabsContent value="calculator" className="space-y-4">
          <SimpleCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple Coupon Form
function SimpleCouponForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    type: "percentage",
    value: "",
    validFrom: "",
    validUntil: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: 1,
      isActive: true,
      userLimit: 1
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Coupon Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="SAVE20"
            required
          />
        </div>
        <div>
          <Label>Type</Label>
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
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Save 20%"
          required
        />
      </div>

      <div>
        <Label>{formData.type === "percentage" ? "Percentage" : "Amount (₹)"}</Label>
        <Input
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder={formData.type === "percentage" ? "20" : "50"}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valid From</Label>
          <Input
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Valid Until</Label>
          <Input
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

// Simple Calculator
function SimpleCalculator() {
  const [amount, setAmount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculate = async () => {
    try {
      const response = await apiRequest("/api/coupons/calculate", "POST", {
        bookingAmount: amount,
        couponCode: couponCode || undefined,
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
        <CardTitle>Booking Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
            />
          </div>
          <div>
            <Label>Coupon Code (Optional)</Label>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="SAVE20"
            />
          </div>
        </div>

        <Button onClick={calculate} disabled={!amount}>
          Calculate
        </Button>

        {result && (
          <div className="p-4 border rounded bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{result.subtotal}</span>
              </div>
              {result.appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({result.appliedCoupon.code}):</span>
                  <span>-₹{result.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{result.taxes}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
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