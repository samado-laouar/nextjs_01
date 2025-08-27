'use client'

import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from '../dashboard/components/Sidebar'
import Header from '../dashboard/components/Header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { sidebarItems } from '../dashboard/components/sidebarItems'


export default function ProductsPage() {
  // Example: Redirect if not authenticated
  // const user = await getAuth()
  // if (!user) redirect('/auth/login')

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Products</h2>
                <Link href="/admin/products/new">
                  <Button>Add New Product</Button>
                </Link>
              </div>
              <ul className="space-y-2">
                {['Laptop', 'T-Shirt', 'Novel'].map((product) => (
                  <li
                    key={product}
                    className="p-3 bg-gray-50 rounded-lg text-gray-700"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}