# 🔥 FlameVPN - Кайфуйте от интернета вместе с нами

![FlameVPN](https://img.shields.io/badge/Flame-VPN-orange?style=for-the-badge&logo=fire)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwindcss)

## 🚀 Описание

**FlameVPN** - это современное веб-приложение для работы с VPN подписками в стиле TikTok. 
Приложение позволяет пользователям легко добавлять подписки, выбирать сервера и подключаться к VPN 
для обхода блокировок и защиты приватности.

### ✨ Особенности

- 🎨 **Современный дизайн** в стиле TikTok с градиентами и анимациями
- 📱 **Mobile-first подход** - идеально работает на мобильных устройствах
- 🔒 **Безопасность** - поддержка современных протоколов (Vmess, Vless, Trojan, Shadowsocks)
- ⚡ **Быстрая работа** - оптимизировано с помощью Vite
- 🌍 **Обход блокировок** - разблокировка Telegram, YouTube и других сервисов
- 🇷🇺 **Оптимизировано для РФ** - лучшая скорость без блокировок РКН
- 📜 **Полная документация** - FAQ, политика конфиденциальности, условия использования
- 📢 **Интеграция рекламы** - баннер OverWall Bot от Tatnet.ru

## 🛠️ Технологический стек

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS 3
- **Icons:** Custom SVG components
- **State Management:** React Hooks (useState, useEffect)

## 📦 Установка

### Требования

- Node.js >= 18.x
- npm >= 9.x

### Шаги установки

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/flamevpn.git
cd flamevpn
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

4. Откройте браузер по адресу `http://localhost:3000`

## 🚀 Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут находиться в папке `dist/`.

## 📁 Структура проекта

```
flamevpn/
├── public/
│   └── flame.svg          # Логотип приложения
├── src/
│   ├── components/
│   │   ├── Icons.jsx      # SVG иконки
│   │   ├── TermsModal.jsx # Модальное окно условий использования
│   │   ├── ServerList.jsx # Список серверов
│   │   └── AdBanner.jsx   # Рекламный баннер
│   ├── styles/
│   │   └── index.css      # Глобальные стили
│   ├── App.jsx            # Главный компонент приложения
│   └── main.jsx           # Точка входа
├── docs/                  # Документация
├── index.html             # HTML шаблон
├── package.json           # Зависимости проекта
├── tailwind.config.js     # Конфигурация TailwindCSS
├── postcss.config.js      # Конфигурация PostCSS
├── vite.config.js         # Конфигурация Vite
└── README.md              # Этот файл
```

## 🎯 Функционал

### Лендинг страница
- Красивый hero-блок с призывом к действию
- Информация о преимуществах
- Статистика сервиса
- FAQ и документация

### Приложение
- Добавление подписки (vmess://, vless://, trojan://)
- Отображение списка серверов с поиском
- Подключение/отключение одной кнопкой
- Индикация статуса подключения
- Выбор сервера из списка

### Документы
- Условия использования
- Политика конфиденциальности
- FAQ
- Техническая документация

## 🎨 Дизайн

Дизайн выполнен в современном стиле с использованием:
- Градиентов (оранжевый, розовый, голубой)
- Glassmorphism эффектов
- Плавных анимаций
- Тёмной темы
- Адаптивной вёрстки

## 📱 Мобильная версия

Приложение оптимизировано для мобильных устройств:
- Адаптивное меню
- Удобные кнопки для тач-интерфейса
- Оптимизированные шрифты
- Mobile-first подход

## 🔐 Безопасность

- Принятие условий использования перед первым входом
- Шифрование данных
- Отсутствие логирования активности
- Современные протоколы безопасности

## 📢 Реклама

В приложение интегрирован рекламный баннер OverWall Bot:
- Ссылка: https://t.me/overwall_bot
- Сайт: https://overwall.hrscp.net
- От разработчиков Tatnet.ru

Баннер можно скрыть нажатием на кнопку закрытия.

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменений (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT.

## 📞 Контакты

- **Email:** support@flamevpn.tatnet.ru
- **Telegram:** @overwall_bot
- **Сайт:** https://tatnet.ru

## 🙏 Благодарности

- React команде за отличный фреймворк
- TailwindCSS за потрясающий CSS-фреймворк
- Vite за молниеносную сборку
- Всем пользователям за поддержку!

---

**FlameVPN** © 2025 Tatnet.ru. Все права защищены. 🔥
