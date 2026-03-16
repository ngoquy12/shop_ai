"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface SidebarContextType {
  collapsed: boolean
  toggleCollapse: () => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarCtx = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapse: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Lock body scroll when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <SidebarCtx.Provider value={{ collapsed, toggleCollapse: () => setCollapsed(c => !c), mobileOpen, setMobileOpen }}>
      {children}
    </SidebarCtx.Provider>
  )
}

export const useSidebar = () => useContext(SidebarCtx)
