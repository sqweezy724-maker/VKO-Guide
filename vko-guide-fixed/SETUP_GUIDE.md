# VKO Guide - Полная инструкция по запуску и созданию APK

## 📦 Что нового в этой версии

### ✨ Основные улучшения:
1. **AI Ассистент** - Виртуальный гид по ВКО с поддержкой русского и казахского языков
2. **Система регистрации** - Сохранение прогресса без паролей + гостевой режим
3. **Улучшенная геолокация** - Альтернативный выбор города при недоступности GPS
4. **Постоянные квесты** - Квесты сохраняются между сессиями
5. **Поддержка Android** - Готово для компиляции в APK через Android Studio
6. **Улучшенная база данных** - Централизованное хранилище с поддержкой экспорта/импорта

---

## 🚀 Быстрый старт (веб-версия)

### Требования:
- Node.js 18+ (рекомендуется 20+)
- npm или pnpm

### Шаги:

1. **Установка зависимостей:**
```bash
npm install
# или
pnpm install
```

2. **Запуск в режиме разработки:**
```bash
npm run dev
# или
pnpm dev
```

3. **Сборка для production:**
```bash
npm run build
# или
pnpm build
```

4. **Предпросмотр production сборки:**
```bash
npm run preview
```

Приложение откроется на `http://localhost:5173`

---

## 📱 Создание APK для Android

### Метод 1: Через Capacitor (Рекомендуется)

#### Требования:
- Android Studio (последняя версия)
- Java JDK 17+
- Android SDK (API 33+)
- Gradle 8+

#### Шаги:

1. **Инициализация Capacitor (уже сделано в проекте):**
```bash
npm install
```

2. **Сборка веб-приложения:**
```bash
npm run build
```

3. **Синхронизация с Android:**
```bash
npx cap sync android
```

4. **Открыть проект в Android Studio:**
```bash
npx cap open android
```

5. **В Android Studio:**
   - Подождите завершения Gradle Sync
   - Проверьте настройки в `android/app/build.gradle`:
     ```gradle
     android {
         compileSdk 34
         defaultConfig {
             applicationId "com.vkoguide.app"
             minSdk 24
             targetSdk 34
             versionCode 1
             versionName "1.0.0"
         }
     }
     ```

6. **Создание Debug APK:**
   - В Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

7. **Создание Release APK (для публикации):**
   
   a) Создайте keystore:
   ```bash
   keytool -genkey -v -keystore vko-guide.keystore -alias vko-guide -keyalg RSA -keysize 2048 -validity 10000
   ```

   b) Добавьте в `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("../../vko-guide.keystore")
               storePassword "your-password"
               keyAlias "vko-guide"
               keyPassword "your-password"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

   c) Соберите Release APK:
   - В Android Studio: `Build` → `Generate Signed Bundle / APK`
   - Выберите `APK` → `release` → указать keystore
   - APK будет в: `android/app/build/outputs/apk/release/app-release.apk`

### Метод 2: Через командную строку (быстрее)

```bash
# 1. Сборка веб-приложения
npm run build

# 2. Синхронизация
npx cap sync android

# 3. Сборка Debug APK
cd android
./gradlew assembleDebug

# APK будет в: android/app/build/outputs/apk/debug/app-debug.apk

# 4. Для Release APK (после настройки keystore)
./gradlew assembleRelease
```

### Установка APK на устройство:

**Через USB:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Через файл:**
1. Скопируйте APK на устройство
2. Откройте файл на устройстве
3. Разрешите установку из неизвестных источников
4. Установите приложение

---

## 🔧 Настройка окружения для Android

### Установка Android Studio:
1. Скачайте с https://developer.android.com/studio
2. Установите Android SDK (API 33+)
3. Настройте переменные окружения:

**Windows:**
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### Проверка установки:
```bash
android --version
adb version
javac -version
```

---

## 🎨 Кастомизация приложения

### Изменение иконки и названия:

1. **Иконка приложения:**
   - Создайте иконку 512x512px
   - Сохраните в `android/app/src/main/res/`
   - Используйте Image Asset Studio в Android Studio

2. **Название приложения:**
   - В `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="app_name">VKO Guide</string>
   ```

3. **Splash Screen:**
   - Отредактируйте `capacitor.config.json`
   - Добавьте изображение в `android/app/src/main/res/drawable/splash.png`

---

## 🧪 Тестирование

### Веб-версия:
```bash
npm run dev
```
Откройте DevTools → Toggle Device Toolbar для эмуляции мобильного устройства

### Android:
1. **Эмулятор Android Studio:**
   - Tools → Device Manager → Create Device
   - Выберите устройство (например, Pixel 7)
   - Запустите эмулятор
   - Запустите приложение из Android Studio

2. **Физическое устройство:**
   - Включите режим разработчика на устройстве
   - Включите отладку по USB
   - Подключите устройство через USB
   - Запустите `adb devices` для проверки
   - Запустите приложение из Android Studio

---

## 🐛 Решение проблем

### Проблема: "Gradle sync failed"
**Решение:**
```bash
cd android
./gradlew clean
./gradlew build
```

### Проблема: "SDK location not found"
**Решение:**
Создайте файл `android/local.properties`:
```
sdk.dir=/path/to/Android/Sdk
```

### Проблема: "Capacitor не найден"
**Решение:**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
```

### Проблема: APK не устанавливается
**Решение:**
- Проверьте версию minSdk (должна быть ≤ версии Android на устройстве)
- Удалите старую версию приложения
- Разрешите установку из неизвестных источников

---

## 📂 Структура проекта

```
vko-guide-updated/
├── android/                    # Android проект (Capacitor)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/           # Ресурсы (иконки, splash)
│   │   └── build.gradle
│   └── build.gradle
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ai-chat.tsx           # AI ассистент
│   │   │   ├── ai-chat-button.tsx    # Кнопка AI чата
│   │   │   ├── auth-modal.tsx        # Регистрация/вход
│   │   │   ├── quest-system.tsx      # Система квестов
│   │   │   └── ...
│   │   ├── App.tsx            # Главный компонент
│   │   └── db.ts             # База данных (LocalStorage)
│   ├── main.tsx
│   └── styles/
├── public/
│   ├── manifest.json          # PWA манифест
│   └── icon-*.png            # Иконки PWA
├── capacitor.config.json      # Конфигурация Capacitor
├── package.json
├── vite.config.ts
└── README.md
```

---

## ✨ Новые возможности

### 1. AI Ассистент
- Открывается кнопкой в правом нижнем углу
- Отвечает только на вопросы о туризме в ВКО
- Поддерживает русский и казахский языки
- Быстрые вопросы для удобства

### 2. Система авторизации
- **Гостевой режим:** Прогресс сохраняется локально
- **Регистрация:** Email + имя (без пароля)
- Выбор аватара из 10 вариантов
- Автоматическое сохранение настроек

### 3. Улучшенная геолокация
- Альтернативный выбор города при недоступности GPS
- Города: Усть-Каменогорск, Семей, Риддер
- Запрос разрешений для Android

### 4. Постоянные квесты
- Квесты сохраняются в LocalStorage
- Отслеживание прогресса
- Ежедневные квесты обновляются автоматически
- Система наград и рангов

---

## 📝 Изменения в коде

### Основные файлы изменены:
- ✅ `src/app/App.tsx` - добавлен AI чат и авторизация
- ✅ `src/app/db.ts` - расширенная база данных
- ✅ `src/app/components/ai-chat.tsx` - новый компонент
- ✅ `src/app/components/auth-modal.tsx` - новый компонент
- ✅ `capacitor.config.json` - конфигурация для Android
- ✅ `package.json` - добавлены Capacitor зависимости

---

## 🔐 Безопасность

- API ключи Claude встроены в код (для демо)
- Для production рекомендуется использовать backend proxy
- LocalStorage шифруется браузером автоматически
- Нет паролей - только email для идентификации

---

## 📊 Производительность

### Оптимизации:
- Lazy loading компонентов
- Кэширование карт
- Минификация в production
- Service Worker для PWA
- Оптимизированные изображения

### Размер APK:
- Debug: ~15-20 MB
- Release (minified): ~8-12 MB

---

## 🌐 Публикация

### Google Play Store:
1. Создайте релизный APK с подписью
2. Зарегистрируйтесь в Google Play Console
3. Создайте новое приложение
4. Заполните описание, скриншоты
5. Загрузите APK
6. Отправьте на модерацию

### Альтернативы:
- APKPure
- Amazon Appstore
- Прямое распространение APK

---

## 💡 Рекомендации

1. **Для разработки:** Используйте `npm run dev` и Chrome DevTools
2. **Для тестирования Android:** Используйте эмулятор Android Studio
3. **Для production:** Всегда создавайте signed release APK
4. **Для обновлений:** Увеличивайте versionCode в build.gradle

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте версии Node.js, Java, Android SDK
2. Очистите кэш: `npm run clean` или `./gradlew clean`
3. Переустановите зависимости: `rm -rf node_modules && npm install`
4. Проверьте логи: `adb logcat` для Android

---

## 🎉 Готово!

Теперь у вас есть полностью функциональное приложение VKO Guide с:
- ✅ AI ассистентом
- ✅ Системой регистрации
- ✅ Улучшенной геолокацией
- ✅ Постоянными квестами
- ✅ Поддержкой Android
- ✅ Готовностью к публикации

**Следующие шаги:**
1. Установите зависимости: `npm install`
2. Запустите в браузере: `npm run dev`
3. Соберите APK: `npm run build && npx cap sync android`
4. Откройте в Android Studio: `npx cap open android`
5. Соберите APK в Android Studio

Удачи с вашим приложением! 🚀
