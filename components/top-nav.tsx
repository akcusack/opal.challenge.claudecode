'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const tabs = [
  { id: 'schools', label: 'Schools' },
  { id: 'rankings', label: 'Rankings' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'feed', label: 'The Feed' },
  { id: 'yearbook', label: 'Yearbook' },
] as const

const WORDS = ['focus', 'connection', 'clarity', 'presence', 'learning', 'creativity', 'memories', 'flow']
const START_COUNT = 300

export function TopNav() {
  const { activeView, setActiveView } = useAppStore()

  const [count, setCount] = useState(START_COUNT)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const [countFlash, setCountFlash] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade word out, swap, fade back in
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % WORDS.length)
        setWordVisible(true)
      }, 250)

      // Increment count with brief lime flash
      setCount(c => c + 1)
      setCountFlash(true)
      setTimeout(() => setCountFlash(false), 400)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tight text-white">
            <span className="text-[#7C3AED]">Opal</span> Ambassador OS
          </h1>

          <span className="hidden xl:block text-xs font-light tracking-wide text-[#78716C]">
            Powering the focus revolution 📵
          </span>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  'hover:text-white',
                  activeView === tab.id
                    ? 'text-white'
                    : 'text-muted-foreground'
                )}
              >
                {tab.label}
                {activeView === tab.id && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-[#7C3AED]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Live mission counter */}
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">📵</span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                'text-xl font-bold tabular-nums transition-colors duration-300',
                countFlash ? 'text-[#A3E635]' : 'text-white'
              )}
            >
              {count}
            </span>
            <span className="text-xs text-[#78716C] font-normal">hrs of</span>
            <span
              className="text-sm font-bold text-[#A3E635] transition-opacity duration-500"
              style={{ opacity: wordVisible ? 1 : 0 }}
            >
              {WORDS[wordIndex]}
            </span>
            <span className="text-xs text-[#78716C] font-normal">saved</span>
          </div>
        </div>
      </div>
    </header>
  )
}
