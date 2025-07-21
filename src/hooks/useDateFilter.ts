import { useMemo, useState } from 'react'
import type { WeeklyStats, HistoryEntry } from '../types/stats'

export const useDateFilter = (weeklyStats: WeeklyStats[], historyEntries?: HistoryEntry[]) => {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const handleFilterChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  const filteredWeeklyStats = useMemo(() => {
    if (!weeklyStats || weeklyStats.length === 0) return []
    
    if (!startDate && !endDate) {
      return weeklyStats
    }

    // Si une seule date est fournie, utiliser cette date pour les deux bornes
    const actualStartDate = new Date(startDate || endDate)
    const actualEndDate = new Date(endDate || startDate)

    // Ajuster les heures pour inclure toute la journée
    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return weeklyStats.filter(week => {
      // Vérifier si la semaine chevauche avec la période sélectionnée
      const weekStart = new Date(week.weekStart)
      const weekEnd = new Date(week.weekEnd)
      
      // La semaine est incluse si elle chevauche avec la période
      const isOverlapping = weekStart <= actualEndDate && weekEnd >= actualStartDate
      
      return isOverlapping
    })
  }, [weeklyStats, startDate, endDate])

  const filteredHistoryEntries = useMemo(() => {
    if (!historyEntries || historyEntries.length === 0) return []
    
    if (!startDate && !endDate) {
      return historyEntries
    }

    const actualStartDate = new Date(startDate || endDate)
    const actualEndDate = new Date(endDate || startDate)
    
    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return historyEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= actualStartDate && entryDate <= actualEndDate
    })
  }, [historyEntries, startDate, endDate])

  const filterInfo = useMemo(() => {
    if (!startDate && !endDate) {
      return null
    }

    const actualStartDate = startDate || endDate
    const actualEndDate = endDate || startDate
    const count = filteredWeeklyStats.length

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    return {
      startDate: actualStartDate,
      endDate: actualEndDate,
      startDateFormatted: formatDate(actualStartDate),
      endDateFormatted: formatDate(actualEndDate),
      totalWeeks: count,
      isFiltered: Boolean(startDate || endDate),
      isSingleDate: actualStartDate === actualEndDate
    }
  }, [startDate, endDate, filteredWeeklyStats.length])

  return {
    filteredWeeklyStats,
    filteredHistoryEntries,
    filterInfo,
    handleFilterChange
  }
}
