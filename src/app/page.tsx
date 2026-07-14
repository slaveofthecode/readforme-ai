"use client"

import { useState } from "react"
import { Menu, BookOpen } from "lucide-react"
import { FileUpload } from "@/features/upload/components/file-upload"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
          transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              ReadForMe AI
            </span>
          </div>

          {/* Upload section */}
          <div className="px-4 py-4 border-b border-border">
            <FileUpload />
          </div>

          {/* Navigation placeholder */}
          <nav className="flex-1 px-4 py-4">
            <p className="text-sm text-muted-foreground">
              Navigation coming soon
            </p>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">v0.1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-border md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-accent text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-foreground">ReadForMe AI</span>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to ReadForMe AI
              </h2>
              <p className="text-muted-foreground max-w-md">
                Upload PDF documents and chat with their content using
                AI-powered RAG.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
