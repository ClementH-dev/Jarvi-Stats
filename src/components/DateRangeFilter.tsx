"use client"

import type React from "react"

import { useState } from "react"

interface DateRangeFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void
}

export const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    onFilterChange(newStartDate, endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    onFilterChange(startDate, newEndDate)
  }

  const clearFilter = () => {
    setStartDate("")
    setEndDate("")
    onFilterChange("", "")
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Filtrer par période</h3>
      </div>

      {/* Form */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-4">
        {/* Date de début */}
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
            📅 Date de début
          </label>
          <div className="relative">
            <input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || today}
              onChange={handleStartDateChange}
              className="
                w-full px-4 py-3 rounded-lg border border-slate-300 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white shadow-sm transition-all duration-200
                hover:border-slate-400 text-slate-700
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:opacity-70
                [&::-webkit-calendar-picker-indicator]:hover:opacity-100
              "
            />
          </div>
        </div>

        {/* Date de fin */}
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">
            📅 Date de fin
          </label>
          <div className="relative">
            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate}
              max={today}
              onChange={handleEndDateChange}
              className="
                w-full px-4 py-3 rounded-lg border border-slate-300 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white shadow-sm transition-all duration-200
                hover:border-slate-400 text-slate-700
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:opacity-70
                [&::-webkit-calendar-picker-indicator]:hover:opacity-100
              "
            />
          </div>
        </div>

        {/* Bouton Clear */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-transparent">Actions</label>
          <button
            onClick={clearFilter}
            disabled={!startDate && !endDate}
            className="
              w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
              flex items-center justify-center space-x-2
              disabled:opacity-50 disabled:cursor-not-allowed
              enabled:bg-slate-100 enabled:text-slate-700 enabled:border enabled:border-slate-300
              enabled:hover:bg-slate-200 enabled:hover:border-slate-400
              enabled:active:bg-slate-300 enabled:shadow-sm
              focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Effacer</span>
          </button>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-sm font-medium text-slate-600 mb-3">🚀 Raccourcis rapides :</p>
        <div className="flex flex-wrap gap-2">
          <QuickFilterButton
            label="7 derniers jours"
            onClick={() => {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 7)
              const startStr = start.toISOString().split("T")[0]
              const endStr = end.toISOString().split("T")[0]
              setStartDate(startStr)
              setEndDate(endStr)
              onFilterChange(startStr, endStr)
            }}
          />
          <QuickFilterButton
            label="30 derniers jours"
            onClick={() => {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 30)
              const startStr = start.toISOString().split("T")[0]
              const endStr = end.toISOString().split("T")[0]
              setStartDate(startStr)
              setEndDate(endStr)
              onFilterChange(startStr, endStr)
            }}
          />
          <QuickFilterButton
            label="Ce mois"
            onClick={() => {
              const now = new Date()
              const start = new Date(now.getFullYear(), now.getMonth(), 1)
              const end = new Date()
              const startStr = start.toISOString().split("T")[0]
              const endStr = end.toISOString().split("T")[0]
              setStartDate(startStr)
              setEndDate(endStr)
              onFilterChange(startStr, endStr)
            }}
          />
          <QuickFilterButton
            label="Mois dernier"
            onClick={() => {
              const now = new Date()
              const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
              const end = new Date(now.getFullYear(), now.getMonth(), 0)
              const startStr = start.toISOString().split("T")[0]
              const endStr = end.toISOString().split("T")[0]
              setStartDate(startStr)
              setEndDate(endStr)
              onFilterChange(startStr, endStr)
            }}
          />
        </div>
      </div>

      {/* Indicateur de filtre actif */}
      {(startDate || endDate) && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">
                Filtre actif
                {startDate && endDate && (
                  <span className="ml-2 text-blue-600">
                    ({new Date(startDate).toLocaleDateString("fr-FR")} - {new Date(endDate).toLocaleDateString("fr-FR")}
                    )
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={clearFilter}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant pour les boutons de raccourcis
const QuickFilterButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5 text-xs font-medium rounded-full
      bg-white border border-blue-200 text-blue-700
      hover:bg-blue-50 hover:border-blue-300
      active:bg-blue-100 transition-all duration-150
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    "
  >
    {label}
  </button>
)
