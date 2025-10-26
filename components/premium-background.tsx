"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { floatingAnimation } from "@/lib/premium-effects"

/**
 * Premium Animated Background Component
 * Features:
 * - Gradient mesh with animation
 * - Floating orbs with glow effects
 * - Grid overlay with opacity
 * - Particle connections
 */

// Floating gradient orbs with enhanced glow
export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large purple orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
        }}
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
      />

      {/* Pink orb */}
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
          top: "60%",
          right: "15%",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Blue orb */}
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
          bottom: "15%",
          left: "50%",
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Small accent orbs */}
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-20 blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
          top: "30%",
          right: "40%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Animated gradient mesh background
export function GradientMesh() {
  return (
    <motion.div
      className="absolute inset-0 opacity-60"
      style={{
        background: `
          radial-gradient(at 0% 0%, rgba(147, 51, 234, 0.2) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.2) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(251, 191, 36, 0.2) 0px, transparent 50%)
        `,
        backgroundSize: "200% 200%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

// Grid pattern overlay
export function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  )
}

// Enhanced particle system with connections
export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`
        ctx.fill()
      }
    }

    // Create particles
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80)
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.update()
        particle.draw()

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 * (1 - distance / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// Main premium background component
export function PremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <GradientMesh />
      <FloatingOrbs />
      <GridPattern />
      <ParticleSystem />
    </div>
  )
}
