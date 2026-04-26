'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ambassadors as initialAmbassadors, schools as initialSchools, calendarEvents as initialEvents, type Ambassador, type School, type Tier, type CalendarEvent, type EventType } from './data'

interface AppState {
  ambassadors: Ambassador[]
  schools: School[]
  calendarEvents: CalendarEvent[]
  selectedAmbassador: Ambassador | null
  sidebarOpen: boolean
  activeView: 'schools' | 'yearbook' | 'rankings' | 'pipeline' | 'calendar' | 'feed'
  
  // Actions
  setSelectedAmbassador: (ambassador: Ambassador | null) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveView: (view: 'schools' | 'yearbook' | 'rankings' | 'pipeline' | 'calendar' | 'feed') => void
  moveToNextTier: (ambassadorId: string) => void
  updateAmbassadorNotes: (ambassadorId: string, notes: string) => void
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void
  launchSchool: (school: Omit<School, 'id'>, newAmbassadors: Omit<Ambassador, 'id'>[]) => void
  resetToSeedData: () => void
}

const tierOrder: Tier[] = ['Prospect', 'Onboarded', 'Active', 'Leader', 'Young Founders Network']

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  ambassadors: initialAmbassadors,
  schools: initialSchools,
  calendarEvents: initialEvents,
  selectedAmbassador: null,
  sidebarOpen: true,
  activeView: 'schools',
  
  setSelectedAmbassador: (ambassador) => set({ selectedAmbassador: ambassador }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setActiveView: (view) => set({ activeView: view }),
  
  moveToNextTier: (ambassadorId) => set((state) => {
    const ambassador = state.ambassadors.find(a => a.id === ambassadorId)
    if (!ambassador) return state
    
    const currentIndex = tierOrder.indexOf(ambassador.tier)
    if (currentIndex >= tierOrder.length - 1) return state
    
    const nextTier = tierOrder[currentIndex + 1]
    
    return {
      ambassadors: state.ambassadors.map(a => 
        a.id === ambassadorId 
          ? { ...a, tier: nextTier, daysInCurrentTier: 0 }
          : a
      )
    }
  }),
  
  updateAmbassadorNotes: (ambassadorId, notes) => set((state) => ({
    ambassadors: state.ambassadors.map(a => 
      a.id === ambassadorId ? { ...a, notes } : a
    )
  })),
  
  addCalendarEvent: (event) => set((state) => ({
    calendarEvents: [
      ...state.calendarEvents,
      { ...event, id: `evt-${Date.now()}` }
    ]
  })),

  launchSchool: (schoolData, newAmbassadors) => set((state) => ({
    schools: [
      ...state.schools,
      { ...schoolData, id: `school-${Date.now()}` }
    ],
    ambassadors: [
      ...state.ambassadors,
      ...newAmbassadors.map((a, i) => ({ ...a, id: `amb-${Date.now()}-${i}` }))
    ]
  })),

  resetToSeedData: () => set({
    ambassadors: initialAmbassadors,
    schools: initialSchools,
  }),
    }),
    {
      name: 'opal-ambassador-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ambassadors: state.ambassadors,
        schools: state.schools,
      }),
    }
  )
)
