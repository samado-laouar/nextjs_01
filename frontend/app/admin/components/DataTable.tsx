'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { ReactNode, useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  format?: (value: any) => ReactNode
}

interface Action<T> {
  label: ReactNode
  href?: (item: T) => string
  onClick?: (item: T) => void
  variant?: 'link' | 'default' | 'outline' | 'destructive' | 'ghost'
  ariaLabel?: string
  size?: 'sm' | 'default' | 'lg'
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading: boolean
  error: string | null
  emptyMessage?: string
  actions?: Action<T>[]
  defaultPageSize?: number
  pageSizeOptions?: number[]
  showPagination?: boolean
}

export function DataTable<T>({
  data,
  columns,
  loading,
  error,
  emptyMessage = 'No data found.',
  actions = [],
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPagination = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Calculate pagination
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  const currentData = useMemo(() => {
    if (!showPagination) return data
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex, showPagination])

  // Reset to first page when data changes or page size changes
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1)
  }

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const PaginationControls = () => {
    if (!showPagination || totalPages <= 1) return null

    const pageNumbers = getPageNumbers()
    const showingStart = startIndex + 1
    const showingEnd = Math.min(endIndex, totalItems)

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Showing {showingStart} to {showingEnd} of {totalItems} results
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {error && <div className="mb-4 text-red-500 px-6">{error}</div>}
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">No Data Found</div>
            <div className="text-sm">{emptyMessage}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.header)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={startIndex + index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={String(column.header)}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : column.format
                          ? column.format(item[column.accessor])
                          : item[column.accessor] || 'N/A'}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 text-sm">
                        <div className="flex justify-end space-x-1">
                          {actions.map((action, idx) => (
                            <div key={idx}>
                              {action.href ? (
                                <Link href={action.href(item)}>
                                  <Button
                                    variant={action.variant || 'outline'}
                                    size={action.size || 'sm'}
                                    aria-label={action.ariaLabel || 'Action'}
                                  >
                                    {action.label}
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  variant={action.variant || 'outline'}
                                  size={action.size || 'sm'}
                                  onClick={() => action.onClick?.(item)}
                                  aria-label={action.ariaLabel || 'Action'}
                                >
                                  {action.label}
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <PaginationControls />
        </>
      )}
    </div>
  )
}