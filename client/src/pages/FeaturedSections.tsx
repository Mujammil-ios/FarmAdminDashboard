import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Star, Heart, TrendingUp, Crown, ArrowUp, ArrowDown, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FeaturedSection, InsertFeaturedSection, Farm, FeaturedSectionFarm } from "@shared/schema";

export default function FeaturedSections() {
  const [editingSection, setEditingSection] = useState<FeaturedSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("sections");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["/api/featured-sections"],
  });

  const { data: farms = [] } = useQuery({
    queryKey: ["/api/farms"],
  });

  const { data: sectionFarms = [] } = useQuery({
    queryKey: [`/api/featured-sections/${selectedSection}/farms`],
    enabled: !!selectedSection,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFeaturedSection) => {
      const response = await apiRequest("/api/featured-sections", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-sections"] });
      toast({ title: "Featured section created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertFeaturedSection> }) => {
      const response = await apiRequest(`/api/featured-sections/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update section");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-sections"] });
      toast({ title: "Featured section updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/featured-sections/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete section");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-sections"] });
      toast({ title: "Featured section deleted successfully" });
    },
  });

  const addFarmMutation = useMutation({
    mutationFn: async ({ sectionId, farmIds }: { sectionId: number; farmIds: number[] }) => {
      const response = await apiRequest(`/api/featured-sections/${sectionId}/farms`, {
        method: "POST",
        body: JSON.stringify({ farmIds }),
      });
      if (!response.ok) throw new Error("Failed to add farms");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-sections"] });
      queryClient.invalidateQueries({ queryKey: [`/api/featured-sections/${selectedSection}/farms`] });
      toast({ title: "Farms added to section successfully" });
    },
  });

  const removeFarmMutation = useMutation({
    mutationFn: async ({ sectionId, farmId }: { sectionId: number; farmId: number }) => {
      const response = await apiRequest(`/api/featured-sections/${sectionId}/farms/${farmId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove farm");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/featured-sections"] });
      queryClient.invalidateQueries({ queryKey: [`/api/featured-sections/${selectedSection}/farms`] });
      toast({ title: "Farm removed from section" });
    },
  });

  const [formData, setFormData] = useState<Partial<InsertFeaturedSection>>({
    name: "",
    displayName: "",
    description: "",
    type: "affordable",
    iconUrl: "",
    displayOrder: 1,
    isActive: true,
  });

  const [selectedFarms, setSelectedFarms] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      type: "affordable",
      iconUrl: "",
      displayOrder: 1,
      isActive: true,
    });
    setEditingSection(null);
    setSelectedFarms([]);
  };

  const handleEdit = (section: FeaturedSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      displayName: section.displayName,
      description: section.description,
      type: section.type,
      iconUrl: section.iconUrl,
      displayOrder: section.displayOrder,
      isActive: section.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertFeaturedSection);
    }
  };

  const handleAddFarms = () => {
    if (selectedSection && selectedFarms.length > 0) {
      addFarmMutation.mutate({
        sectionId: selectedSection,
        farmIds: selectedFarms,
      });
      setSelectedFarms([]);
    }
  };

  const sectionTypes = [
    { value: "affordable", label: "Affordable Price", icon: "💰" },
    { value: "couples", label: "Best for Couples", icon: "💕" },
    { value: "visited", label: "Most Visited", icon: "🔥" },
    { value: "luxury", label: "Luxury", icon: "👑" },
    { value: "family", label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
    { value: "adventure", label: "Adventure", icon: "🏃‍♂️" },
    { value: "peaceful", label: "Peaceful", icon: "🕊️" },
    { value: "modern", label: "Modern", icon: "🏢" },
  ];

  const getIconForType = (type: string) => {
    const typeConfig = sectionTypes.find(t => t.value === type);
    return typeConfig?.icon || "⭐";
  };

  // Search and pagination logic
  const availableFarms = useMemo(() => {
    return (farms as Farm[]).filter((farm: Farm) => 
      !sectionFarms.some((sf: FeaturedSectionFarm) => sf.farmId === farm.id)
    );
  }, [farms, sectionFarms]);

  const filteredFarms = useMemo(() => {
    return availableFarms.filter((farm: Farm) =>
      farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableFarms, searchTerm]);

  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage);
  const paginatedFarms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFarms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFarms, currentPage, itemsPerPage]);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Featured Sections</h1>
          <p className="text-gray-600">Create custom sections to showcase farms by different criteria</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sections">Manage Sections</TabsTrigger>
          <TabsTrigger value="farms">Assign Farms</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Featured Sections</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSection ? "Edit Featured Section" : "Add New Featured Section"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Section Name (Internal)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., affordable_farms"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="e.g., Affordable Farms"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this section features"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Section Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="displayOrder">Display Order</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        min="1"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="iconUrl">Icon URL (Optional)</Label>
                    <Input
                      id="iconUrl"
                      value={formData.iconUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
                      placeholder="https://example.com/icon.svg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingSection ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div>Loading sections...</div>
            ) : sections.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No featured sections found.</p>
                  <p className="text-sm text-gray-500">Create sections to organize and promote your farms.</p>
                </CardContent>
              </Card>
            ) : (
              sections
                .sort((a: FeaturedSection, b: FeaturedSection) => a.displayOrder - b.displayOrder)
                .map((section: FeaturedSection) => (
                  <Card key={section.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getIconForType(section.type)}</span>
                            <h3 className="text-lg font-semibold">{section.displayName}</h3>
                            <Badge variant={section.isActive ? "default" : "destructive"}>
                              {section.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              Order: {section.displayOrder}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{section.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Type: {section.type}</span>
                            <span>Internal Name: {section.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSection(section.id);
                              setActiveTab("farms");
                            }}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage Farms
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(section.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="farms" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="sectionSelect">Select Section to Manage</Label>
              <Select 
                value={selectedSection?.toString()} 
                onValueChange={(value) => setSelectedSection(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section: FeaturedSection) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {getIconForType(section.type)} {section.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSection && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Available Properties ({filteredFarms.length})</span>
                    {selectedFarms.length > 0 && (
                      <Badge variant="secondary">
                        {selectedFarms.length} selected
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, owner, or location..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredFarms.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm ? "No properties found matching your search" : "All properties are already in this section"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 max-h-96 overflow-y-auto">
                        {paginatedFarms.map((farm: Farm) => (
                          <div key={farm.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={`farm-${farm.id}`}
                              checked={selectedFarms.includes(farm.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFarms(prev => [...prev, farm.id]);
                                } else {
                                  setSelectedFarms(prev => prev.filter(id => id !== farm.id));
                                }
                              }}
                              className="mt-1"
                            />
                            <Label htmlFor={`farm-${farm.id}`} className="flex-1 cursor-pointer">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{farm.name}</p>
                                <p className="text-xs text-gray-500">Owner: {farm.ownerName}</p>
                                <p className="text-xs text-gray-400">{farm.address}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    ₹{farm.morningSlotPrice?.toLocaleString()}/day
                                  </Badge>
                                  {farm.rating && (
                                    <Badge variant="secondary" className="text-xs">
                                      ⭐ {farm.rating.toFixed(1)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t">
                          <p className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedFarms.length > 0 && (
                        <Button
                          onClick={handleAddFarms}
                          disabled={addFarmMutation.isPending}
                          className="w-full"
                        >
                          Add Selected Properties ({selectedFarms.length})
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Properties in Section ({(sectionFarms as FeaturedSectionFarm[]).length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(sectionFarms as FeaturedSectionFarm[]).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No properties in this section yet</p>
                      <p className="text-sm text-gray-400">Add properties from the left panel to get started</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {(sectionFarms as FeaturedSectionFarm[]).map((sectionFarm: FeaturedSectionFarm) => {
                        const farm = (farms as Farm[]).find((f: Farm) => f.id === sectionFarm.farmId);
                        return farm ? (
                          <div key={sectionFarm.id} className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex-1 space-y-1">
                              <p className="font-medium text-sm">{farm.name}</p>
                              <p className="text-xs text-gray-500">Owner: {farm.ownerName}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  ₹{farm.morningSlotPrice?.toLocaleString()}/day
                                </Badge>
                                {farm.rating && (
                                  <Badge variant="secondary" className="text-xs">
                                    ⭐ {farm.rating.toFixed(1)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFarmMutation.mutate({
                                sectionId: selectedSection,
                                farmId: farm.id,
                              })}
                              disabled={removeFarmMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}