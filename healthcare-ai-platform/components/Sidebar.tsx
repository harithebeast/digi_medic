"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, LogOut, Layout, Clock } from "lucide-react"

export default function Sidebar() {
  const [chats] = useState([
    { id: 1, title: "User registration and profile UI" },
    { id: 2, title: "Register Component Enhancement" },
    { id: 3, title: "Loss 0.7 in Fine-Tuning" },
    { id: 4, title: "React Auth Flow Fixes" },
    { id: 5, title: "Registration Form Setup" },
  ])

  return (
    <div className="w-80 h-screen flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start gap-2 text-gray-300 border-gray-700">
          <PlusCircle className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-2 p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Today</h2>
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              <Layout className="h-4 w-4" />
              {chat.title}
            </Link>
          ))}
        </div>

        <div className="space-y-2 p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Yesterday</h2>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <Clock className="h-4 w-4" />
            Install OpenJDK 8 Fix
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex flex-col gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </div>
    </div>
  )
}

