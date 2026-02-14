# VKO Guide - ШҚО Туристік Гиді

## 🌄 Жоба туралы

VKO Guide - Шығыс Қазақстан облысы бойынша интерактивті туристік қолданба. AI көмекшісі, квест жүйесі және кеңейтілген картамен жабдықталған.

## ✨ Мүмкіндіктер

### 🤖 AI Туристік Көмекші
- ШҚО туризмі бойынша сұрақтарға жауап береді
- Орыс және қазақ тілдерін қолдайды
- Жылдам сұрақтар үшін дайын түймелер
- Маршруттарды жоспарлауға көмектеседі

### 👤 Тіркелу жүйесі
- **Қонақ режимі**: Прогресс жергілікті сақталады
- **Тіркелу**: Email + аты (құпия сөзсіз)
- 10 аватардан таңдау
- Параметрлер мен прогресстің автоматты сақталуы

### 📍 Жақсартылған геолокация
- GPS қолжетімсіз болса, қалаларды қолмен таңдау
- Қалалар: Өскемен, Семей, Риддер
- Android үшін рұқсаттарды сұрау

### 🎯 Квест жүйесі
- Тұрақты квесттер (сессиялар арасында сақталады)
- Күнделікті квесттер (автоматты жаңартылады)
- Рейтинг жүйесі (Жаңадан келген → Алтай аңызы)
- Жолдамалар: Рахман Бұлақтары, Қатон-Қарағай паркі

### 🗺️ Интерактивті карта
- 3 көрініс режимі: Қалыпты, Спутниктік, Панорама
- 20+ туристік нысандар
- Маршруттарды құру
- Фотосуреттер мен сипаттамалар

### 📱 Мобильді қолдау
- Android қолданбасы (APK)
- PWA қолдауы
- Адаптивті дизайн
- Офлайн режим

## 🚀 Қалай бастау керек

### Веб-нұсқасы:

```bash
# 1. Тәуелділіктерді орнату
npm install

# 2. Әзірлеу режимінде іске қосу
npm run dev

# 3. Браузерде ашу
# http://localhost:5173
```

### Android APK құру:

```bash
# 1. Веб-қолданбаны құру
npm run build

# 2. Android-пен синхрондау
npx cap sync android

# 3. Android Studio-да ашу
npx cap open android

# 4. Android Studio-да APK құру:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

Толық нұсқаулық: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📋 Талаптар

### Веб үшін:
- Node.js 18+
- npm немесе pnpm

### Android үшін:
- Android Studio (соңғы нұсқа)
- Java JDK 17+
- Android SDK (API 33+)
- Gradle 8+

## 🏗️ Жоба құрылымы

```
vko-guide-updated/
├── android/              # Android жобасы
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ai-chat.tsx          # AI көмекші
│   │   │   ├── auth-modal.tsx       # Тіркелу
│   │   │   ├── quest-system.tsx     # Квесттер
│   │   │   └── ...
│   │   ├── App.tsx       # Негізгі компонент
│   │   └── db.ts        # Дерекқор
│   └── main.tsx
├── package.json
└── capacitor.config.json
```

## 🎨 Скриншоттар

- Негізгі карта интерфейсі
- AI чат көмекшісі
- Квест жүйесі
- Тіркелу терезесі
- Орын туралы ақпарат

## 🔧 Қолданылған технологиялар

- **Frontend**: React 18, TypeScript
- **Картография**: Leaflet, React-Leaflet
- **UI**: Tailwind CSS, Radix UI
- **AI**: Anthropic Claude API
- **Мобильді**: Capacitor
- **Дерекқор**: LocalStorage
- **Құрылыс**: Vite

## 📝 Әзірлеу

### Жаңа орын қосу:

```typescript
// src/app/places-data.ts
{
  id: 99,
  name: "Жаңа орын",
  nameKk: "Жаңа орын",
  lat: 49.9485,
  lng: 82.5869,
  zoom: 14,
  category: "nature",
  // ...
}
```

### Жаңа квест қосу:

```typescript
// src/app/components/quest-system.tsx
{
  id: 99,
  title: "Жаңа квест",
  titleKk: "Жаңа квест",
  description: "Сипаттама",
  exp: 200,
  type: "visit",
  // ...
}
```

## 🐛 Мәселелерді шешу

### "Gradle sync failed"
```bash
cd android
./gradlew clean
./gradlew build
```

### "Capacitor табылмады"
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
```

### APK орнатылмайды
- minSdk нұсқасын тексеріңіз
- Ескі нұсқаны жойыңыз
- Белгісіз көздерден орнатуға рұқсат беріңіз

## 🤝 Үлес қосу

1. Fork жасаңыз
2. Feature branch құрыңыз (`git checkout -b feature/amazing`)
3. Өзгерістерді commit жасаңыз (`git commit -m 'add amazing feature'`)
4. Branch-қа push жасаңыз (`git push origin feature/amazing`)
5. Pull Request ашыңыз

## 📄 Лицензия

MIT License - толығырақ [LICENSE](LICENSE) файлында

## 👨‍💻 Авторлар

- Негізгі әзірлеуші: sqweezy724-maker
- AI интеграция: Anthropic Claude

## 📞 Байланыс

- GitHub: [@sqweezy724-maker](https://github.com/sqweezy724-maker)
- Жоба: [VKO-Guide](https://github.com/sqweezy724-maker/VKO-Guide)

## 🙏 Алғыс

- Anthropic Claude AI үшін
- Leaflet картография үшін
- React экожүйесіне
- Барлық қатысушыларға

---

**Жасалған ❤️ Шығыс Қазақстан үшін**
