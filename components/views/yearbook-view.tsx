'use client'

import { useAppStore } from '@/lib/store'
import { getTierColor, getDaysSinceContact, calculateAmbassadorScore } from '@/lib/data'
import { cn } from '@/lib/utils'
import { AlertTriangle, X, Mail, Flame } from 'lucide-react'
import { useState } from 'react'

export function YearbookView() {
  const { ambassadors, sidebarOpen, selectedAmbassador, setSelectedAmbassador, updateAmbassadorNotes } = useAppStore()
  const [notes, setNotes] = useState('')
  
  const handleSelectAmbassador = (ambassador: typeof ambassadors[0]) => {
    setSelectedAmbassador(ambassador)
    setNotes(ambassador.notes || '')
  }
  
  const handleContact = (ambassador: typeof ambassadors[0]) => {
    const firstName = ambassador.name.split(' ')[0]
    const daysSinceContact = getDaysSinceContact(ambassador.lastContactDate)
    const isDropOff = daysSinceContact >= 14
    
    let subject: string
    let body: string
    
    if (isDropOff) {
      // Drop-off re-engage template
      subject = `Checking in — Opal Ambassadors 👋`
      body = `Hi ${firstName},%0A%0AHope you're good! Just wanted to check in as we haven't spoken in a while. No worries if things have been busy — would love to hear how you're getting on when you get a chance.`
    } else {
      // Standard contact template
      subject = `Hey ${firstName} — checking in 👋`
      body = `Hi ${firstName},%0A%0AJust wanted to check in and see how things are going at ${ambassador.school}. Let me know if there's anything you need from me, or if you have ideas for your next activation.%0A%0AAlways here if you want to chat.`
    }
    
    const mailtoLink = `mailto:${ambassador.email}?subject=${encodeURIComponent(subject)}&body=${body}`
    window.open(mailtoLink)
  }
  
  const handleContactAll = () => {
    const allEmails = ambassadors.map(a => a.email)
    const subject = `Opal Ambassador Network — update from HQ`
    const body = `Hi all,%0A%0AHope you're well. Just a quick note from across the network — exciting things are happening and I wanted to keep you all in the loop.%0A%0AMore details coming soon. Keep doing what you're doing.`
    const mailtoLink = `mailto:?bcc=${allEmails.join(',')}&subject=${encodeURIComponent(subject)}&body=${body}`
    window.open(mailtoLink)
  }
  
  return (
    <div className={cn('p-6 transition-all duration-300', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Yearbook</h2>
          <p className="text-muted-foreground mt-1">All ambassadors across schools</p>
        </div>
        <button
          onClick={handleContactAll}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md',
            'text-sm font-medium transition-colors',
            'bg-[#7C3AED] text-white hover:bg-[#7C3AED]/80'
          )}
        >
          <Mail className="h-4 w-4" />
          Contact All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ambassadors.map((ambassador) => {
          const daysSinceContact = getDaysSinceContact(ambassador.lastContactDate)
          const isDropOff = daysSinceContact >= 14
          const isActiveLimeBorder =
            ambassador.streakWeeks >= 3 ||
            (ambassador.activationsCompleted > 0 && daysSinceContact <= 30)

          return (
            <div key={ambassador.id} className="relative group/card">
            {isActiveLimeBorder && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                <div className="bg-[#1A1A1A] border border-[#A3E635] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  🔥 Active
                </div>
              </div>
            )}
            <div
              className={cn(
                'text-left p-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] transition-all',
                'hover:shadow-md hover:border-[#7C3AED]/30',
                isActiveLimeBorder && 'border-2 border-[#A3E635]',
                selectedAmbassador?.id === ambassador.id && 'ring-2 ring-[#7C3AED]'
              )}
            >
              <button
                onClick={() => handleSelectAmbassador(ambassador)}
                className="w-full text-left"
              >
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#A3E635]/20 flex items-center justify-center mb-3">
                  <span className="text-lg font-semibold text-[#7C3AED]">
                    {ambassador.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                      {ambassador.name}
                      {ambassador.isUncutGem && <span className="text-base">💎</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">{ambassador.school}</p>
                  </div>
                  
                  {isDropOff && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', getTierColor(ambassador.tier))}>
                    {ambassador.tier}
                  </span>
                  <div className="flex items-center gap-2">
                    {ambassador.streakWeeks > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-400 font-medium">
                        <Flame className="h-3 w-3" />
                        {ambassador.streakWeeks}w
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(ambassador.lastContactDate).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                </div>
              </button>
              
              {/* Contact button */}
              <button
                onClick={() => handleContact(ambassador)}
                className={cn(
                  'mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md',
                  'text-xs font-medium transition-colors',
                  isDropOff 
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B]/30'
                    : 'bg-secondary text-foreground hover:bg-[#7C3AED]/20 hover:text-[#7C3AED]'
                )}
              >
                <Mail className="h-3 w-3" />
                {isDropOff ? 'Re-engage' : 'Contact'}
              </button>
            </div>
            </div>
          )
        })}
      </div>
      
      {/* Side drawer */}
      {selectedAmbassador && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedAmbassador(null)}
          />
          <div className={cn(
            'fixed top-0 right-0 z-50 h-full w-96 bg-[#1A1A1A] border-l border-[#2A2A2A] shadow-xl',
            'transform transition-transform duration-300',
            sidebarOpen ? 'right-80' : 'right-0'
          )}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {selectedAmbassador.name}
                    {selectedAmbassador.isUncutGem && <span>💎</span>}
                  </h3>
                  <p className="text-muted-foreground">{selectedAmbassador.school}</p>
                </div>
                <button 
                  onClick={() => setSelectedAmbassador(null)}
                  className="p-1 rounded hover:bg-secondary"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tier</span>
                  <div className="mt-1">
                    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getTierColor(selectedAmbassador.tier))}>
                      {selectedAmbassador.tier}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</span>
                  <p className="text-2xl font-bold text-[#7C3AED]">{calculateAmbassadorScore(selectedAmbassador).total}</p>
                </div>
                
                {selectedAmbassador.streakWeeks > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Streak</span>
                    <p className="text-lg font-semibold text-amber-400 flex items-center gap-1">
                      <Flame className="h-5 w-5" />
                      {selectedAmbassador.streakWeeks} weeks
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Days in Current Tier</span>
                  <p className="text-lg font-semibold text-foreground">{selectedAmbassador.daysInCurrentTier} days</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Contact</span>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(selectedAmbassador.lastContactDate).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {selectedAmbassador.plannedActivation && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Planned Activation</span>
                    <p className="text-sm font-medium text-foreground mt-1 p-2 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/30">
                      {selectedAmbassador.plannedActivation}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => {
                      if (selectedAmbassador) {
                        updateAmbassadorNotes(selectedAmbassador.id, notes)
                      }
                    }}
                    className="mt-1 w-full h-32 p-3 text-sm rounded-md border border-border bg-secondary resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder="Add notes about this ambassador..."
                  />
                </div>
                
                {/* Contact button in drawer */}
                <button
                  onClick={() => handleContact(selectedAmbassador)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md',
                    'text-sm font-medium transition-colors',
                    getDaysSinceContact(selectedAmbassador.lastContactDate) >= 14
                      ? 'bg-[#F59E0B] text-white hover:bg-[#F59E0B]/80'
                      : 'bg-[#7C3AED] text-white hover:bg-[#7C3AED]/80'
                  )}
                >
                  <Mail className="h-4 w-4" />
                  {getDaysSinceContact(selectedAmbassador.lastContactDate) >= 14 
                    ? `Re-engage ${selectedAmbassador.name.split(' ')[0]}`
                    : `Contact ${selectedAmbassador.name.split(' ')[0]}`
                  }
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
