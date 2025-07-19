import { useMemo } from 'react'
import type { HistoryEntry, WeeklyStats } from '../types/stats'

export const useWeeklyStats = (historyEntries: HistoryEntry[] | undefined) => {
  // Fonction pour obtenir le début de la semaine
const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  
  // Calculer combien de jours reculer pour arriver au lundi
  const daysToSubtract = day === 0 ? 6 : day - 1 // Dimanche = 6 jours, Lundi = 0, Mardi = 1, etc.
  
  // Créer une nouvelle date pour éviter les mutations
  const weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - daysToSubtract)
  weekStart.setHours(0, 0, 0, 0)
  
  return weekStart
}

  // Fonction pour formater une semaine
  const formatWeek = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
    
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
  }

  const weeklyStats = useMemo(() => {
    if (!historyEntries) return []
    
    const weeklyMap: Record<string, WeeklyStats> = {}
    
    historyEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt)
      const weekStart = getWeekStart(entryDate)
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeklyMap[weekKey]) {
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        
        weeklyMap[weekKey] = {
          week: formatWeek(weekStart),
          weekStart,
          weekEnd,
          total: 0,
          replied: 0,
          replyRate: 0,
          byType: {}
        }
      }
      
      const week = weeklyMap[weekKey]
      week.total += 1
      if (entry.triggerHasBeenRepliedTo) {
        week.replied += 1
      }
      
      // Stats par type
      if (!week.byType[entry.type]) {
        week.byType[entry.type] = { total: 0, replied: 0, replyRate: 0 }
      }
      
      week.byType[entry.type].total += 1
      if (entry.triggerHasBeenRepliedTo) {
        week.byType[entry.type].replied += 1
      }
      week.byType[entry.type].replyRate = (week.byType[entry.type].replied / week.byType[entry.type].total) * 100
    })
    
    // Calculer les taux de réponse globaux
    Object.values(weeklyMap).forEach(week => {
      week.replyRate = week.total > 0 ? (week.replied / week.total) * 100 : 0
    })
    
    return Object.values(weeklyMap).sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
  }, [historyEntries])

  return weeklyStats
}
