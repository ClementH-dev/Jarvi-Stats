import { useState, useMemo } from 'react'
import type { WeeklyStats, TypeStats } from '../types/stats'
import { Table, type TableColumn } from './TableComponent'
import { Pagination } from './Pagination'
import { WeeklyLineChart } from './WeeklyLineChart'
import { exportToCSV } from '../utils/csvExport'

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
      {/* Header responsive */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <h2 className="text-lg md:text-xl font-semibold flex-1 text-left md:text-left text-center w-full md:w-auto mb-2 md:mb-0">
          Statistiques par Semaine
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {viewMode === 'table' && (
            <button
              onClick={() => exportToCSV(weeklyStats, typeStats)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium w-full md:w-auto"
            >
              <span>📊</span>
              <span>Exporter CSV</span>
            </button>
          )}
          <div className="flex flex-row w-full md:w-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 font-medium border-none rounded-l-lg min-w-[110px] ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-200`}
            >
              📋 Tableau
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 font-medium border-none rounded-r-lg min-w-[110px] ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-200`}
            >
              📈 Graphique
            </button>
          </div>
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
