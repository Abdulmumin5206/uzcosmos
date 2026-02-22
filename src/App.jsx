import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Crosshair,
  MessageSquare,
  AlertOctagon,
  Download,
  Satellite,
  X,
  Package,
  Users,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Phase Data ────────────────────────────────────────────────────────────── */

const PHASES = [
  {
    id: 1,
    name: 'Mission Definition',
    duration: 'Months 1–3',
    shortDesc: 'Define what this satellite does and why.',
    milestones: [
      {
        period: 'Month 1',
        label: 'Stakeholder Kickoff',
        detail: 'Align leadership on mission intent, constraints, and success criteria',
      },
      {
        period: 'Month 2',
        label: 'Payload Trade Study',
        detail: 'Evaluate and score payload options against mission goals and budget',
      },
      {
        period: 'Month 3',
        label: 'Requirements Freeze',
        detail: 'Mission Requirements Document signed, baselined, and distributed',
      },
    ],
    whatHappens: [
      'Stakeholder workshops to align on mission goals and political context',
      'Research comparable satellite missions — lessons learned from 3+ reference programs',
      'Evaluate payload options: Earth observation, AIS ship tracking, technology demonstration',
      'Formal documentation of mission requirements in the MRD',
      'Establish launch date as hard constraint or planning target',
    ],
    deliverables: [
      'Mission Requirements Document (MRD) — baselined and formally signed',
      'Payload Trade Study Report — scoring matrix and final recommendation',
      'Comparable Mission Analysis — reference programs and lessons learned',
      'Project Charter and initial Work Breakdown Structure (WBS)',
    ],
    team: [
      'Mission Systems Engineer — lead author of MRD and trade studies',
      'Payload Specialist — drives payload evaluation and scoring criteria',
      'Program Manager — stakeholder coordination and schedule oversight',
      'Science / Application Lead — defines end-user data needs',
    ],
    successCriteria: [
      'MRD formally approved and signed by all stakeholders',
      'Primary mission objective agreed with zero ambiguity',
      'Payload type down-selected to a single preferred option',
      'Launch date constraint documented and accepted by leadership',
    ],
    criticalDecision:
      'What is the primary mission of this satellite? This must be locked before any hardware decisions can be made. A change after Month 3 triggers a full architecture re-evaluation.',
    leadershipQuestions: [
      'What problem are we solving, and for whom specifically?',
      'Who are the end users of the data this satellite produces?',
      'Is the 2028 launch date a hard deadline or a planning target?',
      'Are there political or funding constraints that affect mission scope?',
    ],
    riskIfDelayed:
      'Every week of delay here costs two weeks downstream. Hardware cannot be ordered without a locked mission — and vendors book out months in advance. A 1-month slip in Phase 1 typically causes a 2–3 month slip in Phase 2, compounding into a missed launch window.',
  },
  {
    id: 2,
    name: 'System Design & Vendor Selection',
    duration: 'Months 4–8',
    shortDesc: 'Design the system and choose our hardware partners.',
    milestones: [
      {
        period: 'Months 4–5',
        label: 'Architecture Defined',
        detail: 'Satellite system architecture documented and internally reviewed',
      },
      {
        period: 'Months 6–7',
        label: 'RFP Process',
        detail: 'RFPs issued, proposals received, technical evaluation completed',
      },
      {
        period: 'Month 8',
        label: 'Vendor Down-Select',
        detail: 'Preferred vendor selected, System Design Document finalized',
      },
    ],
    whatHappens: [
      'Define satellite architecture based on locked mission requirements',
      'Research COTS vendors: NanoAvionics, EnduroSat, GomSpace, and others',
      'Issue formal Requests for Proposal (RFPs) to shortlisted vendors',
      'Conduct technical and commercial evaluation of received proposals',
      'Select preferred vendor and finalize System Design Document',
    ],
    deliverables: [
      'System Architecture Document (SAD) — internal review complete',
      'Request for Proposal (RFP) package — issued to 3+ vendors',
      'Vendor Evaluation Matrix and formal recommendation report',
      'System Design Document (SDD) — baselined after vendor selection',
    ],
    team: [
      'Systems Engineer — architecture definition and SDD lead author',
      'Procurement Officer — RFP drafting and vendor communications',
      'Technical Evaluation Panel — multi-discipline proposal review',
      'Legal / Contracts Advisor — terms and compliance review',
    ],
    successCriteria: [
      'System Design Document signed and baselined',
      'Single vendor selected with written justification on file',
      'Procurement timeline confirmed and aligned with budget cycle',
      'All architectural trade studies closed — no open decisions remain',
    ],
    criticalDecision:
      'Which vendor do we partner with, and what exactly are we procuring vs. developing in-house? This determines cost, schedule, and technical risk for the entire program.',
    leadershipQuestions: [
      'Are there political or regulatory restrictions on supplier countries?',
      'What is the procurement approval process and expected timeline?',
      'Is there flexibility in the budget if the preferred vendor is higher cost?',
    ],
    riskIfDelayed:
      'Launch slots book out 12–18 months in advance. A delay here means missing the 2028 window entirely — with no fallback option. Every month of delay in vendor selection pushes hardware delivery later, leaving no margin for testing.',
  },
  {
    id: 3,
    name: 'Procurement & Integration',
    duration: 'Months 9–16',
    shortDesc: 'Order hardware, build and integrate the satellite.',
    milestones: [
      {
        period: 'Months 9–10',
        label: 'Purchase Orders Placed',
        detail: 'All hardware contracts signed, delivery schedule confirmed with vendors',
      },
      {
        period: 'Months 11–14',
        label: 'Integration Campaign',
        detail: 'Subsystems delivered, assembled, and electrically connected and tested',
      },
      {
        period: 'Months 15–16',
        label: 'Functional Testing',
        detail: 'Integrated satellite functional tests complete; launch contract signed',
      },
    ],
    whatHappens: [
      'Place hardware orders and actively manage delivery schedule',
      'Integrate subsystems: structure, power, ADCS, comms, and payload',
      'Begin ground station design, procurement, and RF link testing',
      'Develop flight software to version 1.0 testable build',
      'Sign launch services contract — hard deadline of Month 12',
    ],
    deliverables: [
      'Signed purchase orders for all subsystems — on file',
      'Integration and Assembly procedure documentation',
      'Flight software v1.0 — functional testable build',
      'Launch services contract — signed no later than Month 12',
    ],
    team: [
      'Integration & Assembly Engineer — leads physical satellite build',
      'Flight Software Developer — onboard software development lead',
      'Ground Systems Engineer — ground station design and setup',
      'Supply Chain Manager — hardware delivery tracking and escalation',
    ],
    successCriteria: [
      'All hardware received, inspected, and accepted — no critical shortfalls',
      'Satellite mechanically and electrically integrated as a system',
      'Launch provider contract signed no later than Month 12',
      'Ground station preliminary design complete and site confirmed',
    ],
    criticalDecision:
      'Launch provider selected and contract signed no later than Month 12. This is the hardest deadline in the entire program. Missing it means no launch in 2028.',
    leadershipQuestions: [
      'Is the full hardware procurement budget approved and released?',
      'What is the confirmed ground station location and infrastructure?',
      'Is there a contingency plan if a key subsystem is delayed by the vendor?',
    ],
    riskIfDelayed:
      'Hardware lead times run 6–9 months. Orders placed late cannot be expedited — vendors will not hold slots. A missed procurement window means a missed launch. There is no substitute for time in hardware manufacturing.',
  },
  {
    id: 4,
    name: 'Testing & Verification',
    duration: 'Months 17–22',
    shortDesc: 'Test everything until it breaks, then fix it.',
    milestones: [
      {
        period: 'Months 17–18',
        label: 'Environmental Testing',
        detail: 'Vibration, thermal vacuum (TVAC), and EMC campaigns completed',
      },
      {
        period: 'Months 19–21',
        label: 'Software Validation',
        detail: 'Flight software tested end-to-end; all anomalies resolved',
      },
      {
        period: 'Month 22',
        label: 'Pre-Ship Review',
        detail: 'Formal review board convenes; go/no-go decision recorded in writing',
      },
    ],
    whatHappens: [
      'Vibration testing to simulate launch acoustic and mechanical loads',
      'Thermal vacuum (TVAC) testing to verify performance in orbital environment',
      'Electromagnetic compatibility (EMC) testing — no interference with own systems',
      'End-to-end flight software validation against all mission requirements',
      'Anomaly resolution, pre-ship review, and formal launch readiness declaration',
    ],
    deliverables: [
      'Environmental Test Report — vibration, TVAC, and EMC results',
      'Flight software verification and validation report',
      'Anomaly Log with full closure documentation for each finding',
      'Pre-Ship Review (PSR) board minutes and signed go/no-go decision record',
    ],
    team: [
      'Test Engineer — environmental test planning, execution, and reporting',
      'Flight Software Engineer — software validation and anomaly root cause',
      'Quality Assurance Engineer — independent test witnessing and sign-off',
      'Review Board — independent authority for the go/no-go decision',
    ],
    successCriteria: [
      'All environmental tests passed — zero open critical anomalies',
      'Flight software verified against 100% of functional requirements',
      'Pre-Ship Review board formally records "Go" — no waivers on critical items',
      'Mass, power, and interface data verified against launch provider requirements',
    ],
    criticalDecision:
      'Go / No-go for launch readiness — based on objective test data only, not schedule pressure. This decision cannot be compressed or waived. If the satellite is not ready, it does not ship.',
    leadershipQuestions: [
      'Is contingency budget reserved for anomalies found during testing?',
      'Who holds final go/no-go authority, and is this documented in advance?',
      'What is the decision criteria if a non-critical anomaly is open at PSR?',
    ],
    riskIfDelayed:
      'Skipping or rushing environmental testing is the single biggest cause of on-orbit satellite failure in the small satellite industry. A satellite that fails in orbit cannot be recovered, repaired, or replaced. The cost of a failed mission vastly exceeds the cost of thorough testing.',
  },
  {
    id: 5,
    name: 'Launch & Early Operations',
    duration: 'Months 23–26',
    shortDesc: 'Deliver, launch, and make first contact.',
    milestones: [
      {
        period: 'Month 23',
        label: 'Launch Site Delivery',
        detail: 'Satellite shipped and received at launch provider facility; inspection passed',
      },
      {
        period: 'Months 24–25',
        label: 'Launch Campaign',
        detail: 'Final integration, countdown rehearsals, and range safety approvals',
      },
      {
        period: 'Month 26',
        label: 'Launch + Commissioning',
        detail: 'Vehicle lift-off, first signal acquired, 30-day commissioning begins',
      },
    ],
    whatHappens: [
      'Satellite shipped and handed over to launch provider with inspection',
      'Final launch vehicle integration checks and fit checks',
      'Countdown rehearsals and range safety approval',
      'Ground station fully verified operational before launch day',
      'Launch day, first signal acquisition, initial on-orbit commissioning',
    ],
    deliverables: [
      'Launch site delivery documentation and acceptance inspection report',
      'Operational Procedures Manual — command and telemetry reference',
      'First Contact Confirmation Report — signal acquisition record',
      '30-Day Commissioning Report — satellite declared mission-ready',
    ],
    team: [
      'Launch Campaign Engineer — on-site integration and countdown support',
      'Ground Station Operator — real-time telemetry and command during LEOP',
      'Flight Dynamics Engineer — orbit determination and contact scheduling',
      'Mission Operations Manager — overall launch execution authority',
    ],
    successCriteria: [
      'Satellite delivered to launch site on schedule with no damage or anomaly',
      'Ground station verified fully operational at least 7 days before launch',
      'First signal acquired within the first planned contact window',
      'All commissioning checks passed — satellite declared mission-ready',
    ],
    criticalDecision:
      'Is the ground station ready and independently verified before launch day? There is no launch without confirmed ground contact capability. This verification must happen no later than 7 days before launch.',
    leadershipQuestions: [
      'Who is the designated operations team and is their training complete?',
      'What is the long-term operations and data distribution plan post-commissioning?',
      'Is there a contingency plan if the launch window is missed?',
    ],
    riskIfDelayed:
      'Launch windows are fixed by orbital mechanics and the launch provider manifest. Missing a window means a 6–12 month wait for the next available slot — with associated costs for storage, re-testing, and re-certification of the satellite.',
  },
];

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const BLUE = '#3B82F6';
const BLUE_BORDER = 'rgba(59,130,246,0.25)';

/* ─── Stars ─────────────────────────────────────────────────────────────────── */

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.55 + 0.08,
      })),
    []
  );

  return (
    <div className="stars-layer fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Milestone Strip ───────────────────────────────────────────────────────── */

function MilestoneStrip({ milestones }) {
  return (
    <div className="relative mb-8">
      {/* Connecting line */}
      <div
        className="absolute hidden sm:block"
        style={{
          top: 11,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, #3B82F6, #60a5fa)',
          boxShadow: '0 0 8px rgba(59,130,246,0.7)',
        }}
      />

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
        {milestones.map((m, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center text-center px-4"
          >
            {/* Node */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mb-3 z-10 flex-shrink-0"
              style={{
                background: BLUE,
                border: '2px solid rgba(147,197,253,0.65)',
                boxShadow: '0 0 14px rgba(59,130,246,0.9), 0 0 28px rgba(59,130,246,0.35)',
              }}
            >
              <span className="text-[9px] font-black text-white">{i + 1}</span>
            </div>
            <p
              className="text-[9px] font-black uppercase tracking-[0.18em] mb-1"
              style={{ color: 'rgba(96,165,250,0.7)' }}
            >
              {m.period}
            </p>
            <p className="text-[13px] font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {m.label}
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.65)' }}>
              {m.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Info Card ─────────────────────────────────────────────────────────────── */

function InfoCard({ icon: Icon, title, content, accent }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-5 h-full"
      style={{
        background: 'rgba(5, 11, 22, 0.9)',
        border: '1px solid rgba(59,130,246,0.1)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}18` }}
        >
          <Icon size={15} style={{ color: accent }} />
        </div>
        <h4
          className="text-[10px] font-black uppercase tracking-[0.16em]"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {title}
        </h4>
      </div>

      {Array.isArray(content) ? (
        <ul className="space-y-2 pl-1">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed">
              <span
                className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: accent }}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-slate-300 leading-relaxed pl-1">{content}</p>
      )}
    </div>
  );
}

/* ─── Risk Banner ───────────────────────────────────────────────────────────── */

function RiskBanner({ content }) {
  return (
    <div
      className="rounded-xl p-5 flex gap-4 items-start"
      style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.22)',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(239,68,68,0.12)' }}
      >
        <AlertOctagon size={17} style={{ color: '#EF4444' }} />
      </div>
      <div>
        <h4
          className="text-[10px] font-black uppercase tracking-[0.16em] mb-2"
          style={{ color: 'rgba(239,68,68,0.75)' }}
        >
          Risk if Delayed
        </h4>
        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(252,165,165,0.85)' }}>
          {content}
        </p>
      </div>
    </div>
  );
}

/* ─── Phase Modal ───────────────────────────────────────────────────────────── */

function PhaseModal({ phase, onClose }) {
  // Escape key + scroll lock
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(2,6,15,0.88)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />

      {/* Scrollable container */}
      <div className="relative z-10 w-full h-full overflow-y-auto py-8 px-4">
        <motion.div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(9,18,38,0.98) 0%, rgba(5,11,22,0.98) 100%)',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 0 0 1px rgba(59,130,246,0.08), 0 40px 80px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className="flex items-start justify-between p-6 pb-5"
            style={{ borderBottom: '1px solid rgba(59,130,246,0.12)' }}
          >
            <div className="flex items-start gap-4">
              {/* Phase number accent */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  boxShadow: '0 0 20px rgba(59,130,246,0.2)',
                }}
              >
                <span
                  className="text-xl font-black"
                  style={{ color: '#60a5fa', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {phase.id}
                </span>
              </div>
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
                  style={{ color: 'rgba(96,165,250,0.6)' }}
                >
                  Phase {phase.id} &nbsp;·&nbsp; {phase.duration}
                </p>
                <h2
                  className="text-2xl font-bold text-white tracking-[-0.02em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {phase.name}
                </h2>
                <p className="text-[13px] mt-1" style={{ color: 'rgba(148,163,184,0.65)' }}>
                  {phase.shortDesc}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <X size={15} style={{ color: 'rgba(148,163,184,0.7)' }} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Milestone Strip */}
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                style={{ color: 'rgba(96,165,250,0.5)' }}
              >
                Month-by-Month Breakdown
              </p>
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(59,130,246,0.04)',
                  border: '1px solid rgba(59,130,246,0.12)',
                }}
              >
                <MilestoneStrip milestones={phase.milestones} />
              </div>
            </div>

            {/* Row 1: What Happens + Deliverables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                icon={Activity}
                title="What Happens"
                content={phase.whatHappens}
                accent="#3B82F6"
              />
              <InfoCard
                icon={Package}
                title="Key Deliverables"
                content={phase.deliverables}
                accent="#8B5CF6"
              />
            </div>

            {/* Row 2: Team + Success Criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                icon={Users}
                title="Team & Resources"
                content={phase.team}
                accent="#06B6D4"
              />
              <InfoCard
                icon={CheckCircle}
                title="Success Criteria"
                content={phase.successCriteria}
                accent="#10B981"
              />
            </div>

            {/* Row 3: Critical Decision + Leadership Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                icon={Crosshair}
                title="Critical Decision"
                content={phase.criticalDecision}
                accent="#F59E0B"
              />
              <InfoCard
                icon={MessageSquare}
                title="What We Ask Leadership"
                content={phase.leadershipQuestions}
                accent="#10B981"
              />
            </div>

            {/* Full-width Risk Banner */}
            <RiskBanner content={phase.riskIfDelayed} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Phase Card ────────────────────────────────────────────────────────────── */

function PhaseCard({ phase, index, onClick }) {
  return (
    <motion.div
      className="flex-1 min-w-0"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 + index * 0.13, duration: 0.56, ease: 'easeOut' }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full text-left relative overflow-hidden rounded-xl cursor-pointer group"
        style={{
          background: 'linear-gradient(145deg, rgba(10,20,40,0.82) 0%, rgba(7,13,26,0.82) 100%)',
          border: `1px solid ${BLUE_BORDER}`,
          backdropFilter: 'blur(10px)',
          padding: '20px',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)';
          e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.14)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = BLUE_BORDER;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Watermark number */}
        <span
          className="absolute bottom-0 right-1 font-black leading-none select-none pointer-events-none"
          style={{
            fontSize: '5.5rem',
            color: 'rgba(59,130,246,0.06)',
            lineHeight: 1,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {phase.id}
        </span>

        <div className="relative z-10">
          {/* Badge + duration */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.12em]"
              style={{
                color: '#93c5fd',
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.22)',
              }}
            >
              Phase {phase.id}
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'rgba(100,116,139,0.9)' }}>
              {phase.duration}
            </span>
          </div>

          <h3
            className="font-semibold text-[14px] text-white leading-snug mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {phase.name}
          </h3>

          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
            {phase.shortDesc}
          </p>

          {/* CTA */}
          <div className="mt-4 flex items-center gap-1.5">
            <span
              className="text-[11px] font-semibold tracking-wide transition-colors duration-200"
              style={{ color: 'rgba(96,165,250,0.55)' }}
            >
              Open details
            </span>
            <ArrowUpRight
              size={11}
              style={{ color: 'rgba(96,165,250,0.55)' }}
              className="transition-colors duration-200"
            />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

/* ─── Timeline Progress Track ───────────────────────────────────────────────── */

function TimelineTrack() {
  return (
    <div className="relative h-7 mb-4 hidden md:block" style={{ overflow: 'visible' }}>
      <div
        className="absolute top-1/2 inset-x-0"
        style={{ height: '1px', transform: 'translateY(-50%)', background: 'rgba(59,130,246,0.12)' }}
      />
      <motion.div
        className="absolute top-1/2 left-0 rounded-full"
        style={{
          height: '1px',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, #1d4ed8 0%, #3B82F6 55%, #93c5fd 100%)',
          boxShadow: '0 0 8px rgba(59,130,246,0.9), 0 0 20px rgba(59,130,246,0.35)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.7, delay: 0.75, ease: [0.4, 0, 0.2, 1] }}
      />
      {PHASES.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 10,
            height: 10,
            top: '50%',
            left: `${(i / (PHASES.length - 1)) * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: BLUE,
            border: '2px solid rgba(147,197,253,0.55)',
            boxShadow: '0 0 10px rgba(59,130,246,0.95), 0 0 22px rgba(59,130,246,0.4)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 + i * 0.14, duration: 0.35, ease: 'backOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.28)' }}
          >
            <Satellite size={17} style={{ color: '#60a5fa' }} />
          </div>
          <span
            className="text-[20px] font-bold text-white tracking-[-0.01em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            UzCosmos
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            color: '#60a5fa',
            border: '1px solid rgba(59,130,246,0.28)',
            background: 'rgba(59,130,246,0.06)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.14)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.06)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.28)';
          }}
        >
          <Download size={13} />
          Download PDF
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.68 }}
        className="text-center mb-9"
      >
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4"
          style={{ color: 'rgba(96,165,250,0.55)' }}
        >
          Government Proposal &nbsp;·&nbsp; Confidential
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-[-0.025em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          3U CubeSat Mission Roadmap
        </h1>
        <p className="text-[15px] tracking-wide font-light" style={{ color: 'rgba(147,197,253,0.65)' }}>
          From Concept to Orbit &nbsp;—&nbsp; 2026 to 2028
        </p>
      </motion.div>

      <motion.div
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.7) 25%, rgba(147,197,253,1) 50%, rgba(59,130,246,0.7) 75%, transparent 100%)',
          boxShadow: '0 0 14px rgba(59,130,246,0.55), 0 0 35px rgba(59,130,246,0.18)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.48, duration: 0.85, ease: 'easeInOut' }}
      />
    </motion.header>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.0, duration: 0.9 }}
      className="mt-20 pt-6 pb-10 text-center"
      style={{ borderTop: '1px solid rgba(59,130,246,0.09)' }}
    >
      <p className="text-[13px]" style={{ color: 'rgba(148,163,184,0.55)' }}>
        Prepared by{' '}
        <span style={{ color: 'rgba(203,213,225,0.85)' }}>Abdulmumin Abdusattorov</span>
        {' '}— Lead Engineer Candidate
      </p>
      <p className="text-[11px] mt-1.5" style={{ color: 'rgba(100,116,139,0.45)' }}>
        UzCosmos CubeSat Program 2026–2028 &nbsp;·&nbsp; Confidential Government Proposal Document
      </p>
    </motion.footer>
  );
}

/* ─── App ───────────────────────────────────────────────────────────────────── */

export default function App() {
  const [activePhase, setActivePhase] = useState(null);
  const activePhaseData = activePhase !== null ? PHASES.find((p) => p.id === activePhase) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B1120' }}>
      <Stars />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header />

        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.55 }}
            className="mb-5"
          >
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: 'rgba(96,165,250,0.65)' }}
            >
              Mission Timeline
            </h2>
            <p className="text-[13px]" style={{ color: 'rgba(100,116,139,0.85)' }}>
              Click any phase card to open its full briefing.
            </p>
          </motion.div>

          <TimelineTrack />

          <div className="flex flex-col md:flex-row gap-3">
            {PHASES.map((phase, i) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                index={i}
                onClick={() => setActivePhase(phase.id)}
              />
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activePhaseData && (
          <PhaseModal
            key={activePhaseData.id}
            phase={activePhaseData}
            onClose={() => setActivePhase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
