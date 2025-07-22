import { gql, useQuery } from '@apollo/client'
import type { HistoryEntry } from '../types/stats'

interface HistoryEntriesResponse {
  historyentries: HistoryEntry[]
}

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

export const useHistoryEntries = ({ shouldLoad = true, limit = 100, offset = 0 }) => {
  const { loading, error, data } = useQuery<HistoryEntriesResponse>(GET_HISTORY_ENTRIES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
    skip: !shouldLoad
  })

  const historyEntries = data?.historyentries || []

  return {
    loading,
    error,
    historyEntries,
    isDataReady: !loading && !error,
    loadedCount: historyEntries.length
  }
}
