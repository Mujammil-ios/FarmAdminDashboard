import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCitySchema, insertAreaSchema, type City, type InsertCity, type Area, type InsertArea } from "@shared/schema";

export default function Cities() {
  const [search, setSearch] = useState("");
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [selectedCityForArea, setSelectedCityForArea] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const { data: areas, isLoading: areasLoading } = useQuery<Area[]>({
    queryKey: ["/api/areas"],
  });

  const cityForm = useForm<InsertCity>({
    resolver: zodResolver(insertCitySchema),
    defaultValues: {
      name: "",
    },
  });

  const areaForm = useForm<InsertArea>({
    resolver: zodResolver(insertAreaSchema),
    defaultValues: {
      name: "",
      cityId: undefined,
    },
  });

  // City mutations
  const createCityMutation = useMutation({
    mutationFn: async (data: InsertCity) => {
      await apiRequest("POST", "/api/cities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      setIsCityDialogOpen(false);
      cityForm.reset();
      toast({
        title: "Success",
        description: "City created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create city",
        variant: "destructive",
      });
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCity> }) => {
      await apiRequest("PUT", `/api/cities/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      setIsCityDialogOpen(false);
      setEditingCity(null);
      cityForm.reset();
      toast({
        title: "Success",
        description: "City updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update city",
        variant: "destructive",
      });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive",
      });
    },
  });

  // Area mutations
  const createAreaMutation = useMutation({
    mutationFn: async (data: InsertArea) => {
      await apiRequest("POST", "/api/areas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/areas"] });
      setIsAreaDialogOpen(false);
      areaForm.reset();
      toast({
        title: "Success",
        description: "Area created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create area",
        variant: "destructive",
      });
    },
  });

  const updateAreaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertArea> }) => {
      await apiRequest("PUT", `/api/areas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/areas"] });
      setIsAreaDialogOpen(false);
      setEditingArea(null);
      areaForm.reset();
      toast({
        title: "Success",
        description: "Area updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update area",
        variant: "destructive",
      });
    },
  });

  const deleteAreaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/areas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/areas"] });
      toast({
        title: "Success",
        description: "Area deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete area",
        variant: "destructive",
      });
    },
  });

  const filteredCities = cities?.filter(city => 
    city.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const filteredAreas = areas?.filter(area => 
    area.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    cityForm.reset({
      name: city.name || "",
    });
    setIsCityDialogOpen(true);
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    areaForm.reset({
      name: area.name || "",
      cityId: area.cityId || undefined,
    });
    setIsAreaDialogOpen(true);
  };

  const onCitySubmit = (data: InsertCity) => {
    if (editingCity) {
      updateCityMutation.mutate({ id: editingCity.id, data });
    } else {
      createCityMutation.mutate(data);
    }
  };

  const onAreaSubmit = (data: InsertArea) => {
    if (editingArea) {
      updateAreaMutation.mutate({ id: editingArea.id, data });
    } else {
      createAreaMutation.mutate(data);
    }
  };

  const getCityName = (cityId: number) => {
    return cities?.find(city => city.id === cityId)?.name || "Unknown City";
  };

  const getAreaCountForCity = (cityId: number) => {
    return areas?.filter(area => area.cityId === cityId).length || 0;
  };

  const totalCities = cities?.length || 0;
  const totalAreas = areas?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cities & Areas</h1>
          <p className="text-gray-600">Manage cities and their areas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCities}</div>
          </CardContent>
        </Card>
        <Card className="card-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAreas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-white">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cities and areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Cities and Areas */}
      <Tabs defaultValue="cities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="cities" className="space-y-6">
          {/* Cities Section */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Cities</h2>
            <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add City
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
                </DialogHeader>
                <Form {...cityForm}>
                  <form onSubmit={cityForm.handleSubmit(onCitySubmit)} className="space-y-4">
                    <FormField
                      control={cityForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter city name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="btn-primary flex-1"
                        disabled={createCityMutation.isPending || updateCityMutation.isPending}
                      >
                        {editingCity ? "Update" : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCityDialogOpen(false);
                          setEditingCity(null);
                          cityForm.reset();
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

          <Card className="card-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Areas Count</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citiesLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : filteredCities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No cities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCities.map((city) => (
                      <TableRow key={city.id}>
                        <TableCell className="font-medium">{city.name}</TableCell>
                        <TableCell>{getAreaCountForCity(city.id)} areas</TableCell>
                        <TableCell>
                          {city.createdAt ? new Date(city.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCity(city)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCityMutation.mutate(city.id)}
                              disabled={deleteCityMutation.isPending}
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
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          {/* Areas Section */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Areas</h2>
            <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Area
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingArea ? "Edit Area" : "Add New Area"}</DialogTitle>
                </DialogHeader>
                <Form {...areaForm}>
                  <form onSubmit={areaForm.handleSubmit(onAreaSubmit)} className="space-y-4">
                    <FormField
                      control={areaForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter area name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={areaForm.control}
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
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="btn-primary flex-1"
                        disabled={createAreaMutation.isPending || updateAreaMutation.isPending}
                      >
                        {editingArea ? "Update" : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAreaDialogOpen(false);
                          setEditingArea(null);
                          areaForm.reset();
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

          <Card className="card-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areasLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : filteredAreas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No areas found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAreas.map((area) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">{area.name}</TableCell>
                        <TableCell>{getCityName(area.cityId || 0)}</TableCell>
                        <TableCell>
                          {area.createdAt ? new Date(area.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditArea(area)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAreaMutation.mutate(area.id)}
                              disabled={deleteAreaMutation.isPending}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
