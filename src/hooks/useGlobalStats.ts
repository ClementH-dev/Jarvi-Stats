import { gql, useQuery } from '@apollo/client'

interface GlobalStatsResponse {
  stats_aggregate: {
    aggregate: {
      count: number
    }
    nodes: Array<{
      type: string
      triggerHasBeenRepliedTo: boolean
    }>
  }
}

const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    # Seulement l'agrégation pour les stats - ultra rapide !
    stats_aggregate: historyentries_aggregate(
      where: {
        userId: {_eq: "32ca93da-0cf6-4608-91e7-bc6a2dbedcd1"}
        type: { _in: ["EMAIL_SENT", "LINKEDIN_MESSAGE_SENT", "LINKEDIN_INMAIL_SENT"] }
      }
    ) {
      aggregate {
        count
      }
      nodes {
        type
        triggerHasBeenRepliedTo
      }
    }
  }
`

export const useGlobalStats = () => {
  const { loading, error, data } = useQuery<GlobalStatsResponse>(GET_GLOBAL_STATS, {
    fetchPolicy: 'cache-first',
    // Pas de polling
    notifyOnNetworkStatusChange: false,
  })
  
  const statsNodes = data?.stats_aggregate?.nodes || []
  const totalMessages = data?.stats_aggregate?.aggregate?.count || 0
  
  // Calculs optimisés avec une seule itération
  const stats = statsNodes.reduce((acc, node) => {
    if (node.type === 'EMAIL_SENT') {
      acc.emailSent++
      if (node.triggerHasBeenRepliedTo) acc.emailReplied++
    } else if (node.type === 'LINKEDIN_MESSAGE_SENT') {
      acc.linkedinMessageSent++
      if (node.triggerHasBeenRepliedTo) acc.linkedinMessageReplied++
    } else if (node.type === 'LINKEDIN_INMAIL_SENT') {
      acc.linkedinInmailSent++
      if (node.triggerHasBeenRepliedTo) acc.linkedinInmailReplied++
    }
    return acc
  }, {
    emailSent: 0,
    emailReplied: 0,
    linkedinMessageSent: 0,
    linkedinMessageReplied: 0,
    linkedinInmailSent: 0,
    linkedinInmailReplied: 0
  })
  
  const globalStats = {
    totalMessages,
    
    emailStats: {
      sent: stats.emailSent,
      replied: stats.emailReplied,
      responseRate: stats.emailSent > 0 
        ? ((stats.emailReplied / stats.emailSent) * 100).toFixed(1)
        : '0'
    },
    
    linkedinMessageStats: {
      sent: stats.linkedinMessageSent,
      replied: stats.linkedinMessageReplied,
      responseRate: stats.linkedinMessageSent > 0 
        ? ((stats.linkedinMessageReplied / stats.linkedinMessageSent) * 100).toFixed(1)
        : '0'
    },
    
    linkedinInmailStats: {
      sent: stats.linkedinInmailSent,
      replied: stats.linkedinInmailReplied,
      responseRate: stats.linkedinInmailSent > 0 
        ? ((stats.linkedinInmailReplied / stats.linkedinInmailSent) * 100).toFixed(1)
        : '0'
    }
  }
  
  return {
    loading,
    error,
    globalStats,
    // Indicateur pour savoir si les stats sont chargées
    isStatsReady: !loading && !error
  }
}
