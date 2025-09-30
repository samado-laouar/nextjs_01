'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from '../../../dashboard/components/Sidebar'
import Header from '../../../dashboard/components/Header'
import { useEffect, useState } from 'react'
import { sidebarItems } from '../../../dashboard/components/sidebarItems'
import supabase from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { Category, ProductFormData, Product } from '@/types'
import { ProductForm } from '../../components/productform'

export default function EditProductPage() {
  const { id } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [initialData, setInitialData] = useState<ProductFormData | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error('Authentication error:', error?.message || 'No user found')
        setError('You must be logged in to add a product')
        router.push('auth/login')
      }
    }
    checkUser()
  }, [router])  

  // Fetch categories and product data
  useEffect(() => {
    async function fetchData() {
      try {
        // Validate id
        if (!id || typeof id !== 'string') {
          setError('Invalid product ID')
          toast.error('Invalid product ID')
          setLoading(false)
          return
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true })

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError.message)
          setError('Failed to load categories')
          toast.error('Failed to load categories')
          return
        }

        console.log('Fetched categories:', categoriesData)
        setCategories(categoriesData || [])

        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id, name, description, price, category_id, slug')
          .eq('id', id)
          .single()

        if (productError) {
          console.error('Error fetching product:', productError.message)
          setError('Failed to load product: ' + productError.message)
          toast.error('Failed to load product')
          return
        }

        if (productData) {
          const formattedData: ProductFormData = {
            name: productData.name,
            description: productData.description || '',
            price: productData.price.toString(),
            category_id: productData.category_id,
          }
          console.log('Formatted product data:', formattedData)
          setInitialData(formattedData)
        } else {
          setError('Product not found')
          toast.error('Product not found')
        }
      } catch (err) {
        console.log('Unexpected error:', err)
        setError('Unexpected error occurred')
        toast.error('Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Handle form submission
  const handleSubmit = async (data: ProductFormData & { slug: string }) => {
    console.log('Submitting update with data:', data)
    const priceValue = parseFloat(data.price)
    const { error } = await supabase
      .from('products')
      .update({ ...data, price: priceValue })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating product:', error.message)
      setError('Failed to update product: ' + error.message)
      toast.error('Failed to update product')
      return
    }

    toast.success('Product updated successfully')
    router.push('/admin/products')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <ProductForm
              categories={categories}
              initialData={initialData}
              onSubmit={handleSubmit}
              isEditMode
              loading={loading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  )
}