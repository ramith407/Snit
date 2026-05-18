export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="dev-card min-h-[220px] p-6">
            <div className="skeleton h-5 w-36" />
            <div className="skeleton mt-8 h-14 w-44" />
            <div className="skeleton mt-5 h-5 w-28" />
          </div>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-3">
          <div className="skeleton h-8 w-48" />
          {[0, 1, 2].map((item) => (
            <div key={item} className="skeleton h-20 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-44 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
