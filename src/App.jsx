import React, { useState, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Download, Rocket, CheckCircle, Users, FileText, Search, Zap, Target, TrendingUp, Shield, Calendar } from 'lucide-react';
import T from './translations';

/* ─── Language context ───────────────────────────────────────────────────────── */
const LangCtx = createContext('en');
const useLang = () => useContext(LangCtx);

/* ─── Static metadata (positions, colors, icons — same for all languages) ───── */
const PHASE_BAR_META = [
  { start: 0, end: 2,  color: '#3B82F6' },
  { start: 1, end: 3,  color: '#8B5CF6' },
  { start: 3, end: 5,  color: '#06B6D4' },
  { start: 5, end: 7,  color: '#10B981' },
  { start: 7, end: 9,  color: '#F59E0B' },
  { start: 9, end: 11, color: '#EF4444' },
  { start: 11, end: 12, color: '#ffffff' },
];
const PHASE_COLORS   = ['#3B82F6','#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444','#ffffff'];
const PARALLEL_META  = [
  { start: 0, end: 3,  color: '#3B82F6' },
  { start: 0, end: 4,  color: '#8B5CF6' },
  { start: 1, end: 5,  color: '#06B6D4' },
  { start: 2, end: 9,  color: '#10B981' },
  { start: 1, end: 11, color: '#F59E0B' },
];
const MARGIN_ICONS   = [Zap, Shield, Rocket, TrendingUp];
const MARGIN_COLORS  = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const VALID_ICONS    = [FileText, Calendar, Rocket, Search, Users];
const Q_COLORS       = ['#3B82F6','#8B5CF6','#06B6D4','#F59E0B','#EF4444'];
const DAY90_COLORS   = ['#3B82F6','#8B5CF6','#06B6D4','#10B981'];
const QUARTERS       = ["Q1'26","Q2'26","Q3'26","Q4'26","Q1'27","Q2'27","Q3'27","Q4'27","Q1'28","Q2'28","Q3'28","Q4'28"];

/* ─── Stars ───────────────────────────────────────────────────────────────────── */
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.4 + 0.4, opacity: Math.random() * 0.35 + 0.08,
    })), []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{ left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, opacity:s.opacity }} />
      ))}
    </div>
  );
}

/* ─── Layout helpers ─────────────────────────────────────────────────────────── */
function Section({ id, children }) {
  return (
    <motion.section id={id}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}
      className="mb-20">
      {children}
    </motion.section>
  );
}
function SectionLabel({ text }) {
  return <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-2" style={{ color:'rgba(96,165,250,0.6)' }}>{text}</p>;
}
function SectionTitle({ children }) {
  return <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-[-0.02em]" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>{children}</h2>;
}
function Divider() {
  return <div className="mb-8 mt-4 h-px" style={{ background:'linear-gradient(90deg,rgba(59,130,246,0.45) 0%,transparent 70%)' }} />;
}

/* ─── Gantt bar ───────────────────────────────────────────────────────────────── */
function GanttBar({ start, end, color }) {
  return (
    <div className="flex h-6" style={{ width:'100%' }}>
      {Array.from({ length: 12 }, (_, col) => {
        const filled = col >= start && col < end;
        const isFirst = col === start, isLast = col === end - 1;
        const c = color === '#ffffff' ? 'rgba(255,255,255,0.7)' : color;
        return (
          <div key={col} style={{
            flex: 1,
            background: filled ? (color==='#ffffff' ? 'rgba(255,255,255,0.1)' : `${color}28`) : 'transparent',
            borderRadius: isFirst&&isLast ? 4 : isFirst ? '4px 0 0 4px' : isLast ? '0 4px 4px 0' : 0,
            borderTop:    filled ? `2px solid ${c}` : 'none',
            borderBottom: filled ? `2px solid ${c}` : 'none',
            borderLeft:   isFirst&&filled ? `2px solid ${c}` : 'none',
            borderRight:  isLast&&filled  ? `2px solid ${c}` : 'none',
          }} />
        );
      })}
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────────────────────── */
function Header({ lang, setLang }) {
  const t = T[lang].header;
  const tn = T[lang].nav;
  const LANGS = ['en', 'uz', 'ru'];

  return (
    <motion.header initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} className="mb-16">
      <div className="flex items-center justify-between mb-12 flex-wrap gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.28)' }}>
            <Satellite size={17} style={{ color:'#60a5fa' }} />
          </div>
          <span className="text-[20px] font-bold text-white tracking-[-0.01em]"
            style={{ fontFamily:"'Space Grotesk',sans-serif" }}>UzCosmos</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1 rounded-lg p-1"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            {LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className="px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider transition-all duration-200"
                style={{
                  background: lang===l ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: lang===l ? '#60a5fa' : 'rgba(148,163,184,0.55)',
                  border: lang===l ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                }}>
                {l}
              </button>
            ))}
          </div>
          {/* Download */}
          <button onClick={() => window.print()}
            className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{ color:'#60a5fa', border:'1px solid rgba(59,130,246,0.28)', background:'rgba(59,130,246,0.06)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background='rgba(59,130,246,0.14)'; e.currentTarget.style.borderColor='rgba(59,130,246,0.55)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background='rgba(59,130,246,0.06)'; e.currentTarget.style.borderColor='rgba(59,130,246,0.28)'; }}>
            <Download size={13} /> {tn.download}
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5"
          style={{ color:'rgba(96,165,250,0.55)' }}>{t.label}</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-[-0.025em]"
          style={{ fontFamily:"'Space Grotesk',sans-serif" }}>{t.title}</h1>
        <p className="text-lg font-medium mb-2" style={{ color:'rgba(147,197,253,0.8)' }}>{t.subtitle}</p>
        <p className="text-[14px]" style={{ color:'rgba(148,163,184,0.6)' }}>{t.byline}</p>
      </div>

      <motion.div className="mt-10 h-px"
        style={{ background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.8),rgba(147,197,253,1),rgba(59,130,246,0.8),transparent)', boxShadow:'0 0 14px rgba(59,130,246,0.5)' }}
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.5, duration:0.9 }} />
    </motion.header>
  );
}

/* ─── Core Principles ────────────────────────────────────────────────────────── */
const PRINCIPLE_ICONS = [Target, Zap, CheckCircle];

function CorePrinciples() {
  const lang = useLang();
  const tp = T[lang].principles;
  return (
    <Section id="principles">
      <SectionLabel text={tp.sectionLabel} />
      <SectionTitle>{tp.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tp.body}</p>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tp.items.map((text, i) => {
          const Icon = PRINCIPLE_ICONS[i];
          return (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1 }}
              className="rounded-xl p-5 flex items-start gap-4"
              style={{ background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.18)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.25)' }}>
                <Icon size={16} style={{ color:'#60a5fa' }} />
              </div>
              <p className="text-[14px] text-white leading-relaxed font-medium">{text}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Five Questions ─────────────────────────────────────────────────────────── */
function FiveQuestions() {
  const lang = useLang();
  const tq = T[lang].questions;
  return (
    <Section id="questions">
      <SectionLabel text={tq.sectionLabel} />
      <SectionTitle>{tq.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tq.body}</p>
      <Divider />
      <div className="space-y-3">
        {tq.items.map(({ q, a, tag }, i) => (
          <motion.div key={i}
            initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.08 }}
            className="rounded-xl p-5 flex gap-5 items-start"
            style={{ background:'rgba(5,11,22,0.8)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-[14px]"
              style={{ background:`${Q_COLORS[i]}18`, border:`1px solid ${Q_COLORS[i]}40`, color:Q_COLORS[i] }}>
              {i+1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <p className="text-[14px] font-semibold text-white">{q}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background:`${Q_COLORS[i]}18`, border:`1px solid ${Q_COLORS[i]}30`, color:Q_COLORS[i] }}>{tag}</span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color:'rgba(148,163,184,0.75)' }}>{a}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Master Timeline ────────────────────────────────────────────────────────── */
function MasterTimeline() {
  const lang = useLang();
  const tt = T[lang].timeline;
  return (
    <Section id="timeline">
      <SectionLabel text={tt.sectionLabel} />
      <SectionTitle>{tt.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tt.body}</p>
      <Divider />

      {/* Gantt */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color:'rgba(96,165,250,0.45)' }}>{tt.ganttLabel}</p>
      <div className="overflow-x-auto rounded-xl p-4 mb-6"
        style={{ background:'rgba(5,11,22,0.8)', border:'1px solid rgba(59,130,246,0.12)' }}>
        <div style={{ minWidth:680 }}>
          <div className="flex mb-2 pl-[180px]">
            {QUARTERS.map((q, i) => (
              <div key={i} className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider"
                style={{ color: i===11 ? 'rgba(255,255,255,0.85)' : 'rgba(96,165,250,0.5)' }}>{q}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {PHASE_BAR_META.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-[11px] font-semibold flex-shrink-0 text-right"
                  style={{ width:168, color: p.color==='#ffffff' ? 'rgba(255,255,255,0.85)' : p.color }}>
                  {tt.phaseNames[i]}
                </div>
                <div className="flex-1"><GanttBar start={p.start} end={p.end} color={p.color} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color:'rgba(96,165,250,0.45)' }}>{tt.tableLabel}</p>
      <div className="overflow-x-auto rounded-xl" style={{ border:'1px solid rgba(59,130,246,0.15)' }}>
        <table className="w-full text-[13px]" style={{ minWidth:560 }}>
          <thead>
            <tr style={{ background:'rgba(59,130,246,0.08)', borderBottom:'1px solid rgba(59,130,246,0.15)' }}>
              {tt.tableHeaders.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em]"
                  style={{ color:'rgba(96,165,250,0.65)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tt.rows.map((row, i) => (
              <tr key={i} style={{ background: i%2===0 ? 'rgba(5,11,22,0.5)' : 'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3 font-semibold" style={{ color:PHASE_COLORS[i] }}>{row.timeframe}</td>
                <td className="px-4 py-3 font-semibold text-white">{row.phase}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-[11px] font-bold"
                    style={{ background:`${PHASE_COLORS[i]}15`, color:PHASE_COLORS[i], border:`1px solid ${PHASE_COLORS[i]}30` }}>
                    {row.duration}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color:'rgba(148,163,184,0.8)' }}>{row.deliverable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ─── Parallel Tracks ────────────────────────────────────────────────────────── */
function ParallelTracks() {
  const lang = useLang();
  const tp = T[lang].parallel;
  return (
    <Section id="parallel">
      <SectionLabel text={tp.sectionLabel} />
      <SectionTitle>{tp.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tp.body}</p>
      <Divider />

      <div className="overflow-x-auto rounded-xl p-4 mb-4"
        style={{ background:'rgba(5,11,22,0.8)', border:'1px solid rgba(59,130,246,0.12)' }}>
        <div style={{ minWidth:680 }}>
          <div className="flex mb-2 pl-[200px]">
            {QUARTERS.map((q, i) => (
              <div key={i} className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider"
                style={{ color:'rgba(96,165,250,0.5)' }}>{q}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {PARALLEL_META.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-[11px] font-semibold flex-shrink-0 text-right"
                  style={{ width:188, color:p.color }}>{tp.items[i].name}</div>
                <div className="flex-1"><GanttBar start={p.start} end={p.end} color={p.color} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PARALLEL_META.map((p, i) => (
          <div key={i} className="rounded-lg p-3 flex gap-2.5"
            style={{ background:`${p.color}08`, border:`1px solid ${p.color}20` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:p.color }} />
            <p className="text-[12px] leading-relaxed" style={{ color:'rgba(148,163,184,0.8)' }}>
              <span className="font-semibold" style={{ color:p.color }}>{tp.items[i].name}: </span>{tp.items[i].note}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Schedule Margin ────────────────────────────────────────────────────────── */
function ScheduleMargin() {
  const lang = useLang();
  const tm = T[lang].margin;
  return (
    <Section id="margin">
      <SectionLabel text={tm.sectionLabel} />
      <SectionTitle>{tm.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tm.body}</p>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tm.items.map(({ rule, detail }, i) => {
          const Icon = MARGIN_ICONS[i];
          const color = MARGIN_COLORS[i];
          return (
            <motion.div key={i}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1 }}
              className="rounded-xl p-5 flex gap-4"
              style={{ background:'rgba(5,11,22,0.8)', border:`1px solid ${color}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:`${color}12`, border:`1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="font-bold text-white text-[14px] mb-1">{rule}</p>
                <p className="text-[12px] leading-relaxed" style={{ color:'rgba(148,163,184,0.75)' }}>{detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function Validation() {
  const lang = useLang();
  const tv = T[lang].validation;
  return (
    <Section id="validation">
      <SectionLabel text={tv.sectionLabel} />
      <SectionTitle>{tv.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tv.body}</p>
      <Divider />
      <div className="space-y-3">
        {tv.items.map(({ label, detail }, i) => {
          const Icon = VALID_ICONS[i];
          return (
            <motion.div key={i}
              initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.08 }}
              className="flex gap-4 rounded-xl p-4"
              style={{ background:'rgba(5,11,22,0.8)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)' }}>
                <Icon size={15} style={{ color:'#60a5fa' }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white mb-0.5">{label}</p>
                <p className="text-[12px] leading-relaxed" style={{ color:'rgba(148,163,184,0.75)' }}>{detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── 90 Days ─────────────────────────────────────────────────────────────────── */
function NinetyDays() {
  const lang = useLang();
  const tn = T[lang].ninetyDays;
  const [active, setActive] = useState(0);
  const phase = tn.phases[active];
  const color = DAY90_COLORS[active];

  return (
    <Section id="90days">
      <SectionLabel text={tn.sectionLabel} />
      <SectionTitle>{tn.title}</SectionTitle>
      <p className="text-[14px] mb-2 max-w-2xl" style={{ color:'rgba(148,163,184,0.8)' }}>{tn.body}</p>
      <Divider />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tn.phases.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="px-4 py-2 rounded-lg text-[12px] font-bold transition-all duration-200"
            style={{
              background: active===i ? `${DAY90_COLORS[i]}20` : 'transparent',
              border: `1px solid ${active===i ? DAY90_COLORS[i] : 'rgba(255,255,255,0.1)'}`,
              color: active===i ? DAY90_COLORS[i] : 'rgba(148,163,184,0.7)',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${lang}-${active}`}
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
          transition={{ duration:0.25 }}>

          {/* Phase header */}
          <div className="rounded-xl p-5 mb-4"
            style={{ background:`${color}08`, border:`1px solid ${color}25` }}>
            <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{phase.label}</span>
                <h3 className="text-[18px] font-bold text-white mt-1">{phase.title}</h3>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0"
                style={{ background:`${color}15`, border:`1px solid ${color}30`, color }}>
                {tn.deliverableHeader} {phase.deadline}
              </span>
            </div>
            <p className="text-[13px]" style={{ color:'rgba(148,163,184,0.8)' }}>
              <strong style={{ color:'rgba(255,255,255,0.7)' }}>Goal: </strong>{phase.goal}
            </p>
          </div>

          {/* Task/Deliverable table */}
          <div className="overflow-x-auto rounded-xl mb-4" style={{ border:`1px solid ${color}15` }}>
            <table className="w-full text-[13px]" style={{ minWidth:500 }}>
              <thead>
                <tr style={{ background:`${color}08`, borderBottom:`1px solid ${color}15` }}>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] w-1/2" style={{ color }}>{tn.taskHeader}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] w-1/2" style={{ color }}>{tn.deliverableHeader} {phase.deadline}</th>
                </tr>
              </thead>
              <tbody>
                {phase.tasks.map(([task, deliverable], i) => (
                  <tr key={i} style={{ background: i%2===0 ? 'rgba(5,11,22,0.5)' : 'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 text-white">{task}</td>
                    <td className="px-4 py-3" style={{ color:'rgba(148,163,184,0.8)' }}>{deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Success criteria */}
          <div className="rounded-xl p-4" style={{ background:`${color}06`, border:`1px solid ${color}20` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>{tn.successHeader}</p>
            <p className="text-[13px] leading-relaxed" style={{ color:'rgba(148,163,184,0.85)' }}>{phase.successCriteria}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

/* ─── Commitment ─────────────────────────────────────────────────────────────── */
function Commitment() {
  const lang = useLang();
  const tc = T[lang].commitment;
  return (
    <Section id="commitment">
      <SectionLabel text={tc.sectionLabel} />
      <SectionTitle>{tc.title}</SectionTitle>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-xl p-6"
          style={{ background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4"
            style={{ color:'rgba(96,165,250,0.6)' }}>{tc.promisesLabel}</p>
          <div className="space-y-3">
            {tc.promises.map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle size={16} style={{ color: ['#3B82F6','#10B981','#F59E0B'][i], flexShrink:0, marginTop:2 }} />
                <p className="text-[14px] font-semibold text-white leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-6"
          style={{ background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4"
            style={{ color:'rgba(239,68,68,0.6)' }}>{tc.notLabel}</p>
          <div className="space-y-3">
            {tc.notPromising.map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                  style={{ background:'rgba(239,68,68,0.6)' }} />
                <p className="text-[13px] leading-relaxed" style={{ color:'rgba(148,163,184,0.8)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function Footer() {
  const lang = useLang();
  const tf = T[lang].footer;
  return (
    <motion.footer initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
      className="mt-16 pt-6 pb-10 text-center"
      style={{ borderTop:'1px solid rgba(59,130,246,0.09)' }}>
      <p className="text-[13px]" style={{ color:'rgba(148,163,184,0.55)' }}>
        {tf.line1}{' '}<span style={{ color:'rgba(203,213,225,0.85)' }}>{tf.name}</span>{' '}- {tf.role}
      </p>
      <p className="text-[11px] mt-1.5" style={{ color:'rgba(100,116,139,0.45)' }}>{tf.line2}</p>
    </motion.footer>
  );
}

/* ─── App ─────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [lang, setLang] = useState('en');
  return (
    <LangCtx.Provider value={lang}>
      <div className="min-h-screen" style={{ backgroundColor:'#0B1120' }}>
        <Stars />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Header lang={lang} setLang={setLang} />
          <CorePrinciples />
          <FiveQuestions />
          <MasterTimeline />
          <ParallelTracks />
          <ScheduleMargin />
          <Validation />
          <NinetyDays />
          <Commitment />
          <Footer />
        </div>
      </div>
    </LangCtx.Provider>
  );
}
