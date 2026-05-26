import { useState } from 'react'
import { ServerIcon, CheckIcon, SpeedIcon } from './Icons'

const ServerList = ({ servers, selectedServer, onSelectServer }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSpeedColor = (speed) => {
    if (speed >= 80) return 'text-green-400'
    if (speed >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск сервера..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-modern"
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {filteredServers.map((server) => (
          <button
            key={server.id}
            onClick={() => onSelectServer(server)}
            className={`w-full p-4 rounded-xl transition-all duration-300 ${
              selectedServer?.id === server.id
                ? 'bg-gradient-to-r from-flame-500/20 to-flame-600/20 border-flame-500'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            } border`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedServer?.id === server.id
                    ? 'bg-flame-500'
                    : 'bg-white/10'
                }`}>
                  <ServerIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white">{server.name}</h4>
                  <p className="text-sm text-white/60">{server.country}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <SpeedIcon className={`w-4 h-4 ${getSpeedColor(server.speed)}`} />
                  <span className={`text-sm font-medium ${getSpeedColor(server.speed)}`}>
                    {server.speed}%
                  </span>
                </div>
                {selectedServer?.id === server.id && (
                  <CheckIcon className="w-5 h-5 text-flame-400" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredServers.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <ServerIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Серверы не найдены</p>
        </div>
      )}
    </div>
  )
}

export default ServerList
