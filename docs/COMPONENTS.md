# CiteGenerator.org - Component Specifications

> Next.js 14 Citation Generator with Tailwind CSS
> Production-ready component library with accessibility and responsive design

---

## Table of Contents

1. [Design System](#design-system)
2. [Component Tree](#component-tree)
3. [UI Primitives](#ui-primitives)
4. [Feature Components](#feature-components)
5. [Layout Components](#layout-components)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Responsive Breakpoints](#responsive-breakpoints)

---

## Design System

### Color Palette

```typescript
// tailwind.config.ts
const colors = {
  // Neutral (Slate)
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  // Primary (Blue)
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  // Success (Green)
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  // Warning/Ads (Yellow)
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    500: "#eab308",
    600: "#ca8a04",
  },
  // Error (Red)
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
  },
};
```

### Typography

```css
/* System font stack - no external fonts for speed */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji";

/* Font sizes */
.text-xs {
  font-size: 0.75rem;
} /* 12px - labels */
.text-sm {
  font-size: 0.875rem;
} /* 14px - body small */
.text-base {
  font-size: 1rem;
} /* 16px - body */
.text-lg {
  font-size: 1.125rem;
} /* 18px - emphasis */
.text-xl {
  font-size: 1.25rem;
} /* 20px - headings */
.text-2xl {
  font-size: 1.5rem;
} /* 24px - section titles */
.text-3xl {
  font-size: 1.875rem;
} /* 30px - page titles */
```

### Spacing Scale

```css
/* Consistent spacing */
.space-1  { 0.25rem }  /* 4px */
.space-2  { 0.5rem }   /* 8px */
.space-3  { 0.75rem }  /* 12px */
.space-4  { 1rem }     /* 16px */
.space-6  { 1.5rem }   /* 24px */
.space-8  { 2rem }     /* 32px */
.space-12 { 3rem }     /* 48px */
```

### Animation Tokens

```css
/* Transitions */
.transition-fast {
  transition-duration: 100ms;
}
.transition-normal {
  transition-duration: 150ms;
}
.transition-slow {
  transition-duration: 200ms;
}

/* Easing */
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
```

---

## Component Tree

```
app/
├── layout.tsx                    # RootLayout - html, body, providers
├── page.tsx                      # HomePage - main citation interface
├── globals.css                   # Global styles, Tailwind imports
│
└── components/
    ├── ui/                       # UI Primitives (atomic)
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Card.tsx
    │   ├── Badge.tsx
    │   ├── Spinner.tsx
    │   └── Toast.tsx
    │
    ├── features/                 # Feature Components (composed)
    │   ├── CitationForm.tsx
    │   ├── CitationResult.tsx
    │   ├── AffiliateAd.tsx
    │   └── FormatGuide.tsx
    │
    └── layout/                   # Layout Components
        ├── Header.tsx
        ├── Footer.tsx
        └── Container.tsx
```

---

## UI Primitives

### Button

**Location**: `components/ui/Button.tsx`

```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:ring-blue-500 focus:ring-offset-2
    disabled:bg-blue-300
  `,
  secondary: `
    bg-slate-100 text-slate-700
    hover:bg-slate-200
    focus:ring-slate-400 focus:ring-offset-2
    disabled:bg-slate-50 disabled:text-slate-400
  `,
  ghost: `
    bg-transparent text-slate-600
    hover:bg-slate-100 hover:text-slate-900
    focus:ring-slate-400
    disabled:text-slate-300
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg
          transition-all duration-150 ease-out
          focus:outline-none focus:ring-2
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="mr-2" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Usage**:

```tsx
// Primary button
<Button variant="primary" onClick={handleSubmit}>
  Generate Citation
</Button>

// With loading state
<Button variant="primary" isLoading>
  Generating...
</Button>

// Secondary with icon
<Button variant="secondary" leftIcon={<CopyIcon />}>
  Copy to Clipboard
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Clear
</Button>
```

---

### Input

**Location**: `components/ui/Input.tsx`

```typescript
import { forwardRef, InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              w-full px-4 py-2.5
              bg-white border rounded-lg
              text-slate-900 text-base
              placeholder:text-slate-400
              transition-all duration-150 ease-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-300 hover:border-slate-400'
              }
              ${leftAddon ? 'pl-10' : ''}
              ${rightAddon ? 'pr-10' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            {...props}
          />

          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Usage**:

```tsx
// Basic input with label
<Input
  label="Website URL"
  placeholder="https://example.com/article"
  type="url"
/>

// With error state
<Input
  label="URL"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  error="Please enter a valid URL"
/>

// With left addon (icon)
<Input
  label="URL"
  leftAddon={<LinkIcon className="w-5 h-5" />}
  placeholder="Paste your URL here"
/>

// With hint text
<Input
  label="Source URL"
  hint="Works with news sites, blogs, and academic sources"
/>
```

---

### Card

**Location**: `components/ui/Card.tsx`

```typescript
import { HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'elevated' | 'bordered';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white shadow-sm border border-slate-200',
  elevated: 'bg-white shadow-lg border border-slate-100',
  bordered: 'bg-white border-2 border-slate-200',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', className = '', children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`border-b border-slate-200 pb-4 mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-lg font-semibold text-slate-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`border-t border-slate-200 pt-4 mt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);
```

**Usage**:

```tsx
// Basic card
<Card>
  <p>Citation content here</p>
</Card>

// Elevated card with sections
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Your Citation</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Formatted citation text...</p>
  </CardContent>
  <CardFooter>
    <Button>Copy to Clipboard</Button>
  </CardFooter>
</Card>

// Bordered card for form sections
<Card variant="bordered">
  <CitationForm />
</Card>
```

---

### Badge

**Location**: `components/ui/Badge.tsx`

```typescript
import { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
```

**Usage**:

```tsx
// Format labels
<Badge variant="primary">APA 7th</Badge>
<Badge variant="primary">MLA 9th</Badge>
<Badge variant="default">Chicago 17th</Badge>

// Status indicators
<Badge variant="success" size="sm">Copied</Badge>
<Badge variant="warning" size="sm">Beta</Badge>
```

---

### Spinner

**Location**: `components/ui/Spinner.tsx`

```typescript
import { HTMLAttributes } from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

export function Spinner({
  size = 'md',
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        inline-block
        border-slate-200 border-t-blue-600
        rounded-full animate-spin
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
```

**Usage**:

```tsx
// In button
<Button isLoading>
  <Spinner size="sm" />
  Generating...
</Button>

// Standalone
<div className="flex justify-center py-8">
  <Spinner size="lg" />
</div>

// Full page loading
<div className="fixed inset-0 flex items-center justify-center bg-white/80">
  <Spinner size="lg" />
</div>
```

---

### Toast

**Location**: `components/ui/Toast.tsx`

```typescript
'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3
        border rounded-lg shadow-lg
        animate-slide-in
        ${typeStyles[toast.type]}
      `}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-auto p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

**CSS Animation** (add to globals.css):

```css
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 200ms ease-out;
}
```

**Usage**:

```tsx
// In layout.tsx
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

// In any component
import { useToast } from "@/components/ui/Toast";

function CitationResult() {
  const { addToast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation);
    addToast({
      type: "success",
      message: "Citation copied to clipboard!",
    });
  };

  return <Button onClick={handleCopy}>Copy</Button>;
}
```

---

## Feature Components

### CitationForm

**Location**: `components/features/CitationForm.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

type CitationFormat = 'apa' | 'mla' | 'chicago';

interface CitationFormProps {
  onSubmit: (url: string, format: CitationFormat) => Promise<void>;
  isLoading: boolean;
}

const formats: { value: CitationFormat; label: string; description: string }[] = [
  { value: 'apa', label: 'APA 7th', description: 'American Psychological Association' },
  { value: 'mla', label: 'MLA 9th', description: 'Modern Language Association' },
  { value: 'chicago', label: 'Chicago 17th', description: 'Chicago Manual of Style' },
];

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function CitationForm({ onSubmit, isLoading }: CitationFormProps) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<CitationFormat>('apa');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      await onSubmit(trimmedUrl, format);
    } catch (err) {
      setError('Failed to generate citation. Please try again.');
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <Input
          label="Website URL"
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          hint="Paste the URL of the webpage you want to cite"
          leftAddon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
          disabled={isLoading}
          aria-label="Enter website URL to cite"
        />

        {/* Format Selector */}
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-3">
            Citation Format
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formats.map((f) => (
              <label
                key={f.value}
                className={`
                  relative flex flex-col p-4 cursor-pointer
                  border-2 rounded-lg transition-all duration-150
                  ${format === f.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={format === f.value}
                  onChange={(e) => setFormat(e.target.value as CitationFormat)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span className="flex items-center gap-2">
                  <Badge
                    variant={format === f.value ? 'primary' : 'default'}
                    size="sm"
                  >
                    {f.label}
                  </Badge>
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  {f.description}
                </span>
                {format === f.value && (
                  <span className="absolute top-2 right-2 text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating Citation...' : 'Generate Citation'}
        </Button>
      </form>
    </Card>
  );
}
```

---

### CitationResult

**Location**: `components/features/CitationResult.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

type CitationFormat = 'apa' | 'mla' | 'chicago';

interface CitationData {
  apa: string;
  mla: string;
  chicago: string;
  metadata: {
    title: string;
    author?: string;
    date?: string;
    siteName?: string;
    url: string;
  };
}

interface CitationResultProps {
  citation: CitationData;
  initialFormat: CitationFormat;
  onCiteAnother: () => void;
}

const formatLabels: Record<CitationFormat, string> = {
  apa: 'APA 7th',
  mla: 'MLA 9th',
  chicago: 'Chicago 17th',
};

export function CitationResult({
  citation,
  initialFormat,
  onCiteAnother,
}: CitationResultProps) {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>(initialFormat);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const currentCitation = citation[activeFormat];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCitation);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Citation copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to copy. Please select and copy manually.',
      });
    }
  };

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Format Tabs */}
      <div
        className="flex border-b border-slate-200"
        role="tablist"
        aria-label="Citation formats"
      >
        {(Object.keys(formatLabels) as CitationFormat[]).map((format) => (
          <button
            key={format}
            role="tab"
            aria-selected={activeFormat === format}
            aria-controls={`panel-${format}`}
            id={`tab-${format}`}
            onClick={() => setActiveFormat(format)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium
              transition-all duration-150
              border-b-2 -mb-px
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
              ${activeFormat === format
                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            {formatLabels[format]}
          </button>
        ))}
      </div>

      {/* Citation Content */}
      <CardContent className="p-6">
        <div
          id={`panel-${activeFormat}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeFormat}`}
          className="space-y-4"
        >
          {/* Metadata Summary */}
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            {citation.metadata.siteName && (
              <span>{citation.metadata.siteName}</span>
            )}
            {citation.metadata.author && (
              <>
                <span aria-hidden="true">|</span>
                <span>{citation.metadata.author}</span>
              </>
            )}
            {citation.metadata.date && (
              <>
                <span aria-hidden="true">|</span>
                <span>{citation.metadata.date}</span>
              </>
            )}
          </div>

          {/* Citation Text */}
          <div
            className="
              p-4 bg-slate-50 rounded-lg border border-slate-200
              font-serif text-slate-800 leading-relaxed
              select-all cursor-text
            "
            aria-label={`${formatLabels[activeFormat]} formatted citation`}
          >
            {currentCitation}
          </div>

          {/* Active Format Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="primary">{formatLabels[activeFormat]}</Badge>
            <span className="text-xs text-slate-500">
              Click inside the box to select all text
            </span>
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="primary"
            onClick={handleCopy}
            className="flex-1"
            leftIcon={
              copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )
            }
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          <Button variant="secondary" onClick={onCiteAnother} className="flex-1">
            Cite Another Source
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
```

---

### AffiliateAd

**Location**: `components/features/AffiliateAd.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AffiliateAdProps {
  show: boolean;
  onTrackClick?: (adId: string) => void;
}

const GRAMMARLY_AFFILIATE_URL = 'https://www.grammarly.com/?affiliateNetwork=cj&affiliateID=YOUR_ID';

export function AffiliateAd({ show, onTrackClick }: AffiliateAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (show && !isDismissed) {
      // Delay showing ad for better UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [show, isDismissed]);

  if (!isVisible || isDismissed) {
    return null;
  }

  const handleClick = () => {
    onTrackClick?.('grammarly-banner');
    window.open(GRAMMARLY_AFFILIATE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card
      variant="bordered"
      padding="none"
      className="
        relative overflow-hidden
        bg-gradient-to-r from-yellow-50 to-yellow-100
        border-yellow-200
        animate-fade-in
      "
      role="complementary"
      aria-label="Sponsored content"
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="
          absolute top-2 right-2 p-1
          text-slate-400 hover:text-slate-600
          transition-colors duration-150
        "
        aria-label="Dismiss advertisement"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        {/* Grammarly Logo Placeholder */}
        <div className="shrink-0 w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-2xl font-bold text-green-600">G</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Badge variant="warning" size="sm">Sponsored</Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Perfect Your Citations with Grammarly
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Check grammar, clarity, and plagiarism in your papers. Free for students.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={handleClick}
          className="
            shrink-0 bg-green-600 hover:bg-green-700
            focus:ring-green-500
          "
        >
          Try Free
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Button>
      </div>
    </Card>
  );
}
```

**CSS Animation** (add to globals.css):

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 300ms ease-out;
}
```

---

### FormatGuide

**Location**: `components/features/FormatGuide.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type CitationFormat = 'apa' | 'mla' | 'chicago';

interface FormatGuideProps {
  initialOpen?: boolean;
}

const formatGuides: Record<CitationFormat, {
  label: string;
  template: string;
  example: string;
  tips: string[];
}> = {
  apa: {
    label: 'APA 7th Edition',
    template: 'Author, A. A. (Year, Month Day). Title of page. Site Name. URL',
    example: 'Smith, J. (2024, March 15). How to cite websites. Citation Guide. https://example.com/article',
    tips: [
      'Use hanging indent (first line flush left, subsequent lines indented)',
      'Include retrieval date only if content may change',
      'Italicize the title of the webpage',
      'Do not include a period after URLs',
    ],
  },
  mla: {
    label: 'MLA 9th Edition',
    template: 'Author. "Title of Page." Site Name, Publisher, Day Month Year, URL.',
    example: 'Smith, John. "How to Cite Websites." Citation Guide, 15 Mar. 2024, example.com/article.',
    tips: [
      'Use quotation marks around article titles',
      'Italicize the website name',
      'Abbreviate months (except May, June, July)',
      'Remove https:// and www. from URLs',
    ],
  },
  chicago: {
    label: 'Chicago 17th Edition',
    template: 'Author. "Title of Page." Site Name. Last modified Month Day, Year. URL.',
    example: 'Smith, John. "How to Cite Websites." Citation Guide. Last modified March 15, 2024. https://example.com/article.',
    tips: [
      'Two formats: Notes-Bibliography and Author-Date',
      'Use "Accessed" date if no publication date available',
      'Spell out months in full',
      'Include publisher if different from site name',
    ],
  },
};

export function FormatGuide({ initialOpen = false }: FormatGuideProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('apa');

  const guide = formatGuides[activeFormat];

  return (
    <Card variant="bordered" padding="none">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between
          p-4 text-left
          hover:bg-slate-50 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
        "
        aria-expanded={isOpen}
        aria-controls="format-guide-content"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-slate-900">How to Cite Websites</span>
        </span>
        <svg
          className={`
            w-5 h-5 text-slate-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        id="format-guide-content"
        className={`
          overflow-hidden transition-all duration-200
          ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="border-t border-slate-200">
          {/* Format Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {(Object.keys(formatGuides) as CitationFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium
                  transition-colors duration-150
                  ${activeFormat === format
                    ? 'text-blue-600 bg-white border-b-2 border-blue-500 -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Guide Content */}
          <CardContent className="p-4 space-y-4">
            <div>
              <Badge variant="primary" size="sm">{guide.label}</Badge>
            </div>

            {/* Template */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Template</h4>
              <code className="block p-3 bg-slate-100 rounded text-sm text-slate-800 font-mono">
                {guide.template}
              </code>
            </div>

            {/* Example */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Example</h4>
              <p className="p-3 bg-blue-50 rounded text-sm text-slate-800 font-serif italic border-l-4 border-blue-500">
                {guide.example}
              </p>
            </div>

            {/* Tips */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Tips</h4>
              <ul className="space-y-2">
                {guide.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
```

---

## Layout Components

### Header

**Location**: `components/layout/Header.tsx`

```typescript
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="CiteGenerator.org - Home"
          >
            <div className="
              w-8 h-8 rounded-lg bg-blue-600
              flex items-center justify-center
              group-hover:bg-blue-700 transition-colors duration-150
            ">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900">
              CiteGenerator
            </span>
          </Link>

          {/* Optional Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  href="/"
                  className="
                    px-3 py-2 text-sm font-medium text-slate-600
                    hover:text-slate-900 hover:bg-slate-100
                    rounded-lg transition-colors duration-150
                  "
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="
                    px-3 py-2 text-sm font-medium text-slate-600
                    hover:text-slate-900 hover:bg-slate-100
                    rounded-lg transition-colors duration-150
                  "
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

---

### Footer

**Location**: `components/layout/Footer.tsx`

```typescript
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-slate-500">
            &copy; {currentYear} CiteGenerator.org. All rights reserved.
          </p>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-150"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-150"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-150"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-center text-slate-400">
          Citations generated are provided for reference. Always verify format requirements with your institution.
        </p>
      </div>
    </footer>
  );
}
```

---

### Container

**Location**: `components/layout/Container.tsx`

```typescript
import { HTMLAttributes } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',    // 672px
  md: 'max-w-3xl',    // 768px
  lg: 'max-w-4xl',    // 896px (default)
  xl: 'max-w-5xl',    // 1024px
  full: 'max-w-full', // No max
};

export function Container({
  size = 'lg',
  padding = true,
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full
        ${sizeStyles[size]}
        ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

## Accessibility Requirements

### ARIA Labels

All interactive elements must have proper ARIA attributes:

```typescript
// Buttons with icons only
<button aria-label="Copy citation to clipboard">
  <CopyIcon />
</button>

// Form inputs
<input
  aria-label="Enter website URL"
  aria-describedby="url-hint url-error"
  aria-invalid={!!error}
/>

// Loading states
<button aria-busy={isLoading} aria-live="polite">
  {isLoading ? 'Loading...' : 'Submit'}
</button>

// Tabs
<div role="tablist" aria-label="Citation formats">
  <button role="tab" aria-selected={active} aria-controls="panel-id">
    APA
  </button>
</div>
<div role="tabpanel" id="panel-id" aria-labelledby="tab-id">
  Content
</div>
```

### Keyboard Navigation

```typescript
// Focus management
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal();
  }
  if (e.key === 'Tab') {
    // Trap focus within modal
  }
};

// Skip link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white"
>
  Skip to main content
</a>
```

### Focus States

All interactive elements must have visible focus indicators:

```css
/* Tailwind focus utilities */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Custom focus styles */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Screen Reader Text

```typescript
// Visually hidden but accessible
<span className="sr-only">Loading, please wait</span>

// Announce dynamic changes
<div role="status" aria-live="polite">
  Citation copied successfully
</div>

// Describe icons
<svg aria-hidden="true" focusable="false">
  <title>Copy icon</title>
  ...
</svg>
<span className="sr-only">Copy to clipboard</span>
```

### Color Contrast

Minimum contrast ratios (WCAG 2.1 AA):

- Normal text: 4.5:1
- Large text (18px+ or 14px bold): 3:1
- UI components: 3:1

```typescript
// High contrast color pairs
const accessibleColors = {
  textOnWhite: "text-slate-900", // #0f172a on #ffffff = 17.5:1
  textOnBlue: "text-white", // #ffffff on #2563eb = 4.6:1
  mutedText: "text-slate-600", // #475569 on #ffffff = 7.0:1
  errorText: "text-red-700", // #b91c1c on #ffffff = 5.9:1
};
```

---

## Responsive Breakpoints

### Breakpoint Definitions

```typescript
// tailwind.config.ts
const screens = {
  sm: "640px", // Tablet
  md: "768px", // Small laptop
  lg: "1024px", // Desktop
  xl: "1280px", // Large desktop
  "2xl": "1536px", // Extra large
};

// Mobile-first design
// Base styles: < 640px (mobile)
// sm: 640px - 767px (tablet portrait)
// md: 768px - 1023px (tablet landscape / small laptop)
// lg: 1024px+ (desktop)
```

### Responsive Patterns

```typescript
// Container padding
<div className="px-4 sm:px-6 lg:px-8">

// Grid layouts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Flex direction
<div className="flex flex-col sm:flex-row gap-4">

// Typography scaling
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// Visibility
<nav className="hidden sm:flex">  {/* Hide on mobile */}
<button className="sm:hidden">   {/* Show only on mobile */}

// Spacing
<section className="py-8 sm:py-12 lg:py-16">
```

### Component Responsive Examples

```typescript
// CitationForm - Format Selector
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  {formats.map(format => (
    <FormatOption key={format.value} {...format} />
  ))}
</div>

// CitationResult - Actions
<CardFooter className="p-4">
  <div className="flex flex-col sm:flex-row gap-3 w-full">
    <Button className="flex-1">Copy</Button>
    <Button className="flex-1">Cite Another</Button>
  </div>
</CardFooter>

// AffiliateAd - Layout
<div className="flex flex-col sm:flex-row items-center gap-4 p-4">
  <Logo />
  <Content className="text-center sm:text-left" />
  <CTA />
</div>
```

---

## Global Styles

**Location**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-slate-50 text-slate-900;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
  }

  /* Focus visible polyfill */
  :focus:not(:focus-visible) {
    outline: none;
  }

  :focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2;
  }
}

@layer components {
  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sr-only.focus\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 1rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
}

@layer utilities {
  /* Animations */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-slide-in {
    animation: slide-in 200ms ease-out;
  }

  .animate-fade-in {
    animation: fade-in 300ms ease-out;
  }
}
```

---

## Page Integration Example

**Location**: `app/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { CitationForm } from '@/components/features/CitationForm';
import { CitationResult } from '@/components/features/CitationResult';
import { AffiliateAd } from '@/components/features/AffiliateAd';
import { FormatGuide } from '@/components/features/FormatGuide';

type CitationFormat = 'apa' | 'mla' | 'chicago';

interface CitationData {
  apa: string;
  mla: string;
  chicago: string;
  metadata: {
    title: string;
    author?: string;
    date?: string;
    siteName?: string;
    url: string;
  };
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [citation, setCitation] = useState<CitationData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('apa');

  const handleSubmit = async (url: string, format: CitationFormat) => {
    setIsLoading(true);
    setSelectedFormat(format);

    try {
      const response = await fetch('/api/cite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate citation');
      }

      const data = await response.json();
      setCitation(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCiteAnother = () => {
    setCitation(null);
  };

  return (
    <main id="main-content" className="py-8 sm:py-12">
      <Container size="md">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Free Citation Generator
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Generate accurate citations in APA, MLA, and Chicago formats.
            Just paste a URL and we&apos;ll do the rest.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!citation ? (
            <CitationForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <>
              <CitationResult
                citation={citation}
                initialFormat={selectedFormat}
                onCiteAnother={handleCiteAnother}
              />
              <AffiliateAd show={true} />
            </>
          )}

          {/* Format Guide */}
          <FormatGuide />
        </div>
      </Container>
    </main>
  );
}
```

---

## Component Checklist

Before shipping each component, verify:

- [ ] TypeScript types are complete and exported
- [ ] Props have sensible defaults
- [ ] Component is accessible (ARIA, keyboard, focus)
- [ ] Responsive on all breakpoints
- [ ] Loading/error states handled
- [ ] Animations are 60fps (use transform/opacity)
- [ ] No layout shift (CLS)
- [ ] Works without JavaScript (progressive enhancement)
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Dark mode ready (if applicable)

---

_Last updated: December 2024_
_Version: 1.0.0_
