import { Star } from "lucide-react";

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <span className="h-px w-12 bg-primary/40" />
      <Star className="h-3.5 w-3.5 text-primary fill-primary" />
      <span className="h-px w-12 bg-primary/40" />
    </div>
  );
}