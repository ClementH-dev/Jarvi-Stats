import { useEffect } from 'react'
import type { TypeStats } from '../types/stats'

interface PerformanceChartProps {
  typeStats: TypeStats[]
}

export const PerformanceChart = ({ typeStats }: PerformanceChartProps) => {
  useEffect(() => {
    console.log('📊 Stats par type pour le graphique:', typeStats)
  }, [typeStats])

  return null
}
