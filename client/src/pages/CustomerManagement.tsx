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
import { 
  Search, 
  Filter,
  Download,
  Users, 
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
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gift,
  Heart,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CustomerProfile {
  firebaseId: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'customer';
  isActive: boolean;
  profileImage?: string;
  joinDate: string;
  lastLoginDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingBookings: number;
  totalSpent: number;
  favoriteLocations: string[];
  preferredAmenities: string[];
  loyaltyPoints: number;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  communicationPreferences: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
}

interface CustomerFilters {
  membershipLevel: string;
  verificationStatus: string;
  isActive: string;
  minSpent: string;
  maxSpent: string;
  joinDateFrom: string;
  joinDateTo: string;
  searchQuery: string;
}

export default function CustomerManagement() {
  const [filters, setFilters] = useState<CustomerFilters>({
    membershipLevel: '',
    verificationStatus: '',
    isActive: '',
    minSpent: '',
    maxSpent: '',
    joinDateFrom: '',
    joinDateTo: '',
    searchQuery: ''
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('joinDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/user-management/customers', filters, sortBy, sortOrder],
    queryFn: () => fetch('/api/user-management/customers').then(res => res.json())
  });

  const filteredCustomers = customers.filter((customer: CustomerProfile) => {
    if (filters.searchQuery && !customer.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !customer.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !customer.phoneNumber.includes(filters.searchQuery)) return false;
    
    if (filters.membershipLevel && customer.membershipLevel !== filters.membershipLevel) return false;
    if (filters.verificationStatus && customer.verificationStatus !== filters.verificationStatus) return false;
    if (filters.isActive && customer.isActive.toString() !== filters.isActive) return false;
    if (filters.minSpent && customer.totalSpent < parseInt(filters.minSpent)) return false;
    if (filters.maxSpent && customer.totalSpent > parseInt(filters.maxSpent)) return false;
    if (filters.joinDateFrom && new Date(customer.joinDate) < new Date(filters.joinDateFrom)) return false;
    if (filters.joinDateTo && new Date(customer.joinDate) > new Date(filters.joinDateTo)) return false;
    
    return true;
  }).sort((a: CustomerProfile, b: CustomerProfile) => {
    let aValue: any = a[sortBy as keyof CustomerProfile];
    let bValue: any = b[sortBy as keyof CustomerProfile];
    
    if (sortBy === 'joinDate' || sortBy === 'lastLoginDate') {
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
      membershipLevel: '',
      verificationStatus: '',
      isActive: '',
      minSpent: '',
      maxSpent: '',
      joinDateFrom: '',
      joinDateTo: '',
      searchQuery: ''
    });
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Membership', 'Total Spent', 'Total Bookings', 'Join Date', 'Status'].join(','),
      ...filteredCustomers.map((customer: CustomerProfile) => [
        customer.name,
        customer.email,
        customer.phoneNumber,
        customer.membershipLevel,
        customer.totalSpent,
        customer.totalBookings,
        new Date(customer.joinDate).toLocaleDateString(),
        customer.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getMembershipBadge = (level: string) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level}</Badge>;
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Comprehensive customer database with detailed profiles, booking history, and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCustomers}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Customers
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
                placeholder="Search by name, email, or phone number..."
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
                <SelectItem value="joinDate">Join Date</SelectItem>
                <SelectItem value="lastLoginDate">Last Login</SelectItem>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="totalBookings">Total Bookings</SelectItem>
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
                <Label>Membership Level</Label>
                <Select value={filters.membershipLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, membershipLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Verification Status</Label>
                <Select value={filters.verificationStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, verificationStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Account Status</Label>
                <Select value={filters.isActive} onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All accounts</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Total Spent Range</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minSpent}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSpent: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxSpent}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxSpent: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Join Date From</Label>
                <Input
                  type="date"
                  value={filters.joinDateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, joinDateFrom: e.target.value }))}
                />
              </div>

              <div>
                <Label>Join Date To</Label>
                <Input
                  type="date"
                  value={filters.joinDateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, joinDateTo: e.target.value }))}
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
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
        <div className="flex gap-4 text-sm">
          <span>Active: {filteredCustomers.filter((c: CustomerProfile) => c.isActive).length}</span>
          <span>Verified: {filteredCustomers.filter((c: CustomerProfile) => c.verificationStatus === 'verified').length}</span>
          <span>Total Revenue: ₹{filteredCustomers.reduce((sum: number, c: CustomerProfile) => sum + c.totalSpent, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer: CustomerProfile) => (
                <TableRow key={customer.firebaseId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {customer.firebaseId.slice(-8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {customer.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getMembershipBadge(customer.membershipLevel)}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Gift className="w-3 h-3" />
                        {customer.loyaltyPoints} points
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{customer.totalBookings} total</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.completedBookings} completed, {customer.upcomingBookings} upcoming
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{customer.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Avg: ₹{Math.round(customer.totalSpent / Math.max(customer.totalBookings, 1)).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getVerificationBadge(customer.verificationStatus)}
                      <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(customer.lastLoginDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

function CustomerDetailModal({ 
  customer, 
  isOpen, 
  onClose 
}: { 
  customer: CustomerProfile; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/user-management/customers', customer.firebaseId, 'bookings'],
    queryFn: () => fetch(`/api/user-management/customers/${customer.firebaseId}/bookings`).then(res => res.json()),
    enabled: isOpen
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['/api/user-management/customers', customer.firebaseId, 'payments'],
    queryFn: () => fetch(`/api/user-management/customers/${customer.firebaseId}/payments`).then(res => res.json()),
    enabled: isOpen
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/user-management/customers', customer.firebaseId, 'activities'],
    queryFn: () => fetch(`/api/user-management/customers/${customer.firebaseId}/activities`).then(res => res.json()),
    enabled: isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {customer.name} - Complete Profile
          </DialogTitle>
          <DialogDescription>
            Firebase ID: {customer.firebaseId}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="activities">Activities ({activities.length})</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
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
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{customer.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Join Date:</span>
                    <span className="font-medium">{new Date(customer.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Login:</span>
                    <span className="font-medium">{new Date(customer.lastLoginDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification:</span>
                    <Badge className={
                      customer.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      customer.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {customer.verificationStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership & Loyalty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Membership Level:</span>
                    <Badge className={
                      customer.membershipLevel === 'platinum' ? 'bg-purple-100 text-purple-800' :
                      customer.membershipLevel === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      customer.membershipLevel === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }>
                      {customer.membershipLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Loyalty Points:</span>
                    <span className="font-medium">{customer.loyaltyPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bookings:</span>
                    <span className="font-medium">{customer.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{customer.completedBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled:</span>
                    <span className="font-medium">{customer.cancelledBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upcoming:</span>
                    <span className="font-medium">{customer.upcomingBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent:</span>
                    <span className="font-medium">₹{customer.totalSpent.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{customer.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{customer.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Relation:</span>
                    <span className="font-medium">{customer.emergencyContact.relation}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>SMS Notifications:</span>
                    <Badge variant={customer.communicationPreferences.sms ? 'default' : 'secondary'}>
                      {customer.communicationPreferences.sms ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Notifications:</span>
                    <Badge variant={customer.communicationPreferences.email ? 'default' : 'secondary'}>
                      {customer.communicationPreferences.email ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp:</span>
                    <Badge variant={customer.communicationPreferences.whatsapp ? 'default' : 'secondary'}>
                      {customer.communicationPreferences.whatsapp ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {customer.favoriteLocations.map((location, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferred Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {customer.preferredAmenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {amenity}
                      </Badge>
                    ))}
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
                            <span className="text-muted-foreground">Check-in:</span>
                            <div>{booking.checkInDate} at {booking.checkInTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Check-out:</span>
                            <div>{booking.checkOutDate} at {booking.checkOutTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Guests:</span>
                            <div>{booking.numberOfGuests} ({booking.guestDetails.adults} adults, {booking.guestDetails.children} children)</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Slot Type:</span>
                            <div className="capitalize">{booking.slotType}</div>
                          </div>
                        </div>
                        {booking.specialRequests && (
                          <div>
                            <span className="text-muted-foreground text-sm">Special Requests:</span>
                            <p className="text-sm mt-1">{booking.specialRequests}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-semibold text-lg">₹{booking.totalAmount}</div>
                        <Badge variant={
                          booking.bookingStatus === 'completed' ? 'default' :
                          booking.bookingStatus === 'upcoming' ? 'secondary' :
                          booking.bookingStatus === 'cancelled' ? 'destructive' :
                          'outline'
                        }>
                          {booking.bookingStatus}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Confirmation: {booking.confirmationCode}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="space-y-4">
              {payments.map((payment: any) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{payment.description}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Method: {payment.paymentMethod}</span>
                          <span>Gateway: {payment.gatewayName}</span>
                          <span>Date: {new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                        {payment.reference && (
                          <div className="text-sm">Reference: {payment.reference}</div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold text-lg">₹{payment.amount}</div>
                        <Badge variant={
                          payment.status === 'completed' ? 'default' :
                          payment.status === 'pending' ? 'secondary' :
                          payment.status === 'failed' ? 'destructive' :
                          'outline'
                        }>
                          {payment.status}
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
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-blue-600" />
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

          <TabsContent value="support" className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Support Tickets</h3>
              <p className="text-muted-foreground mb-4">
                View and manage support tickets for this customer
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Support Ticket
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}