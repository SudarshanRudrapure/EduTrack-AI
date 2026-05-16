export const F   = "'Plus Jakarta Sans', system-ui, sans-serif";
export const FM  = "'JetBrains Mono', monospace";

export const DARK = {
  BG  : "#0a0f1e",
  SRF : "#0f1729",
  CRD : "#131d30",
  CRD2: "#172238",
  BD  : "#1e3050",
  BD2 : "#243a5e",
  TX1 : "#e8f0fe",
  TX2 : "#8aa4c8",
  TX3 : "#4a6080",
};

export const LIGHT = {
  BG  : "#f4f6fb",
  SRF : "#ffffff",
  CRD : "#ffffff",
  CRD2: "#eef2fb",
  BD  : "#dde4f0",
  BD2 : "#c8d3e8",
  TX1 : "#0d1b2e",
  TX2 : "#3d5275",
  TX3 : "#8096b4",
};

export const BLU  = "#4f84f6";
export const BLU2 = "#1e4ecf";
export const AMB  = "#f59e0b";
export const GRN  = "#10d9a8";
export const RED  = "#f87171";
export const PRP  = "#a78bfa";
export const ORG  = "#fb923c";

// backward compat — will be overwritten at runtime by ThemeContext
export let BG   = DARK.BG;
export let SRF  = DARK.SRF;
export let CRD  = DARK.CRD;
export let CRD2 = DARK.CRD2;
export let BD   = DARK.BD;
export let BD2  = DARK.BD2;
export let TX1  = DARK.TX1;
export let TX2  = DARK.TX2;
export let TX3  = DARK.TX3;