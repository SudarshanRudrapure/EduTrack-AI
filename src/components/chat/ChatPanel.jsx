import { useRef, useState, useEffect } from "react";
import { BLU, F } from "../../constants/theme";
import buildSystemPrompt from "./buildSystemPrompt";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function ChatPanel({ user, students, teachers, assignments, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi ${user.name || user.data?.name || "there"}! 👋 I'm EduTrack AI. I have access to the academic database and can answer questions about ${user.role === "admin" ? "students, teachers, and system analytics" : user.role === "teacher" ? "your students' performance, attendance, and assignments" : "your CGPA, attendance, assignments, and academic progress"}. How can I help?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const quickPrompts = user.role === "admin"
    ? ["How many students in CSE?", "List low attendance students", "Top 5 performers by CGPA", "Branch-wise summary"]
    : user.role === "teacher"
    ? ["Students below 75% attendance", "Top performers in my class", "Students with backlogs", "List all CSE students"]
    : ["What is my CGPA?", "Show my attendance", "Do I have any backlogs?", "How is my academic progress?"];

  const send = async (msg) => {
    const userMsg = msg || input;
    if (!userMsg.trim() || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const sysPrompt = buildSystemPrompt(user, students, teachers, assignments);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: sysPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Groq API error:", data.error);
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error.message || "Something went wrong. Please try again."}` }]);
        return;
      }

      const reply = data.choices?.[0]?.message?.content || "I encountered an issue. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error("Network error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your network and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const roleIcon = user.role === "admin" ? "🛡️" : user.role === "teacher" ? "👨‍🏫" : "🎓";
  const userName = user.name || user.data?.name || "User";

  return (
    <div style={{
      position: "fixed",
      right: 20,
      bottom: 80,
      top: 20,
      width: 370,
      maxHeight: "calc(100vh - 100px)",
      height: 560,
      background: "#ffffff",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      zIndex: 999,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      overflow: "hidden",
      fontFamily: F,
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "#3a5c83ed",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          background: "#ffffff33",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", fontFamily: F }}>EduTrack AI</div>
          <div style={{ fontSize: 11, color: "#a8c7ff", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
            Online · {user.role} {roleIcon}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffffaa", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "#e8f0fe",
      }}>
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === "assistant" ? (
              /* Bot message */
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                {/* Bot avatar */}
                <div style={{
                  width: 28,
                  height: 28,
                  background: "#1a56db",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                  marginTop: 2,
                }}>🤖</div>
                <div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4, fontWeight: 600, fontFamily: F }}>EduTrack AI</div>
                  <div style={{
                    background: "#ffffff",
                    color: "#1a1a1a",
                    padding: "10px 14px",
                    borderRadius: "4px 14px 14px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    maxWidth: 260,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    fontFamily: F,
                  }}>
                    {m.content}
                  </div>
                </div>
              </div>
            ) : (
              /* User message */
              <div style={{ display: "flex", alignItems: "flex-end", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 10, color: "#555", fontWeight: 600, fontFamily: F }}>You</div>
                <div style={{
                  background: "#1a56db",
                  color: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: "14px 4px 14px 14px",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  maxWidth: 260,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  fontFamily: F,
                }}>
                  {m.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🤖</div>
            <div style={{ background: "#ffffff", borderRadius: "4px 14px 14px 14px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width: 8, height: 8, background: "#1a56db", borderRadius: "50%", animation: `pulse 1s ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick Prompts ── */}
      <div style={{
        padding: "8px 12px",
        borderTop: "1px solid #e0e7ff",
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        background: "#ffffff",
      }}>
        {quickPrompts.map(q => (
          <button key={q} onClick={() => send(q)} style={{
            padding: "5px 11px",
            background: "#e8f0fe",
            border: "1px solid #c7d7fc",
            borderRadius: 20,
            color: "#1a56db",
            fontSize: 11,
            fontFamily: F,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            {q}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "10px 14px",
        borderTop: "1px solid #e0e7ff",
        display: "flex",
        gap: 8,
        alignItems: "center",
        background: "#ffffff",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Send a message..."
          style={{
            flex: 1,
            background: "#f3f6ff",
            border: "1px solid #c7d7fc",
            borderRadius: 24,
            padding: "9px 16px",
            color: "#1a1a1a",
            fontSize: 13,
            fontFamily: F,
            outline: "none",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 38,
            height: 38,
            background: input.trim() && !loading ? "#1a56db" : "#c7d7fc",
            border: "none",
            borderRadius: "50%",
            color: "#fff",
            fontSize: 16,
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            flexShrink: 0,
          }}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: #e8f0fe; }
        div::-webkit-scrollbar-thumb { background: #c7d7fc; border-radius: 4px; }
      `}</style>
    </div>
  );
}