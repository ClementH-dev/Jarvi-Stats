interface DateRangeFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void
}

export const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value
    const endDateInput = document.getElementById('endDate') as HTMLInputElement
    const endDate = endDateInput?.value || startDate
    onFilterChange(startDate, endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value
    const startDateInput = document.getElementById('startDate') as HTMLInputElement
    const startDate = startDateInput?.value || endDate
    onFilterChange(startDate, endDate)
  }

  const clearFilter = () => {
    const startDateInput = document.getElementById('startDate') as HTMLInputElement
    const endDateInput = document.getElementById('endDate') as HTMLInputElement
    if (startDateInput) startDateInput.value = ''
    if (endDateInput) endDateInput.value = ''
    onFilterChange('', '')
  }

  return (
    <div>
      <h3>Filtrer par période</h3>
      <div>
        <div>
          <label htmlFor="startDate">Date de début :</label>
          <input
            id="startDate"
            type="date"
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDate">Date de fin :</label>
          <input
            id="endDate"
            type="date"
            onChange={handleEndDateChange}
          />
        </div>
        <button onClick={clearFilter}>
          Effacer
        </button>
      </div>
    </div>
  )
}
