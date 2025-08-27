import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'

interface SubItem {
  title: string
  href: string
}

interface SidebarItem {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  subItems?: SubItem[]
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
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