'use client'

import { redirect, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from '../../dashboard/components/Sidebar'
import Header from '../../dashboard/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormEvent, useEffect, useState } from 'react'
import { sidebarItems } from '../../dashboard/components/sidebarItems'
import supabase from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AddNewCategoryPage() {
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) redirect('/auth/login')
    }
    checkAuth()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate input
    if (!name.trim()) {
      setError('Category name is required')
      toast.error('Category name is required')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: name.trim() }])
        .select()

      if (error) {
        console.error('Error adding category:', error.message)
        setError('Failed to add category: ' + error.message)
        toast.error('Failed to add category')
        return
      }

      toast.success('Category added successfully')
      router.push('/admin/categories')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Unexpected error occurred')
      toast.error('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
              {error && <div className="mb-4 text-red-500">{error}</div>}
              {loading ? (
                <div>Loading...</div>
              ) : (
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      Save Category
                    </Button>
                    <Link href="/admin/categories">
                      <Button type="button" variant="outline" disabled={loading}>
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}