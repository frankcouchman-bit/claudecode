/**
 * Premium Visual Effects Library
 * Inspired by Jasper.ai, Writesonic, and CustomGPT.ai (2025)
 *
 * Features:
 * - Dynamic micro-animations
 * - 3D-inspired depth effects
 * - Interactive hover states
 * - Smooth transitions
 * - Engaging visual feedback
 */

import { Variants } from "framer-motion"

// ===== BASIC FADE IN UP =====

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
}

// ===== PREMIUM BUTTON EFFECTS =====

export const premiumButtonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.25)",
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 24px 0 rgba(124, 58, 237, 0.4)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  tap: {
    scale: 0.95,
    boxShadow: "0 2px 8px 0 rgba(124, 58, 237, 0.3)",
  }
}

// ===== CARD DEPTH EFFECTS =====

export const cardDepthVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.15), 0 10px 10px -5px rgba(124, 58, 237, 0.1)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== PULSATING BADGE =====

export const pulsatingBadge: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ===== SHIMMER EFFECT =====

export const shimmerAnimation = {
  initial: {
    backgroundPosition: "-1000px 0"
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// ===== 3D TILT EFFECT =====

export const tilt3D: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: (custom?: { rotateX?: number; rotateY?: number }) => ({
    rotateX: custom?.rotateX || 5,
    rotateY: custom?.rotateY || 5,
    z: 50,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  })
}

// ===== SMOOTH SCALE AND FADE =====

export const scaleAndFade: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== FLOATING ANIMATION =====

export const floatingAnimation: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ===== GRADIENT SHIFT =====

export const gradientShift = {
  initial: {
    backgroundPosition: "0% 50%",
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// ===== STAGGER CHILDREN =====

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== REVEAL ANIMATION =====

export const revealAnimation: Variants = {
  initial: {
    clipPath: "inset(0 100% 0 0)",
  },
  animate: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== SLIDE FROM SIDES =====

export const slideFromLeft: Variants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

export const slideFromRight: Variants = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== PREMIUM LOADING SPINNER =====

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// ===== BOUNCE EFFECT =====

export const bounceEffect: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}

// ===== MAGNETIC BUTTON EFFECT =====
// Use this with mouse position tracking for premium effect
export const magneticButton = {
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
}

// ===== UTILITY CLASSES FOR CSS =====

export const premiumGradients = {
  primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
  secondary: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
  success: "bg-gradient-to-r from-green-400 to-emerald-600",
  warning: "bg-gradient-to-r from-yellow-400 to-orange-500",
  danger: "bg-gradient-to-r from-red-500 to-pink-600",
  shimmer: "bg-gradient-to-r from-transparent via-white/20 to-transparent",
  mesh: "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50",
}

export const glassmorphism = {
  light: "backdrop-blur-lg bg-white/80 border border-white/20 shadow-xl",
  dark: "backdrop-blur-lg bg-gray-900/80 border border-gray-700/20 shadow-2xl",
  colorful: "backdrop-blur-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-200/20 shadow-xl",
}

export const neuomorphism = {
  light: "shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] bg-gray-50",
  dark: "shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#1a1a1a] bg-gray-900",
}

// ===== PREMIUM TEXT EFFECTS =====

export const textGradientClasses = {
  primary: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
  rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent",
  gold: "bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent",
  ocean: "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent",
}

// ===== LOADING BAR ANIMATION =====

export const loadingBarVariants: Variants = {
  initial: {
    scaleX: 0,
    transformOrigin: "left",
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: 2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== PAGE TRANSITION =====

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// ===== COUNTER ANIMATION =====

export function animateCounter(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 2000
) {
  const startTime = Date.now()
  const endTime = startTime + duration

  function update() {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)

    // easeOutExpo easing
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

    const currentValue = Math.floor(start + (end - start) * easeProgress)
    element.textContent = currentValue.toLocaleString()

    if (now < endTime) {
      requestAnimationFrame(update)
    } else {
      element.textContent = end.toLocaleString()
    }
  }

  requestAnimationFrame(update)
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====

export const scrollReveal: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

export const scrollScale: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  whileInView: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
