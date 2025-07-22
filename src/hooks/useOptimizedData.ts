import { useGlobalStats } from './useGlobalStats'
import { useHistoryEntries } from './useHistoryEntries'
import { useTypeStats } from './useTypeStats'
import { useMemo, useState, useEffect } from 'react'
import { apolloClient } from '../lib/apollo'
import { gql } from '@apollo/client'
import type { TypeStats, HistoryEntry } from '../types/stats'

export const useOptimizedData = (needsFullData = false) => {
  // Hook rapide pour les stats
  const { 
    globalStats, 
    loading: statsLoading, 
    error: statsError,
    isStatsReady 
  } = useGlobalStats()
  
  // Hook pour la première page
  const {
    historyEntries,
    loading: dataLoading,
    error: dataError,
    isDataReady,
    loadedCount
  } = useHistoryEntries({ shouldLoad: needsFullData })

  // Chargement massif en parallèle
  const PAGE_SIZE = 10000
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>([])
  const [isAllLoaded, setIsAllLoaded] = useState(false)
  const [loadingAll, setLoadingAll] = useState(false)

  // Récupère le total de message
  const totalCount = globalStats?.totalMessages || 0

  useEffect(() => {
    if (!needsFullData) {
      setAllEntries([])
      setIsAllLoaded(false)
      setLoadingAll(false)
      return
    }
    if (!isStatsReady || isAllLoaded || loadingAll || !totalCount) return
    setLoadingAll(true)
    const pages = Math.ceil(totalCount / PAGE_SIZE)
    const GET_HISTORY_ENTRIES = gql`
      query GetHistoryEntries($limit: Int!, $offset: Int!) {
        historyentries(
          where: {
            userId: {_eq: "32ca93da-0cf6-4608-91e7-bc6a2dbedcd1"}
            type: { _in: ["EMAIL_SENT", "LINKEDIN_MESSAGE_SENT", "LINKEDIN_INMAIL_SENT"] }
          }
          order_by: {createdAt: desc}
          limit: $limit
          offset: $offset
        ) {
          id
          createdAt
          type
          isRead
          triggerHasBeenRepliedTo
          userId
        }
      }
    `
    const fetchAllPages = async () => {
      try {
        let all: HistoryEntry[] = []
        for (let i = 0; i < pages; i++) {
          const result = await apolloClient.query({
            query: GET_HISTORY_ENTRIES,
            variables: { limit: PAGE_SIZE, offset: i * PAGE_SIZE },
            fetchPolicy: 'network-only',
          })
          all = all.concat(result.data?.historyentries || [])
        }
        setAllEntries(all)
        setIsAllLoaded(true)
      } finally {
        setLoadingAll(false)
      }
    }
    fetchAllPages()
  }, [needsFullData, isStatsReady, totalCount, isAllLoaded, loadingAll])

  // Hook traditionnel pour les filtres
  const traditionalTypeStats = useTypeStats(needsFullData ? (isAllLoaded ? allEntries : historyEntries) : [])
  
  const optimizedTypeStats = useMemo((): TypeStats[] => {
    if (!isStatsReady) return []
    
    return [
      {
        type: "EMAIL_SENT",
        name: "Email",
        total: globalStats.emailStats.sent,
        replied: globalStats.emailStats.replied,
        replyRate: parseFloat(globalStats.emailStats.responseRate),
        color: "#3b82f6"
      },
      {
        type: "LINKEDIN_MESSAGE_SENT", 
        name: "LinkedIn Message",
        total: globalStats.linkedinMessageStats.sent,
        replied: globalStats.linkedinMessageStats.replied,
        replyRate: parseFloat(globalStats.linkedinMessageStats.responseRate),
        color: "#0ea5e9"
      },
      {
        type: "LINKEDIN_INMAIL_SENT",
        name: "LinkedIn InMail",
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
    historyEntries: needsFullData
      ? (isAllLoaded ? allEntries : historyEntries)
      : historyEntries,
    dataLoading,
    dataError,
    isDataReady: needsFullData ? isAllLoaded : isDataReady,
    loadedCount: needsFullData
      ? (isAllLoaded ? allEntries.length : loadedCount)
      : loadedCount,

    // TypeStats 
    optimizedTypeStats,
    traditionalTypeStats,

    // Status général
    isFullyLoaded: isStatsReady && (needsFullData ? isAllLoaded : isDataReady),
    hasErrors: !!statsError || !!dataError,

    // Helper pour déterminer quelle donnée utiliser
    shouldUseGlobalStats: (isFiltered: boolean) => !isFiltered && isStatsReady,

    // Méthode pour obtenir les bonnes typeStats selon le contexte
    getTypeStats: (isFiltered: boolean) => {
      return (!isFiltered && isStatsReady) ? optimizedTypeStats : traditionalTypeStats
    }
  }
}
