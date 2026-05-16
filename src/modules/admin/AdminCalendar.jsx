import { useState } from "react";
import { CRD, CRD2, SRF, BD, BD2, BLU, GRN, AMB, RED, PRP, ORG, TX1, TX2, TX3, F, FM } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";

// ── Initial Events ──────────────────────────────────────────────
const INIT_EVENTS = [
  {
    id: 1,
    title: "External Project Review",
    date: "2026-01-08",
    type: "review",
    branch: "All",
    desc: "External project evaluation conducted by external panels",
    createdBy: "HOD",
  },
  {
    id: 2,
    title: "Republic Day",
    date: "2026-01-26",
    type: "holiday",
    branch: "All",
    desc: "Republic Day celebration and national holiday",
    createdBy: "Admin",
  },
  {
    id: 3,
    title: "Maha Shivaratri",
    date: "2026-02-15",
    type: "holiday",
    branch: "All",
    desc: "Maha Shivaratri holiday",
    createdBy: "Admin",
  },
  {
    id: 4,
    title: "Internship Review - 1",
    date: "2026-03-18",
    type: "review",
    branch: "All",
    desc: "First internship progress review for final-year students",
    createdBy: "Training Cell",
  },
  {
    id: 5,
    title: "International Workers' Day",
    date: "2026-05-01",
    type: "holiday",
    branch: "All",
    desc: "International Workers' Day holiday",
    createdBy: "Admin",
  },
  {
    id: 6,
    title: "Internship Review - 2",
    date: "2026-05-04",
    type: "review",
    branch: "All",
    desc: "Second internship progress review with faculty mentors",
    createdBy: "Training Cell",
  },
  {
    id: 7,
    title: "AuraFesta 2.0",
    date: "2026-05-09",
    type: "event",
    branch: "All",
    desc: "Annual college cultural and technical fest with competitions and performances",
    createdBy: "Student Council",
  },
  {
    id: 8,
    title: "Internship External Review",
    date: "2026-05-19",
    type: "review",
    branch: "All",
    desc: "Final external internship review conducted by industry panel members",
    createdBy: "Placement Cell",
  },
  {
    id: 9,
    title: "Independence Day",
    date: "2026-08-15",
    type: "holiday",
    branch: "All",
    desc: "Independence Day celebration and flag hoisting ceremony",
    createdBy: "Admin",
  },
];

// ── Initial Timetable ────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00"];

const INIT_TIMETABLE = {
  Monday:    ["Computer Networks", "Computer Networks Lab", "Artificial Intelligence", "LUNCH", "DBMS", "Parallel Computing", "SDLC"],
  Tuesday:   ["Artificial Intelligence", "DBMS", "Computer Networks", "LUNCH", "Parallel Computing Lab", "Computer Networks Lab", "DBMS Lab"],
  Wednesday: ["SDLC", "Parallel Computing", "DBMS Lab", "LUNCH", "Computer Networks", "Artificial Intelligence", "Parallel Computing Lab"],
  Thursday:  ["Computer Networks Lab", "SDLC", "Parallel Computing", "LUNCH", "Artificial Intelligence", "DBMS", "Computer Networks"],
  Friday:    ["DBMS", "Artificial Intelligence", "SDLC", "LUNCH", "Computer Networks", "Parallel Computing", "DBMS Lab"],
  Saturday:  ["Parallel Computing Lab", "Computer Networks Lab", "DBMS Lab", "LUNCH", "SDLC", "---", "---"],
};

// ── Type config ──────────────────────────────────────────────────
const TYPE_CONFIG = {
  exam:    { color: RED,  bg: "#450a0a", label: "Exam"    },
  event:   { color: BLU,  bg: "#0d1f3c", label: "Event"   },
  holiday: { color: GRN,  bg: "#064e3b", label: "Holiday" },
  review:  { color: AMB,  bg: "#451a03", label: "Review"  },
  seminar: { color: PRP,  bg: "#2e1065", label: "Seminar" },
  other:   { color: ORG,  bg: "#431407", label: "Other"   },
};

// ── Subject color map ────────────────────────────────────────────
const SUB_COLORS = {
  "Computer Networks":      BLU,
  "Computer Networks Lab":  "#60a5fa",
  "Artificial Intelligence": GRN,
  "DBMS":                   AMB,
  "DBMS Lab":               "#fcd34d",
  "Parallel Computing":     PRP,
  "Parallel Computing Lab": "#c4b5fd",
  "SDLC":                   ORG,
  "LUNCH":                  TX3,
  "---":                    TX3,
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function AdminCalendar() {
  const [tab, setTab]             = useState("calendar");
  const [events, setEvents]       = useState(INIT_EVENTS);
  const [timetable, setTimetable] = useState(INIT_TIMETABLE);
  const [modal, setModal]         = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [ttModal, setTtModal]     = useState(null); // { day, period, index }
  const [ttValue, setTtValue]     = useState("");

  const today    = new Date();
  const [curYear,  setCurYear]  = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());

  // ── Calendar helpers ─────────────────────────────────────────
  const daysInMonth  = new Date(curYear, curMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(curYear, curMonth, 1).getDay();
  const prevMonth = () => { if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); } else setCurMonth(m => m - 1); };
  const nextMonth = () => { if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); } else setCurMonth(m => m + 1); };

  const getEventsForDate = (day) => {
    const dateStr = `${curYear}-${String(curMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  // ── Event CRUD ───────────────────────────────────────────────
  const [form, setForm] = useState({ title: "", date: "", type: "event", branch: "All", desc: "", createdBy: "Admin" });

  const openAdd = () => {
    setForm({ title: "", date: "", type: "event", branch: "All", desc: "", createdBy: "Admin" });
    setEditEvent(null);
    setModal("event");
  };

  const openEdit = (ev) => {
    setForm({ ...ev });
    setEditEvent(ev);
    setModal("event");
  };

  const saveEvent = () => {
    if (!form.title || !form.date) return;
    if (editEvent) {
      setEvents(p => p.map(e => e.id === editEvent.id ? { ...form, id: editEvent.id } : e));
    } else {
      setEvents(p => [...p, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const deleteEvent = (id) => {
    if (confirm("Delete this event?")) setEvents(p => p.filter(e => e.id !== id));
  };

  // ── Timetable edit ───────────────────────────────────────────
  const openTtEdit = (day, index) => {
    setTtModal({ day, index });
    setTtValue(timetable[day][index]);
  };

  const saveTt = () => {
    setTimetable(p => ({
      ...p,
      [ttModal.day]: p[ttModal.day].map((s, i) => i === ttModal.index ? ttValue : s)
    }));
    setTtModal(null);
  };

  // ── Upcoming events ──────────────────────────────────────────
  const todayStr    = today.toISOString().split("T")[0];
  const upcoming    = [...events].filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Calendar & Timetable"
        sub="Manage academic events, holidays and class schedule"
        actions={[
          <Btn key="add" onClick={openAdd}>+ Add Event</Btn>
        ]}
      />

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: SRF, borderRadius: 10, padding: 4, border: `1px solid ${BD}`, width: "fit-content" }}>
        {[
          { id: "calendar",  label: "📅 Calendar"  },
          { id: "timetable", label: "🗓️ Timetable" },
          { id: "events",    label: "📋 All Events" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "8px 20px", borderRadius: 7, background: tab === t.id ? CRD2 : "transparent", color: tab === t.id ? TX1 : TX2, border: tab === t.id ? `1px solid ${BD2}` : "1px solid transparent", fontSize: 13, fontFamily: F, fontWeight: 600, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════
          TAB 1 — CALENDAR VIEW
      ════════════════════════════════ */}
      {tab === "calendar" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>

          {/* Calendar grid */}
          <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
            {/* Month nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <button onClick={prevMonth} style={{ background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "6px 12px", color: TX1, cursor: "pointer", fontSize: 16 }}>‹</button>
              <div style={{ fontSize: 16, fontWeight: 700, color: TX1, fontFamily: F }}>{MONTHS[curMonth]} {curYear}</div>
              <button onClick={nextMonth} style={{ background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "6px 12px", color: TX1, cursor: "pointer", fontSize: 16 }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: TX3, padding: "4px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {/* Empty cells for first day offset */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day       = i + 1;
                const dayEvents = getEventsForDate(day);
                const isToday   = day === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
                return (
                  <div key={day} style={{ minHeight: 52, padding: "4px", borderRadius: 8, background: isToday ? BLU + "22" : "transparent", border: isToday ? `1px solid ${BLU}55` : "1px solid transparent", cursor: dayEvents.length ? "pointer" : "default" }}>
                    <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? BLU : TX1, textAlign: "center", marginBottom: 2, fontFamily: FM }}>{day}</div>
                    {dayEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} onClick={() => openEdit(ev)}
                        style={{ fontSize: 9, background: TYPE_CONFIG[ev.type]?.color + "22", color: TYPE_CONFIG[ev.type]?.color, borderRadius: 3, padding: "1px 4px", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", fontFamily: F }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div style={{ fontSize: 9, color: TX3 }}>+{dayEvents.length - 2} more</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming events */}
          <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16, fontFamily: F }}>📌 Upcoming Events</div>
            {upcoming.length === 0
              ? <div style={{ color: TX2, fontSize: 13, fontFamily: F }}>No upcoming events.</div>
              : upcoming.map(ev => {
                const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.other;
                return (
                  <div key={ev.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${BD}` }}>
                    <div style={{ width: 44, height: 44, background: cfg.bg, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color, fontFamily: FM }}>{ev.date.split("-")[2]}</div>
                      <div style={{ fontSize: 9, color: cfg.color, fontFamily: F }}>{MONTHS[parseInt(ev.date.split("-")[1]) - 1].slice(0, 3)}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX1, marginBottom: 3, fontFamily: F }}>{ev.title}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <Badge color={cfg.color} bg={cfg.bg}>{cfg.label}</Badge>
                        <span style={{ fontSize: 10, color: TX3, fontFamily: F }}>{ev.branch}</span>
                      </div>
                    </div>
                    <button onClick={() => openEdit(ev)} style={{ background: "none", border: "none", color: TX2, cursor: "pointer", fontSize: 14 }}>✏️</button>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          TAB 2 — TIMETABLE VIEW
      ════════════════════════════════ */}
      {tab === "timetable" && (
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20, overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TX1, fontFamily: F }}>CSE — 8th Semester Class Timetable</div>
            <Badge color={GRN} bg={GRN + "18"}>Click any cell to edit</Badge>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BD2}` }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: TX3, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, width: 110 }}>Day / Time</th>
                {PERIODS.map(p => (
                  <th key={p} style={{ padding: "10px 8px", textAlign: "center", fontSize: 10, color: TX3, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, di) => (
                <tr key={day} style={{ borderBottom: `1px solid ${BD}`, background: di % 2 === 0 ? "transparent" : SRF + "55" }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: TX1, fontFamily: F }}>{day}</td>
                  {timetable[day].map((subject, si) => {
                    const isLunch  = subject === "LUNCH";
                    const isEmpty  = subject === "---";
                    const subColor = SUB_COLORS[subject] || TX2;
                    return (
                      <td key={si} onClick={() => !isLunch && openTtEdit(day, si)}
                        style={{ padding: "6px 4px", textAlign: "center", cursor: isLunch ? "default" : "pointer" }}>
                        <div style={{
                          padding: "6px 4px",
                          borderRadius: 6,
                          background: isLunch ? BD : isEmpty ? "transparent" : subColor + "18",
                          border: isLunch ? "none" : isEmpty ? "none" : `1px solid ${subColor}44`,
                          fontSize: 10,
                          color: isLunch ? TX3 : isEmpty ? TX3 : subColor,
                          fontWeight: isLunch ? 400 : 600,
                          fontFamily: F,
                          minHeight: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1.3,
                          transition: "opacity 0.15s",
                        }}>
                          {isLunch ? "🍽 Lunch" : isEmpty ? "—" : subject}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
            {Object.entries(SUB_COLORS).filter(([k]) => k !== "LUNCH" && k !== "---").map(([sub, color]) => (
              <div key={sub} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 10, color: TX2, fontFamily: F }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          TAB 3 — ALL EVENTS LIST
      ════════════════════════════════ */}
      {tab === "events" && (
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BD2}` }}>
                {["Title", "Date", "Type", "Branch", "Created By", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: TX3, letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...events].sort((a, b) => a.date.localeCompare(b.date)).map((ev, i) => {
                const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.other;
                return (
                  <tr key={ev.id} style={{ borderBottom: `1px solid ${BD}`, background: i % 2 === 0 ? "transparent" : SRF + "44" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX1, fontFamily: F }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: TX3, marginTop: 2, fontFamily: F }}>{ev.desc}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: FM, fontSize: 12, color: TX2 }}>{ev.date}</td>
                    <td style={{ padding: "12px 14px" }}><Badge color={cfg.color} bg={cfg.bg}>{cfg.label}</Badge></td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: TX2, fontFamily: F }}>{ev.branch}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: TX2, fontFamily: F }}>{ev.createdBy}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn v="ghost" sz="sm" onClick={() => openEdit(ev)}>Edit</Btn>
                        <Btn v="danger" sz="sm" onClick={() => deleteEvent(ev.id)}>Del</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {events.length === 0 && <div style={{ padding: 30, textAlign: "center", color: TX2, fontFamily: F }}>No events added yet.</div>}
        </div>
      )}

      {/* ── Add/Edit Event Modal ── */}
      {modal === "event" && (
        <Modal title={editEvent ? "Edit Event" : "Add New Event"} onClose={() => setModal(null)}>
          <Input label="Event Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="e.g. Internal Assessment 1" />
          <Input label="Date *" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} type="date" />
          <Select label="Type" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))}
            options={Object.entries(TYPE_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
          <Select label="Branch" value={form.branch} onChange={v => setForm(p => ({ ...p, branch: v }))}
            options={["All", "CSE", "ISE", "ECE", "EEE", "Mechanical", "Civil"].map(b => ({ value: b, label: b }))} />
          <Select label="Created By" value={form.createdBy} onChange={v => setForm(p => ({ ...p, createdBy: v }))}
            options={[{ value: "Admin", label: "Admin" }, { value: "HOD", label: "HOD" }]} />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: TX2, marginBottom: 5, fontWeight: 500, fontFamily: F }}>Description</div>
            <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={3}
              placeholder="Event description..."
              style={{ width: "100%", background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "9px 13px", color: TX1, fontSize: 13, fontFamily: F, outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            {editEvent && <Btn v="danger" onClick={() => { deleteEvent(editEvent.id); setModal(null); }}>Delete</Btn>}
            <Btn onClick={saveEvent}>{editEvent ? "Save Changes" : "Add Event"}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Edit Timetable Cell Modal ── */}
      {ttModal && (
        <Modal title={`Edit — ${ttModal.day} · ${PERIODS[ttModal.index]}`} onClose={() => setTtModal(null)}>
          <Input label="Subject Name" value={ttValue} onChange={setTtValue} placeholder="e.g. Computer Networks" />
          <div style={{ fontSize: 11, color: TX2, marginBottom: 14, fontFamily: F }}>
            Available subjects: Computer Networks, Computer Networks Lab, Artificial Intelligence, DBMS, DBMS Lab, Parallel Computing, Parallel Computing Lab, SDLC
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn v="ghost" onClick={() => setTtModal(null)}>Cancel</Btn>
            <Btn onClick={saveTt}>Save</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}