export interface TableColumn {
  key: string
  label: string
  align: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: TableColumn[]
  data: T[]
  renderCell: (item: T, column: TableColumn, index: number) => React.ReactNode
}

export const Table = <T,>({ columns, data, renderCell }: TableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key} style={{ textAlign: column.align }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map(column => (
              <td key={column.key} style={{ textAlign: column.align }}>
                {renderCell(item, column, index)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
