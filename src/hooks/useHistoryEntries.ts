import { gql, useQuery } from '@apollo/client'
import type { HistoryEntry } from '../types/stats'

interface OptimizedHistoryEntriesResponse {
  historyentries: HistoryEntry[]
}

const GET_HISTORY_ENTRIES = gql`
  query GetHistoryEntries {
    # Données complètes pour stats précises
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

export const useHistoryEntries = () => {
  const { loading, error, data } = useQuery<OptimizedHistoryEntriesResponse>(GET_HISTORY_ENTRIES)
  
  const historyEntries = data?.historyentries || []
  
  // Calculs rapides côté React
  const emailEntries = historyEntries.filter(entry => entry.type === 'EMAIL_SENT')
  const linkedinMessageEntries = historyEntries.filter(entry => entry.type === 'LINKEDIN_MESSAGE_SENT')
  const linkedinInmailEntries = historyEntries.filter(entry => entry.type === 'LINKEDIN_INMAIL_SENT')
  
  const globalStats = {
    totalMessages: historyEntries.length, // Utilise les données réelles chargées
    
    emailStats: {
      sent: emailEntries.length,
      replied: emailEntries.filter(entry => entry.triggerHasBeenRepliedTo).length,
      responseRate: emailEntries.length 
        ? ((emailEntries.filter(entry => entry.triggerHasBeenRepliedTo).length / emailEntries.length) * 100).toFixed(1)
        : '0'
    },
    
    linkedinMessageStats: {
      sent: linkedinMessageEntries.length,
      replied: linkedinMessageEntries.filter(entry => entry.triggerHasBeenRepliedTo).length,
      responseRate: linkedinMessageEntries.length 
        ? ((linkedinMessageEntries.filter(entry => entry.triggerHasBeenRepliedTo).length / linkedinMessageEntries.length) * 100).toFixed(1)
        : '0'
    },
    
    linkedinInmailStats: {
      sent: linkedinInmailEntries.length,
      replied: linkedinInmailEntries.filter(entry => entry.triggerHasBeenRepliedTo).length,
      responseRate: linkedinInmailEntries.length 
        ? ((linkedinInmailEntries.filter(entry => entry.triggerHasBeenRepliedTo).length / linkedinInmailEntries.length) * 100).toFixed(1)
        : '0'
    }
  }
  
  return {
    loading,
    error,
    historyEntries,
    globalStats
  }
}
