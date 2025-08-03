"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedProgressBarProps {
  value: number
  maxValue: number
  className?: string
  delay?: number
}

export function AnimatedProgressBar({ 
  value, 
  maxValue, 
  className = "bg-gradient-to-r from-emerald-500 to-teal-500", 
  delay = 0 
}: AnimatedProgressBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const percentage = (value / maxValue) * 100

  return (
    <div ref={ref} className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
      <motion.div 
        className={`h-3 rounded-full ${className}`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
        transition={{ 
          duration: 1.2, 
          delay,
          type: "spring",
          stiffness: 80,
          damping: 15
        }}
      />
    </div>
  )
}
