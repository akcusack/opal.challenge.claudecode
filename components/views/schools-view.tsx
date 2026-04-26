'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp, Minus, Users, Mail, X, MapPin, Calendar, HelpCircle, ChevronRight } from 'lucide-react'
import { getTierColor, getDaysSinceContact, calculateAmbassadorScore, type School, type Ambassador } from '@/lib/data'
import { useState } from 'react'

export function SchoolsView() {
  const { schools, ambassadors, sidebarOpen, calendarEvents } = useAppStore()
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [showRankingModal, setShowRankingModal] = useState(false)
  
  const sortedSchools = [...schools].sort((a, b) => b.engagementPercentage - a.engagementPercentage)
  
  const getSchoolAmbassadors = (schoolName: string) => {
    return ambassadors.filter(a => a.school === schoolName)
  }
  
  const getSchoolEmails = (schoolName: string) => {
    return getSchoolAmbassadors(schoolName).map(a => a.email)
  }
  
  const handleContactAll = (schoolName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const emails = getSchoolEmails(schoolName)
    const subject = `Opal Ambassador update — ${schoolName}`
    const body = `Hi all,%0A%0AHope you're doing well. Just reaching out with a quick update from the Opal ambassador network and to hear how things are going at ${schoolName}.%0A%0AReply to this email or drop me a message anytime. More soon.`
    const mailtoLink = `mailto:?bcc=${emails.join(',')}&subject=${encodeURIComponent(subject)}&body=${body}`
    window.open(mailtoLink)
  }
  
  const getTopAmbassador = (schoolName: string): Ambassador | null => {
    const schoolAmbassadors = getSchoolAmbassadors(schoolName)
    if (schoolAmbassadors.length === 0) return null
    return schoolAmbassadors.reduce((top, a) => {
      const topScore = calculateAmbassadorScore(top).total
      const aScore = calculateAmbassadorScore(a).total
      return aScore > topScore ? a : top
    })
  }
  
  const getNextActivation = (schoolName: string) => {
    const schoolAmbassadorIds = getSchoolAmbassadors(schoolName).map(a => a.id)
    const schoolEvents = calendarEvents
      .filter(e => e.ambassadorIds.some(id => schoolAmbassadorIds.includes(id)) && e.eventType === 'activation')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    if (schoolEvents.length === 0) return null
    
    const event = schoolEvents[0]
    const ambassador = ambassadors.find(a => a.id === event.ambassadorIds[0])
    return {
      ...event,
      ambassadorName: ambassador?.name || 'TBD'
    }
  }
  
  const getEngagementTrend = (school: School) => {
    // Simulated trend based on engagement percentage
    if (school.engagementPercentage >= 70) return 'up'
    if (school.isDecline) return 'down'
    return 'flat'
  }
  
  const getRecommendedAction = (school: School): string => {
    const schoolAmbassadors = getSchoolAmbassadors(school.name)
    const dropOffs = schoolAmbassadors.filter(a => getDaysSinceContact(a.lastContactDate) >= 14)
    const topAmbassador = getTopAmbassador(school.name)
    
    if (school.isDecline && dropOffs.length >= 2) {
      return `Priority: re-engage ${dropOffs.length} ambassadors who haven't been contacted in 14+ days`
    }
    
    if (topAmbassador && topAmbassador.tier === 'Leader' && topAmbassador.daysInCurrentTier >= 45) {
      return `Consider nominating ${topAmbassador.name} for Young Founders Network`
    }
    
    if (school.engagementPercentage >= 80) {
      return `School thriving — consider featuring ${school.name} as a case study`
    }
    
    if (dropOffs.length > 0) {
      return `Check in with ${dropOffs[0].name} — last contact was ${getDaysSinceContact(dropOffs[0].lastContactDate)} days ago`
    }
    
    const prospects = schoolAmbassadors.filter(a => a.tier === 'Prospect')
    if (prospects.length > 0) {
      return `Focus on onboarding ${prospects.length} prospect${prospects.length > 1 ? 's' : ''} to Active status`
    }
    
    return `Schedule next activation to maintain momentum`
  }
  
  return (
    <div className={cn('p-6 transition-all duration-300', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Schools</h2>
          <button
            onClick={() => setShowRankingModal(true)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            title="How schools are ranked"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-[#7C3AED]" />
          </button>
        </div>
        <p className="text-muted-foreground mt-1">Ranked by engagement score</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSchools.map((school, index) => (
          <div
            key={school.id}
            onClick={() => setSelectedSchool(school)}
            className={cn(
              'relative p-5 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer',
              'transition-all duration-200 ease-out',
              'hover:shadow-lg hover:border-[#7C3AED] hover:-translate-y-0.5',
              school.isDecline && 'border-amber-500/50 bg-amber-900/10 hover:border-[#7C3AED]'
            )}
          >
            {/* Rank badge */}
            <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            
            {/* Decline flag */}
            {school.isDecline && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-900/50 text-amber-400">
                <TrendingDown className="h-3 w-3" />
                <span className="text-[10px] font-medium">Declining</span>
              </div>
            )}
            
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-foreground">{school.name}</h3>
              
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{school.totalAmbassadors} ambassadors</span>
              </div>
              
              {/* Tier breakdown */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {school.tierBreakdown.yfn > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-medium">
                    {school.tierBreakdown.yfn} YFN
                  </span>
                )}
                {school.tierBreakdown.leader > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#A3E635] border border-[#A3E635] font-medium">
                    {school.tierBreakdown.leader} Leaders
                  </span>
                )}
                {school.tierBreakdown.active > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED] text-white font-medium">
                    {school.tierBreakdown.active} Active
                  </span>
                )}
                {school.tierBreakdown.onboarded > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-medium">
                    {school.tierBreakdown.onboarded} Onboarded
                  </span>
                )}
                {school.tierBreakdown.prospect > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500 text-white font-medium">
                    {school.tierBreakdown.prospect} Prospects
                  </span>
                )}
              </div>
              
              {/* Engagement */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-foreground">{school.engagementPercentage}%</span>
                  <span className="text-xs text-muted-foreground">engagement</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all',
                      school.engagementPercentage >= 70 ? 'bg-gradient-to-r from-[#7C3AED] to-[#A3E635]' :
                      school.engagementPercentage >= 50 ? 'bg-[#7C3AED]' :
                      'bg-amber-500'
                    )}
                    style={{ width: `${school.engagementPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* Last activity */}
              <p className="mt-3 text-xs text-muted-foreground">
                Last activity: {new Date(school.lastActivityDate).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </p>
              
              {/* View Report Card link */}
              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[#7C3AED] group-hover:underline">
                <span>View Report Card</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              
              {/* Contact All button */}
              <button
                onClick={(e) => handleContactAll(school.name, e)}
                className={cn(
                  'mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md',
                  'text-sm font-medium transition-colors',
                  'bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white'
                )}
              >
                <Mail className="h-4 w-4" />
                Contact All
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* School Report Card Modal */}
      {selectedSchool && (
        <>
          <div 
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => setSelectedSchool(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{selectedSchool.name}</h3>
                    <p className="text-sm text-[#A1A1AA] mt-1">School Report Card</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSchool(null)}
                    className="p-2 rounded-md hover:bg-[#2A2A2A] transition-colors"
                  >
                    <X className="h-5 w-5 text-[#A1A1AA]" />
                  </button>
                </div>
                
                {/* Engagement Trend */}
                <section className="mb-6 p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Engagement Trend</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-white">{selectedSchool.engagementPercentage}%</span>
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
                      getEngagementTrend(selectedSchool) === 'up' && 'bg-[#A3E635]/20 text-[#A3E635]',
                      getEngagementTrend(selectedSchool) === 'down' && 'bg-[#F59E0B]/20 text-[#F59E0B]',
                      getEngagementTrend(selectedSchool) === 'flat' && 'bg-[#7C3AED]/20 text-[#7C3AED]'
                    )}>
                      {getEngagementTrend(selectedSchool) === 'up' && <TrendingUp className="h-4 w-4" />}
                      {getEngagementTrend(selectedSchool) === 'down' && <TrendingDown className="h-4 w-4" />}
                      {getEngagementTrend(selectedSchool) === 'flat' && <Minus className="h-4 w-4" />}
                      {getEngagementTrend(selectedSchool) === 'up' ? 'Trending up' : 
                       getEngagementTrend(selectedSchool) === 'down' ? 'Declining' : 'Stable'}
                    </div>
                  </div>
                </section>
                
                {/* Top Ambassador */}
                <section className="mb-6 p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Top Ambassador</h4>
                  {getTopAmbassador(selectedSchool.name) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#A3E635]/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#7C3AED]">
                            {getTopAmbassador(selectedSchool.name)!.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{getTopAmbassador(selectedSchool.name)!.name}</p>
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', getTierColor(getTopAmbassador(selectedSchool.name)!.tier))}>
                            {getTopAmbassador(selectedSchool.name)!.tier}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#7C3AED]">
                          {calculateAmbassadorScore(getTopAmbassador(selectedSchool.name)!).total}
                        </span>
                        <p className="text-xs text-[#A1A1AA]">score</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#A1A1AA]">No ambassadors</p>
                  )}
                </section>
                
                {/* Next Planned Activation */}
                <section className="mb-6 p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Next Planned Activation</h4>
                  {getNextActivation(selectedSchool.name) ? (
                    <div>
                      <p className="font-semibold text-white">{getNextActivation(selectedSchool.name)!.title}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#A1A1AA]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(getNextActivation(selectedSchool.name)!.date).toLocaleDateString('en-GB', { 
                            weekday: 'short',
                            day: 'numeric', 
                            month: 'short'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {getNextActivation(selectedSchool.name)!.location}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#E5E5E5]">
                        Led by {getNextActivation(selectedSchool.name)!.ambassadorName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#A1A1AA]">No activations scheduled</p>
                  )}
                </section>
                
                {/* Recommended Action */}
                <section className="mb-6 p-4 rounded-lg border-l-4 border-[#7C3AED] bg-[#7C3AED]/10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] mb-2">Recommended Action</h4>
                  <p className="text-white">{getRecommendedAction(selectedSchool)}</p>
                </section>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="w-full py-3 rounded-md bg-[#2A2A2A] text-white font-medium hover:bg-[#3A3A3A] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* How Schools Are Ranked Modal */}
      {showRankingModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => setShowRankingModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">How school rankings work</h3>
                  <button 
                    onClick={() => setShowRankingModal(false)}
                    className="p-1 rounded hover:bg-secondary"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                
                <p className="text-[#E5E5E5] leading-relaxed mb-6">
                  Schools are ranked by a composite engagement score that reflects the health of the ambassador programme at that school — not just how many ambassadors they have, but how active they are. The score is calculated from four things: the tier distribution of ambassadors (more Leaders and YFN members = higher base), average activity streak across the school&apos;s ambassadors, recency of touchpoints (are we still in contact with people?), and activations completed in the last 30 days. A school can have 10 ambassadors and rank below a school with 4 — if those 4 are moving and those 10 aren&apos;t. The declining flag appears when engagement has dropped more than 10 points in the last 30 days.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Tier distribution</span>
                    <span className="text-[#7C3AED] font-semibold">up to 40pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Average activity streak</span>
                    <span className="text-[#7C3AED] font-semibold">up to 25pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Recency of touchpoints</span>
                    <span className="text-[#7C3AED] font-semibold">up to 20pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-[#0A0A0A] border border-[#2A2A2A]">
                    <span className="text-white font-medium">Activations completed (last 30 days)</span>
                    <span className="text-[#7C3AED] font-semibold">up to 15pts</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-md bg-amber-900/20 border border-amber-700/50">
                    <span className="text-white font-medium">Declining penalty</span>
                    <span className="text-amber-400 font-semibold">-10pts</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowRankingModal(false)}
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
