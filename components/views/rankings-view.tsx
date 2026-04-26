'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { getTierColor, getDaysSinceContact, calculateAmbassadorScore } from '@/lib/data'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowUpDown, ChevronDown, ChevronUp, HelpCircle, X, Flame } from 'lucide-react'

type SortKey = 'rank' | 'name' | 'school' | 'tier' | 'score'
type SortOrder = 'asc' | 'desc'

const tierOrder = ['Prospect', 'Onboarded', 'Active', 'Leader', 'Young Founders Network']

export function RankingsView() {
  const { ambassadors, sidebarOpen } = useAppStore()
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showScoringModal, setShowScoringModal] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }
  
  const ambassadorsWithScores = ambassadors.map(a => ({
    ...a,
    scoreData: calculateAmbassadorScore(a)
  }))
  
  const sortedAmbassadors = [...ambassadorsWithScores].sort((a, b) => {
    let comparison = 0
    
    switch (sortKey) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'school':
        comparison = a.school.localeCompare(b.school)
        break
      case 'tier':
        comparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
        break
      case 'score':
      case 'rank':
      default:
        comparison = a.scoreData.total - b.scoreData.total
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  const SortButton = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
    <button
      onClick={() => handleSort(sortKeyValue)}
      className={cn(
        'flex items-center gap-1 text-xs font-semibold uppercase tracking-wider',
        sortKey === sortKeyValue ? 'text-[#7C3AED]' : 'text-muted-foreground'
      )}
    >
      {label}
      {sortKey === sortKeyValue ? (
        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3" />
      )}
    </button>
  )
  
  return (
    <div className={cn('p-6 transition-all duration-300', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Rankings</h2>
          <button
            onClick={() => setShowScoringModal(true)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            title="How scores work"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-[#7C3AED]" />
          </button>
        </div>
        <p className="text-muted-foreground">Leaderboard by score</p>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left w-16">
                  <SortButton label="Rank" sortKeyValue="rank" />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Name" sortKeyValue="name" />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="School" sortKeyValue="school" />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Tier" sortKeyValue="tier" />
                </th>
                <th className="px-4 py-3 text-left w-20">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Streak</span>
                </th>
                <th className="px-4 py-3 text-left min-w-[200px]">
                  <SortButton label="Score" sortKeyValue="score" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAmbassadors.map((ambassador, index) => {
                const isExpanded = expandedRow === ambassador.id
                const daysSinceContact = getDaysSinceContact(ambassador.lastContactDate)
                const isDropOff = daysSinceContact >= 14
                
                return (
                  <React.Fragment key={ambassador.id}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : ambassador.id)}
                      className={cn(
                        'border-b border-border last:border-0 transition-colors cursor-pointer',
                        'hover:bg-[#7C3AED]/10',
                        index < 3 && 'bg-gradient-to-r from-[#7C3AED]/10 to-transparent'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                          index === 0 && 'bg-[#A3E635] text-[#0A0A0A]',
                          index === 1 && 'bg-[#7C3AED] text-white',
                          index === 2 && 'bg-[#7C3AED]/70 text-white',
                          index > 2 && 'bg-secondary text-foreground'
                        )}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{ambassador.name}</span>
                          {ambassador.isUncutGem && <span>💎</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ambassador.school}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', getTierColor(ambassador.tier))}>
                          {ambassador.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {ambassador.streakWeeks > 0 && (
                          <span className="flex items-center gap-0.5 text-sm text-amber-400 font-medium">
                            <Flame className="h-4 w-4" />
                            {ambassador.streakWeeks}w
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-foreground">{ambassador.scoreData.total}</span>
                          <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden max-w-[120px]">
                            <div 
                              className="h-full rounded-full bg-[#7C3AED]"
                              style={{ width: `${ambassador.scoreData.total}%` }}
                            />
                          </div>
                          {isDropOff && (
                            <div className="flex items-center gap-1 text-amber-400">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs font-medium">{daysSinceContact}d</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-secondary/30">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="px-2 py-1 rounded bg-card border border-border">
                              Tier: <strong className="text-[#7C3AED]">{ambassador.scoreData.breakdown.tier}pts</strong>
                            </span>
                            <span className="px-2 py-1 rounded bg-card border border-border">
                              Activations: <strong className="text-[#7C3AED]">{ambassador.scoreData.breakdown.activations}pts</strong>
                            </span>
                            <span className="px-2 py-1 rounded bg-card border border-border">
                              Streak: <strong className="text-[#7C3AED]">{ambassador.scoreData.breakdown.streak}pts</strong>
                            </span>
                            <span className="px-2 py-1 rounded bg-card border border-border">
                              Recency: <strong className="text-[#7C3AED]">{ambassador.scoreData.breakdown.recency}pts</strong>
                            </span>
                            {ambassador.scoreData.breakdown.gemBonus > 0 && (
                              <span className="px-2 py-1 rounded bg-[#A3E635]/20 border border-[#A3E635]/30">
                                Gem bonus: <strong className="text-[#A3E635]">+{ambassador.scoreData.breakdown.gemBonus}pts</strong>
                              </span>
                            )}
                            {ambassador.scoreData.breakdown.decay > 0 && (
                              <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50">
                                Decay: <strong className="text-amber-400">-{ambassador.scoreData.breakdown.decay}pts</strong>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Scoring Modal */}
      {showScoringModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => setShowScoringModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">How scores work</h3>
                  <button 
                    onClick={() => setShowScoringModal(false)}
                    className="p-1 rounded hover:bg-secondary"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                
                <p className="text-[#E5E5E5] leading-relaxed mb-6">
                  Rankings are built around momentum, not just status. Your score is made up of five things: your current tier (the foundation — a Leader starts higher than a Prospect), activations you&apos;ve completed (doing things matters more than titles), your activity streak (consistency counts), how recently we&apos;ve been in contact (a health check), and a small bonus for Uncut Gems — students who wouldn&apos;t normally show up in a ranking like this but whose buy-in creates real culture change. If you go quiet, your score decays slowly, and Opal Advocacy Manager gets a nudge to re-engage with you personally.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Tier</span>
                    <span className="text-[#7C3AED] font-semibold">up to 40pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Activations completed</span>
                    <span className="text-[#7C3AED] font-semibold">up to 25pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Activity streak</span>
                    <span className="text-[#7C3AED] font-semibold">up to 20pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Recency of last contact</span>
                    <span className="text-[#7C3AED] font-semibold">up to 10pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#A3E635]/10 border border-[#A3E635]/30">
                    <span className="text-white font-medium">Uncut Gem bonus</span>
                    <span className="text-[#A3E635] font-semibold">+5pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-amber-900/20 border border-amber-700/50">
                    <span className="text-white font-medium">Inactivity decay</span>
                    <span className="text-amber-400 font-semibold">-1pt/week after 14 days</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowScoringModal(false)}
                  className="mt-6 w-full py-3 rounded-md bg-[#2A2A2A] text-white font-medium hover:bg-[#3A3A3A] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
