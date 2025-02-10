"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import Header from "./Header";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello! How can I assist you today?",
        isUser: false,
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    const botMessage = { id: Date.now() + 1, text: "", isUser: false };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/health/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (error) {
      console.error("AI Service Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, text: "AI service error", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Header />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xl rounded-lg px-4 py-3 ${
                  message.isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
         
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <Button variant="ghost" size="icon" className="absolute left-4">
              <Plus className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter symptoms..."
              className="w-full pl-12 pr-20 py-3 bg-gray-800 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={sendMessage} disabled={loading}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Doctoral can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
