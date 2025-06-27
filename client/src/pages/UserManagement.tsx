import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
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
  Building,
  Shield,
  UserCheck,
  Clock
} from "lucide-react";

interface UserSearchResult {
  firebaseId: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'customer' | 'owner';
  isActive: boolean;
  joinDate: string;
  lastLoginDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'firebaseId' | 'phone'>('phone');
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a Firebase ID or phone number");
      return;
    }

    try {
      const params = new URLSearchParams();
      if (searchType === 'firebaseId') {
        params.set('firebaseId', searchQuery);
      } else {
        params.set('phone', searchQuery);
      }

      const response = await fetch(`/api/user-management/search?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError("User not found");
          setSearchResult(null);
          return;
        }
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResult(data);
      setSearchError("");
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Search failed. Please try again.");
      setSearchResult(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Search and manage customers and owners using Firebase ID or phone number
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            User Search
          </CardTitle>
          <CardDescription>
            Find detailed user information by Firebase Auth ID or phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <Button
                  variant={searchType === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('phone')}
                >
                  Phone Number
                </Button>
                <Button
                  variant={searchType === 'firebaseId' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('firebaseId')}
                >
                  Firebase ID
                </Button>
              </div>
              <Input
                placeholder={searchType === 'phone' ? "Enter phone number (e.g., +919876543210)" : "Enter Firebase Auth ID"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="px-8">
              Search
            </Button>
          </div>

          {searchError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {searchError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {searchResult.userType === 'customer' ? (
                <Users className="h-5 w-5 text-blue-500" />
              ) : (
                <Crown className="h-5 w-5 text-gold-500" />
              )}
              {searchResult.name}
              <Badge variant={searchResult.userType === 'customer' ? 'default' : 'secondary'}>
                {searchResult.userType === 'customer' ? 'Customer' : 'Owner'}
              </Badge>
              {getVerificationBadge(searchResult.verificationStatus)}
            </CardTitle>
            <CardDescription>
              Firebase ID: {searchResult.firebaseId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{searchResult.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{searchResult.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {formatDate(searchResult.joinDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last login {formatDate(searchResult.lastLoginDate)}</span>
              </div>
            </div>

            {/* User Type Specific Details */}
            {searchResult.userType === 'customer' ? (
              <CustomerDetails customerId={searchResult.firebaseId} />
            ) : (
              <OwnerDetails ownerId={searchResult.firebaseId} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Management Tabs */}
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">All Customers</TabsTrigger>
          <TabsTrigger value="owners">All Owners</TabsTrigger>
          <TabsTrigger value="roles">Admin Roles</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <AllCustomers />
        </TabsContent>

        <TabsContent value="owners">
          <AllOwners />
        </TabsContent>

        <TabsContent value="roles">
          <AdminRoles />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CustomerDetails({ customerId }: { customerId: string }) {
  const { data: customer } = useQuery({
    queryKey: ['/api/user-management/customers', customerId],
    queryFn: () => fetch(`/api/user-management/customers/${customerId}`).then(res => res.json())
  });

  const { data: bookings } = useQuery({
    queryKey: ['/api/user-management/customers', customerId, 'bookings'],
    queryFn: () => fetch(`/api/user-management/customers/${customerId}/bookings`).then(res => res.json())
  });

  const { data: payments } = useQuery({
    queryKey: ['/api/user-management/customers', customerId, 'payments'],
    queryFn: () => fetch(`/api/user-management/customers/${customerId}/payments`).then(res => res.json())
  });

  if (!customer) return <div>Loading customer details...</div>;

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bookings">Bookings ({bookings?.length || 0})</TabsTrigger>
        <TabsTrigger value="payments">Payments ({payments?.length || 0})</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{customer.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{customer.totalSpent?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{customer.loyaltyPoints}</p>
                  <p className="text-xs text-muted-foreground">Loyalty Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold capitalize">{customer.membershipLevel}</p>
                  <p className="text-xs text-muted-foreground">Membership</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium">{customer.completedBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Upcoming:</span>
                  <span className="font-medium">{customer.upcomingBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelled:</span>
                  <span className="font-medium">{customer.cancelledBookings}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{customer.emergencyContact?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium">{customer.emergencyContact?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Relation:</span>
                  <span className="font-medium">{customer.emergencyContact?.relation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="bookings">
        <div className="space-y-4">
          {bookings?.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.farmName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.checkInDate} to {booking.checkOutDate}
                    </p>
                    <p className="text-sm">
                      {booking.numberOfGuests} guests • {booking.slotType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{booking.totalAmount}</p>
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

      <TabsContent value="payments">
        <div className="space-y-4">
          {payments?.map((payment: any) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.paymentMethod} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{payment.amount}</p>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {customer.favoriteLocations?.map((location: string, index: number) => (
                  <Badge key={index} variant="outline">{location}</Badge>
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
                {customer.preferredAmenities?.map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function OwnerDetails({ ownerId }: { ownerId: string }) {
  const { data: owner } = useQuery({
    queryKey: ['/api/user-management/owners', ownerId],
    queryFn: () => fetch(`/api/user-management/owners/${ownerId}`).then(res => res.json())
  });

  const { data: bookings } = useQuery({
    queryKey: ['/api/user-management/owners', ownerId, 'bookings'],
    queryFn: () => fetch(`/api/user-management/owners/${ownerId}/bookings`).then(res => res.json())
  });

  const { data: payouts } = useQuery({
    queryKey: ['/api/user-management/owners', ownerId, 'payouts'],
    queryFn: () => fetch(`/api/user-management/owners/${ownerId}/payouts`).then(res => res.json())
  });

  if (!owner) return <div>Loading owner details...</div>;

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="business">Business Info</TabsTrigger>
        <TabsTrigger value="bookings">Bookings ({bookings?.length || 0})</TabsTrigger>
        <TabsTrigger value="payouts">Payouts ({payouts?.length || 0})</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{owner.totalFarms}</p>
                  <p className="text-xs text-muted-foreground">Total Farms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{owner.totalEarnings?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{owner.averageRating?.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{owner.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="business">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className="font-medium capitalize">{owner.businessType}</span>
              </div>
              <div className="flex justify-between">
                <span>PAN Number:</span>
                <span className="font-medium">{owner.panNumber}</span>
              </div>
              {owner.gstNumber && (
                <div className="flex justify-between">
                  <span>GST Number:</span>
                  <span className="font-medium">{owner.gstNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>KYC Status:</span>
                <Badge variant={owner.kycStatus === 'verified' ? 'default' : 'secondary'}>
                  {owner.kycStatus}
                </Badge>
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
                <span className="font-medium">{owner.bankDetails?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Type:</span>
                <span className="font-medium capitalize">{owner.bankDetails?.accountType}</span>
              </div>
              <div className="flex justify-between">
                <span>IFSC Code:</span>
                <span className="font-medium">{owner.bankDetails?.ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <span className="font-medium">****{owner.bankDetails?.accountNumber.slice(-4)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="financial">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Total Earnings:</span>
                <span className="font-medium">₹{owner.totalEarnings?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Paid:</span>
                <span className="font-medium">₹{owner.totalCommissionPaid?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding:</span>
                <span className="font-medium text-orange-600">₹{owner.outstandingPayments?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Rate:</span>
                <span className="font-medium">{owner.commissionRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function AllCustomers() {
  const { data: customers = [] } = useQuery({
    queryKey: ['/api/user-management/customers'],
    queryFn: () => fetch('/api/user-management/customers').then(res => res.json())
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customers.map((customer: any) => (
          <Card key={customer.firebaseId}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold">{customer.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-medium">{customer.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-medium">₹{customer.totalSpent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Membership:</span>
                  <Badge variant="outline" className="text-xs">
                    {customer.membershipLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AllOwners() {
  const { data: owners = [] } = useQuery({
    queryKey: ['/api/user-management/owners'],
    queryFn: () => fetch('/api/user-management/owners').then(res => res.json())
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {owners.map((owner: any) => (
          <Card key={owner.firebaseId}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-gold-500" />
                <h3 className="font-semibold">{owner.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Business:</span>
                  <span className="font-medium">{owner.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Farms:</span>
                  <span className="font-medium">{owner.totalFarms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Earnings:</span>
                  <span className="font-medium">₹{owner.totalEarnings?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{owner.averageRating?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding:</span>
                  <span className="font-medium text-orange-600">₹{owner.outstandingPayments?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminRoles() {
  const { data: roles = [] } = useQuery({
    queryKey: ['/api/user-management/admin-roles'],
    queryFn: () => fetch('/api/user-management/admin-roles').then(res => res.json())
  });

  const { data: adminUsers = [] } = useQuery({
    queryKey: ['/api/user-management/admin-users'],
    queryFn: () => fetch('/api/user-management/admin-users').then(res => res.json())
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Admin Roles & Permissions</h3>
        <div className="grid gap-4">
          {roles.map((role: any) => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {role.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Users</h4>
                    <div className="space-y-1">
                      {role.permissions.users.view && <Badge variant="outline">View</Badge>}
                      {role.permissions.users.create && <Badge variant="outline">Create</Badge>}
                      {role.permissions.users.edit && <Badge variant="outline">Edit</Badge>}
                      {role.permissions.users.delete && <Badge variant="destructive">Delete</Badge>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Payments</h4>
                    <div className="space-y-1">
                      {role.permissions.payments.view && <Badge variant="outline">View</Badge>}
                      {role.permissions.payments.process && <Badge variant="outline">Process</Badge>}
                      {role.permissions.payments.refund && <Badge variant="outline">Refund</Badge>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Support</h4>
                    <div className="space-y-1">
                      {role.permissions.support.viewTickets && <Badge variant="outline">View Tickets</Badge>}
                      {role.permissions.support.respondToTickets && <Badge variant="outline">Respond</Badge>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">System</h4>
                    <div className="space-y-1">
                      {role.permissions.system.manageRoles && <Badge variant="outline">Manage Roles</Badge>}
                      {role.permissions.system.viewLogs && <Badge variant="outline">View Logs</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Admin Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminUsers.map((user: any) => {
            const role = roles.find((r: any) => r.id === user.roleId);
            return (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <h3 className="font-semibold">{user.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <Badge variant="outline">{role?.name}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">{user.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RevenueReports() {
  const [fromDate, setFromDate] = useState("2024-06-01");
  const [toDate, setToDate] = useState("2024-06-30");

  const { data: report } = useQuery({
    queryKey: ['/api/user-management/revenue-report', fromDate, toDate],
    queryFn: () => fetch(`/api/user-management/revenue-report?fromDate=${fromDate}&toDate=${toDate}`).then(res => res.json()),
    enabled: !!fromDate && !!toDate
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{report.totalRevenue?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">₹{report.totalCommission?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Commission Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{report.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">₹{report.averageBookingValue?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Avg Booking Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}