import { useEffect, useState } from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';

export function LandscapeWarning() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [glitchActive, setGlitchActive] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  const logLines = [
    '» SYSTEM BOOT: ORIENTATION_GUARD_v5.2.0',
    '» RUNNING SENSORS... GYRO: OK | ACCEL: OK',
    '» VIEWPORT ANALYZING... WIDE_RATIO DETECTED',
    '» STATUS: COMPOSITION LOCK DOWN INITIATED',
    '» SECURITY LEVEL: ALPHA-RESTRICTED',
    '» LOCKING VIEWPORT SCROLL PROTOCOLS...',
    '» ERROR: 0x889 - PORTRAIT MODE COMPILATION BROKEN',
    '» PENDING CORE ALIGNMENT RE-ALIGNMENT...',
    '» SCANNING DEVICE ORIENTATION RETRY IN PROGRESS...'
  ];

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Glitch effect timer
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 4500);

    // Progressive terminal logs
    const logInterval = setInterval(() => {
      setActiveLogIndex((prev) => {
        if (prev < logLines.length) {
          setTerminalLogs((logs) => [...logs, logLines[prev]]);
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearInterval(glitchInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <>
      <div className="landscape-warning-container">
        {/* Futuristic Cyber Grids & Scanners */}
        <div className="hud-grid" />
        <div className="hud-scanline-laser" />
        <div className="hud-ambient-glow" />
        <div className="hud-diagonal-stripes top" />
        <div className="hud-diagonal-stripes bottom" />

        {/* Dynamic Telemetry Accents */}
        <div className="hud-telemetry-panel left-side select-none">
          <div>LAT: 51.5074° N</div>
          <div>LON: 0.1278° W</div>
          <div>ALT: 84.2m</div>
          <div>GRID: 4F_99</div>
        </div>
        <div className="hud-telemetry-panel right-side select-none">
          <div>FPS: 60 // STABLE</div>
          <div>MEM: 84.2MB</div>
          <div>LOCK: FULL_SECURE</div>
          <div>SYS: COMP_V5.2</div>
        </div>

        {/* Framing Corner Brackets with Notch Safety */}
        <div className="hud-bracket top-left" />
        <div className="hud-bracket top-right" />
        <div className="hud-bracket bottom-left" />
        <div className="hud-bracket bottom-right" />

        {/* Tech Header bar */}
        <div className="hud-top-bar select-none">
          <span className="hud-pulse-dot" />
          <span className="hud-bar-title font-bold">CORE_GUARD // SCREEN ALIGNMENT CHECK</span>
          <span className="hud-bar-spring" />
          <span className="hud-bar-code">SYS_ERR: [0x504_MISALIGNED]</span>
        </div>

        {/* Main interactive HUD content */}
        <div className="hud-content">
          {/* Column 1: Rotating Telemetry Compass & Phone animation */}
          <div className="hud-left-pane">
            <div className="hud-compass-wrapper">
              {/* Complex Concentric HUD Circles */}
              <svg className="hud-ring ring-1" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="#ff2e2e" strokeWidth="1.5" strokeDasharray="10 30 50 15 5 5" fill="none" opacity="0.3" />
                <circle cx="50" cy="50" r="48" stroke="#ff2e2e" strokeWidth="2.5" strokeDasharray="40 10" fill="none" opacity="0.85" />
              </svg>
              <svg className="hud-ring ring-2" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 5 15 5" fill="none" opacity="0.6" />
                <circle cx="50" cy="50" r="40" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="80 20" fill="none" opacity="0.8" />
              </svg>
              <svg className="hud-ring ring-3" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="32" stroke="#ff2e2e" strokeWidth="0.8" strokeDasharray="2 2" fill="none" opacity="0.5" />
              </svg>
              
              {/* Rotating Device Silhouette */}
              <div className="hud-device-display">
                <div className="hud-device-body">
                  <div className="hud-device-screen">
                    <div className="hud-device-sensor-bar" />
                    <div className="hud-device-scan-bar" />
                    <div className="hud-device-home-pill" />
                  </div>
                </div>
                {/* Arrow Vector Ring */}
                <div className="hud-vector-arrows">
                  <svg viewBox="0 0 100 100">
                    <path d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="#ff2e2e" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="#ff2e2e" strokeWidth="1.5" strokeDasharray="4 2" />
                    <polygon points="88,50 93,42 83,43" fill="#ff2e2e" />
                    <polygon points="12,50 7,58 17,57" fill="#ff2e2e" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Sci-fi Warnings & Live logs console */}
          <div className="hud-right-pane">
            <div className="hud-warning-card">
              <div className="hud-warning-header">
                <div className="hud-warning-icon-wrapper">
                  <ShieldAlert className="hud-warning-icon animate-pulse" />
                </div>
                <div className="hud-warning-titles">
                  <span className={`hud-warning-label ${glitchActive ? 'glitch' : ''}`}>
                    {glitchActive ? '▲ CORE_MISALIGNMENT_ERR' : '▲ ALIGNMENT ERROR'}
                  </span>
                  <h1 className="hud-warning-headline">PORTRAIT LOCK ACTIVE</h1>
                </div>
              </div>

              <p className="hud-warning-body-text">
                Composition safety systems have engaged. This interactive experience has been optimized exclusively for a 
                <strong className="text-red-400"> portrait screen orientation</strong>. 
                Please rotate your device back to portrait to resume.
              </p>

              {/* Monospaced Live Boot Console logs */}
              <div className="hud-console">
                <div className="hud-console-header select-none">
                  <Terminal className="hud-console-icon" />
                  <span>LIVE_ORIENTATION_GUARD_BOOT_LOGS</span>
                  <span className="hud-console-pulse-dot" />
                </div>
                <div className="hud-console-output">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="hud-console-log-line">
                      {log}
                    </div>
                  ))}
                  {terminalLogs.length < logLines.length && (
                    <div className="hud-console-log-line cursor-blink">_</div>
                  )}
                  {/* Dynamic Dimension Details */}
                  {terminalLogs.length >= logLines.length && (
                    <>
                      <div className="hud-console-log-line text-amber-400">
                        » RESOLUTION: {dimensions.width}px x {dimensions.height}px
                      </div>
                      <div className="hud-console-log-line text-amber-400">
                        » RATIO: {(dimensions.width / (dimensions.height || 1)).toFixed(2)} (CRITICAL_LANDSCAPE)
                      </div>
                      <div className="hud-console-log-line text-red-500 font-bold animate-pulse">
                        » SYSTEM_AWAITING_PHYSICAL_ROTATION...
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Landscape Warning Container (Obsidian Black) ── */
        .landscape-warning-container {
          display: none; /* Controlled strictly by CSS media query to prevent JS bypass */
          position: fixed;
          inset: 0;
          z-index: 999999;
          background-color: #030202 !important; /* Force Obsidian Black background */
          color: #f5f0eb;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          overflow: hidden;
          
          /* Safe Area Notch Padding */
          padding-left: max(32px, env(safe-area-inset-left));
          padding-right: max(32px, env(safe-area-inset-right));
          padding-top: max(24px, env(safe-area-inset-top));
          padding-bottom: max(24px, env(safe-area-inset-bottom));
        }

        /* ── STRICT CSS RULES FOR ZERO BYPASS DELAY ── */
        @media (max-width: 1024px) and (max-height: 768px) and (orientation: landscape) {
          .landscape-warning-container {
            display: flex !important;
          }
          
          /* Force block scrolling of the background */
          html, body {
            overflow: hidden !important;
            height: 100vh !important;
            max-height: 100vh !important;
            background-color: #030202 !important;
          }
        }

        /* ── Sci-Fi HUD Background grid ── */
        .hud-grid {
          position: absolute;
          inset: 0;
          background-size: 36px 36px;
          background-image: 
            linear-gradient(to right, rgba(255, 46, 46, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 46, 46, 0.035) 1px, transparent 1px);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Ambient Neon Red Glow ── */
        .hud-ambient-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255, 46, 46, 0.04) 0%, transparent 75%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Sweeping Laser Scanline ── */
        .hud-scanline-laser {
          position: absolute;
          left: 0;
          right: 0;
          height: 140px;
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(255, 46, 46, 0.02) 40%, 
            rgba(255, 46, 46, 0.12) 98%, 
            #ff2e2e 100%
          );
          box-shadow: 0 4px 12px rgba(255, 46, 46, 0.2);
          opacity: 0.85;
          pointer-events: none;
          z-index: 2;
          animation: scanline-sweep 6s linear infinite;
        }

        @keyframes scanline-sweep {
          0% { transform: translateY(-140px); }
          100% { transform: translateY(100vh); }
        }

        /* ── Diagonal HUD warning stripes ── */
        .hud-diagonal-stripes {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255, 46, 46, 0.3),
            rgba(255, 46, 46, 0.3) 8px,
            transparent 8px,
            transparent 16px
          );
          opacity: 0.6;
          z-index: 5;
          pointer-events: none;
        }
        .hud-diagonal-stripes.top { top: 0; }
        .hud-diagonal-stripes.bottom { bottom: 0; }

        /* ── Telemetry panels on sides ── */
        .hud-telemetry-panel {
          position: absolute;
          font-size: 8px;
          line-height: 1.8;
          color: rgba(245, 240, 235, 0.25);
          letter-spacing: 0.1em;
          z-index: 5;
          pointer-events: none;
        }
        .hud-telemetry-panel.left-side {
          left: max(32px, env(safe-area-inset-left));
          bottom: max(36px, env(safe-area-inset-bottom));
          text-align: left;
        }
        .hud-telemetry-panel.right-side {
          right: max(32px, env(safe-area-inset-right));
          bottom: max(36px, env(safe-area-inset-bottom));
          text-align: right;
        }

        /* ── Corner brackets ── */
        .hud-bracket {
          position: absolute;
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255, 46, 46, 0.45);
          z-index: 6;
          pointer-events: none;
          filter: drop-shadow(0 0 4px rgba(255, 46, 46, 0.3));
        }
        .top-left { 
          top: max(24px, env(safe-area-inset-top)); 
          left: max(32px, env(safe-area-inset-left)); 
          border-right: none; 
          border-bottom: none; 
        }
        .top-right { 
          top: max(24px, env(safe-area-inset-top)); 
          right: max(32px, env(safe-area-inset-right)); 
          border-left: none; 
          border-bottom: none; 
        }
        .bottom-left { 
          bottom: max(24px, env(safe-area-inset-bottom)); 
          left: max(32px, env(safe-area-inset-left)); 
          border-right: none; 
          border-top: none; 
        }
        .bottom-right { 
          bottom: max(24px, env(safe-area-inset-bottom)); 
          right: max(32px, env(safe-area-inset-right)); 
          border-left: none; 
          border-top: none; 
        }

        /* ── HUD Top Bar ── */
        .hud-top-bar {
          position: absolute;
          top: max(24px, env(safe-area-inset-top));
          left: calc(max(32px, env(safe-area-inset-left)) + 48px);
          right: calc(max(32px, env(safe-area-inset-right)) + 48px);
          height: 24px;
          display: flex;
          align-items: center;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: rgba(245, 240, 235, 0.4);
          border-bottom: 1px solid rgba(255, 46, 46, 0.15);
          z-index: 5;
          pointer-events: none;
        }

        .hud-pulse-dot {
          width: 6px;
          height: 6px;
          background-color: #ff2e2e;
          border-radius: 50%;
          box-shadow: 0 0 8px #ff2e2e;
          margin-right: 12px;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .hud-bar-spring {
          flex-grow: 1;
        }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; filter: brightness(1.2); }
        }

        /* ── Grid Layout ── */
        .hud-content {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 2.2fr 3.8fr;
          gap: 40px;
          width: 100%;
          max-width: 900px;
          align-items: center;
          margin-top: 16px;
        }

        /* ── Left Pane (Complex 3D Telemetry compass & phone) ── */
        .hud-left-pane {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hud-compass-wrapper {
          position: relative;
          width: clamp(160px, 28vw, 210px);
          height: clamp(160px, 28vw, 210px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .hud-ring.ring-1 {
          animation: spin-cw 22s linear infinite;
        }

        .hud-ring.ring-2 {
          animation: spin-ccw 14s linear infinite;
        }

        @keyframes spin-cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-ccw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        .hud-device-display {
          position: relative;
          width: 48px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-device-body {
          position: absolute;
          width: 48px;
          height: 90px;
          border: 2px solid rgba(245, 240, 235, 0.95);
          border-radius: 8px;
          background-color: rgba(3, 2, 2, 0.95);
          box-shadow: 0 0 20px rgba(255, 46, 46, 0.15);
          animation: rotate-device 4s cubic-bezier(0.77, 0, 0.175, 1) infinite;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-device-screen {
          position: relative;
          width: 42px;
          height: 78px;
          border: 1px solid rgba(245, 240, 235, 0.18);
          border-radius: 4px;
          overflow: hidden;
        }

        .hud-device-sensor-bar {
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 3px;
          border-radius: 2px;
          background-color: rgba(245, 240, 235, 0.35);
        }

        .hud-device-home-pill {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 2px;
          border-radius: 1px;
          background-color: rgba(245, 240, 235, 0.35);
        }

        /* Glowing screen scanner */
        .hud-device-scan-bar {
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
          background: linear-gradient(to bottom, transparent, rgba(255, 46, 46, 0.35), transparent);
          animation: device-scan 2s ease-in-out infinite;
        }

        @keyframes device-scan {
          0% { top: -12px; }
          50% { top: 78px; }
          100% { top: -12px; }
        }

        .hud-vector-arrows {
          position: absolute;
          inset: -28px;
          pointer-events: none;
        }

        .hud-vector-arrows svg {
          width: 100%;
          height: 100%;
          opacity: 0.65;
          animation: glow-pulse-vector 2s ease-in-out infinite;
        }

        @keyframes rotate-device {
          0%, 15% { transform: rotate(90deg); }
          40%, 65% { transform: rotate(0deg); }
          85%, 100% { transform: rotate(90deg); }
        }

        @keyframes glow-pulse-vector {
          0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 2px rgba(255, 46, 46, 0.1)); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 46, 46, 0.4)); }
        }

        /* ── Right Pane ── */
        .hud-right-pane {
          display: flex;
          flex-direction: column;
        }

        .hud-warning-card {
          width: 100%;
        }

        .hud-warning-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .hud-warning-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 4px;
          background-color: rgba(255, 46, 46, 0.1);
          border: 1px solid rgba(255, 46, 46, 0.4);
          box-shadow: 0 0 12px rgba(255, 46, 46, 0.2);
        }

        .hud-warning-icon {
          width: 24px;
          height: 24px;
          color: #ff2e2e;
          filter: drop-shadow(0 0 4px #ff2e2e);
        }

        .hud-warning-titles {
          display: flex;
          flex-direction: column;
        }

        .hud-warning-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #ff2e2e;
          text-shadow: 0 0 6px rgba(255, 46, 46, 0.4);
        }

        .hud-warning-headline {
          font-family: 'Space Mono', monospace;
          font-size: clamp(18px, 3.8vw, 24px);
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffffff;
          margin: 3px 0 0 0;
          line-height: 1.1;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .hud-warning-body-text {
          font-size: clamp(10px, 2vw, 12px);
          line-height: 1.6;
          color: rgba(245, 240, 235, 0.65);
          margin-bottom: 18px;
          letter-spacing: 0.02em;
        }

        /* ── Live Terminal Console ── */
        .hud-console {
          border: 1px solid rgba(255, 46, 46, 0.18);
          background-color: rgba(3, 2, 2, 0.85);
          border-radius: 4px;
          box-shadow: inset 0 0 12px rgba(255, 46, 46, 0.05);
          overflow: hidden;
          z-index: 10;
        }

        .hud-console-header {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(255, 46, 46, 0.06);
          border-bottom: 1px solid rgba(255, 46, 46, 0.15);
          padding: 8px 12px;
          font-size: 8px;
          letter-spacing: 0.12em;
          color: rgba(245, 240, 235, 0.45);
        }

        .hud-console-icon {
          width: 11px;
          height: 11px;
          color: rgba(255, 46, 46, 0.7);
        }

        .hud-console-pulse-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #ff2e2e;
          margin-left: auto;
          animation: pulse-ring 1s infinite;
        }

        .hud-console-output {
          padding: 10px 14px;
          height: clamp(90px, 18vw, 125px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .hud-console-log-line {
          font-size: clamp(8px, 1.8vw, 9.5px);
          line-height: 1.4;
          color: rgba(255, 46, 46, 0.75);
          letter-spacing: 0.05em;
          word-break: break-all;
        }

        .cursor-blink {
          animation: blink 0.8s steps(2, start) infinite;
        }

        @keyframes blink {
          to { visibility: hidden; }
        }

        /* ── Glitch Text Animations ── */
        .glitch {
          animation: glitch-keyframes 0.15s linear infinite;
          text-shadow: 1px 0 #00ffff, -1px 0 #ff2e2e;
        }

        @keyframes glitch-keyframes {
          0% { transform: translate(0); }
          25% { transform: translate(-1px, 0.5px); }
          50% { transform: translate(0.5px, -1px); }
          75% { transform: translate(-0.5px, -0.5px); }
          100% { transform: translate(0); }
        }

        /* ── Responsiveness overrides for compact devices (e.g. smaller screens) ── */
        @media (max-height: 400px) {
          .landscape-warning-container {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-top: max(12px, env(safe-area-inset-top));
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }
          .hud-bracket {
            width: 16px;
            height: 16px;
          }
          .hud-bracket.top-left { top: max(12px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left)); }
          .hud-bracket.top-right { top: max(12px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right)); }
          .hud-bracket.bottom-left { bottom: max(12px, env(safe-area-inset-bottom)); left: max(16px, env(safe-area-inset-left)); }
          .hud-bracket.bottom-right { bottom: max(12px, env(safe-area-inset-bottom)); right: max(16px, env(safe-area-inset-right)); }
          
          .hud-top-bar { display: none; }
          .hud-telemetry-panel { display: none; }
          .hud-content { gap: 20px; }
          .hud-warning-header { margin-bottom: 8px; }
          .hud-warning-icon-wrapper { width: 36px; height: 36px; }
          .hud-warning-icon { width: 18px; height: 18px; }
          .hud-warning-body-text { margin-bottom: 10px; }
          .hud-console-output { height: 75px; padding: 6px 10px; }
        }
      `}</style>
    </>
  );
}
