import type { WeeklyStats, TypeStats } from '../types/stats'

export const exportToCSV = (weeklyStats: WeeklyStats[], typeStats: TypeStats[], filename: string = 'statistiques-hebdomadaires') => {
  // En-têtes de colonnes
  const headers = [
    'Semaine',
    'Total Messages',
    'Réponses',
    'Taux Global (%)',
    ...typeStats.map(type => `${type.type} - Taux (%)`)
  ]

  // Données
  const rows = weeklyStats.map(week => [
    week.week,
    week.total.toString(),
    week.replied.toString(),
    week.replyRate.toFixed(1),
    ...typeStats.map(type => {
      const typeData = week.byType[type.type]
      return typeData ? typeData.replyRate.toFixed(1) : '0'
    })
  ])

  // Création du contenu CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Création et téléchargement du fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportChartDataToCSV = (weeklyStats: WeeklyStats[], _typeStats: TypeStats[], selectedMetrics: string[], filename: string = 'donnees-graphique') => {
  // En-têtes de colonnes basées sur les métriques sélectionnées
  const headers = ['Semaine']
  
  selectedMetrics.forEach(metric => {
    switch (metric) {
      case 'replyRate':
        headers.push('Taux de réponse (%)')
        break
      case 'total':
        headers.push('Messages envoyés')
        break
      case 'replied':
        headers.push('Réponses reçues')
        break
      default:
        // Pour les types de messages
        headers.push(`${metric} - Taux (%)`)
        break
    }
  })

  // Données
  const rows = weeklyStats.map(week => {
    const row = [week.week]
    
    selectedMetrics.forEach(metric => {
      switch (metric) {
        case 'replyRate':
          row.push(week.replyRate.toFixed(1))
          break
        case 'total':
          row.push(week.total.toString())
          break
        case 'replied':
          row.push(week.replied.toString())
          break
        default: {
          // Pour les types de messages
          const typeData = week.byType[metric]
          row.push(typeData ? typeData.replyRate.toFixed(1) : '0')
          break
        }
      }
    })
    
    return row
  })

  // Création du contenu CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Création et téléchargement du fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
