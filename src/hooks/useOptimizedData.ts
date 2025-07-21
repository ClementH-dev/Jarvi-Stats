import { useGlobalStats } from './useGlobalStats'
import { useHistoryEntries } from './useHistoryEntries'
import { useTypeStats } from './useTypeStats'
import { useMemo } from 'react'
import type { TypeStats } from '../types/stats'

/**
 * Hook composé qui gère le chargement optimisé des données :
 * - Stats globales chargées en priorité (ultra rapide)
 * - Données complètes chargées SEULEMENT quand nécessaire (évite freeze)
 */
export const useOptimizedData = (needsFullData = false) => {
  // Hook rapide pour les stats
  const { 
    globalStats, 
    loading: statsLoading, 
    error: statsError,
    isStatsReady 
  } = useGlobalStats()
  
  // Hook pour toutes les données
  const { 
    historyEntries, 
    loading: dataLoading, 
    error: dataError,
    isDataReady,
    loadedCount 
  } = useHistoryEntries(needsFullData) 
  
  // Hook traditionnel pour les filtres
  const traditionalTypeStats = useTypeStats(needsFullData ? historyEntries : [])
  
  const optimizedTypeStats = useMemo((): TypeStats[] => {
    if (!isStatsReady) return []
    
    return [
      {
        type: "EMAIL_SENT",
        total: globalStats.emailStats.sent,
        replied: globalStats.emailStats.replied,
        replyRate: parseFloat(globalStats.emailStats.responseRate),
        color: "#3b82f6"
      },
      {
        type: "LINKEDIN_MESSAGE_SENT", 
        total: globalStats.linkedinMessageStats.sent,
        replied: globalStats.linkedinMessageStats.replied,
        replyRate: parseFloat(globalStats.linkedinMessageStats.responseRate),
        color: "#0ea5e9"
      },
      {
        type: "LINKEDIN_INMAIL_SENT",
        total: globalStats.linkedinInmailStats.sent, 
        replied: globalStats.linkedinInmailStats.replied,
        replyRate: parseFloat(globalStats.linkedinInmailStats.responseRate),
        color: "#06b6d4"
      }
    ].sort((a, b) => b.replyRate - a.replyRate)
  }, [isStatsReady, globalStats])
  
  return {
    // Stats globales
    globalStats,
    statsLoading,
    statsError,
    isStatsReady,
    
    // Données complètes
    historyEntries,
    dataLoading,
    dataError,
    isDataReady,
    loadedCount,
    
    // TypeStats 
    optimizedTypeStats,
    traditionalTypeStats,
    
    // Status général
    isFullyLoaded: isStatsReady && isDataReady,
    hasErrors: !!statsError || !!dataError,
    
    // Helper pour déterminer quelle donnée utiliser
    shouldUseGlobalStats: (isFiltered: boolean) => !isFiltered && isStatsReady,
    
    // Méthode pour obtenir les bonnes typeStats selon le contexte
    getTypeStats: (isFiltered: boolean) => {
      return (!isFiltered && isStatsReady) ? optimizedTypeStats : traditionalTypeStats
    }
  }
}
