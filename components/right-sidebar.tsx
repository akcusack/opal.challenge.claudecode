'use client'

import { useAppStore } from '@/lib/store'
import { 
  getDaysSinceContact,
  getTierColor,
  getAverageEngagement,
  getMostEngagedSchool,
  generateSmartActions,
} from '@/lib/data'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingUp, Trophy, Clock, Calendar, Zap } from 'lucide-react'

export function RightSidebar() {
  const { sidebarOpen, toggleSidebar, ambassadors } = useAppStore()
  
  const dropOffs = ambassadors.filter(a => getDaysSinceContact(a.lastContactDate) >= 14)
  const avgEngagement = getAverageEngagement()
  const topSchool = getMostEngagedSchool()
  const readyToLevel = ambassadors.filter(a => a.daysInCurrentTier >= 30 && a.tier !== 'Young Founders Network')
  const upcomingActivations = ambassadors.filter(a => a.plannedActivation).slice(0, 3)
  const smartActions = generateSmartActions(ambassadors)

  const activeStreaking = ambassadors.filter(a => a.streakWeeks >= 3)
  const activeCount = activeStreaking.length
  const totalCount = ambassadors.length
  const engagedPct = totalCount > 0 ? activeCount / totalCount : 0

  // SVG donut chart helpers
  const r = 40
  const cx = 50
  const cy = 50
  const endX = cx + r * Math.sin(engagedPct * 2 * Math.PI)
  const endY = cy - r * Math.cos(engagedPct * 2 * Math.PI)
  const largeArc = engagedPct > 0.5 ? 1 : 0
  
  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'fixed top-20 z-40 flex h-8 w-8 items-center justify-center',
          'rounded-l-md border border-r-0 border-[#2A2A2A] bg-[#1A1A1A] shadow-sm',
          'text-[#A1A1AA] hover:text-white transition-all',
          sidebarOpen ? 'right-80' : 'right-0'
        )}
      >
        {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 border-l border-[#2A2A2A] bg-[#111111]',
          'transition-transform duration-300 ease-in-out overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 space-y-6">
          {/* Title */}
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#A3E635]" />
              SIGNAL FEED
            </h2>
          </div>
          
          {/* Total Ambassadors */}
          <section>
            <div className="p-3 rounded-md bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-3xl font-bold text-white tabular-nums">{ambassadors.length}</p>
              <p className="text-xs text-[#A1A1AA] mt-1 uppercase tracking-wider">total ambassadors</p>
            </div>
          </section>

          {/* Top 3 Actions */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Top 3 Actions
            </h3>
            <div className="space-y-2">
              {smartActions.map((action, index) => (
                <div 
                  key={action.id}
                  className="p-3 rounded-md bg-secondary border-l-4 border-[#7C3AED]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Drop-off Alerts */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Drop-off Alerts
              </h3>
            </div>
            {dropOffs.length > 0 ? (
              <div className="space-y-2">
                {dropOffs.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-md bg-[#1A1A1A] border-l-2 border-[#F59E0B]">
                    <div>
                      <p className="text-sm font-medium text-white">{a.name}</p>
                      <p className="text-xs text-[#A1A1AA]">{a.school}</p>
                    </div>
                    <span className="text-xs font-medium text-[#F59E0B]">
                      {getDaysSinceContact(a.lastContactDate)}d
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No drop-offs</p>
            )}
          </section>
          
          {/* Overall Engagement */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overall Engagement
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{avgEngagement}%</span>
              <span className="text-sm text-[#A3E635] font-medium">+3%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A3E635]" 
                style={{ width: `${avgEngagement}%` }}
              />
            </div>
          </section>
          
          {/* Engagement Breakdown Pie */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Engagement Breakdown
            </h3>
            <div className="flex items-center gap-4">
              <svg width="100" height="100" viewBox="0 0 100 100" className="flex-shrink-0">
                {engagedPct === 0 ? (
                  <circle cx={cx} cy={cy} r={r} fill="#444444" />
                ) : engagedPct === 1 ? (
                  <circle cx={cx} cy={cy} r={r} fill="#7C3AED" />
                ) : (
                  <>
                    <circle cx={cx} cy={cy} r={r} fill="#444444" />
                    <path
                      d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)} Z`}
                      fill="#7C3AED"
                    />
                  </>
                )}
                <circle cx={cx} cy={cy} r={r * 0.55} fill="#111111" />
                <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                  {Math.round(engagedPct * 100)}%
                </text>
              </svg>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#7C3AED] flex-shrink-0" />
                  <span className="text-xs text-white">{Math.round(engagedPct * 100)}% Active</span>
                </div>
                <p className="text-[10px] text-[#A1A1AA] leading-tight -mt-1 ml-4">3+ week streak</p>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#444444] flex-shrink-0" />
                  <span className="text-xs text-[#A1A1AA]">{Math.round((1 - engagedPct) * 100)}% Unengaged</span>
                </div>
              </div>
            </div>
          </section>

          {/* Most Engaged School */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-[#A3E635]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Most Engaged School
              </h3>
            </div>
            <div className="p-3 rounded-md bg-gradient-to-br from-[#7C3AED]/10 to-[#A3E635]/20 border border-[#A3E635]/30">
              <p className="text-sm font-semibold text-foreground">{topSchool.name}</p>
              <p className="text-2xl font-bold text-[#7C3AED]">{topSchool.engagementPercentage}%</p>
            </div>
          </section>
          
          {/* Ready to Level Up */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[#7C3AED]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ready to Level Up
              </h3>
            </div>
            {readyToLevel.length > 0 ? (
              <div className="space-y-2">
                {readyToLevel.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-md bg-[#7C3AED]/10 border border-[#7C3AED]/30">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.name}</p>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', getTierColor(a.tier))}>
                        {a.tier}
                      </span>
                    </div>
                    <span className="text-xs text-[#7C3AED] font-medium">
                      {a.daysInCurrentTier}d
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No one ready</p>
            )}
          </section>
          
          {/* Upcoming Activations */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-[#7C3AED]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming Activations
              </h3>
            </div>
            {upcomingActivations.length > 0 ? (
              <div className="space-y-2">
                {upcomingActivations.map((a) => (
                  <div key={a.id} className="p-2 rounded-md bg-secondary border border-border">
                    <p className="text-sm font-medium text-foreground">{a.plannedActivation}</p>
                    <p className="text-xs text-muted-foreground">{a.name} • {a.school}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activations planned</p>
            )}
          </section>
        </div>
      </aside>
    </>
  )
}
