import { useEffect } from 'react'
import type { TypeStats } from '../types/stats'

interface PerformanceChartProps {
  typeStats: TypeStats[]
}

export const PerformanceChart = ({ typeStats }: PerformanceChartProps) => {
  useEffect(() => {
    console.log('📊 Stats par type pour le graphique:', typeStats)
  }, [typeStats])

  const maxRate = Math.max(...typeStats.map(d => d.replyRate), 1)

  return (
    <div>
      <h2>Performance par Type de Message</h2>
      
      <div>
        {typeStats.map((item) => (
          <div key={item.type}>
            <div>{item.type}</div>
            <div>
              <div 
                style={{ 
                  width: `${(item.replyRate / maxRate) * 100}%`,
                  height: '20px',
                  backgroundColor: item.color
                }}
              />
            </div>
            <div>{item.replyRate.toFixed(1)}% ({item.replied}/{item.total})</div>
          </div>
        ))}
      </div>
    </div>
  )
}
