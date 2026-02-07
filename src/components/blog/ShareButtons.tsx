import { Linkedin, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt?: string;
}

const ShareButtons = ({ url, title, excerpt }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">Share this article</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          aria-label="Share on X"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.facebook)}
          className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
