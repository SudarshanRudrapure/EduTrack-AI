export const F   = "'Plus Jakarta Sans', system-ui, sans-serif";
export const FM  = "'JetBrains Mono', monospace";

// ── Dark Theme ───────────────────────────────────────────────────
export const DARK = {
  BG  : "#030810",
  SRF : "#071020",
  CRD : "#0b1628",
  CRD2: "#0f1d35",
  BD  : "#182a45",
  BD2 : "#1e3558",
  TX1 : "#dde8f8",
  TX2 : "#7a94b8",
  TX3 : "#3d5278",
};

// ── Light Theme ──────────────────────────────────────────────────
export const LIGHT = {
  BG  : "#f0f4ff",
  SRF : "#ffffff",
  CRD : "#ffffff",
  CRD2: "#f0f4ff",
  BD  : "#d0daf0",
  BD2 : "#b0bfe0",
  TX1 : "#0f1e3a",
  TX2 : "#4a5e80",
  TX3 : "#8a9bb8",
};

// ── Accent colors (same for both themes) ─────────────────────────
export const BLU  = "#4f84f6";
export const BLU2 = "#1e4ecf";
export const AMB  = "#f59e0b";
export const GRN  = "#10d9a8";
export const RED  = "#f87171";
export const PRP  = "#a78bfa";
export const ORG  = "#fb923c";

// ── These are kept for backward compatibility ────────────────────
// They will be overridden by theme context at runtime
export let BG   = DARK.BG;
export let SRF  = DARK.SRF;
export let CRD  = DARK.CRD;
export let CRD2 = DARK.CRD2;
export let BD   = DARK.BD;
export let BD2  = DARK.BD2;
export let TX1  = DARK.TX1;
export let TX2  = DARK.TX2;
export let TX3  = DARK.TX3;