"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

interface CountUpNumberProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUpNumber({ 
  value, 
  duration = 2, 
  delay = 0,
  className = "",
  suffix = "",
  prefix = "",
  decimals = 0
}: CountUpNumberProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { 
    duration: duration * 1000,
    bounce: 0.1
  })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)
    }
  }, [isInView, value, delay, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ;(ref.current as HTMLElement).textContent = `${prefix}${formatted}${suffix}`
      }
    })
  }, [springValue, decimals, prefix, suffix])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}0{suffix}
    </motion.span>
  )
}
