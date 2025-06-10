import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsSettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
