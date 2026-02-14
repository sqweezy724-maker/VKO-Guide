# Инструкция по созданию Android APK через TWA (Trusted Web Activity)

## 🎯 Что такое TWA?

TWA (Trusted Web Activity) - это технология Google, которая позволяет упаковать веб-приложение PWA в нативное Android-приложение (.apk или .aab) без написания нативного кода. Приложение будет работать как полноценное Android-приложение и может быть опубликовано в Google Play Store.

## 📋 Требования

1. **Android Studio** (последняя версия) - [скачать](https://developer.android.com/studio)
2. **JDK 11 или выше**
3. **Развёрнутое PWA приложение** на домене (например, на Vercel, Netlify, Firebase)

## 🚀 Шаг 1: Настройка проекта

### 1.1 Откройте Android Studio
```bash
# Откройте папку android/ в Android Studio
File → Open → выберите папку /android
```

### 1.2 Настройте домен в build.gradle
Откройте `android/app/build.gradle` и замените:
```gradle
manifestPlaceholders = [
    hostName: "vko-guide.vercel.app",  // ← ВАШЕ_ДОМЕННОЕ_ИМЯ
    defaultUrl: "https://vko-guide.vercel.app",  // ← ПОЛНЫЙ URL
    // остальное оставьте как есть
]
```

## 🔐 Шаг 2: Создание ключа подписи

### 2.1 Генерация keystore
```bash
# В терминале Android Studio
keytool -genkey -v -keystore vko-guide-release.keystore \
  -alias vko-guide \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Введите пароль и заполните данные
```

### 2.2 Получение SHA-256 fingerprint
```bash
keytool -list -v -keystore vko-guide-release.keystore \
  -alias vko-guide

# Скопируйте SHA256: строку
```

### 2.3 Создайте файл key.properties
Создайте `android/key.properties`:
```properties
storePassword=ВАШ_ПАРОЛЬ
keyPassword=ВАШ_ПАРОЛЬ
keyAlias=vko-guide
storeFile=../vko-guide-release.keystore
```

### 2.4 Обновите app/build.gradle
Добавьте перед `android {`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Добавьте в `android {` блок:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## 🌐 Шаг 3: Digital Asset Links

### 3.1 Обновите assetlinks.json
В файле `public/.well-known/assetlinks.json` вставьте ваш SHA256:
```json
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "kz.vko.guide",
    "sha256_cert_fingerprints": [
      "AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56"
    ]
  }
}
```

### 3.2 Разместите assetlinks.json на сервере
Файл должен быть доступен по адресу:
```
https://YOUR_DOMAIN/.well-known/assetlinks.json
```

Проверьте доступность:
```bash
curl https://YOUR_DOMAIN/.well-known/assetlinks.json
```

## 📱 Шаг 4: Добавление иконок

### 4.1 Создайте иконки приложения
Используйте [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) или создайте вручную:

- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Поместите их в:
```
android/app/src/main/res/mipmap-{density}/
```

## 🔨 Шаг 5: Сборка APK

### 5.1 Сборка через Android Studio
```
Build → Generate Signed Bundle / APK
→ APK
→ Выберите keystore
→ release
→ Finish
```

### 5.2 Сборка через командную строку
```bash
cd android
./gradlew assembleRelease

# APK будет в:
# android/app/build/outputs/apk/release/app-release.apk
```

## 📦 Шаг 6: Тестирование APK

### 6.1 Установка на устройство
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

### 6.2 Проверка Digital Asset Links
1. Откройте приложение
2. Перейдите в Settings → Apps → VKO Guide → Open by default
3. Должно быть: "Verified for: your-domain.com"

## 🎨 Дополнительные настройки

### Изменение темы и цветов
Откройте `android/app/src/main/res/values/colors.xml`:
```xml
<color name="colorPrimary">#15803d</color>  <!-- Основной цвет -->
<color name="colorPrimaryDark">#14532d</color>  <!-- Тёмный оттенок -->
```

### Изменение splash screen
Замените `android/app/src/main/res/drawable/splash.xml` своей графикой

## 📤 Публикация в Google Play

### 1. Создайте AAB (Android App Bundle)
```bash
./gradlew bundleRelease
```

### 2. Загрузите в Google Play Console
1. Создайте приложение в [Google Play Console](https://play.google.com/console)
2. Загрузите AAB файл
3. Заполните описание, скриншоты
4. Отправьте на ревью

## ⚠️ Возможные проблемы

### Проблема: "Digital Asset Links verification failed"
**Решение:**
1. Проверьте что assetlinks.json доступен по HTTPS
2. SHA256 fingerprint должен совпадать с keystore
3. package_name должен быть "kz.vko.guide"

### Проблема: APK не устанавливается
**Решение:**
1. Проверьте что USB debugging включен
2. Удалите старую версию: `adb uninstall kz.vko.guide`
3. Переустановите

### Проблема: Приложение открывается в браузере
**Решение:**
1. Digital Asset Links не настроены правильно
2. Проверьте assetlinks.json
3. Очистите данные Chrome: Settings → Apps → Chrome → Storage → Clear data

## 📝 Чек-лист перед публикацией

- [ ] PWA развёрнуто и работает на HTTPS
- [ ] assetlinks.json доступен на вашем домене
- [ ] SHA256 fingerprint совпадает в assetlinks.json и keystore
- [ ] Иконки приложения созданы для всех плотностей
- [ ] APK подписан release ключом
- [ ] Приложение протестировано на реальном устройстве
- [ ] Digital Asset Links проверены и работают
- [ ] Описание, скриншоты, privacy policy готовы для Play Store

## 🎉 Готово!

После успешной сборки у вас будет полноценное Android приложение, которое:
- ✅ Работает как нативное приложение
- ✅ Открывает ваш PWA без адресной строки браузера
- ✅ Может быть опубликовано в Google Play Store
- ✅ Поддерживает все PWA функции (offline, push notifications)
- ✅ Автоматически обновляется при обновлении PWA

## 🔗 Полезные ссылки

- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) - инструмент для автоматизации
- [PWABuilder](https://www.pwabuilder.com/) - альтернативный способ создания APK
- [Digital Asset Links Tester](https://developers.google.com/digital-asset-links/tools/generator)

Удачи! 🚀
