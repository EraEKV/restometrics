"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface HoverAnimationWrapperProps {
  children: ReactNode
  hoverScale?: number
  hoverY?: number
  className?: string
}

export function HoverAnimationWrapper({ 
  children, 
  hoverScale = 1.02, 
  hoverY = -5,
  className = ""
}: HoverAnimationWrapperProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        y: hoverY,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
