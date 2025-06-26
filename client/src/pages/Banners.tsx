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
import { Plus, Edit, Trash2, Image, Link, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Banner, InsertBanner, Farm, Category } from "@shared/schema";

export default function Banners() {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["/api/banners"],
  });

  const { data: farms = [] } = useQuery({
    queryKey: ["/api/farms"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBanner) => {
      const response = await apiRequest("/api/banners", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create banner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBanner> }) => {
      const response = await apiRequest(`/api/banners/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update banner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/banners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete banner");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner deleted successfully" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: "up" | "down" }) => {
      const response = await apiRequest(`/api/banners/${id}/reorder`, {
        method: "POST",
        body: JSON.stringify({ direction }),
      });
      if (!response.ok) throw new Error("Failed to reorder banner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner order updated" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/banners/${id}/toggle`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to toggle status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Status updated successfully" });
    },
  });

  const [formData, setFormData] = useState<Partial<InsertBanner>>({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    linkType: "external",
    targetId: null,
    displayOrder: 1,
    isActive: true,
    startDate: null,
    endDate: null,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      linkType: "external",
      targetId: null,
      displayOrder: 1,
      isActive: true,
      startDate: null,
      endDate: null,
    });
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      linkType: banner.linkType,
      targetId: banner.targetId,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : null,
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : null,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: submitData });
    } else {
      createMutation.mutate(submitData as InsertBanner);
    }
  };

  const linkTypes = [
    { value: "external", label: "External Link" },
    { value: "farm", label: "Farm Detail" },
    { value: "category", label: "Category Page" },
  ];

  const getTargetOptions = () => {
    if (formData.linkType === "farm") return farms;
    if (formData.linkType === "category") return categories;
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-gray-600">Manage promotional banners for your home page</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Summer Special Offer"
                    required
                  />
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
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Additional description or promotional text"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Banner Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/banner-image.jpg"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Link Configuration</h4>
                <div>
                  <Label htmlFor="linkType">Link Type</Label>
                  <Select 
                    value={formData.linkType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, linkType: value, targetId: null }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.linkType === "external" && (
                  <div>
                    <Label htmlFor="linkUrl">External URL</Label>
                    <Input
                      id="linkUrl"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                      placeholder="https://example.com/promotion"
                    />
                  </div>
                )}

                {(formData.linkType === "farm" || formData.linkType === "category") && (
                  <div>
                    <Label htmlFor="targetId">
                      {formData.linkType === "farm" ? "Select Farm" : "Select Category"}
                    </Label>
                    <Select 
                      value={formData.targetId?.toString()} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, targetId: Number(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Choose ${formData.linkType}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getTargetOptions().map((option: any) => (
                          <SelectItem key={option.id} value={option.id.toString()}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value || null }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || null }))}
                  />
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
                  {editingBanner ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading banners...</div>
        ) : banners.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No banners found.</p>
              <p className="text-sm text-gray-500">Create banners to promote your farms and special offers.</p>
            </CardContent>
          </Card>
        ) : (
          banners
            .sort((a: Banner, b: Banner) => a.displayOrder - b.displayOrder)
            .map((banner: Banner) => (
              <Card key={banner.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {banner.imageUrl && (
                        <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={banner.imageUrl} 
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold truncate">{banner.title}</h3>
                          <Badge variant={banner.isActive ? "default" : "destructive"}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">
                            Order: {banner.displayOrder}
                          </Badge>
                        </div>
                        
                        {banner.subtitle && (
                          <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            <span className="capitalize">{banner.linkType}</span>
                          </div>
                          
                          {banner.startDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(banner.startDate).toLocaleDateString()}
                                {banner.endDate && ` - ${new Date(banner.endDate).toLocaleDateString()}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reorderMutation.mutate({ id: banner.id, direction: "up" })}
                        disabled={reorderMutation.isPending}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reorderMutation.mutate({ id: banner.id, direction: "down" })}
                        disabled={reorderMutation.isPending}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate(banner.id)}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {banner.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(banner.id)}
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
    </div>
  );
}