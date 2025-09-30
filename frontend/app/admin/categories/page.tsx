'use client'

import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings, Trash2 } from 'lucide-react'
import Sidebar from '../dashboard/components/Sidebar'
import Header from '../dashboard/components/Header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { sidebarItems } from '../dashboard/components/sidebarItems'
import { Category } from '@/types'
import supabase from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { DataTable } from '../components/DataTable'
import { ConfirmationModal } from '../components/ConfirmationModal'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) redirect('/auth/login')
    }
    checkAuth()
  }, [])

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, created_at')
          .order('name', { ascending: true })

        if (error) {
          console.error('Error fetching categories:', error.message)
          setError('Failed to load categories')
          toast.error('Failed to load categories')
          return
        }

        setCategories(data || [])
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Unexpected error occurred')
        toast.error('Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id)

      if (error) {
        console.error('Error deleting category:', error.message)
        if (error.code === '23503') { // Foreign key violation
          toast.error('Cannot delete category because it is referenced by products')
        } else {
          toast.error('Failed to delete category')
        }
        return
      }

      setCategories(categories.filter((c) => c.id !== selectedCategory.id))
      toast.success('Category deleted successfully')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Unexpected error occurred')
    } finally {
      setIsModalOpen(false)
      setSelectedCategory(null)
    }
  }

  // Open modal for delete confirmation
  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  // Define columns for categories
  const categoryColumns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Created At',
      accessor: 'created_at',
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  // Define actions for categories with icon
  const categoryActions = [
    {
      label: <Trash2 className="h-4 w-4" />,
      onClick: openDeleteModal,
      variant: 'destructive' as const,
      ariaLabel: 'Delete category',
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>
                <Link href="/admin/categories/new">
                  <Button>Add New Category</Button>
                </Link>
              </div>
              <DataTable
                data={categories}
                columns={categoryColumns}
                loading={loading}
                error={error}
                emptyMessage="No categories found."
                actions={categoryActions}
              />
            </div>
          </div>
        </main>
      </div>
      {selectedCategory && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteCategory}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the category "${selectedCategory.name}"?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </div>
  )
}