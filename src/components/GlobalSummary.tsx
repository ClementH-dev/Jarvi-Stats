import type { HistoryEntry, WeeklyStats, TypeStats } from '../types/stats'

interface GlobalSummaryProps {
  historyEntries: HistoryEntry[]
  typeStats: TypeStats[]
  weeklyStats: WeeklyStats[]
}

export const GlobalSummary = ({ historyEntries, typeStats, weeklyStats }: GlobalSummaryProps) => {
  const totalReplies = historyEntries.filter(e => e.triggerHasBeenRepliedTo).length
  const globalReplyRate = historyEntries.length > 0 ? (totalReplies / historyEntries.length) * 100 : 0
  const bestMethod = typeStats[0]?.type || 'N/A'
  const bestMethodRate = typeStats[0]?.replyRate || 0
  const worstMethod = typeStats[typeStats.length - 1]?.type || 'N/A'
  const worstMethodRate = typeStats[typeStats.length - 1]?.replyRate || 0

  return (
    <div>
      <h2>Résumé global</h2>
      <p>Messages totaux : {historyEntries.length}</p>
      <p>Réponses totales : {totalReplies}</p>
      <p>Taux de réponse global : {globalReplyRate.toFixed(1)}%</p>
      <p>Méthode la plus performante : {bestMethod} ({bestMethodRate.toFixed(1)}%)</p>
      <p>Méthode la moins performante : {worstMethod} ({worstMethodRate.toFixed(1)}%)</p>
      <p>Semaines analysées : {weeklyStats.length}</p>
    </div>
  )
}
