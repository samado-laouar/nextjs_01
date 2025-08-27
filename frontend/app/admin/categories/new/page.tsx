'use client'

import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from '../../dashboard/components/Sidebar'
import Header from '../../dashboard/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormEvent } from 'react'
import { sidebarItems } from '../../dashboard/components/sidebarItems'

export default function AddNewCategoryPage() {
  // Example: Redirect if not authenticated
  // const user = await getAuth()
  // if (!user) redirect('/auth/login')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name')
    const description = formData.get('description')
    console.log('New Category:', { name, description })
    // Replace with API call to save category
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter category name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter category description"
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button type="submit">Save Category</Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}