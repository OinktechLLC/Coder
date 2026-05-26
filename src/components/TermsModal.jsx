import { useState } from 'react'
import { CloseIcon, CheckIcon } from './Icons'

const TermsModal = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem('termsAccepted', 'true')
      onAccept()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="card-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Условия использования
            </h2>
            <button className="text-white/70 hover:text-white transition-colors">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-white/80 text-sm md:text-base mb-8">
            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">1. Общие положения</h3>
              <p className="mb-2">
                Используя сервис FlameVPN, вы соглашаетесь с настоящими условиями использования. 
                Если вы не согласны с каким-либо пунктом данных условий, пожалуйста, не используйте наш сервис.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">2. Описание сервиса</h3>
              <p className="mb-2">
                FlameVPN предоставляет услуги по обеспечению безопасного и приватного доступа к интернету. 
                Сервис позволяет обходить блокировки и обеспечивает защиту ваших данных.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Обход блокировок сайтов и сервисов</li>
                <li>Шифрование интернет-трафика</li>
                <li>Защита персональных данных</li>
                <li>Высокая скорость соединения</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">3. Политика конфиденциальности</h3>
              <p className="mb-2">
                Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Мы не собираем и не храним логи вашей активности</li>
                <li>Ваши персональные данные не передаются третьим лицам</li>
                <li>Используется современное шифрование данных</li>
                <li>Все соединения защищены протоколами безопасности</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">4. Правила использования</h3>
              <p className="mb-2">Запрещается использовать сервис для:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Нарушения законодательства РФ и международных законов</li>
                <li>Распространения вредоносного ПО</li>
                <li>Осуществления кибератак</li>
                <li>Спама и мошенничества</li>
                <li>Нарушения авторских прав</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">5. Ограничения ответственности</h3>
              <p className="mb-2">
                Сервис предоставляется "как есть". Мы не гарантируем бесперебойную работу сервиса 
                и не несем ответственности за возможные убытки, возникшие в результате использования сервиса.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">6. Изменение условий</h3>
              <p className="mb-2">
                Мы оставляем за собой право изменять данные условия в любое время. 
                Продолжение использования сервиса после изменений означает ваше согласие с новыми условиями.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-flame-400 mb-2">7. Контактная информация</h3>
              <p className="mb-2">
                По всем вопросам обращайтесь: support@flamevpn.tatnet.ru
              </p>
            </section>
          </div>

          <div className="border-t border-white/10 pt-6">
            <label className="flex items-center space-x-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-white/30 bg-white/10 text-flame-500 focus:ring-flame-500 focus:ring-offset-0"
              />
              <span className="text-white">
                Я прочитал(а) и принимаю условия использования и политику конфиденциальности
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!accepted}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                accepted
                  ? 'btn-primary'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              Принять и продолжить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
