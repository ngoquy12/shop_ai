import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: {
    default: "Tài khoản | VideoPrompt",
    template: "%s | VideoPrompt",
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Shared top-left logo */}
      <header className="absolute top-0 left-0 z-10 p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            VideoPrompt
          </span>
        </Link>
      </header>

      {/* Page content */}
      <div className="flex-1 flex">{children}</div>
    </div>
  )
}
