import { gql, useQuery } from '@apollo/client'
import type { HistoryEntry } from '../types/stats'

interface HistoryEntriesResponse {
  historyentries: HistoryEntry[]
}

const GET_HISTORY_ENTRIES = gql`
  query GetHistoryEntries {
    # Toutes les données pour l'affichage et les filtres - chargement en arrière-plan
    historyentries(
      where: {
        userId: {_eq: "32ca93da-0cf6-4608-91e7-bc6a2dbedcd1"}
        type: { _in: ["EMAIL_SENT", "LINKEDIN_MESSAGE_SENT", "LINKEDIN_INMAIL_SENT"] }
      }
      order_by: {createdAt: desc}
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

export const useHistoryEntries = (shouldLoad = true) => {
  const { loading, error, data } = useQuery<HistoryEntriesResponse>(GET_HISTORY_ENTRIES, {
    // Cache
    fetchPolicy: 'cache-first',
    // Ne pas notifier les changements de statut 
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
    // Chargement conditionnel
    skip: !shouldLoad
  })
  
  const historyEntries = data?.historyentries || []
  
  return {
    loading,
    error,
    historyEntries,
    // Indicateur pour savoir si les données complètes sont prêtes
    isDataReady: !loading && !error,
    // Nombre d'entrées chargées pour debug/info
    loadedCount: historyEntries.length
  }
}
