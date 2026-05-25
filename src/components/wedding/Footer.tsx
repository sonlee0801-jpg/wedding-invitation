import { Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다");
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "손정원 ❤️ 이다빈 결혼합니다", url: window.location.href }); }
      catch {}
    } else {
      copyLink();
    }
  };
  return (
    <footer className="px-6 py-10 text-center">
      <div className="flex justify-center gap-3">
        <Button onClick={share} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
          <Share2 className="mr-1 h-4 w-4" /> 카카오톡 공유
        </Button>
        <Button onClick={copyLink} variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 rounded-full">
          <Link2 className="mr-1 h-4 w-4" /> 링크 복사
        </Button>
      </div>
      <p className="mt-8 font-serif-ko text-xs text-foreground/50">
        with love · 손정원 & 이다빈
      </p>
    </footer>
  );
}