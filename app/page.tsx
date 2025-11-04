"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Page() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#fffaf0");
  const [accent, setAccent] = useState<string>("#eab308");
  const [robe, setRobe] = useState<string>("#d4d4d8");
  const [line, setLine] = useState<string>("#0f172a");
  const [scale, setScale] = useState<number>(1);

  const width = 800;
  const height = 1000;

  const handleDownloadPng = useCallback(async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });

    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = png;
    a.download = "sai-baba.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [width, height]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleDownloadPng();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleDownloadPng]);

  const ariaDesc = useMemo(() => (
    "A respectful, stylized vector illustration of Sai Baba with a serene pose, gentle robe, and halo."
  ), []);

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="title">Sai Baba Image Generator</div>
          <div className="subtitle">Original SVG illustration with PNG export</div>
        </div>
        <div className="actions">
          <button onClick={handleDownloadPng}>Download PNG</button>
          <button className="secondary" onClick={() => { setBgColor("#fffaf0"); setAccent("#eab308"); setRobe("#d4d4d8"); setLine("#0f172a"); }}>Reset</button>
        </div>
      </header>

      <section className="card" style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <label>
            <div>Background</div>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>
          <label>
            <div>Accent (Halo)</div>
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </label>
          <label>
            <div>Robe</div>
            <input type="color" value={robe} onChange={(e) => setRobe(e.target.value)} />
          </label>
          <label>
            <div>Line</div>
            <input type="color" value={line} onChange={(e) => setLine(e.target.value)} />
          </label>
          <label>
            <div>Scale</div>
            <input type="range" min={0.8} max={1.2} step={0.01} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
          </label>
        </div>
      </section>

      <section className="card" style={{ marginTop: "1rem" }}>
        <div className="canvasWrap">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaDesc}
          >
            <defs>
              <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="18" floodColor="#00000040" />
              </filter>
              <linearGradient id="robeShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={robe} />
                <stop offset="100%" stopColor="#bdbdbf" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width={width} height={height} fill={bgColor} />

            {/* Halo */}
            <g transform={`translate(${width/2}, ${height*0.2}) scale(${scale})`}>
              <circle r="150" fill={accent} opacity="0.25" />
              <circle r="120" fill={accent} opacity="0.35" />
              <circle r="95" fill={accent} opacity="0.5" filter="url(#softShadow)" />
            </g>

            {/* Head and face (stylized, minimal) */}
            <g transform={`translate(${width/2}, ${height*0.28}) scale(${scale})`}>
              <ellipse rx="60" ry="75" fill="#f4e6d8" stroke={line} strokeWidth="2" />
              {/* Head wrap */}
              <path d="M -80 -10 C -40 -60, 40 -60, 80 -10 C 60 10, -60 10, -80 -10 Z" fill={robe} stroke={line} strokeWidth="2" />
              {/* Eyes */}
              <ellipse cx="-20" cy="10" rx="8" ry="4" fill={line} />
              <ellipse cx="20" cy="10" rx="8" ry="4" fill={line} />
              {/* Nose */}
              <path d="M 0 15 C 5 28, -5 28, 0 42" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Beard outline */}
              <path d="M -45 30 C -30 85, 30 85, 45 30" fill="#eee8e1" stroke={line} strokeWidth="2" />
            </g>

            {/* Seated posture with robe */}
            <g transform={`translate(${width/2}, ${height*0.62}) scale(${scale})`}>
              {/* Torso */}
              <path d="M -90 -140 C -30 -160, 30 -160, 90 -140 C 100 -100, 100 -60, 90 -20 C 30 10, -30 10, -90 -20 C -100 -60, -100 -100, -90 -140 Z" fill="url(#robeShade)" stroke={line} strokeWidth="2.5" />
              {/* Right arm */}
              <path d="M 70 -100 C 95 -80, 110 -40, 80 -10 C 60 10, 30 15, 10 -5 C 20 -35, 40 -60, 70 -100 Z" fill={robe} stroke={line} strokeWidth="2" />
              {/* Left arm raised (blessing) */}
              <path d="M -70 -100 C -100 -65, -115 -30, -90 -5 C -70 15, -40 10, -25 -5 C -35 -30, -50 -60, -70 -100 Z" fill={robe} stroke={line} strokeWidth="2" />
              {/* Legs crossed */}
              <path d="M -110 20 C -40 60, 40 60, 110 20 C 80 90, -80 90, -110 20 Z" fill={robe} stroke={line} strokeWidth="2" />
              {/* Accent lines */}
              <path d="M -65 -45 C -40 -35, -20 -20, 0 -10" stroke="#64748b" strokeWidth="2" fill="none" />
              <path d="M 65 -45 C 40 -35, 20 -20, 0 -10" stroke="#64748b" strokeWidth="2" fill="none" />
            </g>

            {/* Base platform */}
            <g transform={`translate(${width/2}, ${height*0.9}) scale(${scale})`}>
              <rect x="-220" y="-20" width="440" height="40" rx="12" fill="#e2e8f0" stroke="#94a3b8" />
              <rect x="-180" y="-10" width="360" height="20" rx="10" fill="#f1f5f9" />
            </g>

            {/* Caption */}
            <g transform={`translate(${width/2}, ${height*0.965})`}>
              <text textAnchor="middle" fontSize="28" fontWeight="700" fill={line}>
                Sai Baba
              </text>
            </g>
          </svg>
        </div>
        <div className="footer">
          Tip: Press Ctrl/Cmd+S to quickly export PNG.
        </div>
      </section>
    </div>
  );
}
