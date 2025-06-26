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
import { Plus, Edit, Trash2, Video, Play, Eye, Share, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Reel, InsertReel, Farm } from "@shared/schema";

export default function Reels() {
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reels = [], isLoading } = useQuery({
    queryKey: ["/api/reels"],
  });

  const { data: farms = [] } = useQuery({
    queryKey: ["/api/farms"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertReel) => {
      const response = await apiRequest("/api/reels", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create reel");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
      toast({ title: "Reel created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertReel> }) => {
      const response = await apiRequest(`/api/reels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update reel");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
      toast({ title: "Reel updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/reels/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete reel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
      toast({ title: "Reel deleted successfully" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: "up" | "down" }) => {
      const response = await apiRequest(`/api/reels/${id}/reorder`, {
        method: "POST",
        body: JSON.stringify({ direction }),
      });
      if (!response.ok) throw new Error("Failed to reorder reel");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
      toast({ title: "Reel order updated" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/reels/${id}/toggle`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to toggle status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reels"] });
      toast({ title: "Status updated successfully" });
    },
  });

  const [formData, setFormData] = useState<Partial<InsertReel>>({
    farmId: undefined,
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    farmAliasName: "",
    duration: 0,
    tags: [],
    displayOrder: 1,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      farmId: undefined,
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      farmAliasName: "",
      duration: 0,
      tags: [],
      displayOrder: 1,
      isActive: true,
    });
    setEditingReel(null);
  };

  const handleEdit = (reel: Reel) => {
    setEditingReel(reel);
    setFormData({
      farmId: reel.farmId,
      title: reel.title,
      description: reel.description,
      videoUrl: reel.videoUrl,
      thumbnailUrl: reel.thumbnailUrl,
      farmAliasName: reel.farmAliasName,
      duration: reel.duration,
      tags: reel.tags,
      displayOrder: reel.displayOrder,
      isActive: reel.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReel) {
      updateMutation.mutate({ id: editingReel.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertReel);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reels Management</h1>
          <p className="text-gray-600">Manage property videos for your mobile app feed</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReel ? "Edit Reel" : "Add New Reel"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farmId">Select Farm</Label>
                  <Select 
                    value={formData.farmId?.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, farmId: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {farms.map((farm: Farm) => (
                        <SelectItem key={farm.id} value={farm.id.toString()}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="farmAliasName">Farm Alias Name</Label>
                  <Input
                    id="farmAliasName"
                    value={formData.farmAliasName}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmAliasName: e.target.value }))}
                    placeholder="e.g., @greenvalleyfarms"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Reel Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning Views at Green Valley"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description/Caption</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Write a captivating description for your reel..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://example.com/video.mp4"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="300"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
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
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g., organic, peaceful, nature, luxury"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
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
                  {editingReel ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading reels...</div>
        ) : reels.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No reels found.</p>
              <p className="text-sm text-gray-500">Create video reels to showcase your properties in the mobile app.</p>
            </CardContent>
          </Card>
        ) : (
          reels
            .sort((a: Reel, b: Reel) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((reel: Reel) => {
              const farm = farms.find((f: Farm) => f.id === reel.farmId);
              return (
                <Card key={reel.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 flex-1">
                        {reel.thumbnailUrl && (
                          <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img 
                              src={reel.thumbnailUrl} 
                              alt={reel.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold truncate">{reel.title}</h3>
                            <Badge variant={reel.isActive ? "default" : "destructive"}>
                              {reel.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              Order: {reel.displayOrder}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-blue-600">@{reel.farmAliasName}</span>
                            {farm && <span className="text-gray-500">• {farm.name}</span>}
                          </div>
                          
                          {reel.description && (
                            <p className="text-gray-600 mb-3 line-clamp-2">{reel.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4" />
                              <span>{formatDuration(reel.duration || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{reel.viewCount || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share className="h-4 w-4" />
                              <span>{reel.shareCount || 0} shares</span>
                            </div>
                          </div>
                          
                          {reel.tags && Array.isArray(reel.tags) && reel.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {reel.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reorderMutation.mutate({ id: reel.id, direction: "up" })}
                          disabled={reorderMutation.isPending}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reorderMutation.mutate({ id: reel.id, direction: "down" })}
                          disabled={reorderMutation.isPending}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(reel.id)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {reel.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(reel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(reel.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
}