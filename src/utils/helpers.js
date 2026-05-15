export const avg = arr => arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
export const lowAttendance = st => Object.values(st.attendance || {}).some(v => v < 75);
export const avgAtt = st => { const v = Object.values(st.attendance || {}); return v.length ? Math.round(v.reduce((a,b)=>a+b,0)/v.length) : 0; };
export const initials = name => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
export const gradeColor = g => ({ A: "#10d9a8", B: "#4f84f6", C: "#f59e0b", D: "#fb923c", F: "#f87171" }[g] || "#7a94b8");