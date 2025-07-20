"use client"

import { useState } from "react"
import { PerformanceChart } from "./PerformanceChart"
import { WeeklyStatsTable } from "./WeeklyStatsTable"
import { GlobalSummary } from "./GlobalSummary"
import { DateRangeFilter } from "./DateRangeFilter"
import { PeriodComparison } from "./PeriodComparison"
import { useHistoryEntries } from "../hooks/useHistoryEntries"
import { useWeeklyStats } from "../hooks/useWeeklyStats"
import { useTypeStats } from "../hooks/useTypeStats"
import { useDateFilter } from "../hooks/useDateFilter"

type TabType = "summary" | "chart" | "table" | "comparison"

export const HistoryEntries = () => {
  const [activeTab, setActiveTab] = useState<TabType>("summary")
  const { loading, error, historyEntries } = useHistoryEntries()
  
  // Garde les hooks mais évite les recalculs inutiles
  const weeklyStats = useWeeklyStats(historyEntries)
  const { filteredWeeklyStats, filteredHistoryEntries, filterInfo, handleFilterChange } = useDateFilter(
    weeklyStats,
    historyEntries,
  )

  const filteredTypeStats = useTypeStats(filteredHistoryEntries || historyEntries)

  const tabs = [
    { id: "summary" as TabType, label: "Résumé Global", icon: "📊" },
    { id: "chart" as TabType, label: "Performance", icon: "📈" },
    { id: "table" as TabType, label: "Tableau Hebdo", icon: "📋" },
    { id: "comparison" as TabType, label: "Comparaison", icon: "⚖️" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">❌</div>
        <p className="text-red-800 font-medium">Erreur : {error.message}</p>
      </div>
    )
  }

  if (!historyEntries) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 text-4xl mb-4">📭</div>
        <p className="text-yellow-800 font-medium">Aucune donnée disponible</p>
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
                historyEntries={filteredHistoryEntries || historyEntries}
                typeStats={filteredTypeStats}
                weeklyStats={filteredWeeklyStats}
                filterInfo={filterInfo}
              />
            </div>
          )}

          {activeTab === "chart" && (
            <div className="animate-fadeIn">
              <PerformanceChart typeStats={filteredTypeStats} />
            </div>
          )}

          {activeTab === "table" && (
            <div className="animate-fadeIn">
              <WeeklyStatsTable weeklyStats={filteredWeeklyStats} typeStats={filteredTypeStats} />
            </div>
          )}

          {activeTab === "comparison" && (
            <div className="animate-fadeIn">
              <PeriodComparison historyEntries={historyEntries} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
