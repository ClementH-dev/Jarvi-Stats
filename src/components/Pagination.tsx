"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const goToPrevious = () => onPageChange(Math.max(currentPage - 1, 1))
  const goToNext = () => onPageChange(Math.min(currentPage + 1, totalPages))

  // Fonction pour générer les numéros de pages à afficher
  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = []

    // Si peu de pages, on affiche tout
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i)
      }
      return visiblePages
    }

    // Toujours afficher la première page
    visiblePages.push(1)

    // Déterminer la plage autour de la page actuelle
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Ajuster pour avoir au moins 3 pages au centre
    if (currentPage <= 3) {
      start = 2
      end = Math.min(4, totalPages - 1)
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2)
      end = totalPages - 1
    }

    // Ajouter "..." après 1 si nécessaire
    if (start > 2) {
      visiblePages.push("...")
    }

    // Ajouter les pages centrales
    for (let i = start; i <= end; i++) {
      visiblePages.push(i)
    }

    // Ajouter "..." avant la dernière si nécessaire
    if (end < totalPages - 1) {
      visiblePages.push("...")
    }

    // Toujours afficher la dernière page
    if (totalPages > 1) {
      visiblePages.push(totalPages)
    }

    return visiblePages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info sur la page actuelle */}
      <div className="text-sm text-slate-600">
        Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-1">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <span className="hidden sm:inline">Suivant</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
