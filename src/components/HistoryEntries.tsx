import { PerformanceChart } from './PerformanceChart'
import { WeeklyStatsTable } from './WeeklyStatsTable'
import { GlobalSummary } from './GlobalSummary'
import { useHistoryEntries } from '../hooks/useHistoryEntries'
import { useWeeklyStats } from '../hooks/useWeeklyStats'
import { useTypeStats } from '../hooks/useTypeStats'

export const HistoryEntries = () => {
  const { loading, error, historyEntries } = useHistoryEntries()
  const weeklyStats = useWeeklyStats(historyEntries)
  const typeStats = useTypeStats(historyEntries)

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Chargement des statistiques...</div>
  if (error) return <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>❌ Erreur : {error.message}</div>

  if (!historyEntries) return <div style={{ padding: '20px', textAlign: 'center' }}>Aucune donnée disponible</div>

  return (
    <div>
      <PerformanceChart typeStats={typeStats} />
      <WeeklyStatsTable weeklyStats={weeklyStats} typeStats={typeStats} />
      <GlobalSummary historyEntries={historyEntries} typeStats={typeStats} weeklyStats={weeklyStats} />
    </div>
  )
}
