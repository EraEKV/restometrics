"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedChartWrapperProps {
  children: ReactNode
  delay?: number
}

export function AnimatedChartWrapper({ children, delay = 0 }: AnimatedChartWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
