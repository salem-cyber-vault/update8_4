"use client"

import { useEffect, useState } from "react"

interface Eye {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  blinkTimer: number
  isBlinking: boolean
}

export function FloatingEyes() {
  const [eyes, setEyes] = useState<Eye[]>([])

  useEffect(() => {
    // Create initial eyes
    const initialEyes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - 100,
      size: Math.random() * 15 + 20,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.2,
      blinkTimer: Math.random() * 5000 + 2000,
      isBlinking: false,
    }))
    setEyes(initialEyes)

    // Animation loop
    const animate = () => {
      setEyes((prevEyes) =>
        prevEyes.map((eye) => {
          let newY = eye.y + eye.speed
          let newX = eye.x + Math.sin(Date.now() * 0.001 + eye.id) * 0.2
          let newBlinkTimer = eye.blinkTimer - 16
          let newIsBlinking = eye.isBlinking

          // Reset eye when it goes off screen
          if (newY > window.innerHeight + 50) {
            newY = -50
            newX = Math.random() * window.innerWidth
          }

          // Handle blinking
          if (newBlinkTimer <= 0) {
            newIsBlinking = !newIsBlinking
            newBlinkTimer = newIsBlinking ? 150 : Math.random() * 5000 + 2000
          }

          return {
            ...eye,
            y: newY,
            x: newX,
            blinkTimer: newBlinkTimer,
            isBlinking: newIsBlinking,
          }
        }),
      )
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {eyes.map((eye) => (
        <div
          key={eye.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: eye.x,
            top: eye.y,
            width: eye.size,
            height: eye.size,
            opacity: eye.opacity,
          }}
        >
          <div className="relative w-full h-full">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-md animate-pulse opacity-30"></div>

            {/* Eye container */}
            <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              {/* Pupil */}
              <div
                className={`bg-slate-900 rounded-full transition-all duration-150 ${
                  eye.isBlinking ? "w-full h-1" : "w-1/3 h-1/3"
                }`}
              >
                {/* Highlight */}
                {!eye.isBlinking && <div className="w-1/3 h-1/3 bg-white rounded-full opacity-60 ml-1 mt-1"></div>}
              </div>
            </div>

            {/* Twinkling effect */}
            <div
              className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"
              style={{ animationDelay: `${eye.id * 0.5}s`, animationDuration: "3s" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
