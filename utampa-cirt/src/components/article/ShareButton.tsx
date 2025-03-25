"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";

interface ShareButtonProps {
  articleId: string;
  articleTitle: string;
  articleDoi?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  articleId,
  articleTitle,
  articleDoi,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("social");

  // Build URL for sharing
  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/article/${articleId}`
    : `/article/${articleId}`;

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    toast.success("Link copied to clipboard");
  };

  // Handle email sharing
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Shared article: ${articleTitle}`);
    const body = encodeURIComponent(`Check out this article: ${articleTitle}\n\n${articleUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  // Handle social media sharing
  const handleSocialShare = (platform: string) => {
    let shareUrl = "";
    const encodedTitle = encodeURIComponent(articleTitle);
    const encodedUrl = encodeURIComponent(articleUrl);

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Generate citation if DOI is available
  const citation = articleDoi
    ? `${articleTitle}. https://doi.org/${articleDoi}`
    : `${articleTitle}. ${articleUrl}`;

  return (
    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Article</DialogTitle>
          <DialogDescription>
            Share this article with colleagues or on social media.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-4 gap-3 mt-2">
              <button
                className="share-icon-button"
                onClick={() => handleSocialShare("twitter")}
              >
                <Twitter className="h-6 w-6 text-blue-400" />
                <span className="text-xs mt-2">Twitter</span>
              </button>
              <button
                className="share-icon-button"
                onClick={() => handleSocialShare("facebook")}
              >
                <Facebook className="h-6 w-6 text-blue-600" />
                <span className="text-xs mt-2">Facebook</span>
              </button>
              <button
                className="share-icon-button"
                onClick={() => handleSocialShare("linkedin")}
              >
                <Linkedin className="h-6 w-6 text-blue-700" />
                <span className="text-xs mt-2">LinkedIn</span>
              </button>
              <button
                className="share-icon-button"
                onClick={() => {
                  setActiveTab("email");
                }}
              >
                <MessageSquare className="h-6 w-6 text-green-600" />
                <span className="text-xs mt-2">Message</span>
              </button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={`Shared article: ${articleTitle}`}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message</Label>
              <textarea
                id="email-body"
                rows={4}
                className="w-full mt-1 p-2 border rounded-md resize-none"
                defaultValue={`Check out this article: ${articleTitle}\n\n${articleUrl}`}
              ></textarea>
            </div>
            <Button
              className="w-full bg-utred"
              onClick={handleEmailShare}
            >
              <Mail className="h-4 w-4 mr-2" />
              Open in Email Client
            </Button>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="share-link">Article Link</Label>
              <div className="flex mt-1">
                <Input id="share-link" value={articleUrl} readOnly className="flex-1 rounded-r-none" />
                <Button
                  className="rounded-l-none bg-utred"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {articleDoi && (
              <div>
                <Label htmlFor="share-doi">DOI</Label>
                <div className="flex mt-1">
                  <Input
                    id="share-doi"
                    value={`https://doi.org/${articleDoi}`}
                    readOnly
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    className="rounded-l-none"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://doi.org/${articleDoi}`);
                      toast.success("DOI link copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="share-citation">Citation</Label>
              <div className="flex mt-1">
                <Input
                  id="share-citation"
                  value={citation}
                  readOnly
                  className="flex-1 rounded-r-none"
                />
                <Button
                  className="rounded-l-none"
                  onClick={() => {
                    navigator.clipboard.writeText(citation);
                    toast.success("Citation copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
