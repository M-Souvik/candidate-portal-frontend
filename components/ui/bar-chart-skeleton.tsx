import { Skeleton } from "@/components/ui/skeleton";

const SkeletonBarChart = ({ bars = 6 }: { bars?: number }) => {
  return (
    <div className="w-full h-full flex items-end gap-3 px-6 pb-4">
      {[...Array(bars)].map((_, i) => {
        const height = Math.floor(Math.random() * 70) + 30; // random 30% - 100%
        return (
          <div key={i} className="flex flex-col justify-end items-center w-full">
            <Skeleton className="w-[70%] rounded-md" style={{ height: `${height}%` }} />
          </div>
        );
      })}
    </div>
  );
};

export default SkeletonBarChart;
