'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormEvent, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Category, ProductFormData } from '@/types'

interface ProductFormProps {
  categories: Category[]
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData & { slug: string, files?: File[] }) => Promise<void>
  isEditMode?: boolean
  loading?: boolean
  error?: string | null
}

export function ProductForm({
  categories,
  initialData,
  onSubmit,
  isEditMode = false,
  loading = false,
  error = null,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      description: '',
      price: '',
      sold_price: '',
      images: '',
      total_quantity: '',
      meta: '',
      meta_description: '',
      category_id: '',
    }
  )
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    console.log('ProductForm received initialData:', initialData)
  }, [initialData])

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        sold_price: initialData.sold_price || '',
        images: initialData.images ? JSON.stringify(initialData.images) : '',
        total_quantity: initialData.total_quantity || '',
        meta: initialData.meta ? JSON.stringify(initialData.meta) : '',
        meta_description: initialData.meta_description || '',
        category_id: initialData.category_id || '',
      })
    }
  }, [initialData])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setSelectedFiles(fileArray)
      const fileNames = fileArray.map(file => file.name)
      setFormData((prev) => ({ ...prev, images: JSON.stringify(fileNames) }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('Submitting form with data:', formData, 'and files:', selectedFiles)
    const { name, price, sold_price, total_quantity, meta, category_id } = formData
    const slug = name.toLowerCase().replace(/\s+/g, '-') // Simple slug generation

    // Validate required fields
    if (!name || !price || !category_id) {
      toast.error('Please fill in all required fields (name, price, category)')
      return
    }

    const priceValue = parseFloat(price)
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Price must be a valid positive number')
      return
    }

    let soldPriceValue: number | null = null
    if (sold_price) {
      soldPriceValue = parseFloat(sold_price)
      if (isNaN(soldPriceValue) || soldPriceValue < 0) {
        toast.error('Sold price must be a valid non-negative number')
        return
      }
    }

    let totalQuantityValue: number | null = null
    if (total_quantity) {
      totalQuantityValue = parseInt(total_quantity)
      if (isNaN(totalQuantityValue) || totalQuantityValue < 0) {
        toast.error('Total quantity must be a valid non-negative integer')
        return
      }
    }

    let metaValue: any = null
    if (meta) {
      try {
        metaValue = JSON.parse(meta)
      } catch (err) {
        toast.error('Meta must be valid JSON')
        return
      }
    }

    try {
      await onSubmit({
        ...formData,
        price: priceValue.toString(),
        sold_price: soldPriceValue ? soldPriceValue.toString() : '',
        images: selectedFiles.length > 0 ? selectedFiles.map(file => file.name) : null,
        total_quantity: totalQuantityValue ? totalQuantityValue.toString() : '',
        meta: metaValue,
        slug,
        files: selectedFiles,
      })
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Unexpected error occurred')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter product name"
              className="mt-1"
              value={formData.name}
              onChange={handleInputChange}
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
              placeholder="Enter product description"
              className="mt-1"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="mt-1"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="sold_price" className="block text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <Input
                id="sold_price"
                name="sold_price"
                type="number"
                step="0.01"
                placeholder="0.00 (optional)"
                className="mt-1"
                value={formData.sold_price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="total_quantity" className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <Input
              id="total_quantity"
              name="total_quantity"
              type="number"
              placeholder="Enter stock quantity"
              className="mt-1"
              value={formData.total_quantity}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Available inventory count</p>
          </div>
          
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <Select
              name="category_id"
              value={formData.category_id}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="mt-1"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Select multiple image files (JPEG, PNG, etc.)
            </p>
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="meta" className="block text-sm font-medium text-gray-700">
              Metadata (JSON format)
            </label>
            <Textarea
              id="meta"
              name="meta"
              placeholder='Enter metadata as JSON, e.g., {"brand": "Nike", "color": "red"}'
              className="mt-1"
              rows={3}
              value={formData.meta}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Optional: JSON object for additional product data</p>
          </div>
          
          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
              SEO Meta Description
            </label>
            <Textarea
              id="meta_description"
              name="meta_description"
              placeholder="Enter SEO meta description for search engines"
              className="mt-1"
              rows={2}
              maxLength={160}
              value={formData.meta_description}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 150-160 characters for optimal SEO
            </p>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Save Product'}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline" disabled={loading}>
                CANCEL
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}