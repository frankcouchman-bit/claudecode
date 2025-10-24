"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2000, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      setDisplayValue(Math.floor(easeProgress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// Animated progress bar
interface AnimatedProgressProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
}

export function AnimatedProgress({ value, max, className = "", showLabel = true }: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 1000, bounce: 0 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    motionValue.set(percentage)
  }, [percentage, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span>{value} / {max}</span>
          <span>{displayValue}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_100%] rounded-full"
          initial={{ width: 0, backgroundPosition: "0% 50%" }}
          animate={{
            width: `${displayValue}%`,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            width: { duration: 1, ease: "easeOut" },
            backgroundPosition: { duration: 3, ease: "linear", repeat: Infinity }
          }}
        />
      </div>
    </div>
  )
}

// Animated badge with pulse
interface AnimatedBadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info"
  pulse?: boolean
}

export function AnimatedBadge({ children, variant = "info", pulse = false }: AnimatedBadgeProps) {
  const colors = {
    success: "from-green-500 to-emerald-500",
    warning: "from-yellow-500 to-orange-500",
    error: "from-red-500 to-pink-500",
    info: "from-blue-500 to-cyan-500"
  }

  return (
    <motion.div
      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${colors[variant]}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {pulse && (
        <motion.div
          className="w-2 h-2 rounded-full bg-white mr-2"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {children}
    </motion.div>
  )
}
