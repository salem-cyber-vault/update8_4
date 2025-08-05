"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, BookOpen, Shield, Eye, Search, AlertTriangle, ChevronRight, Lightbulb, Target } from "lucide-react"

interface GuideStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tips: string[]
  example?: string
}

export function BeginnerGuide() {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const guideSteps: GuideStep[] = [
    {
      id: "what-is-this",
      title: "What is Cyber Watch Vault? 🎃",
      description:
        "Think of this as a magical crystal ball that lets you peek into the digital world safely. We show you what devices and computers are connected to the internet worldwide.",
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      tips: [
        "This tool helps you understand cybersecurity without being an expert",
        "All data is gathered safely and legally from public sources",
        "You're exploring the 'surface' of the internet, not doing anything harmful",
      ],
    },
    {
      id: "understanding-threats",
      title: "Understanding Cyber Threats 👻",
      description:
        "Cyber threats are like digital monsters lurking in the shadows. They include viruses, hackers, and malicious software trying to cause harm.",
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      tips: [
        "Red indicators = High danger (like a fire alarm)",
        "Yellow indicators = Medium concern (like a caution sign)",
        "Green indicators = Low risk (like a green traffic light)",
        "The map shows where most cyber attacks come from",
      ],
    },
    {
      id: "exploring-data",
      title: "How to Explore Safely 🔮",
      description:
        "You can search for different types of devices and services. It's like using a telescope to observe distant stars - you can see them, but you're not touching them.",
      icon: <Search className="w-5 h-5 text-purple-400" />,
      tips: [
        "Try searching for 'webcam' to see internet cameras",
        "Search 'port:80' to find web servers",
        "Look for 'country:US' to see devices in specific countries",
        "Click on results to learn more about what you found",
      ],
      example: "Try: webcam country:US",
    },
    {
      id: "staying-safe",
      title: "Digital Safety Tips 🛡️",
      description:
        "Learning about cybersecurity helps you protect yourself online. Knowledge is your best defense against digital threats.",
      icon: <Shield className="w-5 h-5 text-green-400" />,
      tips: [
        "Never try to access devices you find here",
        "Use this knowledge to secure your own devices better",
        "Update your passwords and software regularly",
        "Be curious, but always stay ethical and legal",
      ],
    },
  ]

  const quickActions = [
    {
      title: "Explore Webcams 📹",
      description: "See internet-connected cameras worldwide",
      search: "webcam",
      difficulty: "Beginner",
    },
    {
      title: "Find Web Servers 🌐",
      description: "Discover websites and web services",
      search: "port:80,443",
      difficulty: "Beginner",
    },
    {
      title: "IoT Devices 📱",
      description: "Smart home devices and sensors",
      search: "iot device",
      difficulty: "Intermediate",
    },
    {
      title: "Database Servers 🗄️",
      description: "Systems storing information",
      search: "mysql mongodb",
      difficulty: "Advanced",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Help Toggle */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowGuide(!showGuide)}
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          {showGuide ? "Hide" : "Show"} Beginner Guide
        </Button>

        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
          <Lightbulb className="w-3 h-3 mr-1" />
          New to Cybersecurity?
        </Badge>
      </div>

      {showGuide && (
        <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Welcome to the Digital Realm! 🧙‍♂️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guide Steps */}
            <div className="grid gap-4">
              {guideSteps.map((step) => (
                <Card
                  key={step.id}
                  className={`bg-slate-800/30 border-slate-600 cursor-pointer transition-all hover:bg-slate-800/50 ${
                    activeStep === step.id ? "ring-2 ring-cyan-500/50" : ""
                  }`}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {step.icon}
                        <h3 className="font-semibold text-white">{step.title}</h3>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          activeStep === step.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {activeStep === step.id && (
                      <div className="mt-4 space-y-3">
                        <p className="text-slate-300">{step.description}</p>

                        {step.example && (
                          <div className="p-3 bg-slate-700/50 rounded-lg">
                            <div className="text-sm text-slate-400 mb-1">Try this search:</div>
                            <code className="text-cyan-400 font-mono">{step.example}</code>
                          </div>
                        )}

                        <div className="space-y-2">
                          {step.tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Quick Explorations 🚀
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800/30 border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{action.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            action.difficulty === "Beginner"
                              ? "border-green-400 text-green-400"
                              : action.difficulty === "Intermediate"
                                ? "border-yellow-400 text-yellow-400"
                                : "border-red-400 text-red-400"
                          }`}
                        >
                          {action.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{action.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                        onClick={() => {
                          // This would trigger a search
                          console.log("Search:", action.search)
                        }}
                      >
                        Explore Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Safety Reminder */}
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-400 mb-1">Remember: Stay Ethical! 🧙‍♀️</h4>
                    <p className="text-sm text-green-300">
                      You're here to learn and explore safely. Never attempt to access or interfere with devices you
                      discover. Think of yourself as a digital explorer, not a digital intruder.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
