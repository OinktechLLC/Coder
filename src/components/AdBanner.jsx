import { useState } from 'react'
import { CloseIcon, TelegramIcon } from './Icons'

const AdBanner = () => {
  const [isHidden, setIsHidden] = useState(false)

  if (isHidden) return null

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient opacity-50"></div>
      
      <button
        onClick={() => setIsHidden(true)}
        className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors z-10"
      >
        <CloseIcon className="w-5 h-5" />
      </button>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flame-glow">
              <TelegramIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                OverWall Bot
              </h3>
              <p className="text-sm text-white/70">
                от разработчиков Tatnet.ru
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  ✓ Разблок Телеграмма
                </span>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  ✓ Разблок Ютуба
                </span>
                <span className="text-xs bg-flame-500/20 text-flame-400 px-2 py-1 rounded-full">
                  ✓ Лучшая скорость в РФ
                </span>
              </div>
            </div>
          </div>
          
          <a
            href="https://t.me/overwall_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary whitespace-nowrap"
          >
            Подключиться
          </a>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            🚀 Без блокировок РКН • Стабильная работа • Высокая скорость
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdBanner
