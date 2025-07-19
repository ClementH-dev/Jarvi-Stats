import { useMemo, useState } from 'react'
import type { WeeklyStats, HistoryEntry } from '../types/stats'

export const useWeekFilter = (weeklyStats: WeeklyStats[], historyEntries?: HistoryEntry[]) => {
  const [startWeek, setStartWeek] = useState<string>('')
  const [endWeek, setEndWeek] = useState<string>('')

  const handleFilterChange = (newStartWeek: string, newEndWeek: string) => {
    setStartWeek(newStartWeek)
    setEndWeek(newEndWeek)
  }

  const filteredWeeklyStats = useMemo(() => {
    if (!startWeek && !endWeek) {
      return weeklyStats
    }

    // Si une seule semaine est sélectionnée, utiliser cette semaine pour les deux bornes
    const actualStartWeek = startWeek || endWeek
    const actualEndWeek = endWeek || startWeek

    const startWeekObj = weeklyStats.find(w => w.week === actualStartWeek)
    const endWeekObj = weeklyStats.find(w => w.week === actualEndWeek)

    if (!startWeekObj || !endWeekObj) {
      return weeklyStats
    }

    const startDate = startWeekObj.weekStart
    const endDate = endWeekObj.weekEnd

    return weeklyStats.filter(week => {
      const isInRange = week.weekStart >= startDate && week.weekEnd <= endDate
      return isInRange
    })
  }, [weeklyStats, startWeek, endWeek])

  const filteredHistoryEntries = useMemo(() => {
    if (!historyEntries || (!startWeek && !endWeek)) {
      return historyEntries
    }

    const actualStartWeek = startWeek || endWeek
    const actualEndWeek = endWeek || startWeek

    const startWeekObj = weeklyStats.find(w => w.week === actualStartWeek)
    const endWeekObj = weeklyStats.find(w => w.week === actualEndWeek)

    if (!startWeekObj || !endWeekObj) {
      return historyEntries
    }

    const startDate = startWeekObj.weekStart
    const endDate = endWeekObj.weekEnd

    return historyEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= startDate && entryDate <= endDate
    })
  }, [historyEntries, weeklyStats, startWeek, endWeek])

  const filterInfo = useMemo(() => {
    if (!startWeek && !endWeek) {
      return null
    }

    const actualStartWeek = startWeek || endWeek
    const actualEndWeek = endWeek || startWeek
    const count = filteredWeeklyStats.length

    // Extraire les numéros de semaine pour le titre
    const startWeekNumber = actualStartWeek.split(' - ')[0]
    const endWeekNumber = actualEndWeek.split(' - ')[1] || actualEndWeek.split(' - ')[0]

    return {
      startWeek: actualStartWeek,
      endWeek: actualEndWeek,
      startWeekNumber,
      endWeekNumber,
      totalWeeks: count,
      isFiltered: Boolean(startWeek || endWeek),
      isSingleWeek: actualStartWeek === actualEndWeek
    }
  }, [startWeek, endWeek, filteredWeeklyStats.length])

  return {
    filteredWeeklyStats,
    filteredHistoryEntries,
    filterInfo,
    handleFilterChange
  }
}
