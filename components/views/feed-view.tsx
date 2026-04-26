'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { feedPosts, getPostTagStyle, getMostEngagedSchool, calculateAmbassadorScore, calendarEvents, type FeedPost } from '@/lib/data'
import { Trophy, TrendingUp, Flame, Gem, Calendar, BarChart3, Lightbulb, Camera, MessageSquare } from 'lucide-react'

export function FeedView() {
  const { ambassadors, sidebarOpen, schools } = useAppStore()
  
  // Get current week date range
  const today = new Date('2026-04-26')
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const weekRange = `${formatDate(startOfWeek)} — ${formatDate(endOfWeek)}`
  
  // Top school this week
  const topSchool = getMostEngagedSchool()
  
  // Most recent tier upgrade
  const recentLevelUp = ambassadors
    .filter(a => a.tierUpgradedDate)
    .sort((a, b) => new Date(b.tierUpgradedDate!).getTime() - new Date(a.tierUpgradedDate!).getTime())[0]
  
  // Longest streak
  const longestStreak = ambassadors.reduce((max, a) => a.streakWeeks > max.streakWeeks ? a : max)
  
  // Random uncut gem with quote
  const gemsWithQuotes = ambassadors.filter(a => a.isUncutGem && a.quote)
  const spotlightGem = gemsWithQuotes[0]
  
  // Next activation
  const nextActivation = calendarEvents
    .filter(e => e.eventType === 'activation' && new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  const nextActivationAmbassador = nextActivation 
    ? ambassadors.find(a => nextActivation.ambassadorIds.includes(a.id))
    : null
  
  // Network stats this month
  const activeAmbassadors = ambassadors.filter(a => a.tier !== 'Prospect').length
  const totalActivations = ambassadors.reduce((sum, a) => sum + a.activationsCompleted, 0)
  
  // Get ambassador for a post
  const getAmbassador = (ambassadorId: string) => ambassadors.find(a => a.id === ambassadorId)
  
  // Tag icons
  const getTagIcon = (tag: FeedPost['tag']) => {
    switch (tag) {
      case 'idea': return <Lightbulb className="h-3.5 w-3.5" />
      case 'win': return <Trophy className="h-3.5 w-3.5" />
      case 'moment': return <Camera className="h-3.5 w-3.5" />
      case 'story': return <MessageSquare className="h-3.5 w-3.5" />
    }
  }
  
  return (
    <div className={cn(
      'min-h-screen p-8 transition-all duration-300',
      sidebarOpen ? 'mr-80' : 'mr-0'
    )}>
      {/* THE DISPATCH */}
      <section className="mb-12">
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-white uppercase">THE DISPATCH</h2>
            <p className="text-muted-foreground mt-1 text-lg">{weekRange}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Top School */}
            <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-[#A3E635]" />
                <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Top School This Week</span>
              </div>
              <p className="text-2xl font-bold text-white">{topSchool.name}</p>
              <p className="text-lg text-muted-foreground">{topSchool.engagementPercentage}% engagement</p>
            </div>
            
            {/* Level Up */}
            {recentLevelUp && (
              <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-[#A3E635]" />
                  <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Level Up</span>
                </div>
                <p className="text-2xl font-bold text-white">{recentLevelUp.name}</p>
                <p className="text-lg text-muted-foreground">Now {recentLevelUp.tier}</p>
              </div>
            )}
            
            {/* Longest Streak */}
            <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-5 w-5 text-[#A3E635]" />
                <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Longest Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{longestStreak.name}</p>
              <p className="text-lg text-muted-foreground">{longestStreak.streakWeeks} weeks</p>
            </div>
            
            {/* Uncut Gem Spotlight */}
            {spotlightGem && (
              <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#A3E635]/30 lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Gem className="h-5 w-5 text-[#A3E635]" />
                  <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Uncut Gem Spotlight</span>
                </div>
                <p className="text-xl font-bold text-white">{spotlightGem.name}</p>
                <p className="text-sm text-muted-foreground mb-3">{spotlightGem.school} • {spotlightGem.tier}</p>
                <p className="text-[#E5E5E5] italic leading-relaxed">&quot;{spotlightGem.quote}&quot;</p>
              </div>
            )}
            
            {/* Next Activation */}
            {nextActivation && (
              <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-[#A3E635]" />
                  <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Next Activation</span>
                </div>
                <p className="text-xl font-bold text-white">{nextActivation.title}</p>
                <p className="text-muted-foreground">
                  {nextActivationAmbassador?.school} • {new Date(nextActivation.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-sm text-muted-foreground">{nextActivation.location}</p>
              </div>
            )}
            
            {/* Network This Month */}
            <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-[#A3E635]" />
                <span className="text-sm font-semibold text-[#A3E635] uppercase tracking-wide">Network This Month</span>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-white">{activeAmbassadors}</p>
                  <p className="text-muted-foreground">Active Ambassadors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{totalActivations}</p>
                  <p className="text-muted-foreground">Activations Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* THE WALL */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight text-white uppercase mb-6">THE WALL</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {feedPosts.map((post) => {
            const ambassador = getAmbassador(post.ambassadorId)
            if (!ambassador) return null
            
            const tagStyle = getPostTagStyle(post.tag)
            
            return (
              <div 
                key={post.id}
                className="break-inside-avoid bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-5 hover:border-[#3A3A3A] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{ambassador.name}</p>
                    <p className="text-sm text-muted-foreground">{ambassador.school}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
                    tagStyle.bg,
                    tagStyle.text
                  )}>
                    {ambassador.tier}
                  </span>
                </div>
                
                {/* Tag */}
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3',
                  tagStyle.bg,
                  tagStyle.text
                )}>
                  {getTagIcon(post.tag)}
                  {tagStyle.label}
                </div>
                
                {/* Content */}
                <p className="text-[#E5E5E5] leading-relaxed mb-4">{post.content}</p>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {new Date(post.datePosted).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <span>{post.reactions}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
