import { HistoryEntries } from "./components/HistoryEntries"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Jarvi Stats</h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Application de test technique - Nhost + React + TypeScript
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HistoryEntries />
      </main>
    </div>
  )
}

export default App
