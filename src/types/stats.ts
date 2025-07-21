export type HistoryEntry = {
  id: string
  createdAt: string
  type: string
  isRead: boolean | null
  triggerHasBeenRepliedTo: boolean | null
  userId: string
}

export type GetHistoryEntriesResponse = {
  historyentries: HistoryEntry[]
}

export type WeeklyStats = {
  week: string
  weekStart: Date
  weekEnd: Date
  total: number
  replied: number
  replyRate: number
  byType: Record<string, { total: number; replied: number; replyRate: number }>
}

export type TypeStats = {
  type: string
  name: string
  total: number
  replied: number
  replyRate: number
  color: string
}
