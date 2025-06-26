import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Building, Clock, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SubProperty, InsertSubProperty, Farm } from "@shared/schema";

export default function SubProperties() {
  const [selectedFarm, setSelectedFarm] = useState<number | null>(null);
  const [editingProperty, setEditingProperty] = useState<SubProperty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: farms = [] } = useQuery({
    queryKey: ["/api/farms"],
  });

  const { data: subProperties = [], isLoading } = useQuery({
    queryKey: ["/api/sub-properties", selectedFarm],
    enabled: !!selectedFarm,
  });

  const { data: amenities = [] } = useQuery({
    queryKey: ["/api/amenities"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSubProperty) => {
      const response = await apiRequest("/api/sub-properties", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create sub-property");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-properties"] });
      toast({ title: "Sub-property created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSubProperty> }) => {
      const response = await apiRequest(`/api/sub-properties/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update sub-property");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-properties"] });
      toast({ title: "Sub-property updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/sub-properties/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete sub-property");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-properties"] });
      toast({ title: "Sub-property deleted successfully" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/sub-properties/${id}/toggle`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to toggle status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-properties"] });
      toast({ title: "Status updated successfully" });
    },
  });

  const [formData, setFormData] = useState<Partial<InsertSubProperty>>({
    farmId: selectedFarm || undefined,
    name: "",
    description: "",
    type: "",
    maxGuests: 1,
    pricePerSlot: "0",
    amenities: [],
    images: [],
    morningCheckIn: "09:00",
    morningCheckOut: "18:00",
    eveningCheckIn: "18:00",
    eveningCheckOut: "09:00",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      farmId: selectedFarm || undefined,
      name: "",
      description: "",
      type: "",
      maxGuests: 1,
      pricePerSlot: "0",
      amenities: [],
      images: [],
      morningCheckIn: "09:00",
      morningCheckOut: "18:00",
      eveningCheckIn: "18:00",
      eveningCheckOut: "09:00",
      isActive: true,
    });
    setEditingProperty(null);
  };

  const handleEdit = (property: SubProperty) => {
    setEditingProperty(property);
    setFormData({
      farmId: property.farmId,
      name: property.name,
      description: property.description,
      type: property.type,
      maxGuests: property.maxGuests,
      pricePerSlot: property.pricePerSlot,
      amenities: property.amenities,
      images: property.images,
      morningCheckIn: property.morningCheckIn,
      morningCheckOut: property.morningCheckOut,
      eveningCheckIn: property.eveningCheckIn,
      eveningCheckOut: property.eveningCheckOut,
      isActive: property.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm) {
      toast({ title: "Please select a farm first", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      farmId: selectedFarm,
    };

    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data: submitData });
    } else {
      createMutation.mutate(submitData as InsertSubProperty);
    }
  };

  const propertyTypes = [
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Apartment" },
    { value: "cottage", label: "Cottage" },
    { value: "resort", label: "Resort Room" },
    { value: "tent", label: "Tent" },
    { value: "treehouse", label: "Tree House" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sub-Properties Management</h1>
          <p className="text-gray-600">Manage villas, apartments, and other sub-properties within farms</p>
        </div>
      </div>

      {/* Farm Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Select Farm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFarm?.toString()} onValueChange={(value) => setSelectedFarm(Number(value))}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose a farm to manage its sub-properties" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm: Farm) => (
                <SelectItem key={farm.id} value={farm.id.toString()}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedFarm && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sub-Properties</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-Property
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProperty ? "Edit Sub-Property" : "Add New Sub-Property"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Property Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Villa A1, Apartment 203"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Property Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the sub-property features and amenities"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxGuests">Max Guests</Label>
                      <Input
                        id="maxGuests"
                        type="number"
                        min="1"
                        value={formData.maxGuests}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerSlot">Price per Slot (₹)</Label>
                      <Input
                        id="pricePerSlot"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricePerSlot}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerSlot: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Slot Timings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="morningCheckIn">Morning Check-in</Label>
                        <Input
                          id="morningCheckIn"
                          type="time"
                          value={formData.morningCheckIn}
                          onChange={(e) => setFormData(prev => ({ ...prev, morningCheckIn: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="morningCheckOut">Morning Check-out</Label>
                        <Input
                          id="morningCheckOut"
                          type="time"
                          value={formData.morningCheckOut}
                          onChange={(e) => setFormData(prev => ({ ...prev, morningCheckOut: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eveningCheckIn">Evening Check-in</Label>
                        <Input
                          id="eveningCheckIn"
                          type="time"
                          value={formData.eveningCheckIn}
                          onChange={(e) => setFormData(prev => ({ ...prev, eveningCheckIn: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eveningCheckOut">Evening Check-out</Label>
                        <Input
                          id="eveningCheckOut"
                          type="time"
                          value={formData.eveningCheckOut}
                          onChange={(e) => setFormData(prev => ({ ...prev, eveningCheckOut: e.target.value }))}
                        />
                      </div>
                    </div>
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
                      {editingProperty ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div>Loading sub-properties...</div>
            ) : subProperties.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No sub-properties found for this farm.</p>
                  <p className="text-sm text-gray-500">Add sub-properties to manage individual units like villas or apartments.</p>
                </CardContent>
              </Card>
            ) : (
              subProperties.map((property: SubProperty) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{property.name}</h3>
                          <Badge variant={property.type === "villa" ? "default" : "secondary"}>
                            {property.type}
                          </Badge>
                          <Badge variant={property.isActive ? "default" : "destructive"}>
                            {property.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{property.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Max {property.maxGuests} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">₹{property.pricePerSlot}/slot</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              Morning: {property.morningCheckIn}-{property.morningCheckOut}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              Evening: {property.eveningCheckIn}-{property.eveningCheckOut}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(property.id)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {property.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(property.id)}
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
        </>
      )}
    </div>
  );
}