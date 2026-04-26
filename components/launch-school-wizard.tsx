'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface Prospect {
  name: string
  yearGroup: string
  whyThem: string
  isUncutGem: boolean
}

interface WizardData {
  schoolName: string
  prospects: Prospect[]
  coordinatorName: string
  coordinatorEmail: string
  trialStartDate: string
  meetingScheduled: boolean
  leadershipNotes: string
  goalActivations: number
  goalAmbassadors: number
  goalEngagement: number
  customGoal: string
}

const YEAR_GROUPS = ['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']

const emptyProspect = (): Prospect => ({
  name: '',
  yearGroup: 'Year 9',
  whyThem: '',
  isUncutGem: false,
})

function StepIndicator({ step }: { step: number }) {
  const labels = ['Find Gems', 'Leadership', 'Goals']
  return (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s < step
                  ? 'bg-[#7C3AED] text-white'
                  : s === step
                  ? 'bg-[#A3E635] text-black'
                  : 'bg-[#2A2A2A] text-[#555]'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                s === step ? 'text-[#A3E635]' : s < step ? 'text-[#7C3AED]' : 'text-[#444]'
              }`}
            >
              {labels[i]}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`h-px w-20 mx-3 mb-5 transition-colors ${
                s < step ? 'bg-[#7C3AED]' : 'bg-[#2A2A2A]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function CustomCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-[#444] bg-transparent'
      }`}
    >
      {checked && <span className="text-white text-[10px] font-bold">✓</span>}
    </button>
  )
}

export function LaunchSchoolWizard({ onClose }: { onClose: () => void }) {
  const { launchSchool } = useAppStore()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    schoolName: '',
    prospects: [emptyProspect()],
    coordinatorName: '',
    coordinatorEmail: '',
    trialStartDate: '',
    meetingScheduled: false,
    leadershipNotes: '',
    goalActivations: 1,
    goalAmbassadors: 3,
    goalEngagement: 60,
    customGoal: '',
  })

  const updateField = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const updateProspect = (index: number, field: keyof Prospect, value: string | boolean) =>
    setData((prev) => ({
      ...prev,
      prospects: prev.prospects.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }))

  const addProspect = () => {
    if (data.prospects.length < 5) {
      setData((prev) => ({ ...prev, prospects: [...prev.prospects, emptyProspect()] }))
    }
  }

  const removeProspect = (index: number) => {
    if (data.prospects.length > 1) {
      setData((prev) => ({ ...prev, prospects: prev.prospects.filter((_, i) => i !== index) }))
    }
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().split('T')[0]
    const namedProspects = data.prospects.filter((p) => p.name.trim())
    const schoolSlug = data.schoolName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)

    launchSchool(
      {
        name: data.schoolName,
        totalAmbassadors: namedProspects.length,
        tierBreakdown: {
          prospect: namedProspects.length,
          onboarded: 0,
          active: 0,
          leader: 0,
          yfn: 0,
        },
        engagementPercentage: 0,
        lastActivityDate: now,
        isDecline: false,
        isTrial: true,
        trialGoals: {
          activations: data.goalActivations,
          ambassadors: data.goalAmbassadors,
          engagementScore: data.goalEngagement,
          customGoal: data.customGoal || undefined,
        },
        coordinatorName: data.coordinatorName,
        coordinatorEmail: data.coordinatorEmail,
        trialStartDate: data.trialStartDate,
      },
      namedProspects.map((p) => ({
        name: p.name,
        school: data.schoolName,
        tier: 'Prospect' as const,
        engagementScore: 0,
        isUncutGem: p.isUncutGem,
        lastContactDate: now,
        daysInCurrentTier: 0,
        email: `${p.name.split(' ')[0].toLowerCase()}.${(p.name.split(' ')[1] || 'student').toLowerCase()}@${schoolSlug}.school`,
        activationsCompleted: 0,
        streakWeeks: 0,
        notes: [p.yearGroup, p.whyThem].filter(Boolean).join(' — '),
      }))
    )

    onClose()
  }

  const inputCls =
    'w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-md px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#A3E635] transition-colors text-sm'
  const innerInputCls =
    'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#A3E635] text-sm transition-colors'

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[60] overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A] z-10">
          <div className="flex items-center gap-3">
            <span className="text-[#A3E635] font-semibold text-sm tracking-widest uppercase">
              Launch a School
            </span>
            <span className="text-[#333] text-sm">— Step {step} of 3</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-[#1A1A1A] transition-colors group"
          >
            <X className="h-5 w-5 text-[#555] group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-14">
          <StepIndicator step={step} />

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Find Your Gems</h2>
              <p className="text-[#A1A1AA] text-lg mb-10 leading-relaxed">
                Identify 3–5 students who could be your first ambassadors. Look beyond the obvious
                picks.
              </p>

              <div className="mb-8">
                <label className="block text-sm font-medium text-[#E5E5E5] mb-2">School name</label>
                <input
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => updateField('schoolName', e.target.value)}
                  placeholder="e.g. Highbury Academy"
                  className={inputCls}
                />
              </div>

              <div className="space-y-5">
                {data.prospects.map((prospect, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-lg border border-[#2A2A2A] bg-[#111] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">
                        Prospect {index + 1}
                      </span>
                      {data.prospects.length > 1 && (
                        <button
                          onClick={() => removeProspect(index)}
                          className="p-1 text-[#444] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5">Name</label>
                        <input
                          type="text"
                          value={prospect.name}
                          onChange={(e) => updateProspect(index, 'name', e.target.value)}
                          placeholder="Full name"
                          className={innerInputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5">Year group</label>
                        <select
                          value={prospect.yearGroup}
                          onChange={(e) => updateProspect(index, 'yearGroup', e.target.value)}
                          className={`${innerInputCls} appearance-none cursor-pointer`}
                        >
                          {YEAR_GROUPS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#666] mb-1.5">Why them?</label>
                      <input
                        type="text"
                        value={prospect.whyThem}
                        onChange={(e) => updateProspect(index, 'whyThem', e.target.value)}
                        placeholder="What makes them a good fit?"
                        className={innerInputCls}
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheckbox
                        checked={prospect.isUncutGem}
                        onChange={(v) => updateProspect(index, 'isUncutGem', v)}
                      />
                      <span className="text-sm text-[#A1A1AA]">
                        💎 Uncut Gem — wouldn&apos;t normally self-select, but could change the
                        culture
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {data.prospects.length < 5 && (
                <button
                  onClick={addProspect}
                  className="mt-4 flex items-center gap-2 text-sm text-[#A3E635] hover:text-[#c4f96a] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add another prospect
                </button>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!data.schoolName.trim()}
                className="mt-12 w-full py-4 rounded-md bg-[#A3E635] text-black font-semibold text-base hover:bg-[#c4f96a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next — Align Leadership →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
                Align with Leadership
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-10 leading-relaxed">
                Get school leadership on board before you start. A trial works best when there&apos;s a
                named contact who owns it internally.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                      School coordinator name
                    </label>
                    <input
                      type="text"
                      value={data.coordinatorName}
                      onChange={(e) => updateField('coordinatorName', e.target.value)}
                      placeholder="Full name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                      Coordinator email
                    </label>
                    <input
                      type="email"
                      value={data.coordinatorEmail}
                      onChange={(e) => updateField('coordinatorEmail', e.target.value)}
                      placeholder="name@school.ac.uk"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                    Trial start date
                  </label>
                  <input
                    type="date"
                    value={data.trialStartDate}
                    onChange={(e) => updateField('trialStartDate', e.target.value)}
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-[#2A2A2A] bg-[#111] hover:border-[#7C3AED]/40 transition-colors">
                  <CustomCheckbox
                    checked={data.meetingScheduled}
                    onChange={(v) => updateField('meetingScheduled', v)}
                  />
                  <div className="mt-0.5">
                    <p className="text-sm font-medium text-[#E5E5E5]">Intro call booked</p>
                    <p className="text-xs text-[#555] mt-0.5">
                      Meeting scheduled with school leadership
                    </p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                    Notes from initial conversation
                  </label>
                  <textarea
                    value={data.leadershipNotes}
                    onChange={(e) => updateField('leadershipNotes', e.target.value)}
                    placeholder="What did they care about? What were their concerns?"
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-md border border-[#2A2A2A] text-[#A1A1AA] font-medium hover:bg-[#1A1A1A] transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-md bg-[#A3E635] text-black font-semibold text-base hover:bg-[#c4f96a] transition-colors"
                >
                  Next — Set Your Goals →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
                Set Your 30-Day Goals
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-10 leading-relaxed">
                Define what success looks like in the first 30 days. These will appear in the
                school&apos;s report card as targets.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
                {/* Goals */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-5 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <span className="text-[#A1A1AA] text-sm flex-1">Run</span>
                    <input
                      type="number"
                      min={1}
                      value={data.goalActivations}
                      onChange={(e) =>
                        updateField('goalActivations', parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-2 py-2 text-white focus:outline-none focus:border-[#A3E635] text-sm transition-colors"
                    />
                    <span className="text-[#A1A1AA] text-sm flex-1">activations</span>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <span className="text-[#A1A1AA] text-sm flex-1">Onboard</span>
                    <input
                      type="number"
                      min={1}
                      value={data.goalAmbassadors}
                      onChange={(e) =>
                        updateField('goalAmbassadors', parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-2 py-2 text-white focus:outline-none focus:border-[#A3E635] text-sm transition-colors"
                    />
                    <span className="text-[#A1A1AA] text-sm flex-1">ambassadors</span>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-lg border border-[#2A2A2A] bg-[#111]">
                    <span className="text-[#A1A1AA] text-sm flex-1">Reach</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={data.goalEngagement}
                      onChange={(e) =>
                        updateField('goalEngagement', parseInt(e.target.value) || 60)
                      }
                      className="w-16 text-center bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-2 py-2 text-white focus:outline-none focus:border-[#A3E635] text-sm transition-colors"
                    />
                    <span className="text-[#A1A1AA] text-sm flex-1">% engagement score</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E5E5E5] mb-2">
                      Custom goal{' '}
                      <span className="text-[#444] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={data.customGoal}
                      onChange={(e) => updateField('customGoal', e.target.value)}
                      placeholder="e.g. Host one community event"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Summary panel */}
                <div className="p-6 rounded-lg border border-[#2A2A2A] bg-[#080808] self-start lg:sticky lg:top-24">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-5">
                    Your Plan
                  </p>

                  {data.schoolName && (
                    <div className="mb-5">
                      <p className="text-white font-bold text-lg leading-tight">{data.schoolName}</p>
                      {data.trialStartDate && (
                        <p className="text-xs text-[#555] mt-1">
                          Trial starts{' '}
                          {new Date(data.trialStartDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}

                  {data.prospects.some((p) => p.name.trim()) && (
                    <div className="mb-5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-3">
                        Prospects
                      </p>
                      <div className="space-y-2.5">
                        {data.prospects
                          .filter((p) => p.name.trim())
                          .map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-xs text-[#A1A1AA] flex-shrink-0">
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-[#E5E5E5] truncate block">
                                  {p.name}
                                </span>
                                {p.yearGroup && (
                                  <span className="text-[10px] text-[#555]">{p.yearGroup}</span>
                                )}
                              </div>
                              {p.isUncutGem && <span className="text-sm">💎</span>}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {data.coordinatorName && (
                    <div className="pt-4 border-t border-[#1A1A1A]">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-2">
                        Coordinator
                      </p>
                      <p className="text-sm text-[#E5E5E5]">{data.coordinatorName}</p>
                      {data.meetingScheduled && (
                        <p className="text-xs text-[#A3E635] mt-1.5">✓ Intro call booked</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 rounded-md border border-[#2A2A2A] text-[#A1A1AA] font-medium hover:bg-[#1A1A1A] transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-4 rounded-md bg-[#A3E635] text-black font-semibold text-base hover:bg-[#c4f96a] transition-colors"
                >
                  Launch School →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
