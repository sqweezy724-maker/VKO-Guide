# VKO Guide - Туристический гид по ВКО

## 🌄 О проекте

VKO Guide - интерактивное туристическое приложение по Восточно-Казахстанской области с AI ассистентом, системой квестов и расширенной картой.

[🇰🇿 Қазақша нұсқа](./README_KK.md)

## ✨ Новые возможности

### 🤖 AI Туристический Ассистент
- Отвечает на вопросы о туризме в ВКО
- Поддержка русского и казахского языков
- Готовые быстрые вопросы
- Помощь в планировании маршрутов
- Работает прямо в приложении

### 👤 Система регистрации без паролей
- **Гостевой режим**: Прогресс сохраняется локально
- **Регистрация**: Только Email + имя (без пароля!)
- Выбор из 10 аватаров
- Автоматическое сохранение настроек и прогресса

### 📍 Улучшенная геолокация
- Ручной выбор города при недоступности GPS
- Города: Усть-Каменогорск, Семей, Риддер
- Запрос разрешений для Android
- Альтернативные методы определения местоположения

### 🎯 Постоянная система квестов
- **Постоянные квесты**: Сохраняются между сессиями
- **Ежедневные квесты**: Обновляются автоматически
- Система рангов: Новичок → Легенда Алтая
- Награды: путевки на популярные курорты

### 🗺️ Интерактивная карта
- 3 режима: Обычный, Спутниковый, Панорама
- 20+ туристических объектов
- Построение маршрутов
- Фотографии и описания

### 📱 Полная поддержка Android
- Готовое Android приложение (APK)
- PWA поддержка
- Адаптивный дизайн
- Офлайн режим

## 🚀 Быстрый старт

### Веб-версия:

```bash
# 1. Установка зависимостей (НЕ УСТАНАВЛИВАТЬ - файлы готовы)
npm install

# 2. Запуск в режиме разработки
npm run dev

# Приложение откроется на http://localhost:5173
```

### Создание Android APK:

```bash
# 1. Сборка веб-приложения
npm run build

# 2. Синхронизация с Android
npx cap sync android

# 3. Открыть в Android Studio
npx cap open android

# 4. В Android Studio собрать APK:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**📖 Полная инструкция**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**💬 Как делать коммиты**: [GIT_COMMITS.md](./GIT_COMMITS.md)

## 📋 Требования

### Для веб:
- Node.js 18+ (рекомендуется 20+)
- npm или pnpm

### Для Android:
- Android Studio (последняя версия)
- Java JDK 17+
- Android SDK (API 33+)
- Gradle 8+

## 🏗️ Структура проекта

```
vko-guide-updated/
├── android/                    # Android проект (Capacitor)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ai-chat.tsx           # 🆕 AI ассистент
│   │   │   ├── ai-chat-button.tsx    # 🆕 Кнопка чата
│   │   │   ├── auth-modal.tsx        # 🆕 Регистрация
│   │   │   ├── quest-system.tsx      # ♻️ Обновленные квесты
│   │   │   └── ...
│   │   ├── App.tsx             # ♻️ Главный компонент (обновлен)
│   │   └── db.ts              # ♻️ База данных (расширена)
│   └── main.tsx
├── capacitor.config.json       # 🆕 Конфигурация Android
├── package.json               # ♻️ Обновлен для Android
├── SETUP_GUIDE.md            # 🆕 Полная инструкция
├── GIT_COMMITS.md            # 🆕 Примеры коммитов
└── README.md                  # Этот файл
```

**Обозначения:**
- 🆕 Новый файл
- ♻️ Обновленный файл

## 🎨 Что изменилось

### Добавлено:
✅ AI чат-ассистент (только туризм ВКО)
✅ Регистрация без паролей
✅ Гостевой режим
✅ Улучшенная геолокация
✅ Постоянные квесты
✅ Android поддержка (Capacitor)
✅ Экспорт/импорт прогресса

### Улучшено:
🔄 База данных (централизованная)
🔄 Система квестов (персистентность)
🔄 Геолокация (альтернативные методы)
🔄 UI/UX (мобильная адаптация)

## 🔧 Используемые технологии

- **Frontend**: React 18, TypeScript
- **Картография**: Leaflet, React-Leaflet
- **UI**: Tailwind CSS, Radix UI
- **AI**: Anthropic Claude API (встроено)
- **Mobile**: Capacitor 6
- **Database**: LocalStorage (no backend needed)
- **Build**: Vite 6

## 📝 Разработка

### Добавление места:

```typescript
// src/app/places-data.ts
{
  id: 99,
  name: "Новое место",
  nameKk: "Жаңа орын",
  lat: 49.9485,
  lng: 82.5869,
  zoom: 14,
  category: "nature",
  description: "Описание",
  descriptionKk: "Сипаттама"
}
```

### Добавление квеста:

```typescript
// src/app/components/quest-system.tsx
const newQuest: Quest = {
  id: 99,
  title: "Новый квест",
  titleKk: "Жаңа квест",
  description: "Описание",
  descriptionKk: "Сипаттама",
  exp: 200,
  type: "visit",
  icon: <Trophy size={20} />,
  completed: false
};
```

## 🐛 Частые проблемы

### "Gradle sync failed"
```bash
cd android && ./gradlew clean && ./gradlew build
```

### "Capacitor не найден"
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### APK не устанавливается
- Проверьте minSdk ≤ версии Android на устройстве
- Удалите старую версию приложения
- Разрешите установку из неизвестных источников

### AI чат не работает
- Убедитесь что есть интернет соединение
- API Claude встроен в код (работает из коробки)
- Для production рекомендуется использовать proxy

## 📱 Сборка APK

**Debug APK** (для тестирования):
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK** (для публикации):
1. Создайте keystore
2. Настройте подпись в `android/app/build.gradle`
3. `cd android && ./gradlew assembleRelease`
4. APK: `android/app/build/outputs/apk/release/app-release.apk`

Подробнее: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🤝 Вклад в проект

Приветствуются:
- 🐛 Исправления багов
- ✨ Новые функции
- 📝 Улучшения документации
- 🌍 Переводы
- 🎨 Улучшения UI/UX

### Процесс:
1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/amazing`)
3. Commit изменений (`git commit -m 'add amazing feature'`)
4. Push в branch (`git push origin feature/amazing`)
5. Откройте Pull Request

**Гайд по коммитам**: [GIT_COMMITS.md](./GIT_COMMITS.md)

## 📄 Лицензия

MIT License - используйте свободно!

## 👨‍💻 Авторы

- **Основной разработчик**: sqweezy724-maker
- **AI интеграция**: Anthropic Claude
- **Дизайн**: Community

## 📞 Контакты и поддержка

- 🐙 GitHub: [@sqweezy724-maker](https://github.com/sqweezy724-maker)
- 📦 Проект: [VKO-Guide](https://github.com/sqweezy724-maker/VKO-Guide)
- 📧 Issues: [GitHub Issues](https://github.com/sqweezy724-maker/VKO-Guide/issues)

## 🙏 Благодарности

- **Anthropic** - за Claude AI
- **Leaflet** - за картографию
- **React Team** - за React
- **Capacitor Team** - за mobile support
- **Все участники** проекта

## 🎯 Roadmap

- [ ] Backend для синхронизации прогресса
- [ ] iOS поддержка
- [ ] Больше туристических мест
- [ ] Социальные функции
- [ ] Интеграция с картами Google/Yandex
- [ ] Система рейтингов и отзывов

## 🔐 Безопасность

- ✅ Локальное хранение данных
- ✅ Нет паролей
- ✅ Нет сбора личных данных
- ⚠️ API ключи встроены (только для демо)
- 💡 Для production используйте backend proxy

## 📊 Статистика

- **Размер APK**: ~10-15 MB (debug), ~8-12 MB (release)
- **Туристических мест**: 20+
- **Квестов**: 8 постоянных + 3 ежедневных
- **Языков**: 2 (Русский, Казахский)
- **Режимов карты**: 3

---

**Сделано с ❤️ для путешественников по Восточному Казахстану**

🌄 **Исследуйте ВКО с умом!**
