import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter,
  Download,
  CreditCard, 
  DollarSign,
  Calendar, 
  TrendingUp,
  Activity,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Send,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  FileText,
  Users,
  Crown,
  Building,
  Banknote,
  TrendingDown,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface PaymentTransaction {
  id: string;
  type: 'booking' | 'refund' | 'commission' | 'payout' | 'adjustment';
  bookingId?: string;
  customerId?: string;
  ownerId?: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash' | 'bank-transfer';
  gatewayTransactionId?: string;
  gatewayName?: string;
  description: string;
  reference: string;
  metadata: {
    farmName?: string;
    customerName?: string;
    ownerName?: string;
    bookingDates?: string;
  };
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  processedBy?: string;
}

interface OwnerPayout {
  id: string;
  ownerId: string;
  ownerName: string;
  period: {
    from: string;
    to: string;
  };
  totalEarnings: number;
  commissionDeducted: number;
  netPayout: number;
  bookingIds: string[];
  numberOfBookings: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'on-hold';
  payoutMethod: 'bank-transfer' | 'upi' | 'cheque';
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  transactionId?: string;
  processedAt?: string;
  processedBy: string;
  notes?: string;
  createdAt: string;
}

interface PaymentFilters {
  type: string;
  status: string;
  paymentMethod: string;
  gatewayName: string;
  amountMin: string;
  amountMax: string;
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [filters, setFilters] = useState<PaymentFilters>({
    type: '',
    status: '',
    paymentMethod: '',
    gatewayName: '',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: '',
    searchQuery: ''
  });
  
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<OwnerPayout | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/user-management/payments', filters, sortBy, sortOrder],
    queryFn: () => fetch('/api/user-management/payments').then(res => res.json())
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['/api/user-management/owners'],
    queryFn: () => fetch('/api/user-management/owners').then(res => res.json())
  });

  // Calculate payout data from owners
  const payoutsData = owners.flatMap((owner: any) => 
    owner.outstandingPayments > 0 ? [{
      id: `payout-${owner.firebaseId}`,
      ownerId: owner.firebaseId,
      ownerName: owner.name,
      period: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      totalEarnings: owner.totalEarnings,
      commissionDeducted: owner.totalCommissionPaid,
      netPayout: owner.outstandingPayments,
      bookingIds: [],
      numberOfBookings: owner.totalBookings,
      status: 'pending' as const,
      payoutMethod: 'bank-transfer' as const,
      bankDetails: owner.bankDetails,
      processedBy: '',
      createdAt: new Date().toISOString()
    }] : []
  );

  const filteredPayments = payments.filter((payment: PaymentTransaction) => {
    if (filters.searchQuery && 
        !payment.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !payment.reference.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !payment.metadata.customerName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !payment.metadata.ownerName?.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    
    if (filters.type && payment.type !== filters.type) return false;
    if (filters.status && payment.status !== filters.status) return false;
    if (filters.paymentMethod && payment.paymentMethod !== filters.paymentMethod) return false;
    if (filters.gatewayName && payment.gatewayName !== filters.gatewayName) return false;
    if (filters.amountMin && payment.amount < parseInt(filters.amountMin)) return false;
    if (filters.amountMax && payment.amount > parseInt(filters.amountMax)) return false;
    if (filters.dateFrom && new Date(payment.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(payment.createdAt) > new Date(filters.dateTo)) return false;
    
    return true;
  });

  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      paymentMethod: '',
      gatewayName: '',
      amountMin: '',
      amountMax: '',
      dateFrom: '',
      dateTo: '',
      searchQuery: ''
    });
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'Type', 'Description', 'Amount', 'Status', 'Method', 'Gateway', 'Reference'].join(','),
      ...filteredPayments.map((payment: PaymentTransaction) => [
        new Date(payment.createdAt).toLocaleDateString(),
        payment.type,
        payment.description,
        payment.amount,
        payment.status,
        payment.paymentMethod,
        payment.gatewayName || '',
        payment.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking': return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'refund': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'commission': return <Calculator className="w-4 h-4 text-blue-500" />;
      case 'payout': return <Send className="w-4 h-4 text-purple-500" />;
      case 'adjustment': return <RefreshCw className="w-4 h-4 text-orange-500" />;
      default: return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      card: 'bg-blue-100 text-blue-800',
      upi: 'bg-purple-100 text-purple-800',
      netbanking: 'bg-green-100 text-green-800',
      wallet: 'bg-orange-100 text-orange-800',
      cash: 'bg-gray-100 text-gray-800',
      'bank-transfer': 'bg-indigo-100 text-indigo-800'
    };
    return <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{method}</Badge>;
  };

  const totalAmount = filteredPayments.reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0);
  const completedAmount = filteredPayments.filter((p: PaymentTransaction) => p.status === 'completed').reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0);
  const pendingAmount = filteredPayments.filter((p: PaymentTransaction) => p.status === 'pending').reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            Complete financial tracking with transactions, payouts, and commission management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPayments}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Manual Transaction
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Volume</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₹{completedAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredPayments.length}</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">All Transactions ({payments.length})</TabsTrigger>
          <TabsTrigger value="payouts">Owner Payouts ({payoutsData.length})</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Transactions
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by description, reference, customer, or owner..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Transaction Type</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="booking">Booking</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                        <SelectItem value="commission">Commission</SelectItem>
                        <SelectItem value="payout">Payout</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <Select value={filters.paymentMethod} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All methods</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Gateway</Label>
                    <Select value={filters.gatewayName} onValueChange={(value) => setFilters(prev => ({ ...prev, gatewayName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All gateways" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All gateways</SelectItem>
                        <SelectItem value="Razorpay">Razorpay</SelectItem>
                        <SelectItem value="Stripe">Stripe</SelectItem>
                        <SelectItem value="PayU">PayU</SelectItem>
                        <SelectItem value="Paytm">Paytm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount Range</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min ₹"
                        type="number"
                        value={filters.amountMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                      />
                      <Input
                        placeholder="Max ₹"
                        type="number"
                        value={filters.amountMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Date From</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Date To</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" onClick={resetFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment: PaymentTransaction) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getTypeIcon(payment.type)}
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-sm text-muted-foreground">{payment.reference}</div>
                            {payment.metadata.customerName && (
                              <div className="text-xs text-muted-foreground">
                                Customer: {payment.metadata.customerName}
                              </div>
                            )}
                            {payment.metadata.ownerName && (
                              <div className="text-xs text-muted-foreground">
                                Owner: {payment.metadata.ownerName}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{payment.currency}</div>
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {payment.gatewayName || 'N/A'}
                        </div>
                        {payment.gatewayTransactionId && (
                          <div className="text-xs text-muted-foreground">
                            {payment.gatewayTransactionId.slice(0, 12)}...
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTransaction(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <PayoutManagement payouts={payoutsData} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <RevenueAnalytics payments={payments} />
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-6">
          <ReconciliationCenter payments={payments} />
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

function PayoutManagement({ payouts }: { payouts: OwnerPayout[] }) {
  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.netPayout, 0);

  return (
    <div className="space-y-6">
      {/* Payout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{pendingPayouts.length}</p>
                <p className="text-xs text-muted-foreground">Pending Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalPendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Amount Due</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-500" />
              <div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Process All Payouts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payouts */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Owner Payouts</CardTitle>
          <CardDescription>
            Review and process outstanding payments to farm owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayouts.map((payout) => (
              <div key={payout.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-500" />
                      <h3 className="font-semibold">{payout.ownerName}</h3>
                      <Badge variant="outline">#{payout.id.slice(-8)}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Period:</span>
                        <div>{payout.period.from} to {payout.period.to}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bookings:</span>
                        <div>{payout.numberOfBookings} bookings</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Earnings:</span>
                        <div>₹{payout.totalEarnings.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Commission:</span>
                        <div className="text-red-600">- ₹{payout.commissionDeducted.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm font-medium">Bank Details:</div>
                      <div className="text-sm text-muted-foreground">
                        {payout.bankDetails.bankName} • {payout.bankDetails.ifscCode} • 
                        ****{payout.bankDetails.accountNumber.slice(-4)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{payout.netPayout.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Net Payout</div>
                    <div className="space-y-1">
                      <Button size="sm" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Process Payout
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RevenueAnalytics({ payments }: { payments: PaymentTransaction[] }) {
  const completedPayments = payments.filter(p => p.status === 'completed');
  const bookingPayments = completedPayments.filter(p => p.type === 'booking');
  const commissionPayments = completedPayments.filter(p => p.type === 'commission');
  
  const totalRevenue = bookingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = commissionPayments.reduce((sum, p) => sum + p.amount, 0);
  const averageBookingValue = totalRevenue / Math.max(bookingPayments.length, 1);

  // Group by payment method
  const methodBreakdown = payments.reduce((acc: Record<string, number>, payment) => {
    if (payment.status === 'completed') {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Commission Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">₹{averageBookingValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Avg Booking Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{bookingPayments.length}</p>
                <p className="text-xs text-muted-foreground">Successful Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(methodBreakdown).map(([method, amount]) => {
              const percentage = (amount / totalRevenue) * 100;
              return (
                <div key={method} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize font-medium">{method}</span>
                    <span className="font-medium">₹{amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue Chart</h3>
            <p className="text-muted-foreground">
              Revenue trend visualization would be implemented here with a charting library
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReconciliationCenter({ payments }: { payments: PaymentTransaction[] }) {
  const pendingReconciliation = payments.filter(p => p.status === 'pending' || p.status === 'processing');
  const failedPayments = payments.filter(p => p.status === 'failed');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Reconciliation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Reconciliation ({pendingReconciliation.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReconciliation.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-muted-foreground">{payment.reference}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
              {pendingReconciliation.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  +{pendingReconciliation.length - 5} more pending
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Failed Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Failed Payments ({failedPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-muted-foreground">{payment.failureReason || 'Unknown error'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </div>
              ))}
              {failedPayments.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  +{failedPayments.length - 5} more failed
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16">
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-2" />
                <div>Auto Reconcile</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Report</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Download className="w-6 h-6 mx-auto mb-2" />
                <div>Export Disputes</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionDetailModal({ 
  transaction, 
  isOpen, 
  onClose 
}: { 
  transaction: PaymentTransaction; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(transaction.type)}
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Transaction ID: {transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline" className="capitalize">{transaction.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">₹{transaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  {getStatusBadge(transaction.status)}
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <Badge className={
                    transaction.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                    transaction.paymentMethod === 'upi' ? 'bg-purple-100 text-purple-800' :
                    transaction.paymentMethod === 'netbanking' ? 'bg-green-100 text-green-800' :
                    transaction.paymentMethod === 'wallet' ? 'bg-orange-100 text-orange-800' :
                    transaction.paymentMethod === 'cash' ? 'bg-gray-100 text-gray-800' :
                    'bg-indigo-100 text-indigo-800'
                  }>
                    {transaction.paymentMethod}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-medium">{transaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="font-medium">{new Date(transaction.createdAt).toLocaleString()}</span>
                </div>
                {transaction.completedAt && (
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{new Date(transaction.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gateway Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Gateway:</span>
                  <span className="font-medium">{transaction.gatewayName || 'N/A'}</span>
                </div>
                {transaction.gatewayTransactionId && (
                  <div className="flex justify-between">
                    <span>Gateway ID:</span>
                    <span className="font-medium font-mono text-sm">{transaction.gatewayTransactionId}</span>
                  </div>
                )}
                {transaction.failureReason && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Failure Reason:</span>
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      {transaction.failureReason}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(transaction.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{transaction.description}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {transaction.status === 'pending' && (
              <>
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Completed
                </Button>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            {transaction.status === 'failed' && (
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Payment
              </Button>
            )}
            <Button variant="outline">
              <Receipt className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            {transaction.gatewayTransactionId && (
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View in Gateway
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'processing':
      return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1" />Processing</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Failed</Badge>;
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" />Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'booking': return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    case 'refund': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    case 'commission': return <Calculator className="w-4 h-4 text-blue-500" />;
    case 'payout': return <Send className="w-4 h-4 text-purple-500" />;
    case 'adjustment': return <RefreshCw className="w-4 h-4 text-orange-500" />;
    default: return <CreditCard className="w-4 h-4 text-gray-500" />;
  }
}