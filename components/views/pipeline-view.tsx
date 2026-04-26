'use client'

import { useAppStore } from '@/lib/store'
import { getTierColor, getTierBorderColor, type Tier } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ArrowRight, Clock } from 'lucide-react'

const tiers: Tier[] = ['Prospect', 'Onboarded', 'Active', 'Leader', 'Young Founders Network']

const tierHeaderStyles: Record<Tier, string> = {
  'Prospect': 'bg-gray-500 text-white',
  'Onboarded': 'bg-blue-500 text-white',
  'Active': 'bg-[#7C3AED] text-white',
  'Leader': 'bg-[#0A0A0A] text-[#A3E635] border border-[#A3E635]',
  'Young Founders Network': 'bg-amber-600 text-white',
}

export function PipelineView() {
  const { ambassadors, sidebarOpen, moveToNextTier } = useAppStore()
  
  const getAmbassadorsByTier = (tier: Tier) => {
    return ambassadors.filter(a => a.tier === tier)
  }
  
  return (
    <div className={cn('p-6 transition-all duration-300 min-h-[calc(100vh-4rem)]', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Pipeline</h2>
        <p className="text-muted-foreground mt-1">Kanban view of ambassador progression</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {tiers.map((tier) => {
          const tierAmbassadors = getAmbassadorsByTier(tier)
          const isLastTier = tier === 'Young Founders Network'
          
          return (
            <div 
              key={tier} 
              className="flex-shrink-0 w-72"
            >
              {/* Column header */}
              <div className={cn('px-3 py-2 rounded-t-lg font-semibold text-sm', tierHeaderStyles[tier])}>
                <div className="flex items-center justify-between">
                  <span>{tier}</span>
                  <span className="text-xs opacity-80 font-normal">{tierAmbassadors.length}</span>
                </div>
              </div>
              
              {/* Column content */}
              <div className="bg-secondary rounded-b-lg p-2 min-h-[400px] space-y-2">
                {tierAmbassadors.map((ambassador) => {
                  const stuckInTier = ambassador.daysInCurrentTier >= 30
                  
                  return (
                    <div
                      key={ambassador.id}
                      className={cn(
                        'p-3 bg-[#1A1A1A] rounded-md border transition-all',
                        'hover:shadow-md',
                        ambassador.isUncutGem && 'border-2 border-[#A3E635]',
                        stuckInTier && !ambassador.isUncutGem && 'border-amber-500/50',
                        !ambassador.isUncutGem && !stuckInTier && 'border-[#2A2A2A]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-foreground text-sm flex items-center gap-1.5">
                            {ambassador.name}
                            {ambassador.isUncutGem && <span className="text-sm">💎</span>}
                          </h4>
                          <p className="text-xs text-muted-foreground">{ambassador.school}</p>
                        </div>
                        
                        {stuckInTier && (
                          <div className="flex items-center gap-1 text-amber-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{ambassador.daysInCurrentTier}d</span>
                          </div>
                        )}
                      </div>
                      
                      {ambassador.plannedActivation && (
                        <div className="mt-2 px-2 py-1 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/30">
                          <p className="text-xs text-[#7C3AED] font-medium">{ambassador.plannedActivation}</p>
                        </div>
                      )}
                      
                      {ambassador.notes && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{ambassador.notes}</p>
                      )}
                      
                      {!isLastTier && (
                        <button
                          onClick={() => moveToNextTier(ambassador.id)}
                          className={cn(
                            'mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md',
                            'text-xs font-medium transition-colors',
                            'bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white'
                          )}
                        >
                          Move to next tier
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )
                })}
                
                {tierAmbassadors.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                    No ambassadors
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
