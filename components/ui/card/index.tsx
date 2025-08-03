// components/ui/card.tsx
import { ReactNode } from 'react'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl shadow bg-white ${className}`}>{children}</div>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}
