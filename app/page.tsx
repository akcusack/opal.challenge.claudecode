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
  const { activeView, resetToSeedData } = useAppStore()

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

      <button
        onClick={resetToSeedData}
        className="fixed bottom-4 left-4 text-xs text-[#444] hover:text-[#777] transition-colors z-50"
      >
        Reset to demo data
      </button>
    </div>
  )
}
