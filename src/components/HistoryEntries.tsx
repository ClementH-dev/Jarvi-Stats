import { PerformanceChart } from './PerformanceChart'
import { WeeklyStatsTable } from './WeeklyStatsTable'
import { GlobalSummary } from './GlobalSummary'
import { DateRangeFilter } from './DateRangeFilter'
import { PeriodComparison } from './PeriodComparison'
import { useHistoryEntries } from '../hooks/useHistoryEntries'
import { useWeeklyStats } from '../hooks/useWeeklyStats'
import { useTypeStats } from '../hooks/useTypeStats'
import { useDateFilter } from '../hooks/useDateFilter'

export const HistoryEntries = () => {
  const { loading, error, historyEntries } = useHistoryEntries()
  const weeklyStats = useWeeklyStats(historyEntries)
  const { filteredWeeklyStats, filteredHistoryEntries, filterInfo, handleFilterChange } = useDateFilter(weeklyStats, historyEntries)
  
  // Recalculer les typeStats avec les données filtrées
  const filteredTypeStats = useTypeStats(filteredHistoryEntries || historyEntries)

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Chargement des statistiques...</div>
  if (error) return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>❌ Erreur : {error.message}</div>

  if (!historyEntries) return <div>Aucune donnée disponible</div>

  return (
    <div>
      <h1>Statistiques d'Approche - Jarvi</h1>
      
      <DateRangeFilter onFilterChange={handleFilterChange} />
      
      {filterInfo && (
        <div>
          <p>Période filtrée : {filterInfo.startDateFormatted} → {filterInfo.endDateFormatted}</p>
          <p>Semaines affichées : {filterInfo.totalWeeks}</p>
        </div>
      )}
      
      <GlobalSummary 
        historyEntries={filteredHistoryEntries || historyEntries} 
        typeStats={filteredTypeStats} 
        weeklyStats={filteredWeeklyStats}
        filterInfo={filterInfo}
      />
      <PerformanceChart typeStats={filteredTypeStats} />
      <WeeklyStatsTable weeklyStats={filteredWeeklyStats} typeStats={filteredTypeStats} />
      
      <PeriodComparison historyEntries={historyEntries} />
    </div>
  )
}
