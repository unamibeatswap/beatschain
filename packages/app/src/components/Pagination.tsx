'use client'

import { usePaginationStyle } from '@/hooks/usePaginationStyle'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const { style, getBorderRadius } = usePaginationStyle()
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {style.showItemCount && (
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </div>
        )}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${style.borderColor}`,
              borderRadius: getBorderRadius(),
              background: currentPage === 1 ? '#f9fafb' : style.inactiveColor,
              color: currentPage === 1 ? '#9ca3af' : style.textColor,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          {style.showPageInfo && (
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
          )}
          
          {totalPages <= 7 ? (
            // Show all pages if there are 7 or fewer
            [...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${currentPage === i + 1 ? style.activeColor : style.borderColor}`,
                  borderRadius: getBorderRadius(),
                  background: currentPage === i + 1 ? style.activeColor : style.inactiveColor,
                  color: currentPage === i + 1 ? style.activeTextColor : style.textColor,
                  cursor: 'pointer',
                  fontWeight: currentPage === i + 1 ? '600' : '400'
                }}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // Show limited pages with ellipsis for larger page counts
            <>
              {/* First page */}
              <button
                onClick={() => onPageChange(1)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${currentPage === 1 ? style.activeColor : style.borderColor}`,
                  borderRadius: getBorderRadius(),
                  background: currentPage === 1 ? style.activeColor : style.inactiveColor,
                  color: currentPage === 1 ? style.activeTextColor : style.textColor,
                  cursor: 'pointer',
                  fontWeight: currentPage === 1 ? '600' : '400'
                }}
              >
                1
              </button>
              
              {/* Ellipsis or page 2 */}
              {currentPage > 3 && (
                <span className="px-2">...</span>
              )}
              
              {/* Pages around current page */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1
                // Show current page and one page before/after
                if (
                  (pageNum > 1 && pageNum < totalPages) && 
                  (pageNum === currentPage || 
                   pageNum === currentPage - 1 || 
                   pageNum === currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: `1px solid ${currentPage === pageNum ? style.activeColor : style.borderColor}`,
                        borderRadius: getBorderRadius(),
                        background: currentPage === pageNum ? style.activeColor : style.inactiveColor,
                        color: currentPage === pageNum ? style.activeTextColor : style.textColor,
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNum ? '600' : '400'
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                }
                return null
              })}
              
              {/* Ellipsis or second-last page */}
              {currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}
              
              {/* Last page */}
              <button
                onClick={() => onPageChange(totalPages)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${currentPage === totalPages ? style.activeColor : style.borderColor}`,
                  borderRadius: getBorderRadius(),
                  background: currentPage === totalPages ? style.activeColor : style.inactiveColor,
                  color: currentPage === totalPages ? style.activeTextColor : style.textColor,
                  cursor: 'pointer',
                  fontWeight: currentPage === totalPages ? '600' : '400'
                }}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${style.borderColor}`,
              borderRadius: getBorderRadius(),
              background: currentPage === totalPages ? '#f9fafb' : style.inactiveColor,
              color: currentPage === totalPages ? '#9ca3af' : style.textColor,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}