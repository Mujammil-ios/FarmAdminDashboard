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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter,
  Download,
  Crown, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  CreditCard,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  X,
  Building,
  Banknote,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Users,
  Home,
  Calculator,
  Send,
  Receipt,
  TrendingDown,
  Wallet,
  Award
} from "lucide-react";

interface OwnerProfile {
  firebaseId: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'owner';
  isActive: boolean;
  joinDate: string;
  lastLoginDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  gstNumber?: string;
  panNumber: string;
  aadhaarNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
    accountType: 'savings' | 'current';
  };
  commissionRate: number;
  totalEarnings: number;
  totalCommissionPaid: number;
  outstandingPayments: number;
  totalFarms: number;
  activeFarms: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  totalReviews: number;
  partnershipStartDate: string;
  contractStatus: 'active' | 'suspended' | 'terminated';
  kycStatus: 'verified' | 'pending' | 'rejected';
  documents: {
    panCard: string;
    aadhaarCard: string;
    gstCertificate?: string;
    bankPassbook: string;
    businessLicense?: string;
  };
}

interface OwnerFilters {
  businessType: string;
  contractStatus: string;
  kycStatus: string;
  verificationStatus: string;
  minEarnings: string;
  maxEarnings: string;
  minCommissionRate: string;
  maxCommissionRate: string;
  partnershipDateFrom: string;
  partnershipDateTo: string;
  searchQuery: string;
}

export default function OwnerManagement() {
  const [filters, setFilters] = useState<OwnerFilters>({
    businessType: '',
    contractStatus: '',
    kycStatus: '',
    verificationStatus: '',
    minEarnings: '',
    maxEarnings: '',
    minCommissionRate: '',
    maxCommissionRate: '',
    partnershipDateFrom: '',
    partnershipDateTo: '',
    searchQuery: ''
  });
  
  const [selectedOwner, setSelectedOwner] = useState<OwnerProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('partnershipStartDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['/api/user-management/owners', filters, sortBy, sortOrder],
    queryFn: () => fetch('/api/user-management/owners').then(res => res.json())
  });

  const filteredOwners = owners.filter((owner: OwnerProfile) => {
    if (filters.searchQuery && !owner.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !owner.businessName.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !owner.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !owner.phoneNumber.includes(filters.searchQuery)) return false;
    
    if (filters.businessType && owner.businessType !== filters.businessType) return false;
    if (filters.contractStatus && owner.contractStatus !== filters.contractStatus) return false;
    if (filters.kycStatus && owner.kycStatus !== filters.kycStatus) return false;
    if (filters.verificationStatus && owner.verificationStatus !== filters.verificationStatus) return false;
    if (filters.minEarnings && owner.totalEarnings < parseInt(filters.minEarnings)) return false;
    if (filters.maxEarnings && owner.totalEarnings > parseInt(filters.maxEarnings)) return false;
    if (filters.minCommissionRate && owner.commissionRate < parseInt(filters.minCommissionRate)) return false;
    if (filters.maxCommissionRate && owner.commissionRate > parseInt(filters.maxCommissionRate)) return false;
    if (filters.partnershipDateFrom && new Date(owner.partnershipStartDate) < new Date(filters.partnershipDateFrom)) return false;
    if (filters.partnershipDateTo && new Date(owner.partnershipStartDate) > new Date(filters.partnershipDateTo)) return false;
    
    return true;
  }).sort((a: OwnerProfile, b: OwnerProfile) => {
    let aValue: any = a[sortBy as keyof OwnerProfile];
    let bValue: any = b[sortBy as keyof OwnerProfile];
    
    if (sortBy === 'partnershipStartDate' || sortBy === 'lastLoginDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const resetFilters = () => {
    setFilters({
      businessType: '',
      contractStatus: '',
      kycStatus: '',
      verificationStatus: '',
      minEarnings: '',
      maxEarnings: '',
      minCommissionRate: '',
      maxCommissionRate: '',
      partnershipDateFrom: '',
      partnershipDateTo: '',
      searchQuery: ''
    });
  };

  const exportOwners = () => {
    const csvContent = [
      ['Name', 'Business Name', 'Email', 'Phone', 'Business Type', 'Total Earnings', 'Commission Rate', 'Contract Status', 'KYC Status'].join(','),
      ...filteredOwners.map((owner: OwnerProfile) => [
        owner.name,
        owner.businessName,
        owner.email,
        owner.phoneNumber,
        owner.businessType,
        owner.totalEarnings,
        owner.commissionRate + '%',
        owner.contractStatus,
        owner.kycStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owners-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getBusinessTypeBadge = (type: string) => {
    const colors = {
      individual: 'bg-blue-100 text-blue-800',
      company: 'bg-purple-100 text-purple-800',
      partnership: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Suspended</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Terminated</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><Shield className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalEarnings = filteredOwners.reduce((sum: number, owner: OwnerProfile) => sum + owner.totalEarnings, 0);
  const totalCommission = filteredOwners.reduce((sum: number, owner: OwnerProfile) => sum + owner.totalCommissionPaid, 0);
  const totalOutstanding = filteredOwners.reduce((sum: number, owner: OwnerProfile) => sum + owner.outstandingPayments, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Management</h1>
          <p className="text-muted-foreground">
            Comprehensive partner management with business details, earnings, and payout tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportOwners}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{filteredOwners.length}</p>
                <p className="text-xs text-muted-foreground">Total Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
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
                <p className="text-xs text-muted-foreground">Commission Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Owners
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
                placeholder="Search by name, business name, email, or phone..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="businessName">Business Name</SelectItem>
                <SelectItem value="partnershipStartDate">Partnership Date</SelectItem>
                <SelectItem value="totalEarnings">Total Earnings</SelectItem>
                <SelectItem value="commissionRate">Commission Rate</SelectItem>
                <SelectItem value="averageRating">Rating</SelectItem>
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
                <Label>Business Type</Label>
                <Select value={filters.businessType} onValueChange={(value) => setFilters(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contract Status</Label>
                <Select value={filters.contractStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, contractStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All contracts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All contracts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>KYC Status</Label>
                <Select value={filters.kycStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, kycStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All KYC</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Commission Rate</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min %"
                    type="number"
                    value={filters.minCommissionRate}
                    onChange={(e) => setFilters(prev => ({ ...prev, minCommissionRate: e.target.value }))}
                  />
                  <Input
                    placeholder="Max %"
                    type="number"
                    value={filters.maxCommissionRate}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxCommissionRate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Earnings Range</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min ₹"
                    type="number"
                    value={filters.minEarnings}
                    onChange={(e) => setFilters(prev => ({ ...prev, minEarnings: e.target.value }))}
                  />
                  <Input
                    placeholder="Max ₹"
                    type="number"
                    value={filters.maxEarnings}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxEarnings: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Partnership From</Label>
                <Input
                  type="date"
                  value={filters.partnershipDateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, partnershipDateFrom: e.target.value }))}
                />
              </div>

              <div>
                <Label>Partnership To</Label>
                <Input
                  type="date"
                  value={filters.partnershipDateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, partnershipDateTo: e.target.value }))}
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredOwners.length} of {owners.length} owners
        </div>
        <div className="flex gap-4 text-sm">
          <span>Active: {filteredOwners.filter((o: OwnerProfile) => o.contractStatus === 'active').length}</span>
          <span>KYC Verified: {filteredOwners.filter((o: OwnerProfile) => o.kycStatus === 'verified').length}</span>
          <span>Avg Commission: {(filteredOwners.reduce((sum: number, o: OwnerProfile) => sum + o.commissionRate, 0) / filteredOwners.length).toFixed(1)}%</span>
        </div>
      </div>

      {/* Owner Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner/Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Business Info</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Partnership</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOwners.map((owner: OwnerProfile) => (
                <TableRow key={owner.firebaseId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{owner.name}</div>
                        <div className="text-sm font-medium text-purple-600">{owner.businessName}</div>
                        <div className="text-xs text-muted-foreground">ID: {owner.firebaseId.slice(-8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        {owner.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {owner.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getBusinessTypeBadge(owner.businessType)}
                      <div className="text-sm text-muted-foreground">
                        {owner.businessAddress.city}, {owner.businessAddress.state}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Commission: {owner.commissionRate}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{owner.averageRating?.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({owner.totalReviews})</span>
                      </div>
                      <div className="text-sm">
                        {owner.totalFarms} farms • {owner.totalBookings} bookings
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {owner.completedBookings} completed
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">₹{owner.totalEarnings.toLocaleString()}</div>
                      <div className="text-sm text-green-600">
                        Commission: ₹{owner.totalCommissionPaid.toLocaleString()}
                      </div>
                      {owner.outstandingPayments > 0 && (
                        <div className="text-sm text-orange-600">
                          Outstanding: ₹{owner.outstandingPayments.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getContractStatusBadge(owner.contractStatus)}
                      {getKycStatusBadge(owner.kycStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      Since {new Date(owner.partnershipStartDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last login: {new Date(owner.lastLoginDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOwner(owner)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
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

      {/* Owner Detail Modal */}
      {selectedOwner && (
        <OwnerDetailModal
          owner={selectedOwner}
          isOpen={!!selectedOwner}
          onClose={() => setSelectedOwner(null)}
        />
      )}
    </div>
  );
}

function OwnerDetailModal({ 
  owner, 
  isOpen, 
  onClose 
}: { 
  owner: OwnerProfile; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/user-management/owners', owner.firebaseId, 'bookings'],
    queryFn: () => fetch(`/api/user-management/owners/${owner.firebaseId}/bookings`).then(res => res.json()),
    enabled: isOpen
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ['/api/user-management/owners', owner.firebaseId, 'payouts'],
    queryFn: () => fetch(`/api/user-management/owners/${owner.firebaseId}/payouts`).then(res => res.json()),
    enabled: isOpen
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/user-management/owners', owner.firebaseId, 'activities'],
    queryFn: () => fetch(`/api/user-management/owners/${owner.firebaseId}/activities`).then(res => res.json()),
    enabled: isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            {owner.name} - {owner.businessName}
          </DialogTitle>
          <DialogDescription>
            Firebase ID: {owner.firebaseId} • Partnership since {new Date(owner.partnershipStartDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{owner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{owner.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{owner.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAN Number:</span>
                    <span className="font-medium">{owner.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aadhaar:</span>
                    <span className="font-medium">****{owner.aadhaarNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partnership Date:</span>
                    <span className="font-medium">{new Date(owner.partnershipStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Login:</span>
                    <span className="font-medium">{new Date(owner.lastLoginDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status & Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Account Status:</span>
                    <Badge variant={owner.isActive ? 'default' : 'secondary'}>
                      {owner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Contract Status:</span>
                    <Badge className={
                      owner.contractStatus === 'active' ? 'bg-green-100 text-green-800' :
                      owner.contractStatus === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {owner.contractStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>KYC Status:</span>
                    <Badge className={
                      owner.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      owner.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {owner.kycStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification:</span>
                    <Badge className={
                      owner.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      owner.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {owner.verificationStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Rate:</span>
                    <span className="font-medium">{owner.commissionRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{owner.averageRating?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Reviews:</span>
                    <span className="font-medium">{owner.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Farms:</span>
                    <span className="font-medium">{owner.totalFarms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Farms:</span>
                    <span className="font-medium">{owner.activeFarms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bookings:</span>
                    <span className="font-medium">{owner.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium text-green-600">{owner.completedBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled:</span>
                    <span className="font-medium text-red-600">{owner.cancelledBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">
                      {((owner.completedBookings / Math.max(owner.totalBookings, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        PAN Card
                      </span>
                      <Badge variant="outline">Uploaded</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Aadhaar Card
                      </span>
                      <Badge variant="outline">Uploaded</Badge>
                    </div>
                    {owner.gstNumber && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          GST Certificate
                        </span>
                        <Badge variant="outline">Uploaded</Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bank Passbook
                      </span>
                      <Badge variant="outline">Uploaded</Badge>
                    </div>
                    {owner.documents.businessLicense && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Business License
                        </span>
                        <Badge variant="outline">Uploaded</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Business Name:</span>
                    <span className="font-medium">{owner.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Type:</span>
                    <Badge className={
                      owner.businessType === 'company' ? 'bg-purple-100 text-purple-800' :
                      owner.businessType === 'partnership' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {owner.businessType}
                    </Badge>
                  </div>
                  {owner.gstNumber && (
                    <div className="flex justify-between">
                      <span>GST Number:</span>
                      <span className="font-medium">{owner.gstNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>PAN Number:</span>
                    <span className="font-medium">{owner.panNumber}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Street:</span>
                    <div className="font-medium">{owner.businessAddress.street}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">City:</span>
                      <div className="font-medium">{owner.businessAddress.city}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">State:</span>
                      <div className="font-medium">{owner.businessAddress.state}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pincode:</span>
                    <div className="font-medium">{owner.businessAddress.pincode}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Earnings:</span>
                    <span className="font-medium text-green-600">₹{owner.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Paid:</span>
                    <span className="font-medium">₹{owner.totalCommissionPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding:</span>
                    <span className="font-medium text-orange-600">₹{owner.outstandingPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Earnings:</span>
                    <span className="font-medium">₹{(owner.totalEarnings - owner.totalCommissionPaid).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Rate:</span>
                    <span className="font-medium">{owner.commissionRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-medium">{owner.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Holder:</span>
                    <span className="font-medium">{owner.bankDetails.accountHolderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Type:</span>
                    <Badge variant="outline">{owner.bankDetails.accountType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>IFSC Code:</span>
                    <span className="font-medium">{owner.bankDetails.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-medium">****{owner.bankDetails.accountNumber.slice(-4)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Payout Actions
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Process Payout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {owner.outstandingPayments > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Outstanding Payment</span>
                      </div>
                      <div className="text-orange-700 mt-1">
                        ₹{owner.outstandingPayments.toLocaleString()} pending
                      </div>
                      <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                        Process Now
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Receipt className="w-4 h-4 mr-2" />
                      Generate Statement
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Calculator className="w-4 h-4 mr-2" />
                      Update Commission Rate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{booking.farmName}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <div>{booking.customerName}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <div>{booking.customerPhone}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Check-in:</span>
                            <div>{booking.checkInDate} at {booking.checkInTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Check-out:</span>
                            <div>{booking.checkOutDate} at {booking.checkOutTime}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-semibold text-lg">₹{booking.totalAmount}</div>
                        <div className="text-sm text-green-600">Owner: ₹{booking.ownerEarnings}</div>
                        <div className="text-sm text-blue-600">Commission: ₹{booking.commissionAmount}</div>
                        <Badge variant={
                          booking.bookingStatus === 'completed' ? 'default' :
                          booking.bookingStatus === 'upcoming' ? 'secondary' :
                          'destructive'
                        }>
                          {booking.bookingStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <div className="space-y-4">
              {payouts.map((payout: any) => (
                <Card key={payout.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          Payout #{payout.id.slice(-8)}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Period:</span>
                            <div>{payout.period.from} to {payout.period.to}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Method:</span>
                            <div className="capitalize">{payout.payoutMethod}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Bookings:</span>
                            <div>{payout.numberOfBookings} bookings</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Processed:</span>
                            <div>{new Date(payout.processedAt || payout.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        {payout.notes && (
                          <div>
                            <span className="text-muted-foreground text-sm">Notes:</span>
                            <p className="text-sm mt-1">{payout.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm text-muted-foreground">Total Earnings</div>
                        <div className="font-medium">₹{payout.totalEarnings.toLocaleString()}</div>
                        <div className="text-sm text-red-600">- ₹{payout.commissionDeducted.toLocaleString()}</div>
                        <div className="font-semibold text-lg text-green-600">₹{payout.netPayout.toLocaleString()}</div>
                        <Badge variant={
                          payout.status === 'completed' ? 'default' :
                          payout.status === 'processing' ? 'secondary' :
                          payout.status === 'failed' ? 'destructive' :
                          'outline'
                        }>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-3">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2 text-sm">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key} className="text-muted-foreground">
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}