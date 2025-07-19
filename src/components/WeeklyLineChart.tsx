"use client"

import { useState } from "react"
import type { WeeklyStats, TypeStats } from "../types/stats"

interface WeeklyLineChartProps {
  weeklyStats: WeeklyStats[]
  typeStats: TypeStats[]
}

export const WeeklyLineChart = ({ weeklyStats, typeStats }: WeeklyLineChartProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["replyRate"])
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null)

  // Couleurs pour les différentes métriques
  const colors = {
    replyRate: { line: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", dot: "#3b82f6" },
    total: { line: "#10b981", bg: "rgba(16, 185, 129, 0.1)", dot: "#10b981" },
    replied: { line: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", dot: "#f59e0b" },
  }

  // Couleurs pour les types
  const typeColors = [
    { line: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)", dot: "#8b5cf6" },
    { line: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", dot: "#ef4444" },
    { line: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)", dot: "#06b6d4" },
    { line: "#84cc16", bg: "rgba(132, 204, 22, 0.1)", dot: "#84cc16" },
    { line: "#f97316", bg: "rgba(249, 115, 22, 0.1)", dot: "#f97316" },
  ]

  const margin = { top: 20, right: 20, bottom: 50, left: 50 }

  // Calcul des échelles
  const maxReplyRate = Math.max(...weeklyStats.map((w) => w.replyRate), 100)
  const maxTotal = Math.max(...weeklyStats.map((w) => w.total), 1)
  const maxReplied = Math.max(...weeklyStats.map((w) => w.replied), 1)

  // Fonction pour obtenir la valeur Y selon la métrique
  const getYValue = (week: WeeklyStats, metric: string, chartHeight: number) => {
    switch (metric) {
      case "replyRate":
        return (chartHeight * (maxReplyRate - week.replyRate)) / maxReplyRate
      case "total":
        return (chartHeight * (maxTotal - week.total)) / maxTotal
      case "replied":
        return (chartHeight * (maxReplied - week.replied)) / maxReplied
      default: {
        // Pour les types
        const typeData = week.byType[metric]
        return typeData ? (chartHeight * (100 - typeData.replyRate)) / 100 : chartHeight
      }
    }
  }

  // Fonction pour créer le path SVG
  const createPath = (metric: string, chartWidth: number, chartHeight: number) => {
    if (weeklyStats.length === 0) return ""

    const points = weeklyStats.map((week, index) => {
      const x = (index * chartWidth) / Math.max(weeklyStats.length - 1, 1)
      const y = getYValue(week, metric, chartHeight)
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  // Fonction pour créer l'area path
  const createAreaPath = (metric: string, chartWidth: number, chartHeight: number) => {
    if (weeklyStats.length === 0) return ""

    const points = weeklyStats.map((week, index) => {
      const x = (index * chartWidth) / Math.max(weeklyStats.length - 1, 1)
      const y = getYValue(week, metric, chartHeight)
      return { x, y }
    })

    const pathData = points.map((point, index) => (index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`))

    return `${pathData.join(" ")} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`
  }

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm font-medium text-slate-700">Métriques principales :</span>
          </div>
          {[
            { key: "replyRate", label: "Taux de réponse (%)", color: colors.replyRate.line },
            { key: "total", label: "Messages envoyés", color: colors.total.line },
            { key: "replied", label: "Réponses reçues", color: colors.replied.line },
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedMetrics.includes(metric.key)
                  ? "bg-white border-2 shadow-sm"
                  : "bg-slate-100 border-2 border-transparent hover:bg-slate-200"
              }`}
              style={{
                borderColor: selectedMetrics.includes(metric.key) ? metric.color : "transparent",
                color: selectedMetrics.includes(metric.key) ? metric.color : "#64748b",
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }}></div>
              <span>{metric.label}</span>
            </button>
          ))}
        </div>

        {/* Types */}
        {typeStats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-sm font-medium text-slate-700">Types de messages :</span>
            </div>
            {typeStats.map((type, index) => {
              const color = typeColors[index % typeColors.length]
              return (
                <button
                  key={type.type}
                  onClick={() => toggleMetric(type.type)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedMetrics.includes(type.type)
                      ? "bg-white border-2 shadow-sm"
                      : "bg-slate-100 border-2 border-transparent hover:bg-slate-200"
                  }`}
                  style={{
                    borderColor: selectedMetrics.includes(type.type) ? color.line : "transparent",
                    color: selectedMetrics.includes(type.type) ? color.line : "#64748b",
                  }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.line }}></div>
                  <span>{type.type}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 relative">
        <div className="w-full" style={{ minHeight: '500px' }}>
          <svg
            width="100%"
            height="500"
            viewBox={`0 0 1000 500`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {selectedMetrics.map((metric) => {
                const color =
                  metric === "replyRate" || metric === "total" || metric === "replied"
                    ? colors[metric as keyof typeof colors]
                    : typeColors[typeStats.findIndex((t) => t.type === metric) % typeColors.length]

                return (
                  <linearGradient key={`gradient-${metric}`} id={`gradient-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color.line} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color.line} stopOpacity="0.05" />
                  </linearGradient>
                )
              })}
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {(() => {
                const chartWidth = 1000 - margin.left - margin.right
                const chartHeight = 500 - margin.top - margin.bottom

                return (
                  <>
                    {/* Grille */}
                    <g className="opacity-20">
                      {[0, 25, 50, 75, 100].map((value) => {
                        const y = (chartHeight * (100 - value)) / 100
                        return (
                          <g key={value}>
                            <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#94a3b8" strokeWidth={1} />
                            <text x={-10} y={y + 4} textAnchor="end" className="text-xs fill-slate-500">
                              {value}%
                            </text>
                          </g>
                        )
                      })}
                    </g>

                    {/* Lignes des métriques */}
                    {selectedMetrics.map((metric) => {
                      const color =
                        metric === "replyRate" || metric === "total" || metric === "replied"
                          ? colors[metric as keyof typeof colors]
                          : typeColors[typeStats.findIndex((t) => t.type === metric) % typeColors.length]

                      return (
                        <g key={metric}>
                          {/* Area */}
                          <path
                            d={createAreaPath(metric, chartWidth, chartHeight)}
                            fill={`url(#gradient-${metric})`}
                            className="opacity-30"
                          />
                          {/* Line */}
                          <path
                            d={createPath(metric, chartWidth, chartHeight)}
                            fill="none"
                            stroke={color.line}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-sm"
                          />
                          {/* Points */}
                          {weeklyStats.map((week, index) => {
                            const x = (index * chartWidth) / Math.max(weeklyStats.length - 1, 1)
                            const y = getYValue(week, metric, chartHeight)
                            return (
                              <circle
                                key={`${metric}-${index}`}
                                cx={x}
                                cy={y}
                                r={hoveredWeek === week.week ? 5 : 3}
                                fill="white"
                                stroke={color.line}
                                strokeWidth={2}
                                className="transition-all duration-200 cursor-pointer drop-shadow-sm"
                                onMouseEnter={() => setHoveredWeek(week.week)}
                                onMouseLeave={() => setHoveredWeek(null)}
                              />
                            )
                          })}
                        </g>
                      )
                    })}

                    {/* Axe X */}
                    <g transform={`translate(0, ${chartHeight})`}>
                      <line x1={0} y1={0} x2={chartWidth} y2={0} stroke="#94a3b8" strokeWidth={1} />
                      {weeklyStats.map((week, index) => {
                        const x = (index * chartWidth) / Math.max(weeklyStats.length - 1, 1)
                        const showLabel = index % Math.max(Math.ceil(weeklyStats.length / 6), 1) === 0 || index === weeklyStats.length - 1
                        return (
                          <g key={index}>
                            <line x1={x} y1={0} x2={x} y2={5} stroke="#94a3b8" strokeWidth={1} />
                            {showLabel && (
                              <text
                                x={x}
                                y={18}
                                textAnchor="middle"
                                className="text-xs fill-slate-600"
                              >
                                {week.week}
                              </text>
                            )}
                          </g>
                        )
                      })}
                    </g>
                  </>
                )
              })()}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredWeek && (
            <div className="absolute bg-white border border-slate-200 rounded-lg shadow-lg p-3 pointer-events-none z-10 top-4 right-4">
              <div className="font-medium text-slate-900 mb-2">Semaine {hoveredWeek}</div>
              {selectedMetrics.map((metric) => {
                const week = weeklyStats.find((w) => w.week === hoveredWeek)
                if (!week) return null

                const color =
                  metric === "replyRate" || metric === "total" || metric === "replied"
                    ? colors[metric as keyof typeof colors]
                    : typeColors[typeStats.findIndex((t) => t.type === metric) % typeColors.length]

                let value = ""
                switch (metric) {
                  case "replyRate":
                    value = `${week.replyRate.toFixed(1)}%`
                    break
                  case "total":
                    value = week.total.toString()
                    break
                  case "replied":
                    value = week.replied.toString()
                    break
                  default: {
                    const typeData = week.byType[metric]
                    value = typeData ? `${typeData.replyRate.toFixed(1)}%` : "N/A"
                    break
                  }
                }

                return (
                  <div key={metric} className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.line }}></div>
                    <span className="text-slate-600">{metric}:</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
