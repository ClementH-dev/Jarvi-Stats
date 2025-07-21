"use client"

import { useState, useMemo } from "react"
import { PerformanceChart } from "./PerformanceChart"
import { WeeklyStatsTable } from "./WeeklyStatsTable"
import { GlobalSummary } from "./GlobalSummary"
import { DateRangeFilter } from "./DateRangeFilter"
import { PeriodComparison } from "./PeriodComparison"
import { useOptimizedData } from "../hooks/useOptimizedData"
import { useWeeklyStats } from "../hooks/useWeeklyStats"
import { useDateFilter } from "../hooks/useDateFilter"
import { useTypeStats } from "../hooks/useTypeStats"

type TabType = "summary" | "chart" | "table" | "comparison"

export const HistoryEntries = () => {
  const [activeTab, setActiveTab] = useState<TabType>("summary")
  
  // Hook ude chargement de donnée
  const {
    globalStats,
    historyEntries,
    statsLoading,
    dataLoading,
    statsError,
    dataError,
    isStatsReady,
    getTypeStats,
    shouldUseGlobalStats
  } = useOptimizedData(true)
  
  // éviter les recalculs coûteux avec des données vides
  const safeHistoryEntries = historyEntries || []
  const weeklyStats = useWeeklyStats(safeHistoryEntries)
  const { filteredWeeklyStats, filteredHistoryEntries, filterInfo, handleFilterChange } = useDateFilter(
    weeklyStats,
    safeHistoryEntries,
  )

  // Calcul des TypeStats
  const globalTypeStats = useMemo(() => getTypeStats(false), [getTypeStats])
  const filteredTypeStats = useTypeStats(filteredHistoryEntries || [])

  const tabs = [
    { id: "summary" as TabType, label: "Résumé Global", icon: "📊" },
    { id: "chart" as TabType, label: "Performance", icon: "📈" },
    { id: "table" as TabType, label: "Tableau Hebdo", icon: "📋" },
    { id: "comparison" as TabType, label: "Comparaison", icon: "⚖️" },
  ]
  
  const isFiltered = useMemo(() => filterInfo?.isFiltered || false, [filterInfo?.isFiltered])
  const useGlobalData = useMemo(() => shouldUseGlobalStats(isFiltered), [shouldUseGlobalStats, isFiltered])
  
  const typeStats = useMemo(() => {
    if (!isFiltered && isStatsReady) {
      // Pas de filtre : utiliser les stats globales optimisées
      return globalTypeStats
    } else {
      // Filtre actif : utiliser les stats calculées sur les données filtrées
      return filteredTypeStats
    }
  }, [isFiltered, isStatsReady, globalTypeStats, filteredTypeStats])

  // Gestion des erreurs
  if (statsError || dataError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">❌</div>
        <p className="text-red-800 font-medium">Erreur : {(statsError || dataError)?.message}</p>
      </div>
    )
  }

  // Loader principal seulement si même les stats rapides ne sont pas prêtes
  if (!isStatsReady && statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Statistiques d'Approche - Jarvi</h1>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <DateRangeFilter onFilterChange={handleFilterChange} />

        {filterInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="font-medium text-blue-900">Période filtrée :</span>
                <span className="ml-2 text-blue-700">
                  {filterInfo.startDateFormatted} → {filterInfo.endDateFormatted}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-blue-900">Semaines affichées :</span>
                <span className="ml-2 text-blue-700 font-semibold">{filterInfo.totalWeeks}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "summary" && (
            <div className="animate-fadeIn">
              <GlobalSummary
                typeStats={typeStats}
                weeklyStats={filteredWeeklyStats}
                filterInfo={filterInfo}
                globalStats={globalStats}
                historyEntries={filteredHistoryEntries || historyEntries}
              />
            </div>
          )}

          {activeTab === "chart" && (
            <div className="animate-fadeIn">
              {/* Performance Chart peut utiliser les données agrégées directement */}
              {!useGlobalData && dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Chargement des données pour le graphique...</p>
                </div>
              ) : (
                <PerformanceChart typeStats={typeStats} />
              )}
            </div>
          )}

          {activeTab === "table" && (
            <div className="animate-fadeIn">
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Chargement des données du tableau...</p>
                </div>
              ) : (
                <WeeklyStatsTable weeklyStats={filteredWeeklyStats} typeStats={typeStats} />
              )}
            </div>
          )}

          {activeTab === "comparison" && (
            <div className="animate-fadeIn">
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Chargement des données de comparaison...</p>
                </div>
              ) : (
                <PeriodComparison historyEntries={historyEntries} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
