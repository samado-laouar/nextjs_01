'use client'

import { redirect } from 'next/navigation'
import Sidebar from '../dashboard/components/Sidebar'
import Header from '../dashboard/components/Header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { sidebarItems } from '../dashboard/components/sidebarItems'
import { Product } from '@/types'
import supabase from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { DataTable } from '../components/DataTable'
import { Eye, Edit, Trash2, Package, ShoppingCart, ImageIcon } from 'lucide-react'
import { ConfirmationModal } from '../components/ConfirmationModal'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) redirect('/auth/login')
    }
    checkAuth()
  }, [])

  // Fetch products with all necessary fields
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            price, 
            slug, 
            images,
            total_quantity,
            total_orders,
            category:categories(name)
          `)
          .order('name', { ascending: true })

        if (error) {
          console.error('Error fetching products:', error.message)
          setError('Failed to load products')
          toast.error('Failed to load products')
          return
        }

        setProducts(data || [])
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Unexpected error occurred')
        toast.error('Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id)

      if (error) {
        console.error('Error deleting product:', error.message)
        toast.error('Failed to delete product')
        return
      }

      setProducts(products.filter((p) => p.id !== selectedProduct.id))
      toast.success('Product deleted successfully')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Unexpected error occurred')
    } finally {
      setIsModalOpen(false)
      setSelectedProduct(null)
    }
  }

  // Open modal for delete confirmation
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  // Component to render product image
    const ProductImage = ({ images, name }: { images: any, name: string }) => {
    // Ensure images is an array and has at least one element
    const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;
    console.log('Rendering image for product:', name, imageUrl);

    return (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
            <Image
            src={imageUrl}
            alt={name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
            }}
            />
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
        )}
        </div>
    );
    };
  // Stock status component
  const StockStatus = ({ quantity }: { quantity: number }) => {
    const getStatusColor = () => {
      if (quantity === 0) return 'text-red-600 bg-red-50'
      if (quantity <= 10) return 'text-yellow-600 bg-yellow-50'
      return 'text-green-600 bg-green-50'
    }

    const getStatusText = () => {
      if (quantity === 0) return 'Out of Stock'
      if (quantity <= 10) return 'Low Stock'
      return 'In Stock'
    }

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        <Package className="w-3 h-3 mr-1" />
        {getStatusText()}
      </div>
    )
  }

  // Orders badge component
  const OrdersBadge = ({ orders }: { orders: number }) => {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
        <ShoppingCart className="w-3 h-3 mr-1" />
        {orders} orders
      </div>
    )
  }

  // Define columns for products
  const productColumns = [
    {
      header: 'Product',
      accessor: (product: Product) => (
        <div className="flex items-center space-x-3">
          <ProductImage images={product.images} name={product.name} />
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">
              {product.category?.name || 'No Category'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      format: (value: number) => (
        <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
      ),
    },
    {
      header: 'Stock',
      accessor: (product: Product) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {product.total_quantity || 0} units
          </div>
          <StockStatus quantity={product.total_quantity || 0} />
        </div>
      )
    },
    {
      header: 'Orders',
      accessor: (product: Product) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {product.total_orders || 0} total
          </div>
          <OrdersBadge orders={product.total_orders || 0} />
        </div>
      )
    }
  ]

  // Define actions for products with icons
  const productActions = [
    {
      label: <Eye className="h-4 w-4" />,
      href: (product: Product) => `/admin/products/${product.slug}`,
      variant: 'outline' as const,
      ariaLabel: 'View product',
      size: 'sm' as const,
    },
    {
      label: <Edit className="h-4 w-4" />,
      href: (product: Product) => `/admin/products/edit/${product.id}`,
      variant: 'outline' as const,
      ariaLabel: 'Edit product',
      size: 'sm' as const,
    },
    {
      label: <Trash2 className="h-4 w-4" />,
      onClick: openDeleteModal,
      variant: 'destructive' as const,
      ariaLabel: 'Delete product',
      size: 'sm' as const,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your product inventory and track orders
                  </p>
                </div>
                <Link href="/admin/products/new">
                  <Button className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Add New Product</span>
                  </Button>
                </Link>
              </div>
              
              {/* Summary Stats */}
              {!loading && products.length > 0 && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-gray-900">
                        {products.length}
                      </div>
                      <div className="text-sm text-gray-500">Total Products</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {products.reduce((sum, p) => sum + (p.total_quantity || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-500">Total Stock</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {products.reduce((sum, p) => sum + (p.total_orders || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-500">Total Orders</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">
                        {products.filter(p => (p.total_quantity || 0) === 0).length}
                      </div>
                      <div className="text-sm text-gray-500">Out of Stock</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <DataTable
                  data={products}
                  columns={productColumns}
                  loading={loading}
                  error={error}
                  emptyMessage="No products found. Start by adding your first product!"
                  actions={productActions}
                  defaultPageSize={10}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPagination={true}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      {selectedProduct && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteProduct}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the product "${selectedProduct.name}"? This action cannot be undone.`}
          confirmLabel="Delete Product"
          cancelLabel="Cancel"
        />
      )}
    </div>
  )
}