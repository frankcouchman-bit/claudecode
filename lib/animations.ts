// Premium animation variants for framer-motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
}

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
}

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
}

export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 8,
    ease: 'linear',
    repeat: Infinity,
  }
}

export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    ease: 'easeInOut',
    repeat: Infinity,
  }
}

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    ease: 'easeInOut',
    repeat: Infinity,
  }
}

export const rotateAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 20,
    ease: 'linear',
    repeat: Infinity,
  }
}

// Scroll reveal animation
export const scrollReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }
})

// Number counter animation hook
export function useCountAnimation(end: number, duration = 2000, start = 0) {
  const [count, setCount] = React.useState(start)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start])

  return count
}

// For React import
import * as React from 'react'
