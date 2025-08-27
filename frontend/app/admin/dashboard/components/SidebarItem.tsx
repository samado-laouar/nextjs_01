'use client'

import { useState } from 'react'
import { ChevronDown, FolderTree, LayoutDashboard, Package, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubItem {
  title: string
  href: string
}

interface SidebarItemProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  subItems?: SubItem[]
  isSidebarOpen: boolean
}

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    subItems: [
      { title: 'All Products', href: '/admin/products' },
      { title: 'Add New Product', href: '/admin/products/new' },
    ],
  },
  {
    title: 'Categories',
    icon: FolderTree,
    subItems: [
      { title: 'All Categories', href: '/admin/categories' },
      { title: 'Add New Category', href: '/admin/categories/new' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]


export default function SidebarItem({
  title,
  icon: Icon,
  href,
  subItems,
  isSidebarOpen,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    if (subItems && isSidebarOpen) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <li>
      {subItems ? (
        <>
          <button
            onClick={toggleDropdown}
            className={cn(
              'flex items-center w-full space-x-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors',
              !isSidebarOpen && 'justify-center'
            )}
          >
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            {isSidebarOpen && (
              <>
                <span className="font-medium flex-1 text-left">{title}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>
          {isSidebarOpen && isOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              {subItems.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    href={subItem.href}
                    className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    {subItem.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <a
          href={href}
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors',
            !isSidebarOpen && 'justify-center'
          )}
        >
          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
          {isSidebarOpen && <span className="font-medium">{title}</span>}
        </a>
      )}
    </li>
  )
}