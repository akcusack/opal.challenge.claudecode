'use client'

import { TopNav } from '@/components/top-nav'
import { RightSidebar } from '@/components/right-sidebar'
import { SchoolsView } from '@/components/views/schools-view'
import { YearbookView } from '@/components/views/yearbook-view'
import { RankingsView } from '@/components/views/rankings-view'
import { PipelineView } from '@/components/views/pipeline-view'
import { CalendarView } from '@/components/views/calendar-view'
import { FeedView } from '@/components/views/feed-view'
import { useAppStore } from '@/lib/store'

export default function Home() {
  const { activeView } = useAppStore()
  
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopNav />
      
      <main>
        {activeView === 'schools' && <SchoolsView />}
        {activeView === 'rankings' && <RankingsView />}
        {activeView === 'pipeline' && <PipelineView />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'feed' && <FeedView />}
        {activeView === 'yearbook' && <YearbookView />}
      </main>
      
      <RightSidebar />
    </div>
  )
}
