#!/bin/bash

# ВКО Гид - Скрипт автоматической сборки APK
# Использует bubblewrap для создания Trusted Web Activity

set -e

echo "🚀 ВКО Гид - Сборка Android APK"
echo "================================"
echo ""

# Проверка установки Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js найден: $(node --version)"

# Проверка установки npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi
echo "✅ npm найден: $(npm --version)"

# Проверка/установка bubblewrap
if ! command -v bubblewrap &> /dev/null; then
    echo "📦 Установка @bubblewrap/cli..."
    npm install -g @bubblewrap/cli
fi
echo "✅ bubblewrap найден"

# Проверка Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME не установлен"
    echo "Установите Android Studio или Android SDK"
    echo "Затем выполните: export ANDROID_HOME=/path/to/android-sdk"
    read -p "Продолжить без Android SDK? (сборка может не удасться) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Android SDK найден: $ANDROID_HOME"
fi

# Проверка Java
if ! command -v java &> /dev/null; then
    echo "⚠️  Java не установлен"
    echo "Установите JDK 17 или выше"
    read -p "Продолжить без Java? (сборка может не удасться) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Java найден: $(java --version | head -n 1)"
fi

echo ""
echo "📋 Настройка проекта TWA"
echo "========================="
echo ""

# Запрос URL приложения
read -p "Введите URL вашего PWA (например: https://vko-guide.vercel.app): " APP_URL

if [ -z "$APP_URL" ]; then
    echo "❌ URL не может быть пустым"
    exit 1
fi

# Проверка доступности manifest.json
echo "🔍 Проверка $APP_URL/manifest.json..."
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/manifest.json")
    if [ "$HTTP_CODE" != "200" ]; then
        echo "⚠️  Предупреждение: manifest.json не найден (HTTP $HTTP_CODE)"
        echo "Убедитесь что ваше PWA развёрнуто и доступно"
        read -p "Продолжить? [y/N]: " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ manifest.json найден"
    fi
fi

echo ""
echo "🏗️  Инициализация TWA проекта..."
echo ""

# Создание TWA проекта
cd "$(dirname "$0")/.."

if [ ! -f "twa-manifest.json" ]; then
    echo "Инициализация нового TWA проекта..."
    bubblewrap init --manifest "$APP_URL/manifest.json" || {
        echo ""
        echo "❌ Ошибка инициализации"
        echo ""
        echo "Попробуйте ручную инициализацию:"
        echo "  cd vko-guide-complete"
        echo "  bubblewrap init --manifest $APP_URL/manifest.json"
        exit 1
    }
else
    echo "✅ TWA проект уже инициализирован"
    
    # Обновление URL в существующем проекте
    echo "Обновление startUrl в twa-manifest.json..."
    if command -v jq &> /dev/null; then
        jq --arg url "$APP_URL" '.startUrl = $url | .host = ($url | sub("https?://"; "") | sub("/.*"; ""))' twa-manifest.json > twa-manifest.tmp
        mv twa-manifest.tmp twa-manifest.json
    else
        echo "⚠️  jq не установлен, обновите startUrl вручную в twa-manifest.json"
    fi
fi

echo ""
echo "🔨 Сборка APK..."
echo ""

# Сборка APK
bubblewrap build || {
    echo ""
    echo "❌ Ошибка сборки APK"
    echo ""
    echo "Возможные причины:"
    echo "1. Android SDK не настроен корректно"
    echo "2. Не установлена нужная версия Android Build Tools"
    echo "3. Проблемы с keystore"
    echo ""
    echo "Попробуйте:"
    echo "  - Установите Android Studio"
    echo "  - Настройте ANDROID_HOME"
    echo "  - Выполните: bubblewrap doctor"
    exit 1
}

echo ""
echo "✅ APK успешно собран!"
echo ""

# Поиск APK файла
APK_FILE=$(find . -name "app-release-signed.apk" -o -name "app-release.apk" | head -n 1)

if [ -n "$APK_FILE" ]; then
    APK_SIZE=$(du -h "$APK_FILE" | cut -f1)
    echo "📦 APK файл: $APK_FILE"
    echo "📏 Размер: $APK_SIZE"
    echo ""
    
    # Копирование в outputs
    cp "$APK_FILE" "vko-guide.apk"
    echo "✅ APK скопирован: vko-guide.apk"
    echo ""
fi

echo "🎉 Сборка завершена!"
echo ""
echo "📱 Установка на устройство:"
echo "   adb install vko-guide.apk"
echo ""
echo "📤 Публикация в Google Play:"
echo "   https://play.google.com/console"
echo ""
