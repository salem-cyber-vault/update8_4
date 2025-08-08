"use client"

import { useEffect, useRef } from "react"

export function FloatingLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const lights = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      color: ['#FFB6C1', '#DDA0DD', '#ADD8E6', '#E6E6FA'][Math.floor(Math.random() * 4)]
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      lights.forEach((light, i) => {
        // Update position
        light.x += Math.sin(time * light.speed + light.phase) * 0.5
        light.y += Math.cos(time * light.speed + light.phase * 0.7) * 0.3

        // Wrap around screen
        if (light.x < -50) light.x = canvas.width + 50
        if (light.x > canvas.width + 50) light.x = -50
        if (light.y < -50) light.y = canvas.height + 50
        if (light.y > canvas.height + 50) light.y = -50

        // Pulsing effect
        const pulseIntensity = 0.3 + Math.sin(time * 2 + i * 0.5) * 0.2

        // Draw light
        const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.size * 8)
        gradient.addColorStop(0, `${light.color}${Math.floor(pulseIntensity * 0.8 * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.3, `${light.color}${Math.floor(pulseIntensity * 0.4 * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${light.color}00`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(light.x, light.y, light.size * 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw central bright point
        ctx.fillStyle = `${light.color}${Math.floor(pulseIntensity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  )
}