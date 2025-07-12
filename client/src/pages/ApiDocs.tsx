import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Resizable panels would be nice but let's use a simpler layout for now
import { 
  File, 
  FolderOpen, 
  Plus, 
  Save, 
  Eye, 
  Code, 
  Search, 
  GitBranch,
  History,
  Download,
  Upload
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ApiDocs() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const queryClient = useQueryClient();

  const { data: docs, isLoading } = useQuery({
    queryKey: ["/api/docs"],
  });

  const { data: selectedDocData } = useQuery({
    queryKey: ["/api/docs", selectedDoc],
    enabled: !!selectedDoc,
  });

  const updateDocMutation = useMutation({
    mutationFn: (data: { id: number; title: string; content: string }) =>
      apiRequest(`/api/docs/${data.id}`, "PUT", { 
        title: data.title, 
        content: data.content,
        lastEditedBy: 1 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/docs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/docs", selectedDoc] });
      setEditMode(false);
    },
  });

  const createDocMutation = useMutation({
    mutationFn: (data: { filename: string; title: string; content: string; category: string }) =>
      apiRequest("/api/docs", "POST", { 
        ...data, 
        lastEditedBy: 1,
        version: "1.0",
        isPublic: false
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/docs"] });
    },
  });

  const filteredDocs = docs?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(docs?.map(doc => doc.category) || [])];

  const handleSave = () => {
    if (selectedDoc && selectedDocData) {
      updateDocMutation.mutate({
        id: selectedDoc,
        title: editTitle,
        content: editContent
      });
    }
  };

  const handleEdit = () => {
    if (selectedDocData) {
      setEditTitle(selectedDocData.title);
      setEditContent(selectedDocData.content);
      setEditMode(true);
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for preview
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/gim, '<br>');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
        <div className="h-[600px] border rounded-lg animate-pulse bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground">Manage and maintain API documentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <Card>
        <CardContent className="p-0">
          <div className="flex min-h-[700px]">
            {/* File Browser */}
            <div className="w-1/4 border-r">
              <div className="p-4 h-full">
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search docs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Tree */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <FolderOpen className="h-4 w-4" />
                      API Documentation
                    </div>
                    {filteredDocs.map(doc => (
                      <div
                        key={doc.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted ${
                          selectedDoc === doc.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedDoc(doc.id)}
                      >
                        <File className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{doc.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">v{doc.version}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor/Preview */}
            <div className="flex-1">
              {selectedDoc && selectedDocData ? (
                <div className="h-full flex flex-col">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium">{selectedDocData.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDocData.filename} • Last edited {
                            new Date(selectedDocData.updatedAt).toLocaleDateString()
                          }
                        </p>
                      </div>
                      <Badge variant={selectedDocData.isPublic ? "default" : "secondary"}>
                        {selectedDocData.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitBranch className="h-4 w-4 mr-2" />
                        Version
                      </Button>
                      {editMode ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={handleSave}
                            disabled={updateDocMutation.isPending}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={handleEdit}>
                          <Code className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-hidden">
                    {editMode ? (
                      <div className="h-full flex flex-col p-4 space-y-4">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Document title"
                          className="font-medium"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Write your documentation in Markdown..."
                          className="flex-1 resize-none font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <Tabs defaultValue="preview" className="h-full">
                        <div className="border-b px-4">
                          <TabsList>
                            <TabsTrigger value="preview">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </TabsTrigger>
                            <TabsTrigger value="source">
                              <Code className="h-4 w-4 mr-2" />
                              Source
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        
                        <TabsContent value="preview" className="h-full mt-0">
                          <div 
                            className="p-6 h-full overflow-auto prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(selectedDocData.content)
                            }}
                          />
                        </TabsContent>
                        
                        <TabsContent value="source" className="h-full mt-0">
                          <pre className="p-6 h-full overflow-auto text-sm bg-muted font-mono whitespace-pre-wrap">
                            {selectedDocData.content}
                          </pre>
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a document to view</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a document from the sidebar to view or edit its content
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}