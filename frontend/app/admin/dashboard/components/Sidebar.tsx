'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import SidebarItem from './SidebarItem'

interface SubItem {
  title: string
  href: string
}

interface SidebarItemProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  subItems?: SubItem[]
}

interface SidebarProps {
  items: SidebarItemProps[]
}

export default function Sidebar({ items }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div
      className={cn(
        'bg-white shadow-lg transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {sidebarOpen && (
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {items.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              href={item.href}
              subItems={item.subItems}
              isSidebarOpen={sidebarOpen}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}