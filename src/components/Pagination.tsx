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
      visiblePages.push('...')
    }
    
    // Ajouter les pages centrales
    for (let i = start; i <= end; i++) {
      visiblePages.push(i)
    }
    
    // Ajouter "..." avant la dernière si nécessaire
    if (end < totalPages - 1) {
      visiblePages.push('...')
    }
    
    // Toujours afficher la dernière page
    if (totalPages > 1) {
      visiblePages.push(totalPages)
    }
    
    return visiblePages
  }

  return (
    <div>
      {/* Info sur la page actuelle */}
      <div>
        Page {currentPage} sur {totalPages}
      </div>
      
      {/* Navigation */}
      <div>
        <button 
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          ← Précédent
        </button>
        
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              disabled={currentPage === page}
              style={{
                fontWeight: currentPage === page ? 'bold' : 'normal'
              }}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
