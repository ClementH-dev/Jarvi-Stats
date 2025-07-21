"use client"

import type { HistoryEntry, WeeklyStats, TypeStats } from "../types/stats"
import { MetricCard } from "./MetricCard"

interface GlobalSummaryProps {
  typeStats: TypeStats[]
  weeklyStats: WeeklyStats[]
  filterInfo?: {
    startWeekNumber?: string
    endWeekNumber?: string
    isSingleWeek?: boolean
    isFiltered: boolean
    startDateFormatted?: string
    endDateFormatted?: string
    isSingleDate?: boolean
  } | null
  // Props pour l'optimisation
  globalStats?: {
    totalMessages: number
    emailStats: { sent: number; replied: number; responseRate: string }
    linkedinMessageStats: { sent: number; replied: number; responseRate: string }
    linkedinInmailStats: { sent: number; replied: number; responseRate: string }
  }
  historyEntries?: HistoryEntry[] // Pour les filtres
}

export const GlobalSummary = ({ typeStats, weeklyStats, filterInfo, globalStats, historyEntries }: GlobalSummaryProps) => {
  // Donnée filtrée
  const shouldUseGlobalStats = !filterInfo?.isFiltered
  
  const actualHistoryEntries = historyEntries || []
  
  // Protection contre globalStats undefined
  if (shouldUseGlobalStats && !globalStats) {
    return <div className="text-center p-8">⏳ Chargement des statistiques...</div>
  }
  
  const totalMessages = shouldUseGlobalStats ? globalStats!.totalMessages : actualHistoryEntries.length
  
  const totalReplies = shouldUseGlobalStats 
    ? (globalStats!.emailStats.replied + globalStats!.linkedinMessageStats.replied + globalStats!.linkedinInmailStats.replied)
    : actualHistoryEntries.filter((e) => e.triggerHasBeenRepliedTo).length
    
  const globalReplyRate = shouldUseGlobalStats
    ? totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 0
    : actualHistoryEntries.length > 0 ? (totalReplies / actualHistoryEntries.length) * 100 : 0
  
  const bestMethod = typeStats[0]?.type || "N/A"
  const bestMethodRate = typeStats[0]?.replyRate || 0
  const worstMethod = typeStats[typeStats.length - 1]?.type || "N/A"
  const worstMethodRate = typeStats[typeStats.length - 1]?.replyRate || 0

  const globalSummaryData = {
    weeksAnalyzed: shouldUseGlobalStats ? "Toutes" : weeklyStats.length,
  }

  // Générer le titre dynamique
  const getTitle = () => {
    if (!filterInfo?.isFiltered) {
      return "Résumé global"
    }

    // Utiliser les dates formatées si disponibles
    if (filterInfo.startDateFormatted) {
      if (filterInfo.isSingleDate) {
        return `Résumé du ${filterInfo.startDateFormatted}`
      }
      return `Résumé du ${filterInfo.startDateFormatted} au ${filterInfo.endDateFormatted}`
    }

    // Fallback sur les semaines
    if (filterInfo.isSingleWeek) {
      return `Résumé Semaine ${filterInfo.startWeekNumber}`
    }

    return `Résumé Semaines ${filterInfo.startWeekNumber} - ${filterInfo.endWeekNumber}`
  }

  // Calculer les tendances
  const getTrendIcon = (rate: number) => {
    if (rate >= 70) return { icon: "📈", color: "text-green-600", bg: "bg-green-50" }
    if (rate >= 40) return { icon: "📊", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { icon: "📉", color: "text-red-600", bg: "bg-red-50" }
  }

  const replyTrend = getTrendIcon(globalReplyRate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{getTitle()}</h2>
        <p className="text-slate-600">Analyse des performances d'approche</p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Messages totaux */}
        <MetricCard
          title="Messages envoyés"
          value={totalMessages.toLocaleString()}
          icon="📧"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          subtitle="Total des approches"
        />

        {/* Réponses totales */}
        <MetricCard
          title="Réponses reçues"
          value={totalReplies.toLocaleString()}
          icon="💬"
          iconBg="bg-green-50"
          iconColor="text-green-600"
          subtitle="Interactions positives"
        />

        {/* Taux de réponse global */}
        <MetricCard
          title="Taux de réponse"
          value={`${globalReplyRate.toFixed(1)}%`}
          icon={replyTrend.icon}
          iconBg={replyTrend.bg}
          iconColor={replyTrend.color}
          subtitle="Performance globale"
          trend={globalReplyRate >= 50 ? "positive" : globalReplyRate >= 30 ? "neutral" : "negative"}
        />

        {/* Semaines analysées */}
        <MetricCard
          title="Période d'analyse"
          value={globalSummaryData.weeksAnalyzed.toString()}
          icon="📅"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          subtitle="Semaines de données"
        />
      </div>

      {/* Analyse des méthodes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Analyse comparative des méthodes</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meilleure méthode */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span className="font-medium text-green-800">Méthode la plus performante</span>
              </div>
              <div className="px-2 py-1 bg-green-100 rounded-full">
                <span className="text-xs font-medium text-green-700">TOP</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-green-900">{bestMethod}</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(bestMethodRate, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-green-700">{bestMethodRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Méthode à améliorer */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="font-medium text-orange-800">Méthode à optimiser</span>
              </div>
              <div className="px-2 py-1 bg-orange-100 rounded-full">
                <span className="text-xs font-medium text-orange-700">À AMÉLIORER</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-orange-900">{worstMethod}</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(worstMethodRate, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-orange-700">{worstMethodRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Écart de performance */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <span className="font-medium text-slate-700">Écart de performance</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">{(bestMethodRate - worstMethodRate).toFixed(1)}</span>
              <span className="text-slate-600 ml-1">%</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2">Différence entre la méthode la plus et la moins performante</p>
        </div>
      </div>
    </div>
  )
}