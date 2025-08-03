"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  const elements = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-teal-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
