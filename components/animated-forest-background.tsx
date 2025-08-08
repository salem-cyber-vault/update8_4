"use client"

import { useEffect, useRef } from "react"

export function AnimatedForestBackground() {
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

    const drawTree = (x: number, y: number, scale: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // Tree trunk
      ctx.fillStyle = `rgba(45, 27, 105, ${0.6 * opacity})`
      ctx.fillRect(-2, -20, 4, 40)

      // Tree canopy - mystical triangular shape
      ctx.fillStyle = `rgba(74, 20, 140, ${0.8 * opacity})`
      ctx.beginPath()
      ctx.moveTo(0, -50)
      ctx.lineTo(-15, -10)
      ctx.lineTo(15, -10)
      ctx.closePath()
      ctx.fill()

      // Additional layers for depth
      ctx.fillStyle = `rgba(106, 27, 154, ${0.6 * opacity})`
      ctx.beginPath()
      ctx.moveTo(0, -40)
      ctx.lineTo(-20, 0)
      ctx.lineTo(20, 0)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    const drawFog = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `rgba(255, 182, 193, ${0.05 + Math.sin(time * 0.001) * 0.02})`)
      gradient.addColorStop(0.5, `rgba(221, 160, 221, ${0.08 + Math.cos(time * 0.0015) * 0.03})`)
      gradient.addColorStop(1, `rgba(173, 216, 230, ${0.06 + Math.sin(time * 0.0008) * 0.02})`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Floating fog particles
      for (let i = 0; i < 20; i++) {
        const x = (time * 0.1 + i * 50) % (canvas.width + 100) - 50
        const y = canvas.height * 0.6 + Math.sin(time * 0.001 + i) * 30
        const size = 40 + Math.sin(time * 0.002 + i) * 20
        const opacity = 0.1 + Math.sin(time * 0.001 + i * 0.5) * 0.05

        const fogGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
        fogGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        fogGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

        ctx.fillStyle = fogGradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawMysticalLights = () => {
      for (let i = 0; i < 8; i++) {
        const x = canvas.width * (0.1 + (i * 0.15)) + Math.sin(time * 0.001 + i) * 50
        const y = canvas.height * (0.3 + Math.sin(time * 0.0008 + i) * 0.2)
        const intensity = 0.3 + Math.sin(time * 0.002 + i * 0.7) * 0.2

        const lightGradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
        lightGradient.addColorStop(0, `rgba(221, 160, 221, ${intensity})`)
        lightGradient.addColorStop(0.5, `rgba(255, 182, 193, ${intensity * 0.6})`)
        lightGradient.addColorStop(1, `rgba(173, 216, 230, 0)`)

        ctx.fillStyle = lightGradient
        ctx.beginPath()
        ctx.arc(x, y, 30, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 16

      // Draw forest silhouette
      const treePositions = [
        { x: canvas.width * 0.1, scale: 0.8, depth: 0.3 },
        { x: canvas.width * 0.25, scale: 1.2, depth: 0.5 },
        { x: canvas.width * 0.4, scale: 0.9, depth: 0.4 },
        { x: canvas.width * 0.6, scale: 1.4, depth: 0.7 },
        { x: canvas.width * 0.75, scale: 1.0, depth: 0.4 },
        { x: canvas.width * 0.9, scale: 0.7, depth: 0.3 },
      ]

      // Draw trees from back to front
      treePositions
        .sort((a, b) => a.depth - b.depth)
        .forEach((tree) => {
          const sway = Math.sin(time * 0.001 + tree.x * 0.01) * 2
          drawTree(
            tree.x + sway,
            canvas.height - 50,
            tree.scale,
            0.2 + tree.depth * 0.3
          )
        })

      drawMysticalLights()
      drawFog()

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
      style={{ zIndex: 1 }}
    />
  )
}