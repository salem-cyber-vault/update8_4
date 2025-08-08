"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, ArrowLeft, Sparkles, Heart, Shield } from "lucide-react"

interface OnboardingStep {
  title: string
  description: string
  target?: string
  content: React.ReactNode
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to Salem Cyber Vault! ✨",
    description: "Your stunning cyber forensics & digital investigation platform",
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">💎</div>
        <h3 className="text-xl font-semibold text-gradient-feminine">Welcome, Digital Detective!</h3>
        <p className="text-slate-300">
          Salem Cyber Vault combines powerful cybersecurity tools with an elegant, 
          intuitive interface designed for both beginners and professionals.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge className="glass-card-feminine bg-pink-500/20 text-pink-300 border-pink-300/30">
            <Heart className="w-3 h-3 mr-1" />
            Beginner Friendly
          </Badge>
          <Badge className="glass-card-feminine bg-purple-500/20 text-purple-300 border-purple-300/30">
            <Shield className="w-3 h-3 mr-1" />
            Pro Features
          </Badge>
          <Badge className="glass-card-feminine bg-blue-500/20 text-blue-300 border-blue-300/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Beautiful UI
          </Badge>
        </div>
      </div>
    )
  },
  {
    title: "Universal Intelligence Scanner",
    description: "Your gateway to cyber intelligence",
    target: "search",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300">
          Our intelligent search bar automatically detects what you're looking for:
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><code className="bg-pink-500/20 px-2 py-1 rounded text-pink-300">192.168.1.1</code> → IP Address lookup</li>
          <li><code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">example.com</code> → Domain analysis</li>
          <li><code className="bg-blue-500/20 px-2 py-1 rounded text-blue-300">user@email.com</code> → Email investigation</li>
          <li><code className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-300">abc123def456</code> → Hash lookup</li>
        </ul>
        <p className="text-slate-300 text-sm">
          Just type what you want to investigate and we'll handle the rest!
        </p>
      </div>
    )
  },
  {
    title: "Explain This! Helper System",
    description: "Hover over any technical term to learn more",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300">
          Look for the little <span className="text-pink-400">?</span> icons next to technical terms. 
          Hover over them to see:
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• <strong className="text-pink-300">Simple explanations</strong> in plain English</li>
          <li>• <strong className="text-purple-300">Technical details</strong> for professionals</li>
          <li>• <strong className="text-blue-300">Legal context</strong> for digital forensics</li>
          <li>• <strong className="text-indigo-300">Real examples</strong> and learn more links</li>
        </ul>
        <p className="text-slate-300 text-sm">
          Perfect for learning while investigating!
        </p>
      </div>
    )
  },
  {
    title: "Evidence Timeline & Case Notebook",
    description: "Build your digital forensics case documentation",
    target: "evidence",
    content: (
      <div className="space-y-3">
        <p className="text-slate-300">
          Professional case management tools designed for legal teams:
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• <strong className="text-pink-300">Timeline View</strong>: Chronological evidence tracking</li>
          <li>• <strong className="text-purple-300">Case Notes</strong>: Detailed analysis documentation</li>
          <li>• <strong className="text-blue-300">Bookmarks</strong>: Save important findings</li>
          <li>• <strong className="text-indigo-300">Export Evidence</strong>: Generate legal reports</li>
        </ul>
        <p className="text-slate-300 text-sm">
          Everything you need for professional digital forensics work!
        </p>
      </div>
    )
  },
  {
    title: "You're Ready to Investigate! 🚀",
    description: "Start exploring with confidence",
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gradient-feminine">Happy Investigating!</h3>
        <p className="text-slate-300">
          You now have access to professional-grade cyber forensics tools in a beautiful, 
          intuitive interface. Whether you're a beginner or expert, Salem Cyber Vault 
          adapts to your expertise level.
        </p>
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4 rounded-lg border border-pink-300/20">
          <p className="text-sm text-slate-300">
            <strong className="text-pink-300">Pro Tip:</strong> Start with the Universal Scanner to explore 
            any IP, domain, or indicator. Use the Evidence Timeline to document your findings 
            as you build your case!
          </p>
        </div>
      </div>
    )
  }
]

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem('salem-cyber-vault-onboarding-completed', 'true')
    onComplete()
  }

  const skipTour = () => {
    handleComplete()
  }

  if (!isVisible) {
    return null
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card-feminine border-pink-300/30 max-w-md w-full animate-gentle-glow">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="absolute right-0 top-0 text-slate-400 hover:text-pink-300"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg text-gradient-feminine">{step.title}</CardTitle>
            <Badge variant="outline" className="text-xs glass-card-feminine border-slate-400/30 text-slate-300">
              {currentStep + 1} of {onboardingSteps.length}
            </Badge>
          </div>
          <p className="text-sm text-slate-400">{step.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step.content}
          
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-slate-400 hover:text-pink-300 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-pink-400' 
                      : index < currentStep 
                        ? 'bg-pink-400/50' 
                        : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-400/90 hover:to-purple-400/90 backdrop-blur-md"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function useOnboardingTour() {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const hasCompleted = localStorage.getItem('salem-cyber-vault-onboarding-completed')
    if (!hasCompleted) {
      // Small delay to let the page load
      setTimeout(() => setShowTour(true), 1000)
    }
  }, [])

  const completeTour = () => {
    setShowTour(false)
  }

  const startTour = () => {
    localStorage.removeItem('salem-cyber-vault-onboarding-completed')
    setShowTour(true)
  }

  return { showTour, completeTour, startTour }
}