import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { RequestedFarm } from "@shared/schema";

export default function PendingFarms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requestedFarms, isLoading } = useQuery<RequestedFarm[]>({
    queryKey: ["/api/requested-farms"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/requested-farms/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requested-farms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Farm request approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve farm request",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/requested-farms/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requested-farms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Farm request rejected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject farm request",
        variant: "destructive",
      });
    },
  });

  const pendingFarms = requestedFarms?.filter(farm => farm.status === 'pending') || [];

  if (isLoading) {
    return (
      <Card className="card-white p-6">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-white p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Farm Approvals</h3>
          <Badge className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {pendingFarms.length} Pending
          </Badge>
        </div>
        <div className="space-y-4">
          {pendingFarms.slice(0, 3).map((farm) => (
            <div key={farm.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
                  alt="Farm"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{farm.farmName}</p>
                  <p className="text-sm text-gray-500">by {farm.ownerName}</p>
                  <p className="text-xs text-gray-400">{farm.city}, {farm.area}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="btn-primary text-xs"
                  onClick={() => approveMutation.mutate(farm.id)}
                  disabled={approveMutation.isPending}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => rejectMutation.mutate(farm.id)}
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
          
          {!pendingFarms.length && (
            <div className="text-center text-gray-500 py-8">
              No pending farm requests
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
