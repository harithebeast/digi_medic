"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }])
      // Here you would typically send the message to your AI backend
      // and get a response. For now, we'll just simulate a response.
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "I'm an AI assistant. How can I help you today?", isUser: false }])
      }, 1000)
      setInput("")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>AI Health Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-96 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"} rounded-lg p-3`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow dark:bg-gray-800 dark:text-white"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}

