import { useEffect } from 'react'
import type { WeeklyStats, TypeStats } from '../types/stats'

interface WeeklyStatsTableProps {
  weeklyStats: WeeklyStats[]
  typeStats: TypeStats[]
}

export const WeeklyStatsTable = ({ weeklyStats, typeStats }: WeeklyStatsTableProps) => {
  useEffect(() => {
    console.log('📅 Stats hebdomadaires pour le tableau:', weeklyStats)
    console.log('📊 Types pour le tableau:', typeStats)
  }, [weeklyStats, typeStats])

  return null
}
