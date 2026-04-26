export type Tier = 'Prospect' | 'Onboarded' | 'Active' | 'Leader' | 'Young Founders Network'

export interface Ambassador {
  id: string
  name: string
  school: string
  tier: Tier
  engagementScore: number
  isUncutGem: boolean
  lastContactDate: string
  daysInCurrentTier: number
  plannedActivation?: string
  activationDate?: string
  activationLocation?: string
  notes?: string
  email: string
  activationsCompleted: number
  streakWeeks: number
  tierUpgradedDate?: string
  quote?: string
}

export interface School {
  id: string
  name: string
  totalAmbassadors: number
  tierBreakdown: {
    prospect: number
    onboarded: number
    active: number
    leader: number
    yfn: number
  }
  engagementPercentage: number
  lastActivityDate: string
  isDecline: boolean
  isTrial?: boolean
  trialGoals?: {
    activations: number
    ambassadors: number
    engagementScore: number
    customGoal?: string
  }
  coordinatorName?: string
  coordinatorEmail?: string
  trialStartDate?: string
}

// Generate email from name and school
function generateEmail(name: string, school: string): string {
  const firstName = name.split(' ')[0].toLowerCase()
  const lastName = name.split(' ')[1]?.toLowerCase() || ''
  const schoolSlug = school.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)
  return `${firstName}.${lastName}@${schoolSlug}.school`
}

// Seed data for ambassadors
export const ambassadors: Ambassador[] = [
  // Highbury Academy - Leading school
  { id: '1', name: 'Maya Chen', school: 'Highbury Academy', tier: 'Young Founders Network', engagementScore: 98, isUncutGem: false, lastContactDate: '2026-04-24', daysInCurrentTier: 45, notes: 'Co-founded wellness club. Exceptional leader.', email: 'maya.chen@highburyacademy.school', activationsCompleted: 5, streakWeeks: 5, tierUpgradedDate: '2026-03-12' },
  { id: '2', name: 'Jordan Walsh', school: 'Highbury Academy', tier: 'Leader', engagementScore: 94, isUncutGem: false, lastContactDate: '2026-04-25', daysInCurrentTier: 30, plannedActivation: 'Instagram takeover', activationDate: '2026-05-02', activationLocation: 'Media Room', notes: 'Strong social media presence.', email: 'jordan.walsh@highburyacademy.school', activationsCompleted: 4, streakWeeks: 4, tierUpgradedDate: '2026-03-27' },
  { id: '3', name: 'Priya Sharma', school: 'Highbury Academy', tier: 'Leader', engagementScore: 91, isUncutGem: false, lastContactDate: '2026-04-23', daysInCurrentTier: 28, plannedActivation: 'Peer workshop', activationDate: '2026-04-30', activationLocation: 'Main Hall', email: 'priya.sharma@highburyacademy.school', activationsCompleted: 3, streakWeeks: 3, tierUpgradedDate: '2026-04-22' },
  { id: '4', name: 'Alex Turner', school: 'Highbury Academy', tier: 'Active', engagementScore: 85, isUncutGem: true, lastContactDate: '2026-04-20', daysInCurrentTier: 35, notes: 'Quietly influential. Watch closely.', email: 'alex.turner@highburyacademy.school', activationsCompleted: 2, streakWeeks: 2, quote: "I've been feeling like as the weather gets nicer, we should run an outdoor challenge — connecting with nature without our phones. What do you think?" },
  { id: '5', name: 'Sam Okonkwo', school: 'Highbury Academy', tier: 'Active', engagementScore: 82, isUncutGem: false, lastContactDate: '2026-04-22', daysInCurrentTier: 22, email: 'sam.okonkwo@highburyacademy.school', activationsCompleted: 2, streakWeeks: 3 },
  { id: '6', name: 'Lily Park', school: 'Highbury Academy', tier: 'Onboarded', engagementScore: 70, isUncutGem: false, lastContactDate: '2026-04-21', daysInCurrentTier: 14, email: 'lily.park@highburyacademy.school', activationsCompleted: 1, streakWeeks: 1 },
  
  // St Clement's - Mid-tier, good momentum
  { id: '7', name: 'Oscar Williams', school: "St Clement's", tier: 'Leader', engagementScore: 88, isUncutGem: false, lastContactDate: '2026-04-24', daysInCurrentTier: 40, plannedActivation: 'Lunch session w/ Year 10s', activationDate: '2026-05-03', activationLocation: 'Canteen', email: 'oscar.williams@stclements.school', activationsCompleted: 4, streakWeeks: 4 },
  { id: '8', name: 'Zara Hussein', school: "St Clement's", tier: 'Active', engagementScore: 79, isUncutGem: true, lastContactDate: '2026-04-19', daysInCurrentTier: 32, notes: 'Great connector. Mid-pipeline gem.', email: 'zara.hussein@stclements.school', activationsCompleted: 2, streakWeeks: 2, quote: 'I never thought a screen time app would actually get me — but here I am.' },
  { id: '9', name: 'Tom Brady', school: "St Clement's", tier: 'Active', engagementScore: 75, isUncutGem: false, lastContactDate: '2026-04-25', daysInCurrentTier: 18, email: 'tom.brady@stclements.school', activationsCompleted: 1, streakWeeks: 2 },
  { id: '10', name: 'Nina Patel', school: "St Clement's", tier: 'Onboarded', engagementScore: 65, isUncutGem: false, lastContactDate: '2026-04-08', daysInCurrentTier: 25, email: 'nina.patel@stclements.school', activationsCompleted: 0, streakWeeks: 0 },
  { id: '11', name: 'Jake Morrison', school: "St Clement's", tier: 'Prospect', engagementScore: 45, isUncutGem: false, lastContactDate: '2026-04-22', daysInCurrentTier: 10, email: 'jake.morrison@stclements.school', activationsCompleted: 0, streakWeeks: 1 },
  
  // The Reach School - Mid-tier
  { id: '12', name: 'Emma Richardson', school: 'The Reach School', tier: 'Active', engagementScore: 80, isUncutGem: false, lastContactDate: '2026-04-23', daysInCurrentTier: 38, email: 'emma.richardson@thereachschool.school', activationsCompleted: 3, streakWeeks: 3 },
  { id: '13', name: 'Kai Johnson', school: 'The Reach School', tier: 'Active', engagementScore: 76, isUncutGem: true, lastContactDate: '2026-04-18', daysInCurrentTier: 25, notes: 'Natural storyteller. Uncut gem potential.', email: 'kai.johnson@thereachschool.school', activationsCompleted: 2, streakWeeks: 1, quote: 'People listen when you are not trying to sell them something. That is the whole point.' },
  { id: '14', name: 'Sophie Lee', school: 'The Reach School', tier: 'Onboarded', engagementScore: 62, isUncutGem: false, lastContactDate: '2026-04-20', daysInCurrentTier: 20, email: 'sophie.lee@thereachschool.school', activationsCompleted: 1, streakWeeks: 1 },
  { id: '15', name: 'Marcus Brown', school: 'The Reach School', tier: 'Onboarded', engagementScore: 58, isUncutGem: false, lastContactDate: '2026-04-25', daysInCurrentTier: 15, email: 'marcus.brown@thereachschool.school', activationsCompleted: 0, streakWeeks: 1 },
  { id: '16', name: 'Chloe Davis', school: 'The Reach School', tier: 'Prospect', engagementScore: 40, isUncutGem: false, lastContactDate: '2026-04-21', daysInCurrentTier: 8, email: 'chloe.davis@thereachschool.school', activationsCompleted: 0, streakWeeks: 0 },
  
  // Northfield College - Mid-tier with varied momentum
  { id: '17', name: 'Ethan Clark', school: 'Northfield College', tier: 'Leader', engagementScore: 86, isUncutGem: false, lastContactDate: '2026-04-24', daysInCurrentTier: 55, email: 'ethan.clark@northfieldcollege.school', activationsCompleted: 4, streakWeeks: 5 },
  { id: '18', name: 'Ava Martinez', school: 'Northfield College', tier: 'Active', engagementScore: 77, isUncutGem: false, lastContactDate: '2026-04-10', daysInCurrentTier: 28, email: 'ava.martinez@northfieldcollege.school', activationsCompleted: 2, streakWeeks: 0 },
  { id: '19', name: 'Noah Kim', school: 'Northfield College', tier: 'Onboarded', engagementScore: 60, isUncutGem: true, lastContactDate: '2026-04-22', daysInCurrentTier: 33, notes: 'Quiet but deeply engaged. Hidden gem.', email: 'noah.kim@northfieldcollege.school', activationsCompleted: 1, streakWeeks: 2, quote: 'I used to think wellness stuff was just for people who already had it together. Coming at it from the other side has been different.' },
  { id: '20', name: 'Mia Thompson', school: 'Northfield College', tier: 'Prospect', engagementScore: 35, isUncutGem: false, lastContactDate: '2026-04-23', daysInCurrentTier: 12, email: 'mia.thompson@northfieldcollege.school', activationsCompleted: 0, streakWeeks: 0 },
  
  // Elmwood High - Declining engagement
  { id: '21', name: 'Lucas Wright', school: 'Elmwood High', tier: 'Active', engagementScore: 55, isUncutGem: false, lastContactDate: '2026-04-05', daysInCurrentTier: 60, notes: 'Engagement dropping. Needs attention.', email: 'lucas.wright@elmwoodhigh.school', activationsCompleted: 1, streakWeeks: 0 },
  { id: '22', name: 'Grace Anderson', school: 'Elmwood High', tier: 'Onboarded', engagementScore: 42, isUncutGem: false, lastContactDate: '2026-04-02', daysInCurrentTier: 45, email: 'grace.anderson@elmwoodhigh.school', activationsCompleted: 0, streakWeeks: 0 },
  { id: '23', name: 'Ryan Scott', school: 'Elmwood High', tier: 'Onboarded', engagementScore: 38, isUncutGem: false, lastContactDate: '2026-04-08', daysInCurrentTier: 40, email: 'ryan.scott@elmwoodhigh.school', activationsCompleted: 0, streakWeeks: 0 },
  { id: '24', name: 'Ella White', school: 'Elmwood High', tier: 'Prospect', engagementScore: 25, isUncutGem: false, lastContactDate: '2026-04-15', daysInCurrentTier: 20, email: 'ella.white@elmwoodhigh.school', activationsCompleted: 0, streakWeeks: 0 },
  { id: '25', name: 'Ben Taylor', school: 'Elmwood High', tier: 'Prospect', engagementScore: 20, isUncutGem: false, lastContactDate: '2026-04-18', daysInCurrentTier: 15, email: 'ben.taylor@elmwoodhigh.school', activationsCompleted: 0, streakWeeks: 0 },
  
  // Trinity Park - Mid-tier, newer program
  { id: '26', name: 'Isabella Garcia', school: 'Trinity Park', tier: 'Active', engagementScore: 83, isUncutGem: false, lastContactDate: '2026-04-25', daysInCurrentTier: 20, plannedActivation: 'Assembly presentation', activationDate: '2026-05-05', activationLocation: 'Assembly Hall', email: 'isabella.garcia@trinitypark.school', activationsCompleted: 3, streakWeeks: 4 },
  { id: '27', name: 'Oliver James', school: 'Trinity Park', tier: 'Active', engagementScore: 78, isUncutGem: false, lastContactDate: '2026-04-24', daysInCurrentTier: 15, email: 'oliver.james@trinitypark.school', activationsCompleted: 2, streakWeeks: 3 },
  { id: '28', name: 'Charlotte Wilson', school: 'Trinity Park', tier: 'Onboarded', engagementScore: 68, isUncutGem: false, lastContactDate: '2026-04-20', daysInCurrentTier: 18, email: 'charlotte.wilson@trinitypark.school', activationsCompleted: 1, streakWeeks: 1 },
  { id: '29', name: 'Henry Moore', school: 'Trinity Park', tier: 'Prospect', engagementScore: 50, isUncutGem: false, lastContactDate: '2026-04-23', daysInCurrentTier: 7, email: 'henry.moore@trinitypark.school', activationsCompleted: 0, streakWeeks: 1 },
  { id: '30', name: 'Amelia Evans', school: 'Trinity Park', tier: 'Prospect', engagementScore: 48, isUncutGem: false, lastContactDate: '2026-04-22', daysInCurrentTier: 5, email: 'amelia.evans@trinitypark.school', activationsCompleted: 0, streakWeeks: 0 },
]

// Calculate schools from ambassadors
export const schools: School[] = [
  {
    id: '1',
    name: 'Highbury Academy',
    totalAmbassadors: 6,
    tierBreakdown: { prospect: 0, onboarded: 1, active: 2, leader: 2, yfn: 1 },
    engagementPercentage: 87,
    lastActivityDate: '2026-04-25',
    isDecline: false,
  },
  {
    id: '2',
    name: "St Clement's",
    totalAmbassadors: 5,
    tierBreakdown: { prospect: 1, onboarded: 1, active: 2, leader: 1, yfn: 0 },
    engagementPercentage: 70,
    lastActivityDate: '2026-04-25',
    isDecline: false,
  },
  {
    id: '3',
    name: 'The Reach School',
    totalAmbassadors: 5,
    tierBreakdown: { prospect: 1, onboarded: 2, active: 2, leader: 0, yfn: 0 },
    engagementPercentage: 63,
    lastActivityDate: '2026-04-25',
    isDecline: false,
  },
  {
    id: '4',
    name: 'Northfield College',
    totalAmbassadors: 4,
    tierBreakdown: { prospect: 1, onboarded: 1, active: 1, leader: 1, yfn: 0 },
    engagementPercentage: 65,
    lastActivityDate: '2026-04-24',
    isDecline: false,
  },
  {
    id: '5',
    name: 'Elmwood High',
    totalAmbassadors: 5,
    tierBreakdown: { prospect: 2, onboarded: 2, active: 1, leader: 0, yfn: 0 },
    engagementPercentage: 36,
    lastActivityDate: '2026-04-18',
    isDecline: true,
  },
  {
    id: '6',
    name: 'Trinity Park',
    totalAmbassadors: 5,
    tierBreakdown: { prospect: 2, onboarded: 1, active: 2, leader: 0, yfn: 0 },
    engagementPercentage: 65,
    lastActivityDate: '2026-04-25',
    isDecline: false,
  },
]

// Helper functions
export function getDaysSinceContact(dateString: string): number {
  const today = new Date('2026-04-26')
  const contactDate = new Date(dateString)
  const diffTime = Math.abs(today.getTime() - contactDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getDropOffAmbassadors(): Ambassador[] {
  return ambassadors.filter(a => getDaysSinceContact(a.lastContactDate) >= 14)
}

export function getReadyToLevelUp(): Ambassador[] {
  return ambassadors.filter(a => a.daysInCurrentTier >= 30 && a.tier !== 'Young Founders Network')
}

export function getAverageEngagement(): number {
  const total = schools.reduce((sum, school) => sum + school.engagementPercentage, 0)
  return Math.round(total / schools.length)
}

export function getMostEngagedSchool(): School {
  return schools.reduce((max, school) => school.engagementPercentage > max.engagementPercentage ? school : max)
}

export function getLatestUncutGem(): Ambassador | undefined {
  return ambassadors.filter(a => a.isUncutGem).sort((a, b) => 
    new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime()
  )[0]
}

export function getUpcomingActivations(): Ambassador[] {
  return ambassadors.filter(a => a.plannedActivation).slice(0, 3)
}

export function getActiveAmbassadorCount(): number {
  return ambassadors.filter(a => a.tier !== 'Prospect').length
}

// Calendar Events
export type EventType = 'activation' | 'check-in'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  eventType: EventType
  ambassadorIds: string[]
  location: string
  notes?: string
}

// Seed calendar events
export const calendarEvents: CalendarEvent[] = [
  // Activations from ambassador data
  { id: 'act-1', title: 'Instagram takeover', date: '2026-05-02', eventType: 'activation', ambassadorIds: ['2'], location: 'Media Room', notes: 'Jordan leading social campaign' },
  { id: 'act-2', title: 'Peer workshop', date: '2026-04-30', eventType: 'activation', ambassadorIds: ['3'], location: 'Main Hall', notes: 'Mental wellness focus' },
  { id: 'act-3', title: 'Lunch session w/ Year 10s', date: '2026-05-03', eventType: 'activation', ambassadorIds: ['7'], location: 'Canteen' },
  { id: 'act-4', title: 'Assembly presentation', date: '2026-05-05', eventType: 'activation', ambassadorIds: ['26'], location: 'Assembly Hall' },
  // Check-ins spread across May 2026
  { id: 'chk-1', title: 'Monthly check-in', date: '2026-05-06', eventType: 'check-in', ambassadorIds: ['1'], location: 'Google Meet', notes: 'YFN progress review' },
  { id: 'chk-2', title: 'Onboarding follow-up', date: '2026-05-08', eventType: 'check-in', ambassadorIds: ['6', '15'], location: 'Room 7', notes: 'New ambassadors catch-up' },
  { id: 'chk-3', title: 'Re-engagement call', date: '2026-05-12', eventType: 'check-in', ambassadorIds: ['21'], location: 'Google Meet', notes: 'Elmwood High support' },
  { id: 'chk-4', title: 'Gem nurture session', date: '2026-05-15', eventType: 'check-in', ambassadorIds: ['4', '8'], location: 'Zoom', notes: 'Uncut gems development' },
  { id: 'chk-5', title: 'Leadership prep', date: '2026-05-20', eventType: 'check-in', ambassadorIds: ['17'], location: 'Room 12', notes: 'Ethan YFN pathway discussion' },
]

export function getTierColor(tier: Tier): string {
  switch (tier) {
    case 'Prospect': return 'bg-gray-500 text-white'
    case 'Onboarded': return 'bg-blue-500 text-white'
    case 'Active': return 'bg-[#7C3AED] text-white'
    case 'Leader': return 'bg-[#1a1a1a] text-[#A3E635] border border-[#A3E635]'
    case 'Young Founders Network': return 'bg-amber-600 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

export function getTierBorderColor(tier: Tier): string {
  switch (tier) {
    case 'Prospect': return 'border-gray-500'
    case 'Onboarded': return 'border-blue-500'
    case 'Active': return 'border-[#7C3AED]'
    case 'Leader': return 'border-[#A3E635]'
    case 'Young Founders Network': return 'border-amber-600'
    default: return 'border-gray-500'
  }
}

// Scoring system
export function calculateAmbassadorScore(ambassador: Ambassador): {
  total: number
  breakdown: {
    tier: number
    activations: number
    streak: number
    recency: number
    gemBonus: number
    decay: number
  }
} {
  // Tier base score
  const tierScores: Record<Tier, number> = {
    'Prospect': 8,
    'Onboarded': 16,
    'Active': 24,
    'Leader': 32,
    'Young Founders Network': 40,
  }
  const tierScore = tierScores[ambassador.tier]
  
  // Activations completed (5pts each, max 25pts)
  const activationsScore = Math.min(ambassador.activationsCompleted * 5, 25)
  
  // Streak weeks (4pts each, max 20pts)
  const streakScore = Math.min(ambassador.streakWeeks * 4, 20)
  
  // Recency score
  const daysSinceContact = getDaysSinceContact(ambassador.lastContactDate)
  let recencyScore = 0
  if (daysSinceContact <= 7) recencyScore = 10
  else if (daysSinceContact <= 14) recencyScore = 7
  else if (daysSinceContact <= 21) recencyScore = 3
  else recencyScore = 0
  
  // Uncut gem bonus
  const gemBonus = ambassador.isUncutGem ? 5 : 0
  
  // Decay: -1pt per week after 14 days no touchpoint
  let decay = 0
  if (daysSinceContact > 14) {
    const weeksOverdue = Math.floor((daysSinceContact - 14) / 7)
    decay = Math.min(weeksOverdue, 10) // Cap decay at 10
  }
  
  const total = Math.max(0, tierScore + activationsScore + streakScore + recencyScore + gemBonus - decay)
  
  return {
    total,
    breakdown: {
      tier: tierScore,
      activations: activationsScore,
      streak: streakScore,
      recency: recencyScore,
      gemBonus,
      decay,
    }
  }
}

// Smart action generation
export interface SmartAction {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export function generateSmartActions(ambassadorList: Ambassador[]): SmartAction[] {
  const actions: SmartAction[] = []
  
  // Check for schools with multiple drop-offs
  const schoolDropOffs: Record<string, Ambassador[]> = {}
  ambassadorList.forEach(a => {
    if (getDaysSinceContact(a.lastContactDate) >= 14) {
      if (!schoolDropOffs[a.school]) schoolDropOffs[a.school] = []
      schoolDropOffs[a.school].push(a)
    }
  })
  
  Object.entries(schoolDropOffs).forEach(([school, dropped]) => {
    if (dropped.length >= 2) {
      actions.push({
        id: `dropoff-${school}`,
        title: `Re-engage ${school}`,
        description: `${dropped.length} ambassadors haven't been contacted in 14+ days`,
        priority: 'high',
      })
    }
  })
  
  // Check for ambassadors ready to level up
  const readyToLevel = ambassadorList.filter(a => 
    a.daysInCurrentTier >= 30 && 
    a.tier !== 'Young Founders Network' &&
    calculateAmbassadorScore(a).total >= 50
  )
  
  if (readyToLevel.length > 0) {
    const topCandidate = readyToLevel.sort((a, b) => 
      calculateAmbassadorScore(b).total - calculateAmbassadorScore(a).total
    )[0]
    actions.push({
      id: `levelup-${topCandidate.id}`,
      title: `Promote ${topCandidate.name}`,
      description: `Ready for ${topCandidate.tier === 'Active' ? 'Leader' : 'next tier'} — ${topCandidate.daysInCurrentTier} days at current level`,
      priority: 'medium',
    })
  }
  
  // Check for declining schools
  const decliningSchools = schools.filter(s => s.isDecline)
  decliningSchools.forEach(school => {
    if (!actions.some(a => a.title.includes(school.name))) {
      actions.push({
        id: `decline-${school.id}`,
        title: `Revive ${school.name}`,
        description: `Engagement at ${school.engagementPercentage}% — schedule team outreach`,
        priority: 'high',
      })
    }
  })
  
  // Check for uncut gems needing attention
  const gems = ambassadorList.filter(a => a.isUncutGem && getDaysSinceContact(a.lastContactDate) >= 7)
  if (gems.length > 0) {
    const gem = gems[0]
    actions.push({
      id: `gem-${gem.id}`,
      title: `Nurture ${gem.name}`,
      description: `Uncut gem hasn't been contacted in ${getDaysSinceContact(gem.lastContactDate)} days`,
      priority: 'medium',
    })
  }
  
  return actions.slice(0, 3)
}

// Feed Posts
export type PostTag = 'idea' | 'win' | 'moment' | 'story'

export interface FeedPost {
  id: string
  ambassadorId: string
  tag: PostTag
  content: string
  datePosted: string
  reactions: number
}

export const feedPosts: FeedPost[] = [
  // Required 4 posts from spec
  { id: 'post-1', ambassadorId: '1', tag: 'win', content: 'Got 23 people to show up to our lunchtime session. Half of them said they\'d never heard of Opal before. Three of them asked how to become ambassadors.', datePosted: '2026-04-25', reactions: 42 },
  { id: 'post-2', ambassadorId: '4', tag: 'idea', content: "I've been feeling like as the weather gets nicer, we should run an outdoor challenge — connecting with nature without our phones. What do you think?", datePosted: '2026-04-24', reactions: 38 },
  { id: 'post-3', ambassadorId: '19', tag: 'story', content: 'I used to think wellness stuff was just for people who already had it together. Coming at it from the other side has been different.', datePosted: '2026-04-23', reactions: 31 },
  { id: 'post-4', ambassadorId: '22', tag: 'moment', content: 'First ambassador meeting at Elmwood. Six people showed up and we ended up talking for two hours. Something is starting here.', datePosted: '2026-04-22', reactions: 27 },
  
  // 11 more posts spread across schools
  { id: 'post-5', ambassadorId: '2', tag: 'win', content: 'The Instagram takeover numbers came in. 847 story views and 12 DMs asking about the app. Not bad for a Tuesday.', datePosted: '2026-04-21', reactions: 45 },
  { id: 'post-6', ambassadorId: '7', tag: 'idea', content: 'Thinking about doing weekly office hours where people can come ask questions. No pressure, no sign-up. Just show up if you want.', datePosted: '2026-04-20', reactions: 22 },
  { id: 'post-7', ambassadorId: '12', tag: 'moment', content: 'Caught two Year 9s showing each other their focus scores in the corridor. Did not say anything. Just smiled and kept walking.', datePosted: '2026-04-19', reactions: 35 },
  { id: 'post-8', ambassadorId: '17', tag: 'story', content: 'Three months ago I was the person who needed convincing. Now I am running sessions. Funny how that works.', datePosted: '2026-04-18', reactions: 29 },
  { id: 'post-9', ambassadorId: '26', tag: 'win', content: 'Assembly went better than expected. Got actual applause. The head teacher asked if we could do it again next term.', datePosted: '2026-04-17', reactions: 47 },
  { id: 'post-10', ambassadorId: '3', tag: 'idea', content: 'What about pairing new ambassadors with experienced ones? Like a buddy system but for the first month. Less overwhelming that way.', datePosted: '2026-04-16', reactions: 19 },
  { id: 'post-11', ambassadorId: '9', tag: 'moment', content: 'Had a student come up to me after class and say Opal helped them get their first full night of sleep in weeks. That is why we do this.', datePosted: '2026-04-15', reactions: 41 },
  { id: 'post-12', ambassadorId: '27', tag: 'story', content: 'My parents noticed I was off my phone more. They asked what changed. I told them about Opal. Now they want the app too.', datePosted: '2026-04-14', reactions: 33 },
  { id: 'post-13', ambassadorId: '8', tag: 'win', content: 'Connected three different friend groups to each other through the programme. Watching people find their people is the best part.', datePosted: '2026-04-13', reactions: 24 },
  { id: 'post-14', ambassadorId: '13', tag: 'idea', content: 'Could we get branded hoodies? Not for us to keep, but to lend out. Makes people curious. Conversation starter.', datePosted: '2026-04-12', reactions: 16 },
  { id: 'post-15', ambassadorId: '21', tag: 'moment', content: 'Ran into a Year 7 wearing a focus mode reminder on their wrist. They made it themselves. Did not even know we had ambassadors that young following along.', datePosted: '2026-04-11', reactions: 28 },
]

export function getPostTagStyle(tag: PostTag): { bg: string; text: string; label: string } {
  switch (tag) {
    case 'idea': return { bg: 'bg-[#7C3AED]', text: 'text-white', label: 'Idea' }
    case 'win': return { bg: 'bg-[#A3E635]', text: 'text-black', label: 'Win' }
    case 'moment': return { bg: 'bg-blue-500', text: 'text-white', label: 'Moment' }
    case 'story': return { bg: 'bg-amber-500', text: 'text-black', label: 'Story' }
  }
}
