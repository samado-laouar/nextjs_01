'use client'

import { redirect, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Settings } from 'lucide-react'
import Sidebar from '../../dashboard/components/Sidebar'
import Header from '../../dashboard/components/Header'
import { useEffect, useState } from 'react'
import { sidebarItems } from '../../dashboard/components/sidebarItems'
import supabase from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { Category, ProductFormData } from '@/types'
import { ProductForm } from '../components/productform'

export default function AddNewProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication
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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true })

        if (error) {
          console.error('Error fetching categories:', error.message)
          setError('Failed to load categories')
          return
        }

        setCategories(data || [])
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Handle form submission
  const handleSubmit = async (data: ProductFormData & { slug: string, files?: File[] }) => {
    try {
      console.log('Submitting data to Supabase:', data)
      
      // Upload images to Supabase Storage
      let imagePaths: string[] = []
      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          const fileName = `${Date.now()}_${file.name}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Error uploading image:', uploadError.message)
            setError('Failed to upload image: ' + uploadError.message)
            toast.error('Failed to upload image: ' + uploadError.message)
            return
          }

          const { data: urlData } = supabase.storage
            .from('product_images')
            .getPublicUrl(fileName)

          if (urlData?.publicUrl) {
            imagePaths.push(urlData.publicUrl)
          } else {
            console.error('Failed to get public URL for image:', fileName)
            setError('Failed to get image URL')
            toast.error('Failed to get image URL')
            return
          }
        }
      }

      // Prepare the data for database insertion
      const insertData: any = {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        sold_price: data.sold_price ? parseFloat(data.sold_price) : null,
        images: imagePaths.length > 0 ? imagePaths : null,
        total_quantity: data.total_quantity ? parseInt(data.total_quantity) : 0,
        total_orders: 0,
        slug: data.slug,
        meta: data.meta ? JSON.parse(data.meta) : null,
        meta_description: data.meta_description || null,
        category_id: data.category_id,
      }

      const { data: result, error } = await supabase
        .from('products')
        .insert([insertData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        if (error.code === '42501') {
          setError('Permission denied: You do not have access to add products')
          toast.error('Permission denied: You do not have access to add products')
        } else {
          setError('Failed to add product: ' + error.message)
          toast.error('Failed to add product: ' + error.message)
        }
        return
      }

      console.log('Product added successfully:', result)
      toast.success('Product added successfully')
      router.push('/admin/products')
      
    } catch (err) {
      console.error('Unexpected error during submission:', err)
      setError('Unexpected error occurred')
      toast.error('Unexpected error occurred')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-5">
          <div className="max-w-7xl mx-auto">            
            <ProductForm
              categories={categories}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  )
}