# Обновления ВКО Гид v3 - Финальные исправления + Android APK

## Внесённые изменения (v3)

### 🔧 НОВЫЕ ИСПРАВЛЕНИЯ

#### 1. **Исправлен белый экран в квестах** 🎮
- **Проблема**: При переходе на вкладку "Постоянные квесты" на телефоне отображался белый экран
- **Решение**: 
  - Добавлен явный цвет фона для Content области: `bg-gray-900` (темная тема) или `bg-white` (светлая тема)
  - Теперь фон корректно отображается на всех устройствах

#### 2. **Добавлен Swipe для закрытия модальных окон** 👆
- **Функционал**: Теперь можно смахнуть модальное окно квестов вниз для закрытия
- **Технология**:
  - Touch events обработчики (`touchStart`, `touchMove`, `touchEnd`)
  - Визуальный индикатор для свайпа (серая полоска вверху на мобильных)
  - Плавная анимация при свайпе
  - Минимальная дистанция: 50px для срабатывания

```typescript
// Swipe вниз для закрытия
<div 
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{
    transform: `translateY(${swipeDistance}px)`,
    transition: swipeDistance === 0 ? 'transform 0.3s' : 'none'
  }}
>
```

#### 3. **Android APK через TWA (Trusted Web Activity)** 📱
- **Новая возможность**: Создание нативного Android приложения из PWA
- **Файлы**:
  - `android-twa/BUILD_APK_GUIDE.md` - полная инструкция по сборке
  - `android-twa/build-apk.sh` - автоматический скрипт сборки
  - `android-twa/bubblewrap.json` - конфигурация TWA
  - `android-twa/app/` - структура Android проекта

### 📋 Как собрать Android APK

#### Быстрый способ (рекомендуется):

```bash
# 1. Деплой PWA на хостинг
npm install -g vercel
vercel --prod
# Получите URL: https://your-app.vercel.app

# 2. Соберите APK
cd vko-guide-complete/android-twa
chmod +x build-apk.sh
./build-apk.sh

# 3. Установите на телефон
adb install vko-guide.apk
```

#### Альтернативные способы:

1. **PWABuilder** (онлайн, самый простой):
   - Откройте https://www.pwabuilder.com
   - Введите URL вашего PWA
   - Скачайте готовый APK

2. **Bubblewrap CLI** (командная строка):
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://your-url.com/manifest.json
   bubblewrap build
   ```

3. **Android Studio** (полный контроль):
   - Импортируйте проект из `android-twa/`
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

Подробная инструкция: `android-twa/BUILD_APK_GUIDE.md`

---

## Предыдущие изменения (v2)

### 🔧 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

#### 1. **Исправлена автоматическая панорама** 🎯
- Добавлен отдельный обработчик события `zoomend` карты
- Автоматическое открытие при zoom level 18 в режиме "panorama"

#### 2. **Исправлена кнопка геолокации** 📍
- Индикатор загрузки (spinner)
- Детальные сообщения об ошибках
- Таймауты и точные настройки GPS

#### 3. **Исправлена загрузка внешних сайтов** 🌐
- Service Worker не блокирует внешние домены
- CSP обновлён для всех ресурсов
- iframe с sandbox и lazy loading

---

## Предыдущие изменения (v1)

### 1. Ограничение зума для спутника
- Satellite mode: maxZoom 16

### 2. 360° панорама
- Mapillary, Google Street View
- Полноэкранный режим

### 3. PWA поддержка
- Установка на домашний экран
- Работа офлайн
- Service Worker

---

## Установка и запуск

```bash
npm install
npm run dev
```

## Тестирование новых функций

### Проверка swipe в квестах:
1. Откройте приложение на телефоне (или эмулируйте touch в DevTools)
2. Откройте меню квестов (иконка подарка)
3. Смахните окно вниз - оно должно закрыться

### Проверка фона квестов:
1. Откройте квесты на телефоне
2. Переключитесь между вкладками (Ежедневные / Постоянные / Награды)
3. Фон должен быть белым (светлая тема) или серым (темная тема)

### Создание APK:
1. Разверните PWA на Vercel/Netlify
2. Запустите `./android-twa/build-apk.sh`
3. Установите `vko-guide.apk` на Android устройство

---

## Что исправлено в деталях

| Версия | Проблема | Решение |
|--------|----------|---------|
| v3 | Белый экран в квестах | Добавлен bg-gray-900/bg-white |
| v3 | Неудобно закрывать на телефоне | Swipe вниз для закрытия |
| v3 | Нет Android приложения | TWA + инструкции сборки APK |
| v2 | Панорама не открывается | Обработчик zoomend |
| v2 | Геолокация не работает | Spinner + обработка ошибок |
| v2 | iframe не грузятся | SW минует внешние домены |

---

## Структура Android проекта

```
android-twa/
├── BUILD_APK_GUIDE.md     # Подробная инструкция
├── build-apk.sh           # Скрипт автосборки
├── bubblewrap.json        # Конфигурация TWA
└── app/
    ├── build.gradle       # Gradle конфигурация
    └── src/main/
        └── AndroidManifest.xml
```

---

## Технологии

- **PWA**: Service Worker, Manifest, Offline support
- **TWA**: Google's Trusted Web Activity для Android
- **Swipe**: Touch Events API
- **Геолокация**: Navigator Geolocation API
- **360°**: Mapillary Embed, Google Street View API

---

## Публикация

### Web:
- Vercel: `vercel --prod`
- Netlify: `netlify deploy --prod`

### Android:
1. Соберите APK через TWA
2. Создайте аккаунт Google Play Console ($25)
3. Загрузите APK/AAB
4. Заполните Store Listing
5. Опубликуйте

---

Удачи! 🚀

## Внесённые изменения (v2)

### 🔧 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

#### 1. **Исправлена автоматическая панорама** 🎯
- **Проблема**: Панорама не открывалась автоматически при максимальном зуме
- **Решение**: 
  - Добавлен отдельный обработчик события `zoomend` карты Leaflet
  - Теперь при достижении zoom level 18 в режиме "panorama" автоматически открывается полноэкранная 360° панорама
  - Добавлена небольшая задержка (300ms) для плавности

#### 2. **Исправлена кнопка геолокации** 📍
- **Проблема**: Геолокация не работала, не было обратной связи
- **Решение**:
  - Добавлен индикатор загрузки (spinner) на кнопке геолокации
  - Улучшена обработка ошибок с понятными сообщениями на русском и казахском
  - Добавлены таймауты и более точные настройки GPS
  - Детальные сообщения для разных типов ошибок:
    - PERMISSION_DENIED: просьба разрешить доступ
    - TIMEOUT: предложение попробовать снова
    - POSITION_UNAVAILABLE: проверка настроек

#### 3. **Исправлена загрузка внешних сайтов** 🌐
- **Проблема**: iframe с внешними сайтами не загружались, Service Worker блокировал запросы
- **Решение**:
  - **Service Worker переработан**:
    - Внешние домены (Google, Mapillary, OpenStreetMap, Yandex) НЕ кэшируются
    - API и tile серверы пропускаются напрямую без кэширования
    - Только локальные файлы проходят через Service Worker
  - **CSP обновлён**: Добавлен permissive Content-Security-Policy для загрузки всех внешних ресурсов
  - **iframe улучшены**:
    - Добавлены атрибуты `sandbox` для безопасности
    - Атрибут `loading="lazy"` для ускорения загрузки
    - Уникальные `key` для правильного обновления при смене координат

### 📋 Технические детали исправлений

#### MapController (map-view.tsx):
```typescript
// Отдельный эффект для отслеживания зума
useEffect(() => {
  const handleZoomEnd = () => {
    const currentZoom = map.getZoom();
    if (mapMode === "panorama" && currentZoom >= 18 && onOpenPanorama) {
      setTimeout(() => {
        onOpenPanorama();
      }, 300);
    }
  };

  map.on('zoomend', handleZoomEnd);
  
  return () => {
    map.off('zoomend', handleZoomEnd);
  };
}, [map, mapMode, onOpenPanorama]);
```

#### Service Worker (sw.js):
```javascript
// НЕ кэшируем внешние домены
const isExternal = url.origin !== self.location.origin;
const isApiOrTile = url.pathname.includes('/tile/') || 
                     url.hostname.includes('googleapis.com') ||
                     url.hostname.includes('mapillary.com') ||
                     // ... другие внешние сервисы

if (isExternal || isApiOrTile) {
  event.respondWith(fetch(event.request)); // Прямой проход
  return;
}
```

#### Геолокация (App.tsx):
```typescript
const [isGeolocating, setIsGeolocating] = useState(false);

navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback,
  { 
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);
```

---

## Предыдущие изменения (v1)

### 1. Ограничение зума для режима спутника
- В режиме "satellite" установлен `maxZoom: 16` (вместо 18)
- Теперь не будет ошибок незагруженных текстур

### 2. 360° панорама при максимальном зуме
- **Бесплатные сервисы:**
  - **Mapillary** - street view от OpenStreetMap
  - **Google Street View** - встроенная панорама
  - Ссылки на OpenStreetMap, Google Maps, Яндекс.Карты

### 3. PWA поддержка
- ✅ Установка на домашний экран
- ✅ Работа офлайн
- ✅ Автономный режим
- ✅ Кэширование ресурсов

---

## Установка и запуск

```bash
npm install
npm run dev
```

## Тестирование исправлений

### Проверка автоматической панорамы:
1. Переключитесь в режим "Panorama" (360°)
2. Приблизьте карту до максимума (используя кнопку + или колесо мыши)
3. При достижении zoom 18 должна автоматически открыться полноэкранная панорама

### Проверка геолокации:
1. Нажмите кнопку геолокации (иконка компаса)
2. Должен появиться анимированный spinner
3. Браузер запросит разрешение на доступ к местоположению
4. После получения координат карта переместится к вашей позиции

### Проверка внешних сайтов:
1. Откройте полноэкранную панораму
2. Все iframe (Mapillary, Google Street View) должны загружаться
3. Ссылки должны открываться в новых вкладках
4. Нет ошибок в консоли браузера

---

## Что исправлено в деталях

| Проблема | Было | Стало |
|----------|------|-------|
| Панорама не открывается | zoom проверялся в useEffect | Отдельный обработчик zoomend |
| Геолокация молча падает | Без обработки ошибок | Детальные сообщения + индикатор |
| iframe не грузятся | SW кэширует всё | Внешние домены минуют SW |
| Нет обратной связи | - | Spinner, статусы, ошибки |

---

## Для разработчиков

### Debug режим:
```javascript
// В консоли браузера
navigator.serviceWorker.getRegistrations().then(r => r.forEach(w => w.unregister()))
// Перезагрузите страницу для очистки кэша SW
```

### Проверка Service Worker:
- DevTools → Application → Service Workers
- Убедитесь что внешние запросы проходят напрямую

### Проверка геолокации:
- DevTools → Console
- Включите "Geolocation error:" для просмотра ошибок

Удачи! 🚀
