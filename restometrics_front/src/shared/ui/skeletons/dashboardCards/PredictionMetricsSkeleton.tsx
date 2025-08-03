import { motion } from "framer-motion"
import { Skeleton } from "@/shared/ui/skeleton"

export function PredictionMetricsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </motion.div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </motion.div>
  )
}