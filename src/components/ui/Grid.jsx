export default function Grid({ cols = 4, gap = 16, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, marginBottom: 24 }}>
      {children}
    </div>
  );
}