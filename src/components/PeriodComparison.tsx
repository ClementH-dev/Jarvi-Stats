"use client"

import { useState, useMemo } from "react"
import type { HistoryEntry } from "../types/stats"

interface PeriodComparisonProps {
  historyEntries: HistoryEntry[]
}

export const PeriodComparison = ({ historyEntries }: PeriodComparisonProps) => {
  const [period1Start, setPeriod1Start] = useState<string>("")
  const [period1End, setPeriod1End] = useState<string>("")
  const [period2Start, setPeriod2Start] = useState<string>("")
  const [period2End, setPeriod2End] = useState<string>("")

  const period1Data = useMemo(() => {
    if (!period1Start && !period1End) return []
    const actualStartDate = new Date(period1Start || period1End)
    const actualEndDate = new Date(period1End || period1Start)

    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return historyEntries.filter((entry) => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= actualStartDate && entryDate <= actualEndDate
    })
  }, [historyEntries, period1Start, period1End])

  const period2Data = useMemo(() => {
    if (!period2Start && !period2End) return []
    const actualStartDate = new Date(period2Start || period2End)
    const actualEndDate = new Date(period2End || period2Start)

    actualStartDate.setHours(0, 0, 0, 0)
    actualEndDate.setHours(23, 59, 59, 999)

    return historyEntries.filter((entry) => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= actualStartDate && entryDate <= actualEndDate
    })
  }, [historyEntries, period2Start, period2End])

  const calculateStats = (entries: HistoryEntry[]) => {
    const totalMessages = entries.length
    const totalReplies = entries.filter((e) => e.triggerHasBeenRepliedTo).length
    const replyRate = totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 0

    return {
      totalMessages,
      totalReplies,
      replyRate,
    }
  }

  const stats1 = calculateStats(period1Data)
  const stats2 = calculateStats(period2Data)

  const getEvolutionIndicator = (value1: number, value2: number, isPercentage = false) => {
    if (value1 === 0 && value2 === 0)
      return { text: "Aucune donnée", color: "text-slate-500", symbol: "➖", bgColor: "bg-slate-50" }
    if (value1 === 0)
      return {
        text: `+${isPercentage ? value2.toFixed(1) + "%" : value2}`,
        color: "text-green-600",
        symbol: "📈",
        bgColor: "bg-green-50",
      }
    if (value2 === 0)
      return {
        text: `${isPercentage ? value1.toFixed(1) + "%" : value1}`,
        color: "text-red-600",
        symbol: "📉",
        bgColor: "bg-red-50",
      }

    const diff = value2 - value1
    const percentChange = (diff / value1) * 100

    if (diff > 0) {
      return {
        text: `+${isPercentage ? diff.toFixed(1) + "%" : diff} (+${percentChange.toFixed(1)}%)`,
        color: "text-green-600",
        symbol: "📈",
        bgColor: "bg-green-50",
      }
    } else if (diff < 0) {
      return {
        text: `${isPercentage ? diff.toFixed(1) + "%" : diff} (${percentChange.toFixed(1)}%)`,
        color: "text-red-600",
        symbol: "📉",
        bgColor: "bg-red-50",
      }
    }

    return { text: "Stable", color: "text-slate-600", symbol: "➖", bgColor: "bg-slate-50" }
  }

  const messageEvolution = getEvolutionIndicator(stats1.totalMessages, stats2.totalMessages)
  const replyEvolution = getEvolutionIndicator(stats1.totalReplies, stats2.totalReplies)
  const rateEvolution = getEvolutionIndicator(stats1.replyRate, stats2.replyRate, true)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const hasData = (period1Start || period1End) && (period2Start || period2End)

  // Raccourcis de périodes
  const setQuickPeriods = (type: "lastWeek" | "lastMonth" | "last3Months") => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (type) {
      case "lastWeek": {
        // Période 1: Semaine dernière
        const lastWeekStart = new Date(today)
        lastWeekStart.setDate(today.getDate() - 14)
        const lastWeekEnd = new Date(today)
        lastWeekEnd.setDate(today.getDate() - 8)

        // Période 2: Cette semaine
        const thisWeekStart = new Date(today)
        thisWeekStart.setDate(today.getDate() - 7)
        const thisWeekEnd = new Date(today)

        setPeriod1Start(lastWeekStart.toISOString().split("T")[0])
        setPeriod1End(lastWeekEnd.toISOString().split("T")[0])
        setPeriod2Start(thisWeekStart.toISOString().split("T")[0])
        setPeriod2End(thisWeekEnd.toISOString().split("T")[0])
        break
      }

      case "lastMonth": {
        // Période 1: Mois dernier
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Période 2: Ce mois
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisMonthEnd = new Date(today)

        setPeriod1Start(lastMonthStart.toISOString().split("T")[0])
        setPeriod1End(lastMonthEnd.toISOString().split("T")[0])
        setPeriod2Start(thisMonthStart.toISOString().split("T")[0])
        setPeriod2End(thisMonthEnd.toISOString().split("T")[0])
        break
      }

      case "last3Months": {
        // Période 1: Il y a 3-6 mois
        const period1StartDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        const period1EndDate = new Date(now.getFullYear(), now.getMonth() - 3, 0)

        // Période 2: 3 derniers mois
        const period2StartDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        const period2EndDate = new Date(today)

        setPeriod1Start(period1StartDate.toISOString().split("T")[0])
        setPeriod1End(period1EndDate.toISOString().split("T")[0])
        setPeriod2Start(period2StartDate.toISOString().split("T")[0])
        setPeriod2End(period2EndDate.toISOString().split("T")[0])
        break
      }
    }
  }

  const clearPeriods = () => {
    setPeriod1Start("")
    setPeriod1End("")
    setPeriod2Start("")
    setPeriod2End("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Comparaison de Périodes</h2>
        </div>
        <p className="text-slate-600">Analysez l'évolution de vos performances entre deux périodes</p>
      </div>

      {/* Raccourcis rapides */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-blue-800">Comparaisons rapides</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setQuickPeriods("lastWeek")}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            📅 Semaine dernière vs Cette semaine
          </button>
          <button
            onClick={() => setQuickPeriods("lastMonth")}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            📅 Mois dernier vs Ce mois
          </button>
          <button
            onClick={() => setQuickPeriods("last3Months")}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            📅 Trimestres (3-6 mois vs 0-3 mois)
          </button>
          <button
            onClick={clearPeriods}
            className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      {/* Sélection des périodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Période 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Période 1 (Référence)</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
              <input
                type="date"
                value={period1Start}
                max={period1End || undefined}
                onChange={(e) => setPeriod1Start(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
              <input
                type="date"
                value={period1End}
                min={period1Start || undefined}
                onChange={(e) => setPeriod1End(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
            {(period1Start || period1End) && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-800">
                  <strong>Période sélectionnée :</strong>
                  <br />
                  {formatDate(period1Start || period1End)} - {formatDate(period1End || period1Start)}
                </div>
                <div className="text-xs text-green-600 mt-1">{period1Data.length} messages dans cette période</div>
              </div>
            )}
          </div>
        </div>

        {/* Période 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Période 2 (Comparaison)</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
              <input
                type="date"
                value={period2Start}
                max={period2End || undefined}
                onChange={(e) => setPeriod2Start(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
              <input
                type="date"
                value={period2End}
                min={period2Start || undefined}
                onChange={(e) => setPeriod2End(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            {(period2Start || period2End) && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>Période sélectionnée :</strong>
                  <br />
                  {formatDate(period2Start || period2End)} - {formatDate(period2End || period2Start)}
                </div>
                <div className="text-xs text-blue-600 mt-1">{period2Data.length} messages dans cette période</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Résultats de la comparaison */}
      {hasData ? (
        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Messages totaux */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <span className="text-xl">📧</span>
                  </div>
                  <h4 className="font-semibold text-slate-800">Messages totaux</h4>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 1</span>
                  <span className="font-bold text-lg text-slate-900">{stats1.totalMessages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 2</span>
                  <span className="font-bold text-lg text-slate-900">{stats2.totalMessages.toLocaleString()}</span>
                </div>
                <div className={`p-3 rounded-lg ${messageEvolution.bgColor}`}>
                  <div className={`flex items-center space-x-2 ${messageEvolution.color}`}>
                    <span className="text-lg">{messageEvolution.symbol}</span>
                    <span className="font-medium text-sm">{messageEvolution.text}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Réponses totales */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <span className="text-xl">💬</span>
                  </div>
                  <h4 className="font-semibold text-slate-800">Réponses totales</h4>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 1</span>
                  <span className="font-bold text-lg text-slate-900">{stats1.totalReplies.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 2</span>
                  <span className="font-bold text-lg text-slate-900">{stats2.totalReplies.toLocaleString()}</span>
                </div>
                <div className={`p-3 rounded-lg ${replyEvolution.bgColor}`}>
                  <div className={`flex items-center space-x-2 ${replyEvolution.color}`}>
                    <span className="text-lg">{replyEvolution.symbol}</span>
                    <span className="font-medium text-sm">{replyEvolution.text}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Taux de réponse */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-slate-800">Taux de réponse</h4>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 1</span>
                  <span className="font-bold text-lg text-slate-900">{stats1.replyRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Période 2</span>
                  <span className="font-bold text-lg text-slate-900">{stats2.replyRate.toFixed(1)}%</span>
                </div>
                <div className={`p-3 rounded-lg ${rateEvolution.bgColor}`}>
                  <div className={`flex items-center space-x-2 ${rateEvolution.color}`}>
                    <span className="text-lg">{rateEvolution.symbol}</span>
                    <span className="font-medium text-sm">{rateEvolution.text}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse détaillée */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-slate-200 rounded-lg">
                <span className="text-xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Analyse détaillée</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">
                    {stats2.replyRate > stats1.replyRate ? "✅" : stats2.replyRate < stats1.replyRate ? "❌" : "➖"}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800">Performance globale</p>
                    <p className="text-sm text-slate-600">
                      Le taux de réponse a{" "}
                      <span
                        className={
                          stats2.replyRate > stats1.replyRate
                            ? "text-green-600 font-medium"
                            : stats2.replyRate < stats1.replyRate
                              ? "text-red-600 font-medium"
                              : "text-slate-600 font-medium"
                        }
                      >
                        {stats2.replyRate > stats1.replyRate
                          ? "augmenté"
                          : stats2.replyRate < stats1.replyRate
                            ? "diminué"
                            : "stagné"}
                      </span>{" "}
                      entre les deux périodes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-medium text-slate-800">Volume d'activité</p>
                    <p className="text-sm text-slate-600">
                      Volume{" "}
                      <span
                        className={
                          stats2.totalMessages > stats1.totalMessages
                            ? "text-blue-600 font-medium"
                            : stats2.totalMessages < stats1.totalMessages
                              ? "text-orange-600 font-medium"
                              : "text-slate-600 font-medium"
                        }
                      >
                        {stats2.totalMessages > stats1.totalMessages
                          ? "en hausse"
                          : stats2.totalMessages < stats1.totalMessages
                            ? "en baisse"
                            : "stable"}
                      </span>{" "}
                      ({Math.abs(stats2.totalMessages - stats1.totalMessages).toLocaleString()} messages de différence)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-8 text-center">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Prêt pour la comparaison ?</h3>
          <p className="text-yellow-700">
            Sélectionnez deux périodes pour analyser l'évolution de vos performances et identifier les tendances.
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Utilisez les raccourcis rapides ci-dessus ou définissez vos propres périodes personnalisées.
          </p>
        </div>
      )}
    </div>
  )
}
