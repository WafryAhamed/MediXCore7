
function Pulse({ className }: {className?: string;}) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-lg ${className || ''}`} />);

}
export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Pulse className="w-10 h-10 rounded-lg" />
        <Pulse className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Pulse className="w-20 h-7" />
        <Pulse className="w-28 h-4" />
      </div>
    </div>);

}
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border">
      <Pulse className="w-8 h-8 rounded-lg flex-shrink-0" />
      <Pulse className="w-24 h-4 flex-shrink-0" />
      <Pulse className="w-32 h-4 flex-1" />
      <Pulse className="w-24 h-4 flex-shrink-0 hidden sm:block" />
      <Pulse className="w-20 h-6 rounded-full flex-shrink-0" />
    </div>);

}
export function RecordCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Pulse className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="w-3/4 h-4" />
          <Pulse className="w-1/2 h-3" />
        </div>
      </div>
      <Pulse className="w-full h-4" />
      <div className="flex gap-2">
        <Pulse className="w-20 h-6 rounded-full" />
        <Pulse className="w-24 h-6 rounded-full" />
      </div>
    </div>);

}
export function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) =>
      <div key={i} className="flex gap-3">
          <Pulse className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Pulse className="w-3/4 h-4" />
            <Pulse className="w-1/3 h-3" />
          </div>
        </div>
      )}
    </div>);

}
export function AccessCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-4">
        <Pulse className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="w-40 h-4" />
          <Pulse className="w-28 h-3" />
        </div>
        <Pulse className="w-24 h-8 rounded-lg" />
      </div>
    </div>);

}
