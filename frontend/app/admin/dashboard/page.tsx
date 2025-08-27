'use client'

import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MainContent from './components/MainContent'
import { sidebarItems } from '../dashboard/components/sidebarItems'

export default function Page() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainContent />
      </div>
    </div>
  )
}