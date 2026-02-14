# Инструкция по созданию Android APK через TWA (Trusted Web Activity)

## Что такое TWA?
Trusted Web Activity (TWA) - это технология Google, которая позволяет упаковать веб-приложение (PWA) в нативное Android приложение (.apk). Приложение откроется в полноэкранном режиме Chrome без адресной строки, выглядя как нативное приложение.

## Подготовка

### 1. Установите необходимые инструменты:

```bash
# Node.js и npm должны быть установлены
node --version
npm --version

# Установите bubblewrap-cli (утилита Google для создания TWA)
npm install -g @bubblewrap/cli
```

### 2. Установите Android SDK:

**Вариант A: Через Android Studio (рекомендуется)**
1. Скачайте и установите Android Studio: https://developer.android.com/studio
2. Откройте Android Studio → Settings → Android SDK
3. Установите Android SDK Platform 34 (или выше)
4. Установите Android SDK Build-Tools

**Вариант B: Через командную строку (только SDK)**
```bash
# Скачайте Command Line Tools: https://developer.android.com/studio#command-tools
# Распакуйте и добавьте в PATH
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### 3. Установите Java Development Kit (JDK):

```bash
# Проверьте версию Java
java --version

# Если нет, установите JDK 17 или выше
# Ubuntu/Debian:
sudo apt install openjdk-17-jdk

# macOS (через Homebrew):
brew install openjdk@17

# Windows: скачайте с https://adoptium.net/
```

## Создание APK

### Способ 1: Автоматическая сборка через Bubblewrap (РЕКОМЕНДУЕТСЯ)

1. **Разместите ваше PWA приложение на хостинге**
   
   Важно! TWA требует, чтобы приложение было доступно по HTTPS.
   
   Варианты хостинга:
   - **Vercel** (бесплатно): https://vercel.com
   - **Netlify** (бесплатно): https://netlify.com
   - **GitHub Pages** (бесплатно): https://pages.github.com
   - **Firebase Hosting** (бесплатно): https://firebase.google.com/docs/hosting

   Пример для Vercel:
   ```bash
   npm install -g vercel
   cd vko-guide-complete
   vercel --prod
   # Запомните URL, например: https://vko-guide.vercel.app
   ```

2. **Инициализируйте TWA проект**

   ```bash
   cd vko-guide-complete
   bubblewrap init --manifest https://ваш-домен.com/manifest.json
   ```

   Ответьте на вопросы:
   - Application name: `ВКО Гид`
   - Package ID: `kz.vko.guide`
   - Start URL: `/`
   - Icon URL: `https://ваш-домен.com/icon-512.png`

3. **Соберите APK**

   ```bash
   bubblewrap build
   ```

   APK файл будет создан в директории: `app-release-signed.apk`

### Способ 2: Ручная сборка (если нужны кастомизации)

1. **Создайте Android проект структуру**

   ```
   android-twa/
   ├── app/
   │   ├── build.gradle
   │   └── src/
   │       └── main/
   │           ├── AndroidManifest.xml
   │           ├── res/
   │           │   ├── values/
   │           │   │   └── strings.xml
   │           │   ├── mipmap-*/
   │           │   │   └── ic_launcher.png
   │           │   └── drawable/
   │           │       └── splash.png
   │           └── java/
   ├── build.gradle
   ├── settings.gradle
   └── gradle.properties
   ```

2. **Создайте keystore для подписи**

   ```bash
   keytool -genkey -v -keystore android.keystore -alias android \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

   Введите пароль и данные для сертификата.

3. **Соберите проект через Gradle**

   ```bash
   cd android-twa
   ./gradlew assembleRelease
   ```

   APK будет в: `app/build/outputs/apk/release/app-release.apk`

### Способ 3: Онлайн сервисы (самый простой для начинающих)

**PWABuilder** (https://www.pwabuilder.com/)
1. Откройте https://www.pwabuilder.com
2. Введите URL вашего PWA приложения
3. Нажмите "Start"
4. Выберите "Android" → "Generate Package"
5. Скачайте готовый .apk файл

**Bubblewrap Web Tool** (https://bubblewrap.dev/)
1. Откройте https://bubblewrap.dev
2. Следуйте инструкциям визуального конструктора
3. Скачайте готовый проект или APK

## Настройка Digital Asset Links (для production)

Для того чтобы TWA работало без панели Chrome, нужно настроить Digital Asset Links:

1. Создайте файл `.well-known/assetlinks.json` на вашем сервере:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "kz.vko.guide",
    "sha256_cert_fingerprints": [
      "ВАШ_SHA256_FINGERPRINT"
    ]
  }
}]
```

2. Получите SHA256 fingerprint из keystore:

```bash
keytool -list -v -keystore android.keystore -alias android
```

3. Разместите `assetlinks.json` по адресу:
   `https://ваш-домен.com/.well-known/assetlinks.json`

## Тестирование APK

### На эмуляторе:
```bash
# Создайте эмулятор через Android Studio или:
emulator -avd Pixel_4_API_34
adb install app-release-signed.apk
```

### На реальном устройстве:
1. Включите "Режим разработчика" на Android устройстве
2. Включите "Отладка по USB"
3. Подключите устройство к компьютеру
4. ```bash
   adb devices  # Проверьте подключение
   adb install app-release-signed.apk
   ```

## Публикация в Google Play Store

1. Создайте аккаунт разработчика Google Play ($25 единоразовый платеж)
2. Откройте Google Play Console: https://play.google.com/console
3. Создайте новое приложение
4. Загрузите APK или AAB (Android App Bundle)
5. Заполните детали приложения:
   - Название: ВКО Гид
   - Описание
   - Скриншоты (минимум 2)
   - Иконка
   - Feature Graphic
6. Настройте категорию: Путешествия
7. Установите возрастное ограничение
8. Опубликуйте приложение

## Альтернатива: Создание AAB (рекомендуется для Google Play)

AAB (Android App Bundle) - предпочтительный формат для Google Play:

```bash
bubblewrap build --buildMode=release --bundleMode
```

Или через Gradle:
```bash
./gradlew bundleRelease
```

AAB будет в: `app/build/outputs/bundle/release/app-release.aab`

## Полезные команды

```bash
# Проверить установленные устройства
adb devices

# Установить APK
adb install app-release.apk

# Удалить приложение
adb uninstall kz.vko.guide

# Посмотреть логи приложения
adb logcat | grep VKO

# Обновить bubblewrap
bubblewrap update
```

## Решение проблем

### Ошибка: "Android SDK not found"
```bash
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Ошибка: "Java version mismatch"
Установите JDK 17:
```bash
sudo apt install openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### Приложение показывает URL bar
- Проверьте что `assetlinks.json` доступен
- Проверьте SHA256 fingerprint совпадает
- Убедитесь что домен в манифесте совпадает с реальным

### APK не устанавливается
- Проверьте версию Android (минимум API 21 / Android 5.0)
- Разрешите установку из неизвестных источников
- Проверьте что APK подписан корректно

## Быстрый старт (для нетерпеливых)

```bash
# 1. Установка инструментов
npm install -g @bubblewrap/cli vercel

# 2. Деплой PWA
cd vko-guide-complete
vercel --prod

# 3. Создание TWA
bubblewrap init --manifest https://ваш-url.vercel.app/manifest.json

# 4. Сборка APK
bubblewrap build

# 5. Установка на устройство
adb install app-release-signed.apk
```

Готово! Ваше приложение установлено на Android! 🚀

## Дополнительные ресурсы

- Bubblewrap документация: https://github.com/GoogleChromeLabs/bubblewrap
- TWA Quick Start Guide: https://developer.chrome.com/docs/android/trusted-web-activity/
- PWABuilder: https://www.pwabuilder.com
- Digital Asset Links: https://developers.google.com/digital-asset-links/v1/getting-started
