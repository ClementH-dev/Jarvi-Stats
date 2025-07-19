import { gql, useQuery } from '@apollo/client'
import type { GetHistoryEntriesResponse } from '../types/stats'

const GET_HISTORY_ENTRIES = gql`
  query GetHistoryEntries {
    historyentries(
      where: {userId: {_eq: "32ca93da-0cf6-4608-91e7-bc6a2dbedcd1"}}
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
  const { loading, error, data } = useQuery<GetHistoryEntriesResponse>(GET_HISTORY_ENTRIES)
  
  return {
    loading,
    error,
    historyEntries: data?.historyentries
  }
}
