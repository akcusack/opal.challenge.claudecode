'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, MapPin, Plus, X, Calendar, Users } from 'lucide-react'
import { useState } from 'react'
import type { EventType } from '@/lib/data'

export function CalendarView() {
  const { ambassadors, sidebarOpen, calendarEvents, addCalendarEvent } = useAppStore()
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-05-01'))
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  
  // Form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    eventType: 'activation' as EventType,
    ambassadorIds: [] as string[],
    location: '',
    notes: '',
  })

  // Format a HH:MM London time into a 3-timezone compact row
  // All seed events fall within BST (UTC+1), EDT (UTC-4), CEST (UTC+2)
  // so the relative offsets are: NY = London − 5h, Paris = London + 1h
  const getTimezoneRow = (time: string): string => {
    const [hStr, mStr] = time.split(':')
    const h = parseInt(hStr)
    const m = parseInt(mStr)
    const fmt = (hour: number, min: number) => {
      const h12 = hour % 12 || 12
      const ampm = hour < 12 ? 'AM' : 'PM'
      return `${h12}:${String(min).padStart(2, '0')} ${ampm}`
    }
    const nyH = ((h - 5) + 24) % 24
    const parisH = (h + 1) % 24
    return `${fmt(h, m)} London · ${fmt(nyH, m)} New York · ${fmt(parisH, m)} Paris`
  }
  
  // Get ambassador name by ID
  const getAmbassadorName = (id: string) => {
    return ambassadors.find(a => a.id === id)?.name || 'Unknown'
  }
  
  const getAmbassadorSchool = (id: string) => {
    return ambassadors.find(a => a.id === id)?.school || 'Unknown'
  }
  
  // Combine calendar events with activation data
  const allEvents = calendarEvents
    .map(event => ({
      ...event,
      dateObj: new Date(event.date),
      ambassadorNames: event.ambassadorIds.map(getAmbassadorName),
      school: event.ambassadorIds.length > 0 ? getAmbassadorSchool(event.ambassadorIds[0]) : '',
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days: (number | null)[] = []
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }
  
  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  
  const getEventsForDay = (day: number) =>
    allEvents.filter(
      e =>
        e.dateObj.getFullYear() === currentMonth.getFullYear() &&
        e.dateObj.getMonth() === currentMonth.getMonth() &&
        e.dateObj.getDate() === day
    )

  const getEventsOnDay = (day: number | null) => {
    if (!day) return { activations: false, checkIns: false }
    return {
      activations: allEvents.some(e => 
        e.dateObj.getMonth() === currentMonth.getMonth() && 
        e.dateObj.getDate() === day &&
        e.eventType === 'activation'
      ),
      checkIns: allEvents.some(e => 
        e.dateObj.getMonth() === currentMonth.getMonth() && 
        e.dateObj.getDate() === day &&
        e.eventType === 'check-in'
      )
    }
  }
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    
    addCalendarEvent({
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time || undefined,
      eventType: newEvent.eventType,
      ambassadorIds: newEvent.ambassadorIds,
      location: newEvent.location,
      notes: newEvent.notes,
    })

    // Reset form
    setNewEvent({
      title: '',
      date: '',
      time: '',
      eventType: 'activation',
      ambassadorIds: [],
      location: '',
      notes: '',
    })
    setShowAddModal(false)
  }
  
  const toggleAmbassador = (id: string) => {
    setNewEvent(prev => ({
      ...prev,
      ambassadorIds: prev.ambassadorIds.includes(id)
        ? prev.ambassadorIds.filter(a => a !== id)
        : [...prev.ambassadorIds, id]
    }))
  }
  
  return (
    <div className={cn('p-6 transition-all duration-300', sidebarOpen ? 'mr-80' : 'mr-0')}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h2>
          <p className="text-muted-foreground mt-1">Activations and check-ins</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md',
            'text-sm font-medium transition-colors',
            'bg-[#7C3AED] text-white hover:bg-[#7C3AED]/80'
          )}
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Grid */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <h3 className="text-xl font-bold text-foreground">{monthName}</h3>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const events = getEventsOnDay(day)
              const hasAnyEvent = events.activations || events.checkIns
              
              return (
                <div
                  key={index}
                  onClick={() => { if (day && hasAnyEvent) setSelectedDay(day) }}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-md relative',
                    day ? 'hover:bg-secondary' : '',
                    day && hasAnyEvent && 'bg-[#7C3AED]/10 cursor-pointer hover:bg-[#7C3AED]/20',
                    day && !hasAnyEvent && 'cursor-default'
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        'text-sm font-medium',
                        hasAnyEvent ? 'text-[#7C3AED]' : 'text-foreground'
                      )}>
                        {day}
                      </span>
                      <div className="absolute bottom-1 flex gap-0.5">
                        {events.activations && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                        )}
                        {events.checkIns && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
              <span>Activation scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              <span>Ambassador check-in</span>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events List */}
        <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight uppercase">
            Upcoming Events
          </h3>
          
          {allEvents.length > 0 ? (
            <div className="space-y-4">
              {allEvents.map((event) => (
                <article 
                  key={event.id}
                  className={cn(
                    'p-4 rounded-lg border-l-4 bg-secondary',
                    event.eventType === 'activation' ? 'border-[#A3E635]' : 'border-[#7C3AED]'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium uppercase',
                          event.eventType === 'activation' 
                            ? 'bg-[#A3E635]/20 text-[#A3E635]' 
                            : 'bg-[#7C3AED]/20 text-[#7C3AED]'
                        )}>
                          {event.eventType === 'activation' ? 'Activation' : 'Check-in'}
                        </span>
                      </div>
                      <time className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {event.dateObj.toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </time>
                      {event.time && (
                        <p className="text-xs text-[#555] mt-0.5 tracking-wide">
                          {getTimezoneRow(event.time)}
                        </p>
                      )}
                      <h4 className="text-lg font-semibold text-foreground mt-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.ambassadorNames.join(', ')} {event.school && `• ${event.school}`}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-md flex flex-col items-center justify-center',
                      event.eventType === 'activation' ? 'bg-[#A3E635]/20' : 'bg-[#7C3AED]/20'
                    )}>
                      <span className={cn(
                        'text-lg font-bold',
                        event.eventType === 'activation' ? 'text-[#A3E635]' : 'text-[#7C3AED]'
                      )}>
                        {event.dateObj.getDate()}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        {event.dateObj.toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No events scheduled</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Day Detail Modal */}
      {selectedDay !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => setSelectedDay(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#7C3AED] shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay)
                        .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {getEventsForDay(selectedDay).length === 1
                        ? '1 event'
                        : `${getEventsForDay(selectedDay).length} events`}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 rounded-md hover:bg-[#2A2A2A] transition-colors"
                  >
                    <X className="h-5 w-5 text-[#A1A1AA]" />
                  </button>
                </div>

                {/* Events */}
                <div className="space-y-4">
                  {getEventsForDay(selectedDay).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'p-4 rounded-lg bg-[#0A0A0A] border-l-4',
                        event.eventType === 'activation' ? 'border-[#A3E635]' : 'border-[#7C3AED]'
                      )}
                    >
                      {/* Type badge */}
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide',
                        event.eventType === 'activation'
                          ? 'bg-[#A3E635]/20 text-[#A3E635]'
                          : 'bg-[#7C3AED]/20 text-[#7C3AED]'
                      )}>
                        {event.eventType === 'activation' ? 'Activation' : 'Check-in'}
                      </span>

                      {/* Title */}
                      <h4 className="text-base font-semibold text-white mt-2">{event.title}</h4>

                      {/* Timezones */}
                      {event.time && (
                        <p className="text-xs text-[#555] mt-1.5 leading-relaxed tracking-wide">
                          {getTimezoneRow(event.time)}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          <Users className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{event.ambassadorNames.join(', ')}{event.school ? ` · ${event.school}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        {event.notes && (
                          <p className="text-xs text-[#666] italic mt-2 pl-1 border-l border-[#2A2A2A] leading-relaxed">
                            {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedDay(null)}
                  className="mt-6 w-full py-3 rounded-md bg-[#2A2A2A] text-white font-medium hover:bg-[#3A3A3A] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/75 z-50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Add Event</h3>
                    <p className="text-sm text-[#A1A1AA] mt-1">Schedule an activation or check-in</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded hover:bg-secondary"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Event Title */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      placeholder="e.g., Instagram takeover, Monthly check-in"
                    />
                  </div>
                  
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  
                  {/* Time */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Time (London)
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] [color-scheme:dark]"
                    />
                    {newEvent.time && (
                      <p className="mt-1.5 text-xs text-[#555] tracking-wide">
                        {getTimezoneRow(newEvent.time)}
                      </p>
                    )}
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Event Type
                    </label>
                    <select
                      value={newEvent.eventType}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, eventType: e.target.value as EventType }))}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    >
                      <option value="activation">Activation</option>
                      <option value="check-in">Ambassador Check-in</option>
                    </select>
                  </div>
                  
                  {/* Ambassador(s) */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Ambassador(s) Involved
                    </label>
                    <div className="max-h-40 overflow-y-auto rounded-md border border-[#2A2A2A] bg-[#0A0A0A] p-2 space-y-1">
                      {ambassadors.map(a => (
                        <label
                          key={a.id}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[#2A2A2A]',
                            newEvent.ambassadorIds.includes(a.id) && 'bg-[#7C3AED]/20'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={newEvent.ambassadorIds.includes(a.id)}
                            onChange={() => toggleAmbassador(a.id)}
                            className="rounded border-[#2A2A2A]"
                          />
                          <span className="text-sm text-white">{a.name}</span>
                          <span className="text-xs text-[#A1A1AA]">• {a.school}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      placeholder="e.g., Main Hall, Google Meet, Room 7"
                    />
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                      placeholder="Additional details..."
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || !newEvent.date}
                  className={cn(
                    'mt-6 w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
                    newEvent.title && newEvent.date
                      ? 'bg-[#7C3AED] text-white hover:bg-[#7C3AED]/80'
                      : 'bg-[#2A2A2A] text-[#A1A1AA] cursor-not-allowed'
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
