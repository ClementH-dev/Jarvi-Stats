import { useEffect, useState, useMemo } from 'react'
import type { WeeklyStats, TypeStats } from '../types/stats'
import { Table, type TableColumn } from './TableComponent'
import { Pagination } from './Pagination'
import { WeeklyLineChart } from './WeeklyLineChart'

interface WeeklyStatsTableProps {
  weeklyStats: WeeklyStats[]
  typeStats: TypeStats[]
}

type ViewMode = 'table' | 'chart'

export const WeeklyStatsTable = ({ weeklyStats, typeStats }: WeeklyStatsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const itemsPerPage = 10
  
  // Calcul de la pagination
  const totalPages = Math.ceil(weeklyStats.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = weeklyStats.slice(startIndex, endIndex)

  useEffect(() => {
    console.log('📅 Stats hebdomadaires pour le tableau:', weeklyStats)
    console.log('📊 Types pour le tableau:', typeStats)
  }, [weeklyStats, typeStats])

  // Configuration des colonnes
  const columns = useMemo(() => [
    { key: 'week', label: 'Semaine', align: 'left' as const },
    { key: 'total', label: 'Total Messages', align: 'center' as const },
    { key: 'replied', label: 'Réponses', align: 'center' as const },
    { key: 'replyRate', label: 'Taux Global', align: 'center' as const },
    ...typeStats.map(type => ({
      key: type.type,
      label: type.type,
      align: 'center' as const
    }))
  ], [typeStats])

  // Fonction de rendu des cellules
  const renderCell = (week: WeeklyStats, column: TableColumn) => {
    switch (column.key) {
      case 'week':
        return week.week
      case 'total':
        return week.total
      case 'replied':
        return week.replied
      case 'replyRate':
        return `${week.replyRate.toFixed(1)}%`
      default: {
        // Colonnes des types
        const typeData = week.byType[column.key]
        return typeData ? (
          <div>
            <div>{typeData.replyRate.toFixed(1)}%</div>
            <div>{typeData.replied}/{typeData.total}</div>
          </div>
        ) : '-'
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Statistiques par Semaine</h2>
        
        {/* Toggle View Mode */}
        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '5px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#007bff' : '#f8f9fa',
              color: viewMode === 'table' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px 0 0 5px'
            }}
          >
            📋 Tableau
          </button>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: viewMode === 'chart' ? '#007bff' : '#f8f9fa',
              color: viewMode === 'chart' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '0 5px 5px 0'
            }}
          >
            📈 Graphique
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div>
          <Table 
            columns={columns}
            data={currentItems}
            renderCell={renderCell}
          />

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <div>
            Affichage de {startIndex + 1} à {Math.min(endIndex, weeklyStats.length)} sur {weeklyStats.length} semaines
          </div>
        </div>
      ) : (
        <WeeklyLineChart weeklyStats={weeklyStats} typeStats={typeStats} />
      )}
    </div>
  )
}
