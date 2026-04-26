'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'schools', label: 'Schools' },
  { id: 'rankings', label: 'Rankings' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'feed', label: 'The Feed' },
  { id: 'yearbook', label: 'Yearbook' },
] as const

export function TopNav() {
  const { activeView, setActiveView, ambassadors } = useAppStore()
  
  // Calculate active ambassador count (non-prospects)
  const activeCount = ambassadors.filter(a => a.tier !== 'Prospect').length
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tight text-white">
            <span className="text-[#7C3AED]">Opal</span> Ambassador OS
          </h1>
          
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
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground">
            {activeCount} active ambassadors
          </span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A3E635]" />
        </div>
      </div>
    </header>
  )
}
