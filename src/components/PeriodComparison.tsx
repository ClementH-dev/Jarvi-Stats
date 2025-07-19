import { useState, useMemo } from 'react'
import type { HistoryEntry } from '../types/stats'

interface PeriodComparisonProps {
  historyEntries: HistoryEntry[]
}

export const PeriodComparison = ({ historyEntries }: PeriodComparisonProps) => {
  const [period1Start, setPeriod1Start] = useState<string>('')
  const [period1End, setPeriod1End] = useState<string>('')
  const [period2Start, setPeriod2Start] = useState<string>('')
  const [period2End, setPeriod2End] = useState<string>('')

  const period1Data = useMemo(() => {
    if (!period1Start && !period1End) return []

    const actualStartDate = new Date(period1Start || period1End)
    const actualEndDate = new Date(period1End || period1Start)
    
    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return historyEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= actualStartDate && entryDate <= actualEndDate
    })
  }, [historyEntries, period1Start, period1End])

  const period2Data = useMemo(() => {
    if (!period2Start && !period2End) return []

    const actualStartDate = new Date(period2Start || period2End)
    const actualEndDate = new Date(period2End || period2Start)
    
    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return historyEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= actualStartDate && entryDate <= actualEndDate
    })
  }, [historyEntries, period2Start, period2End])

  const calculateStats = (entries: HistoryEntry[]) => {
    const totalMessages = entries.length
    const totalReplies = entries.filter(e => e.triggerHasBeenRepliedTo).length
    const replyRate = totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 0
    
    return {
      totalMessages,
      totalReplies,
      replyRate
    }
  }

  const stats1 = calculateStats(period1Data)
  const stats2 = calculateStats(period2Data)

  const getEvolutionIndicator = (value1: number, value2: number, isPercentage: boolean = false) => {
    if (value1 === 0 && value2 === 0) return { text: '=', color: '#666', symbol: '=' }
    if (value1 === 0) return { text: `+${isPercentage ? value2.toFixed(1) + '%' : value2}`, color: '#28a745', symbol: '↗️' }
    if (value2 === 0) return { text: `${isPercentage ? value1.toFixed(1) + '%' : value1}`, color: '#dc3545', symbol: '↘️' }
    
    const diff = value2 - value1
    const percentChange = (diff / value1) * 100
    
    if (diff > 0) {
      return { 
        text: `+${isPercentage ? diff.toFixed(1) + '%' : diff} (+${percentChange.toFixed(1)}%)`, 
        color: '#28a745', 
        symbol: '↗️' 
      }
    } else if (diff < 0) {
      return { 
        text: `${isPercentage ? diff.toFixed(1) + '%' : diff} (${percentChange.toFixed(1)}%)`, 
        color: '#dc3545', 
        symbol: '↘️' 
      }
    }
    
    return { text: '=', color: '#666', symbol: '=' }
  }

  const messageEvolution = getEvolutionIndicator(stats1.totalMessages, stats2.totalMessages)
  const replyEvolution = getEvolutionIndicator(stats1.totalReplies, stats2.totalReplies)
  const rateEvolution = getEvolutionIndicator(stats1.replyRate, stats2.replyRate, true)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const hasData = (period1Start || period1End) && (period2Start || period2End)

  return (
    <div>
      <h2>Comparaison de Périodes</h2>
      
      <div>
        <h3>Période 1 (Référence)</h3>
        <div>
          <label>Date de début :</label>
          <input
            type="date"
            value={period1Start}
            onChange={(e) => setPeriod1Start(e.target.value)}
          />
          <label>Date de fin :</label>
          <input
            type="date"
            value={period1End}
            onChange={(e) => setPeriod1End(e.target.value)}
          />
        </div>
        
        <h3>Période 2 (Comparaison)</h3>
        <div>
          <label>Date de début :</label>
          <input
            type="date"
            value={period2Start}
            onChange={(e) => setPeriod2Start(e.target.value)}
          />
          <label>Date de fin :</label>
          <input
            type="date"
            value={period2End}
            onChange={(e) => setPeriod2End(e.target.value)}
          />
        </div>
      </div>

      {hasData && (
        <div>
          <h3>Résultats de la Comparaison</h3>
          
          <table>
            <thead>
              <tr>
                <th>Métrique</th>
                <th>Période 1 ({formatDate(period1Start || period1End)} - {formatDate(period1End || period1Start)})</th>
                <th>Période 2 ({formatDate(period2Start || period2End)} - {formatDate(period2End || period2Start)})</th>
                <th>Évolution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Messages totaux</td>
                <td>{stats1.totalMessages}</td>
                <td>{stats2.totalMessages}</td>
                <td>
                  <span style={{ color: messageEvolution.color }}>
                    {messageEvolution.symbol} {messageEvolution.text}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Réponses totales</td>
                <td>{stats1.totalReplies}</td>
                <td>{stats2.totalReplies}</td>
                <td>
                  <span style={{ color: replyEvolution.color }}>
                    {replyEvolution.symbol} {replyEvolution.text}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Taux de réponse</td>
                <td>{stats1.replyRate.toFixed(1)}%</td>
                <td>{stats2.replyRate.toFixed(1)}%</td>
                <td>
                  <span style={{ color: rateEvolution.color }}>
                    {rateEvolution.symbol} {rateEvolution.text}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <h4>Analyse</h4>
            <p>
              {stats2.replyRate > stats1.replyRate ? '✅' : stats2.replyRate < stats1.replyRate ? '❌' : '➖'} 
              {' '}
              Le taux de réponse a {stats2.replyRate > stats1.replyRate ? 'augmenté' : stats2.replyRate < stats1.replyRate ? 'diminué' : 'stagné'} 
              entre les deux périodes.
            </p>
            <p>
              📊 Volume d'activité : {stats2.totalMessages > stats1.totalMessages ? 'en hausse' : stats2.totalMessages < stats1.totalMessages ? 'en baisse' : 'stable'} 
              ({Math.abs(stats2.totalMessages - stats1.totalMessages)} messages de différence)
            </p>
          </div>
        </div>
      )}

      {!hasData && (
        <p>
          💡 Sélectionnez deux périodes pour voir la comparaison des performances.
        </p>
      )}
    </div>
  )
}
