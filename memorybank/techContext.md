# Tech Context: Building Agency

## Используемые технологии

### Core
- **Next.js 14.2.21** → React framework с App Router
- **React 18.3.1** → UI библиотека
- **TypeScript 5.7.2** → Типизация

### Styling
- **Tailwind CSS 3.4.15** → Утилитарный CSS
- **PostCSS 8.4.49** → CSS трансформации
- **Autoprefixer 10.4.20** → Вендорные префиксы

### Утилиты
- **clsx 2.1.1** → Конкатенация классов
- **tailwind-merge 2.5.5** → Слияние Tailwind классов
- **lucide-react 0.468.0** → Иконки

## Конфигурация

### Tailwind
- Файл: `tailwind.config.ts`
- Кастомные цвета: `primary`, `secondary`, `gray`
- Кастомные классы: `container-custom`, `section-padding`

### TypeScript
- Файл: `tsconfig.json`
- Path aliases: `@/*` → корень проекта

### Next.js
- Файл: `next.config.mjs`
- App Router включён
- Статическая генерация по умолчанию

## Ограничения
- **localStorage** → только клиентская сторона, проверка `isClient`
- **SSR** → UI компоненты используют "use client"
- **Нет backend** → все данные статические

## Развёртывание
- **Vercel** → автоматическое развёртывание из `.vercel/`
- **Build**: `npm run build` или `next build`
- **Dev**: `npm run dev` → localhost:3000