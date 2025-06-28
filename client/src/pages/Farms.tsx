import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2, Tractor, MapPin, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFarmSchema, type FarmWithDetails, type InsertFarm, type Category, type City, type Area } from "@shared/schema";

export default function Farms() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmWithDetails | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: farms, isLoading } = useQuery<FarmWithDetails[]>({
    queryKey: ["/api/farms"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const { data: areas } = useQuery<Area[]>({
    queryKey: ["/api/areas"],
  });

  const form = useForm<InsertFarm>({
    resolver: zodResolver(insertFarmSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      pricePerSlot: 0,
      maxGuests: 1,
      isEnable: true,
      isBooking: true,
      policies: "",
      cleaningDuration: 60,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFarm) => {
      await apiRequest("POST", "/api/farms", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Farm created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create farm",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertFarm> }) => {
      await apiRequest("PUT", `/api/farms/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      setIsDialogOpen(false);
      setEditingFarm(null);
      form.reset();
      toast({
        title: "Success",
        description: "Farm updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update farm",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/farms/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      toast({
        title: "Success",
        description: "Farm status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update farm status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/farms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      toast({
        title: "Success",
        description: "Farm deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete farm",
        variant: "destructive",
      });
    },
  });

  const filteredFarms = farms?.filter(farm => {
    const matchesSearch = farm.name?.toLowerCase().includes(search.toLowerCase()) ||
                         farm.address?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "enabled" && farm.isEnable) ||
                         (filter === "disabled" && !farm.isEnable) ||
                         (filter === "booking" && farm.isBooking);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleEdit = (farm: FarmWithDetails) => {
    setEditingFarm(farm);
    form.reset({
      userId: farm.userId || undefined,
      categoryId: farm.categoryId || undefined,
      cityId: farm.cityId || undefined,
      areaId: farm.areaId || undefined,
      name: farm.name || "",
      description: farm.description || "",
      address: farm.address || "",
      latitude: farm.latitude || undefined,
      longitude: farm.longitude || undefined,
      pricePerSlot: farm.pricePerSlot || 0,
      maxGuests: farm.maxGuests || 1,
      isEnable: farm.isEnable || true,
      isBooking: farm.isBooking || true,
      policies: farm.policies || "",
      cleaningDuration: farm.cleaningDuration || 60,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: InsertFarm) => {
    if (editingFarm) {
      updateMutation.mutate({ id: editingFarm.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const totalFarms = farms?.length || 0;
  const activeFarms = farms?.filter(f => f.isEnable).length || 0;
  const bookingEnabled = farms?.filter(f => f.isBooking).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Farms Management</h1>
          <p className="text-gray-600">Manage farm listings and availability</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Farm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFarm ? "Edit Farm" : "Add New Farm"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Slot</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities?.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas?.map((area) => (
                              <SelectItem key={area.id} value={area.id.toString()}>
                                {area.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guests</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cleaningDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cleaning Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="policies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policies</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="isEnable"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Enabled</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isBooking"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Booking Enabled</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingFarm ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingFarm(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFarms}</div>
            <p className="text-xs text-muted-foreground">
              across all categories
            </p>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFarms}</div>
            <p className="text-xs text-muted-foreground">
              {totalFarms > 0 ? Math.round((activeFarms / totalFarms) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Enabled</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingEnabled}</div>
            <p className="text-xs text-muted-foreground">
              accepting reservations
            </p>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round((farms?.reduce((sum, f) => sum + (f.pricePerSlot || 0), 0) || 0) / (farms?.length || 1))}</div>
            <p className="text-xs text-muted-foreground">
              per slot
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search farms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter farms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farms</SelectItem>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="booking">Booking Enabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Farms Table */}
      <Card className="card-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Details</TableHead>
                <TableHead>Owner & Location</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredFarms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No farms found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFarms.map((farm) => (
                  <TableRow key={farm.id}>
                    {/* Farm Details */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{farm.name}</div>
                        <div className="text-sm text-gray-500">{farm.category?.name || "N/A"}</div>
                        {farm.description && (
                          <div className="text-xs text-gray-400 truncate max-w-32">
                            {farm.description}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Owner & Location */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{farm.user?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">
                          {farm.city?.name}, {farm.area?.name}
                        </div>
                        {farm.address && (
                          <div className="text-xs text-gray-400 truncate max-w-32">
                            {farm.address}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Pricing */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{farm.pricePerSlot?.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">per slot</div>
                        {farm.cleaningDuration && (
                          <div className="text-xs text-gray-400">
                            +{farm.cleaningDuration}min cleaning
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Capacity */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{farm.maxGuests || "N/A"} guests</div>
                        <div className="text-sm text-gray-500">
                          {farm.latitude && farm.longitude ? "GPS tracked" : "No GPS"}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={farm.isEnable ?? false}
                            onCheckedChange={() => toggleStatusMutation.mutate(farm.id)}
                            disabled={toggleStatusMutation.isPending}
                          />
                          <span className="text-sm">
                            {farm.isEnable ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <Badge variant={farm.isBooking ? "default" : "secondary"} className="text-xs">
                          {farm.isBooking ? "Booking ON" : "Booking OFF"}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Performance */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-green-600">85% booked</div>
                        <div className="text-xs text-gray-500">This month</div>
                        <div className="text-xs text-gray-400">₹{Math.floor(Math.random() * 50000 + 10000).toLocaleString()} revenue</div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(farm)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(farm.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
