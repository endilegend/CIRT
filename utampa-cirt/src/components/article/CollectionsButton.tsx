"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  FolderPlus,
  Check,
  Plus,
  X,
  BookmarkCheck,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CollectionsButtonProps {
  articleId: string;
  articleTitle: string;
}

// Mock collections data - would be stored in a database in a real app
const mockCollections = [
  { id: "1", name: "Research Methods", color: "bg-blue-100 text-blue-700" },
  { id: "2", name: "Forensics Papers", color: "bg-green-100 text-green-700" },
  { id: "3", name: "Teaching Resources", color: "bg-purple-100 text-purple-700" },
];

const CollectionsButton: React.FC<CollectionsButtonProps> = ({
  articleId,
  articleTitle
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [collections, setCollections] = useState(mockCollections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);

  // Check localStorage on mount to see if article is saved
  useEffect(() => {
    // In a real app, this would be an API call to check if article is in any user collections
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "{}");
    if (savedArticles[articleId]) {
      setIsSaved(true);
      setSelectedCollections(savedArticles[articleId].collections || []);
    }
  }, [articleId]);

  const handleSaveToCollection = (collectionId: string) => {
    // Toggle collection selection
    setSelectedCollections((prev) => {
      const newSelected = prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId];

      // Update localStorage
      const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "{}");
      savedArticles[articleId] = {
        title: articleTitle,
        collections: newSelected,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles));

      // Update isSaved status
      setIsSaved(newSelected.length > 0);

      return newSelected;
    });
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    // Create new collection with random color
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
      "bg-red-100 text-red-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];

    const newId = (collections.length + 1).toString();
    const newCollection = {
      id: newId,
      name: newCollectionName.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName("");
    setShowNewCollection(false);

    // Auto-select the new collection
    handleSaveToCollection(newId);

    toast.success(`Added to new collection: ${newCollectionName}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`collections-button ${isSaved ? 'border-utred' : ''}`}
          data-saved={isSaved}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="font-medium">Save to Collection</div>

          <div className="space-y-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleSaveToCollection(collection.id)}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${collection.color.split(' ')[0]}`}></div>
                  <span>{collection.name}</span>
                </div>
                <div>
                  {selectedCollections.includes(collection.id) ? (
                    <Badge className="bg-utred">
                      <Check className="h-3 w-3 mr-1" />
                      Saved
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showNewCollection ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleCreateCollection}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNewCollection(false);
                  setNewCollectionName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowNewCollection(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Create New Collection
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs w-full">
                Manage All Collections
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Collections</DialogTitle>
              </DialogHeader>

              <div className="max-h-96 overflow-y-auto py-4">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 border-b"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${collection.color.split(' ')[0]}`}></div>
                      <span className="font-medium">{collection.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {/* In a real app, show count of articles in collection */}
                      3 articles
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowNewCollection(true)}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create New Collection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionsButton;
