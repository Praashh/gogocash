import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const SkeletonCard = () => (
  <Card className="bg-background/10 backdrop-blur border-white/10 overflow-hidden">
    <div className="relative aspect-[4/3] bg-white/5">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
    <CardHeader className="p-4 pb-2">
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent className="p-4 pt-0 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-16" />
      </div>
    </CardContent>
  </Card>
);