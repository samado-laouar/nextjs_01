interface Category {
  id: string
  name: string
  created_at: string
}

// Update your types file (@/types) with these changes

export interface ProductFormData {
  name: string
  description: string
  price: string
  sold_price: string
  images: string | any // Can be string (JSON) or parsed object
  total_quantity: string // Renamed from 'total'
  meta: string | any // Can be string (JSON) or parsed object
  meta_description: string
  category_id: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  sold_price?: number
  images?: any // JSONB
  category?: string
  total_quantity: number // Renamed from 'total'
  total_orders: number // New field
  slug: string
  meta?: any // JSONB
  meta_description?: string
  created_at: string
  updated_at: string
  category_id?: string
}


export interface ProductsSectionProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  loading: boolean;
}

