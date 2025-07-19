"use client"

import { useEffect, useState } from "react"
import type { TypeStats } from "../types/stats"

interface PerformanceChartProps {
  typeStats: TypeStats[]
}

export const PerformanceChart = ({ typeStats }: PerformanceChartProps) => {
  const [animatedStats, setAnimatedStats] = useState<TypeStats[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("📊 Stats par type pour le graphique:", typeStats)

    // Animation d'entrée
    setIsVisible(true)
    const timer = setTimeout(() => {
      setAnimatedStats(typeStats)
    }, 300)

    return () => clearTimeout(timer)
  }, [typeStats])

  const maxRate = Math.max(...typeStats.map((d) => d.replyRate), 1)
  const totalMessages = typeStats.reduce((sum, item) => sum + item.total, 0)
  const totalReplies = typeStats.reduce((sum, item) => sum + item.replied, 0)
  const averageRate = totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 0

  // Couleurs LinkedIn-style
  const getBarColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600", // LinkedIn blue
      "from-green-500 to-green-600", // Success green
      "from-purple-500 to-purple-600", // Premium purple
      "from-orange-500 to-orange-600", // Warning orange
      "from-red-500 to-red-600", // Alert red
      "from-indigo-500 to-indigo-600", // Deep blue
      "from-teal-500 to-teal-600", // Teal
      "from-pink-500 to-pink-600", // Pink
    ]
    return colors[index % colors.length]
  }

  const getPerformanceLevel = (rate: number) => {
    if (rate >= 70) return { label: "Excellent", color: "text-green-600", bg: "bg-green-50" }
    if (rate >= 50) return { label: "Très bon", color: "text-blue-600", bg: "bg-blue-50" }
    if (rate >= 30) return { label: "Bon", color: "text-yellow-600", bg: "bg-yellow-50" }
    if (rate >= 15) return { label: "Moyen", color: "text-orange-600", bg: "bg-orange-50" }
    return { label: "Faible", color: "text-red-600", bg: "bg-red-50" }
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Performance par Type de Message</h2>
        </div>
        <p className="text-slate-600">Analyse comparative des taux de réponse par méthode d'approche</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{typeStats.length}</div>
          <div className="text-sm text-slate-600">Méthodes analysées</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{averageRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-600">Taux moyen</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalMessages.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Messages totaux</div>
        </div>
      </div>

      {/* Chart principal */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="space-y-4">
          {typeStats.map((item, index) => {
            const performance = getPerformanceLevel(item.replyRate)
            const animatedRate = animatedStats.find((stat) => stat.type === item.type)?.replyRate || 0

            return (
              <div key={item.type} className="group hover:bg-slate-50 rounded-lg p-4 transition-all duration-200">
                {/* Header de la barre */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${getBarColor(index)}`}
                      ></div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">{item.type}</h3>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}
                    >
                      {performance.label}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{item.replyRate.toFixed(1)}%</div>
                    <div className="text-xs text-slate-500">
                      {item.replied}/{item.total}
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getBarColor(index)} transition-all duration-1000 ease-out relative`}
                      style={{
                        width: `${(animatedRate / maxRate) * 100}%`,
                      }}
                    >
                      {/* Effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Ligne de référence pour la moyenne */}
                  {averageRate > 0 && (
                    <div
                      className="absolute top-0 h-3 w-0.5 bg-slate-400 opacity-60"
                      style={{ left: `${(averageRate / maxRate) * 100}%` }}
                      title={`Moyenne: ${averageRate.toFixed(1)}%`}
                    >
                      <div className="absolute -top-6 -left-8 text-xs text-slate-500 font-medium">Moy.</div>
                    </div>
                  )}
                </div>

                {/* Détails supplémentaires */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-600">
                      <span className="font-medium text-green-600">{item.replied}</span> réponses
                    </span>
                    <span className="text-slate-600">
                      <span className="font-medium text-blue-600">{item.total}</span> envoyés
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.replyRate > averageRate ? (
                      <span className="text-green-600 text-xs">↗️ +{(item.replyRate - averageRate).toFixed(1)}%</span>
                    ) : item.replyRate < averageRate ? (
                      <span className="text-red-600 text-xs">↘️ -{(averageRate - item.replyRate).toFixed(1)}%</span>
                    ) : (
                      <span className="text-slate-500 text-xs">→ Moyenne</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performer */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">🏆</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Meilleure Performance</h3>
          </div>
          {typeStats.length > 0 && (
            <div className="space-y-2">
              <p className="text-xl font-bold text-green-900">{typeStats[0].type}</p>
              <p className="text-green-700">
                <span className="font-semibold">{typeStats[0].replyRate.toFixed(1)}%</span> de taux de réponse
              </p>
              <p className="text-sm text-green-600">
                {typeStats[0].replied} réponses sur {typeStats[0].total} messages
              </p>
            </div>
          )}
        </div>

        {/* Opportunité d'amélioration */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-800">Potentiel d'Optimisation</h3>
          </div>
          {typeStats.length > 0 && (
            <div className="space-y-2">
              <p className="text-xl font-bold text-blue-900">{typeStats[typeStats.length - 1].type}</p>
              <p className="text-blue-700">
                Potentiel de{" "}
                <span className="font-semibold">
                  +{(typeStats[0].replyRate - typeStats[typeStats.length - 1].replyRate).toFixed(1)}%
                </span>
              </p>
              <p className="text-sm text-blue-600">En appliquant les meilleures pratiques</p>
            </div>
          )}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span>Ligne de moyenne</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">↗️</span>
            <span>Au-dessus de la moyenne</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-600">↘️</span>
            <span>En-dessous de la moyenne</span>
          </div>
        </div>
      </div>
    </div>
  )
}
