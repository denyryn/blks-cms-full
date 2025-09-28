import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      </div>
    </div>
  );
}
