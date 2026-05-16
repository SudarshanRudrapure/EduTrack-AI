import { useState } from "react";
import { BRANCHES } from "../../constants/branches";
// eslint-disable-next-line no-unused-vars
import { BLU, BLU2, RED, GRN, AMB, TX2, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import Btn from "../../components/ui/Btn";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

export default function LoginPage({ onLogin, students, teachers, setStudents }) {
  const { theme } = useTheme();

  const [tab,  setTab]  = useState("login");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [key,   setKey]   = useState("");
  const [err,   setErr]   = useState("");
  const [reg,   setReg]   = useState({
    name: "", email: "", password: "", phone: "",
    branch: "CSE", university: "VTU", college: "SCE"
  });

  const doLogin = () => {
    setErr("");
    if (role === "admin") {
      if (email === "admin@college.edu" && pass === "admin123")
        onLogin({ role: "admin", name: "Admin", data: {} });
      else setErr("Invalid admin credentials.");
      return;
    }
    if (role === "teacher") {
      const t     = teachers.find(t => t.email === email && t.password === pass);
      const byKey = key === "TEACH2024" && teachers.find(t => t.email === email);
      const found = t || byKey;
      if (found) onLogin({ role: "teacher", name: found.name, data: found });
      else setErr("Invalid teacher credentials or special key.");
      return;
    }
    const s = students.find(s => s.email === email && s.password === pass);
    if (s) onLogin({ role: "student", name: s.name, data: s });
    else setErr("Invalid student credentials.");
  };

  const doRegister = () => {
    if (!reg.name || !reg.email || !reg.password) { setErr("Fill all required fields."); return; }
    if (students.find(s => s.email === reg.email)) { setErr("Email already registered."); return; }
    const newS = {
      id: Date.now(), usn: "", name: reg.name, email: reg.email,
      password: reg.password, phone: reg.phone, university: reg.university,
      college: reg.college, branch: reg.branch, specialization: "", section: "",
      semester: 1, year: 1, sgpa: 0, cgpa: 0, backlogs: 0, status: "pending",
      teacherId: 1, attendance: {}, sgpaHist: [],
      notifications: [{ id: 1, msg: "Welcome! Your profile is pending teacher approval.", type: "info", read: false, date: "Today" }]
    };
    setStudents(prev => [...prev, newS]);
    onLogin({ role: "student", name: newS.name, data: newS });
  };

  const demos = [
    { role: "admin",   email: "admin@college.edu",      pass: "admin123",    label: "Admin"   },
    { role: "teacher", email: "shwetha@college.edu",     pass: "shwetha@123", label: "Teacher" },
    { role: "student", email: "sudarshan@student.edu",   pass: "student123",  label: "Student" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.BG, display: "flex", fontFamily: F }}>

      {/* ── Left Panel ── */}
      <div style={{ flex: 1, background: `linear-gradient(135deg, ${theme.SRF} 0%, ${theme.CRD2} 100%)`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, borderRight: `1px solid ${theme.BD}` }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: theme.TX3, textTransform: "uppercase", marginBottom: 12 }}>Academic Management System</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: theme.TX1, letterSpacing: -2, marginBottom: 8 }}>
          EduTrack <span style={{ color: BLU }}>AI</span>
        </div>
        <div style={{ fontSize: 15, color: theme.TX2, textAlign: "center", maxWidth: 320, lineHeight: 1.7, marginBottom: 36 }}>
          Intelligent proctor system for students, teachers & administrators powered by AI.
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%", maxWidth: 400 }}>
          {[
            { icon: "🎓", label: "Students", count: "20+" },
            { icon: "👨‍🏫", label: "Teachers", count: "5"   },
            { icon: "🏫", label: "Branches", count: "1"   },
          ].map(c => (
            <div key={c.label} style={{ background: theme.CRD, border: `1px solid ${theme.BD}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 22 }}>{c.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: BLU, fontFamily: FM }}>{c.count}</div>
              <div style={{ fontSize: 11, color: theme.TX2 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Demo */}
        <div style={{ marginTop: 40, width: "100%", maxWidth: 400 }}>
          <div style={{ fontSize: 11, color: theme.TX3, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Quick Demo Access</div>
          <div style={{ display: "flex", gap: 8 }}>
            {demos.map(d => (
              <button key={d.role}
                onClick={() => { setTab("login"); setRole(d.role); setEmail(d.email); setPass(d.pass); }}
                style={{ flex: 1, background: theme.CRD, border: `1px solid ${theme.BD2}`, borderRadius: 8, padding: "8px 4px", color: theme.TX2, fontSize: 12, fontFamily: F, cursor: "pointer" }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ width: 440, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: theme.BG }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 0, marginBottom: 28, background: theme.SRF, borderRadius: 10, padding: 4, border: `1px solid ${theme.BD}` }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setErr(""); }}
                style={{ flex: 1, padding: "8px", borderRadius: 7, background: tab === t ? theme.CRD2 : "transparent", color: tab === t ? theme.TX1 : theme.TX2, border: tab === t ? `1px solid ${theme.BD2}` : "1px solid transparent", fontSize: 13, fontFamily: F, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <>
              {/* Role selector */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: theme.TX2, marginBottom: 8, fontWeight: 500 }}>Sign in as</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["admin", "teacher", "student"].map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      style={{ flex: 1, padding: "7px 4px", borderRadius: 7, background: role === r ? BLU + "22" : theme.SRF, border: `1px solid ${role === r ? BLU + "66" : theme.BD}`, color: role === r ? BLU : theme.TX2, fontSize: 12, fontFamily: F, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Email"    value={email} onChange={setEmail} type="email"    placeholder="your@email.com" />
              <Input label="Password" value={pass}  onChange={setPass}  type="password" placeholder="••••••••" />
              {role === "teacher" && <Input label="Special Key (optional)" value={key} onChange={setKey} placeholder="TEACH2024" />}

              {err && (
                <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", color: RED, fontSize: 12, marginBottom: 14 }}>
                  {err}
                </div>
              )}
              <Btn onClick={doLogin} style={{ width: "100%" }} sz="lg">Sign In →</Btn>
            </>
          ) : (
            <>
              <Input label="Full Name *" value={reg.name}     onChange={v => setReg(p => ({ ...p, name: v }))}     placeholder="Your full name" />
              <Input label="Email *"     value={reg.email}    onChange={v => setReg(p => ({ ...p, email: v }))}    type="email"    placeholder="student@email.com" />
              <Input label="Password *"  value={reg.password} onChange={v => setReg(p => ({ ...p, password: v }))} type="password" placeholder="••••••••" />
              <Input label="Phone"       value={reg.phone}    onChange={v => setReg(p => ({ ...p, phone: v }))}    placeholder="10-digit number" />
              <Select label="Branch" value={reg.branch} onChange={v => setReg(p => ({ ...p, branch: v }))} options={BRANCHES} />

              {err && (
                <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", color: RED, fontSize: 12, marginBottom: 14 }}>
                  {err}
                </div>
              )}
              <Btn onClick={doRegister} style={{ width: "100%" }} sz="lg">Create Account →</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}