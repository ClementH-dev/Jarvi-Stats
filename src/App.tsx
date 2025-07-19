import './App.css'
import { HistoryEntries } from './components/HistoryEntries'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Jarvi Stats</h1>
        <p>Application de test technique - Nhost + React + TypeScript</p>
      </header>
      <main>
        <HistoryEntries />
      </main>
    </div>
  )
}

export default App
