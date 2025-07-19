interface WeekFilterProps {
  weeklyStats: Array<{
    week: string
    weekStart: Date
    weekEnd: Date
  }>
  onFilterChange: (startWeek: string, endWeek: string) => void
}

export const WeekFilter = ({ weeklyStats, onFilterChange }: WeekFilterProps) => {
  const handleStartWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const startWeek = event.target.value
    const endWeekSelect = document.querySelector('#end-week') as HTMLSelectElement
    const endWeek = endWeekSelect?.value || startWeek
    onFilterChange(startWeek, endWeek)
  }

  const handleEndWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const endWeek = event.target.value
    const startWeekSelect = document.querySelector('#start-week') as HTMLSelectElement
    const startWeek = startWeekSelect?.value || endWeek
    onFilterChange(startWeek, endWeek)
  }

  const handleReset = () => {
    onFilterChange('', '')
  }

  return (
    <div>
      <h3>Filtrer par période</h3>
      
      <div>
        <label>
          Semaine de début :
          <select id="start-week" onChange={handleStartWeekChange} defaultValue="">
            <option value="">Toutes les semaines</option>
            {weeklyStats.map((week) => (
              <option key={`start-${week.week}`} value={week.week}>
                {week.week}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Semaine de fin :
          <select id="end-week" onChange={handleEndWeekChange} defaultValue="">
            <option value="">Toutes les semaines</option>
            {weeklyStats.map((week) => (
              <option key={`end-${week.week}`} value={week.week}>
                {week.week}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleReset}>
        Réinitialiser les filtres
      </button>
    </div>
  )
}
