# Style Guide: Building Agency

## UI/UX Design Patterns

### Цветовая схема
```css
/* tailwind.config.ts цвета */
primary:    #0066CC    /* Основной цвет кнопок, ссылок */
secondary:  #1E293B    /* Заголовки, текст */
success:    #22C55E    /* Свободно (зелёный) */
warning:    #EAB308    /* Бронь (жёлтый) */
danger:     #EF4444    /* Продано (красный) */
info:       #2563EB    /* Куплено (синий) */
```

### Типографика
- Заголовки: `text-secondary-800`, `font-bold`
- Основной текст: `text-gray-600`
- Метки: `text-sm`, `text-gray-500`

### Отступы
- Контейнер: `container-custom` (max-w + mx-auto + px)
- Секции: `section-padding` (py-16 md:py-24)
- Карточки: `p-4`, `rounded-lg`, `shadow-sm`

### Интерактивность
- Hover: `hover:bg-primary-600`, `hover:scale-105`, `hover:shadow-lg`
- Transitions: `transition-all duration-200`
- Кнопки: `cursor-pointer`, `disabled:opacity-50`, `disabled:cursor-not-allowed`

## Code Style Conventions

### React компоненты
```tsx
// 1. "use client" для интерактивных компонентов
"use client";

import { useState, useEffect, useMemo } from "react";

// 2. Именование: PascalCase
export function ApartmentPool() { }

// 3. Props деструктуризация
interface Props {
  variant?: "primary" | "outline";
}
export function Button({ variant = "primary" }: Props) { }
```

### Хуки
- `useState` → инициализация с правильными типами
- `useEffect` → для localStorage (проверка `if (!isClient) return`)
- `useMemo` → для expensive вычислений (фильтрация, статистика)

### Утилиты
```typescript
// Использовать cn() для динамических классов
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  condition && "conditional-class",
  variant === "primary" && "primary-class"
)} />
```

### Форматирование цен
```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
};
```

## Design System Components

### Button
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  <Icon className="w-5 h-5 mr-2" />
  Текст
</Button>
```

### Статус квартиры (цвета)
```tsx
const statusConfig = {
  free: { color: "bg-green-500 hover:bg-green-600", label: "Свободно" },
  sold: { color: "bg-red-500 hover:bg-red-600", label: "Продано" },
  reserved: { color: "bg-yellow-500 hover:bg-yellow-600", label: "Бронь" },
  my: { color: "bg-blue-600 hover:bg-blue-700", label: "Куплено" },
};
```

### Grid системы
```tsx
/* 2 колонки на моби, 4 на десктоп */
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

/* Квартиры на этаже: всегда 4 */
<div className="grid grid-cols-4 gap-2">
```

## Russian Localization
- Все тексты на русском языке
- Форматирование чисел: `Intl.NumberFormat("ru-RU")`
- Валюта: `₽` (рубль)
- Площадь: `м²` (квадратные метры)