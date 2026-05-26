import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-950 via-premium-900 to-premium-800 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark p-8 rounded-2xl"
        >
          <h1 className="text-4xl font-bold mb-8 gradient-text">Условия использования</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Общие положения</h2>
              <p>
                Используя Coder-Pawno, вы соглашаетесь с данными условиями. Если вы не согласны, 
                пожалуйста, не используйте приложение.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Описание сервиса</h2>
              <p>
                Coder-Pawno предоставляет веб-редактор кода с поддержкой русского языка, 
                компиляцией для Pawno и других языков программирования.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Рекламные материалы</h2>
              <p>
                Приложение может отображать рекламные баннеры. Реклама является неотъемлемой 
                частью бесплатной версии приложения и не может быть удалена пользователем.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Пуш-уведомления</h2>
              <p>
                Приложение использует пуш-уведомления для информирования пользователей о событиях. 
                Вы можете отключить уведомления в настройках браузера.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Хранение данных</h2>
              <p>
                Ваши проекты хранятся локально в браузере. Мы не сохраняем ваш код на серверах. 
                Рекомендуется регулярно скачивать резервные копии проектов.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Ограничения ответственности</h2>
              <p>
                Приложение предоставляется "как есть". Мы не несем ответственности за потерю данных, 
                ошибки компиляции или другие проблемы при использовании.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Изменения условий</h2>
              <p>
                Мы оставляем за собой право изменять данные условия в любое время. 
                Продолжение использования приложения означает принятие новых условий.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-700">
              <button
                onClick={() => navigate('/')}
                className="btn-premium"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
