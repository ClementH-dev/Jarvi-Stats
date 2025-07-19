"use client"

import type React from "react"

export interface TableColumn {
  key: string
  label: string
  align?: "left" | "center" | "right"
}

interface TableProps<T> {
  columns: TableColumn[]
  data: T[]
  renderCell: (item: T, column: TableColumn) => React.ReactNode
}

export function Table<T>({ columns, data, renderCell }: TableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wide border-r border-slate-200 last:border-r-0 ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-25"
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-4 text-sm border-r border-slate-100 last:border-r-0 ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : "text-left"
                  }`}
                >
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
