# Git Commits для VKO Guide

Используйте эти сообщения для коммитов в хронологическом порядке:

```bash
git add src/app/components/ai-chat.tsx src/app/components/ai-chat-button.tsx
git commit -m "add ai assistant chat component"

git add src/app/components/auth-modal.tsx
git commit -m "implement user registration without passwords"

git add src/app/db.ts
git commit -m "enhance database with quest progress tracking"

git add src/app/App.tsx
git commit -m "integrate ai chat and auth modal"

git add capacitor.config.json
git commit -m "add capacitor config for android support"

git add package.json
git commit -m "update dependencies for mobile build"

git add SETUP_GUIDE.md
git commit -m "add comprehensive setup documentation"

git commit -m "improve geolocation with manual city selection"

git commit -m "fix quest persistence between sessions"

git commit -m "optimize mobile responsiveness"
```

## Альтернативные варианты сообщений (выберите по вкусу):

### Для AI чата:
- "add tourism assistant for vko region"
- "implement ai guide functionality"
- "create chat interface for tourists"

### Для авторизации:
- "add guest mode and registration"
- "implement passwordless auth system"
- "create profile management"

### Для базы данных:
- "refactor local storage structure"
- "add quest completion tracking"
- "improve data persistence"

### Для геолокации:
- "add fallback for geolocation errors"
- "implement manual location selection"
- "improve location handling"

### Для Android:
- "prepare project for android build"
- "add capacitor integration"
- "configure mobile platform support"

## Пример workflow для всего проекта:

```bash
# 1. Инициализация (если еще не сделано)
git init
git branch -M main

# 2. Добавление всех файлов по частям
git add src/app/components/ai-chat*
git commit -m "add ai tourism assistant"

git add src/app/components/auth-modal.tsx src/app/db.ts
git commit -m "implement user system with guest mode"

git add src/app/App.tsx
git commit -m "integrate new features into main app"

git add capacitor.config.json package.json
git commit -m "configure android build support"

git add SETUP_GUIDE.md
git commit -m "add setup and build documentation"

git add .
git commit -m "finalize vko guide improvements"

# 3. Подключение к удаленному репозиторию
git remote add origin https://github.com/sqweezy724-maker/VKO-Guide.git

# 4. Пуш изменений
git push -u origin main
```

## Рекомендации по коммитам:

1. **Будьте кратки** - одна строка, до 50 символов
2. **Используйте повелительное наклонение** - "add", "fix", "update", не "added", "fixed"
3. **Без точек в конце** - "add feature" не "add feature."
4. **Группируйте связанные изменения** - не делайте слишком много мелких коммитов
5. **Понятные сообщения** - другие должны понимать что изменилось

## Примеры хороших коммитов:

✅ "add ai chat assistant"
✅ "fix geolocation on mobile"
✅ "update quest system persistence"
✅ "improve auth flow"
✅ "configure android build"

## Примеры плохих коммитов:

❌ "update" (что именно?)
❌ "fixes" (что починили?)
❌ "asdfgh" (не информативно)
❌ "Added new amazing super cool AI feature!!!!" (слишком эмоционально)
❌ "fix bug fix bug fix" (повторения)
