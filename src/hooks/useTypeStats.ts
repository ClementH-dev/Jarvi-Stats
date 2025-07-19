import { useMemo } from 'react'
import type { HistoryEntry, TypeStats } from '../types/stats'

export const useTypeStats = (historyEntries: HistoryEntry[] | undefined) => {
  const typeStats = useMemo(() => {
    if (!historyEntries) return []
    
    const typeMap: Record<string, { total: number; replied: number }> = {}
    
    historyEntries.forEach(entry => {
      if (!typeMap[entry.type]) {
        typeMap[entry.type] = { total: 0, replied: 0 }
      }
      
      typeMap[entry.type].total += 1
      if (entry.triggerHasBeenRepliedTo) {
        typeMap[entry.type].replied += 1
      }
    })
    
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997']
    
    return Object.entries(typeMap).map(([type, stats], index): TypeStats => ({
      type,
      total: stats.total,
      replied: stats.replied,
      replyRate: stats.total > 0 ? (stats.replied / stats.total) * 100 : 0,
      color: colors[index % colors.length]
    })).sort((a, b) => b.replyRate - a.replyRate)
  }, [historyEntries])

  return typeStats
}
