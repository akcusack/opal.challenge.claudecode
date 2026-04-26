'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp, Minus, Users, Mail, X, MapPin, Calendar, HelpCircle, ChevronRight, Share2 } from 'lucide-react'
import { getTierColor, getDaysSinceContact, calculateAmbassadorScore, type School, type Ambassador } from '@/lib/data'
import { useState } from 'react'
import { LaunchSchoolWizard } from '@/components/launch-school-wizard'

export function SchoolsView() {
  const { schools, ambassadors, sidebarOpen, calendarEvents } = useAppStore()
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [showRankingModal, setShowRankingModal] = useState(false)
  const [showLaunchWizard, setShowLaunchWizard] = useState(false)
  
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

  const handleShareSchool = (school: School) => {
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    const schoolAmbs = getSchoolAmbassadors(school.name)
    const topAmb = getTopAmbassador(school.name)
    const nextAct = getNextActivation(school.name)
    const trend = getEngagementTrend(school)
    const action = getRecommendedAction(school)

    const today = new Date('2026-04-26').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    const parts: string[] = []
    if (school.tierBreakdown.yfn > 0) parts.push(`${school.tierBreakdown.yfn} YFN`)
    if (school.tierBreakdown.leader > 0) parts.push(`${school.tierBreakdown.leader} Leader${school.tierBreakdown.leader > 1 ? 's' : ''}`)
    if (school.tierBreakdown.active > 0) parts.push(`${school.tierBreakdown.active} Active`)
    if (school.tierBreakdown.onboarded > 0) parts.push(`${school.tierBreakdown.onboarded} Onboarded`)
    if (school.tierBreakdown.prospect > 0) parts.push(`${school.tierBreakdown.prospect} Prospect${school.tierBreakdown.prospect > 1 ? 's' : ''}`)
    const tierString = parts.join(' · ') || 'No ambassadors yet'

    const trendLabel = trend === 'up' ? '↑ Trending up' : trend === 'down' ? '↓ Declining' : '→ Stable'
    const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-flat'

    const progStartDate = school.trialStartDate
      ? new Date(school.trialStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date('2026-01-20').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    const topAmbActivity = topAmb
      ? topAmb.notes
        ? topAmb.notes.split('.')[0]
        : `${topAmb.activationsCompleted} activation${topAmb.activationsCompleted !== 1 ? 's' : ''} completed — ${topAmb.streakWeeks}-week activity streak`
      : ''

    const recentActAmb = schoolAmbs
      .filter(a => a.activationsCompleted > 0)
      .sort((a, b) => b.activationsCompleted - a.activationsCompleted)[0]
    const attendance = Math.max(8, Math.round(10 + (school.engagementPercentage / 100) * 25))
    const recentActTitle = recentActAmb?.plannedActivation || 'Ambassador Programme Session'
    const recentActLocation = recentActAmb?.activationLocation || 'School Campus'
    const recentActDate = new Date(school.lastActivityDate).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

    const gemWithQuote = schoolAmbs.find(a => a.isUncutGem && a.quote)
    const pullQuote = gemWithQuote?.quote ||
      "Being part of this has reminded me why I care about my focus — and given me a way to talk about it with others."
    const quoteAuthor = gemWithQuote ? gemWithQuote.name : 'Opal Ambassador'

    const goals = school.trialGoals
      ? [
          `Run ${school.trialGoals.activations} activation${school.trialGoals.activations !== 1 ? 's' : ''}`,
          `Onboard ${school.trialGoals.ambassadors} active ambassador${school.trialGoals.ambassadors !== 1 ? 's' : ''}`,
          `Reach ${school.trialGoals.engagementScore}% engagement score`,
          ...(school.trialGoals.customGoal ? [school.trialGoals.customGoal] : []),
        ]
      : ['Run 1 activation', 'Onboard 3 active ambassadors', 'Reach 60% engagement score']

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(school.name)} — Opal School Update</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .page { max-width: 800px; margin: 0 auto; padding: 64px 72px; }
    .logo { font-size: 22px; font-weight: 800; color: #7C3AED; letter-spacing: -0.5px; }
    .programme-label { font-size: 13px; color: #9ca3af; margin-top: 4px; }
    .school-name { font-size: 40px; font-weight: 800; color: #111827; margin-top: 20px; line-height: 1.1; letter-spacing: -1.5px; }
    .meta { font-size: 13px; color: #9ca3af; margin-top: 10px; }
    .divider { height: 1px; background: #7C3AED; margin: 36px 0; opacity: 0.2; }
    .section { margin-bottom: 48px; }
    .section-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #7C3AED; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 18px; }
    .stat-box { background: #fafafa; border: 1px solid #f3f4f6; border-radius: 10px; padding: 18px 22px; }
    .stat-value { font-size: 30px; font-weight: 800; color: #111827; line-height: 1; }
    .stat-value-sm { font-size: 15px; font-weight: 700; color: #111827; line-height: 1.3; margin-top: 2px; }
    .stat-label { font-size: 12px; color: #9ca3af; margin-top: 5px; font-weight: 500; letter-spacing: 0.3px; }
    .tier-row { font-size: 14px; color: #374151; font-weight: 500; }
    .trend { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 100px; margin-top: 8px; }
    .trend-up { background: #ecfdf5; color: #059669; }
    .trend-down { background: #fffbeb; color: #d97706; }
    .trend-flat { background: #f5f3ff; color: #7C3AED; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px 26px; margin-bottom: 14px; }
    .card-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
    .card-title { font-size: 18px; font-weight: 700; color: #111827; }
    .card-meta { font-size: 13px; color: #6b7280; margin-top: 6px; line-height: 1.5; }
    .tier-pill { display: inline-block; background: #f5f3ff; color: #7C3AED; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 100px; margin-left: 8px; vertical-align: middle; }
    .quote-block { border-left: 3px solid #7C3AED; padding: 16px 24px; background: #faf5ff; border-radius: 0 10px 10px 0; margin-top: 16px; }
    .quote-text { font-size: 16px; color: #374151; font-style: italic; line-height: 1.7; }
    .quote-attr { font-size: 12px; color: #7C3AED; font-weight: 600; margin-top: 10px; }
    .goals-list { list-style: none; }
    .goals-list li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f9fafb; font-size: 15px; color: #374151; }
    .goals-list li:last-child { border-bottom: none; }
    .goal-dot { width: 8px; height: 8px; border-radius: 50%; background: #7C3AED; flex-shrink: 0; }
    .action-box { background: #faf5ff; border-left: 4px solid #7C3AED; border-radius: 0 10px 10px 0; padding: 18px 24px; }
    .action-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #7C3AED; margin-bottom: 8px; }
    .action-text { font-size: 15px; color: #374151; line-height: 1.65; }
    .footer { border-top: 2px solid #7C3AED; margin-top: 56px; padding-top: 22px; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
    .footer-brand { font-size: 13px; font-weight: 700; color: #7C3AED; }
    .footer-contact { font-size: 13px; color: #6b7280; text-align: right; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">

    <div>
      <div class="logo">Opal</div>
      <div class="programme-label">Ambassador Programme — School Update</div>
      <h1 class="school-name">${esc(school.name)}</h1>
      <div class="meta">Generated ${today}</div>
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-label">Programme Snapshot</div>
      <div class="stat-grid">
        <div class="stat-box">
          <div class="stat-value">${school.totalAmbassadors}</div>
          <div class="stat-label">Total ambassadors</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${school.engagementPercentage}%</div>
          <div class="stat-label">Engagement score</div>
          <div class="trend ${trendClass}">${trendLabel}</div>
        </div>
        <div class="stat-box">
          <div class="stat-value-sm">${progStartDate}</div>
          <div class="stat-label">Programme start</div>
        </div>
      </div>
      <div class="tier-row">${esc(tierString)}</div>
    </div>

    <div class="section">
      <div class="section-label">Highlights This Month</div>
      ${topAmb ? `
      <div class="card">
        <div class="card-eyebrow">Top Ambassador</div>
        <div class="card-title">${esc(topAmb.name)}<span class="tier-pill">${esc(topAmb.tier)}</span></div>
        ${topAmbActivity ? `<div class="card-meta">${esc(topAmbActivity)}</div>` : ''}
      </div>` : ''}
      ${recentActAmb ? `
      <div class="card">
        <div class="card-eyebrow">Most Recent Activation</div>
        <div class="card-title">${esc(recentActTitle)}</div>
        <div class="card-meta">${esc(recentActDate)} &nbsp;&middot;&nbsp; ${esc(recentActLocation)} &nbsp;&middot;&nbsp; ${attendance} students attended</div>
      </div>` : ''}
      <div class="quote-block">
        <div class="quote-text">&ldquo;${esc(pullQuote)}&rdquo;</div>
        <div class="quote-attr">&mdash; ${esc(quoteAuthor)}${gemWithQuote ? ', Uncut Gem Ambassador' : ''}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-label">What's Coming</div>
      ${nextAct ? `
      <div class="card">
        <div class="card-eyebrow">Next Planned Activation</div>
        <div class="card-title">${esc(nextAct.title)}</div>
        <div class="card-meta">${esc(new Date(nextAct.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))} &nbsp;&middot;&nbsp; ${esc(nextAct.location)} &nbsp;&middot;&nbsp; Led by ${esc(nextAct.ambassadorName)}</div>
      </div>` : `
      <div class="card">
        <div class="card-eyebrow">Next Planned Activation</div>
        <div class="card-title" style="color:#9ca3af;font-size:15px;font-weight:500;">No activations currently scheduled</div>
      </div>`}
      <div class="card">
        <div class="card-eyebrow">30-Day Goals</div>
        <ul class="goals-list">
          ${goals.map(g => `<li><span class="goal-dot"></span>${esc(g)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="action-box">
        <div class="action-label">Recommended Next Action</div>
        <div class="action-text">${esc(action)}</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-brand">Generated by Opal Ambassador OS</div>
      <div class="footer-contact">Questions? Reach out to Annabelle, your Opal Advocacy Manager.</div>
    </div>

  </div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${school.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-school-update.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('p-6 transition-all duration-300', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8">
        <div className="flex items-center justify-between">
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
          <button
            onClick={() => setShowLaunchWizard(true)}
            className="px-4 py-2 rounded-md bg-[#A3E635] text-black text-sm font-semibold hover:bg-[#c4f96a] transition-colors"
          >
            Launch a School
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

            {/* Trial badge */}
            {school.isTrial && !school.isDecline && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <span className="text-[10px] font-semibold tracking-wide">Trial</span>
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
                
                {/* Trial Goals */}
                {selectedSchool.isTrial && selectedSchool.trialGoals && (
                  <section className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Trial Goals — 30 Days
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A1AA]">Activations</span>
                        <span className="text-white font-medium">
                          0 / {selectedSchool.trialGoals.activations}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A1AA]">Ambassadors onboarded</span>
                        <span className="text-white font-medium">
                          0 / {selectedSchool.trialGoals.ambassadors}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A1AA]">Engagement score</span>
                        <span className="text-white font-medium">
                          0% / {selectedSchool.trialGoals.engagementScore}%
                        </span>
                      </div>
                      {selectedSchool.trialGoals.customGoal && (
                        <div className="pt-2 border-t border-amber-500/20">
                          <span className="text-xs text-[#A1A1AA]">
                            {selectedSchool.trialGoals.customGoal}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Recommended Action */}
                <section className="mb-6 p-4 rounded-lg border-l-4 border-[#7C3AED] bg-[#7C3AED]/10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] mb-2">Recommended Action</h4>
                  <p className="text-white">{getRecommendedAction(selectedSchool)}</p>
                </section>
                
                {/* Footer buttons */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedSchool(null)}
                    className="px-6 py-3 rounded-md bg-[#2A2A2A] text-white font-medium hover:bg-[#3A3A3A] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleShareSchool(selectedSchool)}
                    className="flex items-center gap-2 px-5 py-3 rounded-md bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share with School
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Launch a School Wizard */}
      {showLaunchWizard && <LaunchSchoolWizard onClose={() => setShowLaunchWizard(false)} />}

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
