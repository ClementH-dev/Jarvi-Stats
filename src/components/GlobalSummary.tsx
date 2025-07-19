import type { HistoryEntry, WeeklyStats, TypeStats } from '../types/stats'

interface GlobalSummaryProps {
  historyEntries: HistoryEntry[]
  typeStats: TypeStats[]
  weeklyStats: WeeklyStats[]
  filterInfo?: {
    startWeekNumber?: string
    endWeekNumber?: string
    isSingleWeek?: boolean
    isFiltered: boolean
    startDateFormatted?: string
    endDateFormatted?: string
    isSingleDate?: boolean
  } | null
}

export const GlobalSummary = ({ historyEntries, typeStats, weeklyStats, filterInfo }: GlobalSummaryProps) => {
  const totalReplies = historyEntries.filter(e => e.triggerHasBeenRepliedTo).length
  const globalReplyRate = historyEntries.length > 0 ? (totalReplies / historyEntries.length) * 100 : 0
  const bestMethod = typeStats[0]?.type || 'N/A'
  const bestMethodRate = typeStats[0]?.replyRate || 0
  const worstMethod = typeStats[typeStats.length - 1]?.type || 'N/A'
  const worstMethodRate = typeStats[typeStats.length - 1]?.replyRate || 0

  const globalSummaryData = {
    weeksAnalyzed: weeklyStats.length
  }

  // Générer le titre dynamique
  const getTitle = () => {
    if (!filterInfo?.isFiltered) {
      return 'Résumé global'
    }
    
    // Utiliser les dates formatées si disponibles
    if (filterInfo.startDateFormatted) {
      if (filterInfo.isSingleDate) {
        return `Résumé du ${filterInfo.startDateFormatted}`
      }
      return `Résumé du ${filterInfo.startDateFormatted} au ${filterInfo.endDateFormatted}`
    }
    
    // Fallback sur les semaines
    if (filterInfo.isSingleWeek) {
      return `Résumé Semaine ${filterInfo.startWeekNumber}`
    }
    
    return `Résumé Semaines ${filterInfo.startWeekNumber} - ${filterInfo.endWeekNumber}`
  }

  return (
    <div>
      <h2>{getTitle()}</h2>
      <p>Messages totaux : {historyEntries.length}</p>
      <p>Réponses totales : {totalReplies}</p>
      <p>Taux de réponse global : {globalReplyRate.toFixed(1)}%</p>
      <p>Méthode la plus performante : {bestMethod} ({bestMethodRate.toFixed(1)}%)</p>
      <p>Méthode la moins performante : {worstMethod} ({worstMethodRate.toFixed(1)}%)</p>
      <p>Semaines analysées : {globalSummaryData.weeksAnalyzed}</p>
    </div>
  )
}
