import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export function LandscapeWarning() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isBypassed, setIsBypassed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // If the user has already bypassed this session, don't show it again
    const sessionBypass = sessionStorage.getItem('landscape_bypass') === 'true';
    if (sessionBypass) {
      setIsBypassed(true);
      return;
    }

    const checkDeviceAndOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });

      const isLandscape = width > height;
      
      // Detect if it's a mobile/tablet touch device
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      // Typical mobile/tablet landscape sizes: width up to 1024px or height up to 600px
      const isMobileSize = width <= 1024 && height <= 768;

      setIsLandscapeMobile(isLandscape && isMobileSize && hasTouch);
    };

    checkDeviceAndOrientation();

    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);

    // Dynamic glitch effect timer to add sci-fi character
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);

    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleBypass = () => {
    setIsBypassed(true);
    sessionStorage.setItem('landscape_bypass', 'true');
  };

  if (isBypassed || !isLandscapeMobile) return null;

  return (
    <>
      <div className="landscape-warning-container">
        {/* Animated Background Scan & Grids */}
        <div className="hud-grid" />
        <div className="hud-scanner" />
        <div className="hud-ambient" />

        {/* Framing Corner Brackets */}
        <div className="hud-bracket top-left" />
        <div className="hud-bracket top-right" />
        <div className="hud-bracket bottom-left" />
        <div className="hud-bracket bottom-right" />

        {/* Status indicator bar top edge */}
        <div className="hud-top-bar">
          <span className="hud-dot pulsing-red" />
          <span className="hud-bar-text">SYSTEM STATUS: ORIENTATION_LOCK_ACTIVE</span>
          <span className="hud-bar-separator" />
          <span className="hud-bar-text select-none">CODE: 504_COMPOSITION_WARN</span>
        </div>

        {/* Content Box - Split 2-Column Grid optimized for Landscape */}
        <div className="hud-content">
          {/* Left Column: Rotating Telemetry & Device Icon */}
          <div className="hud-left-pane">
            <div className="telemetry-wrapper">
              <svg className="hud-circle-outer" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="rgba(230, 59, 46, 0.2)" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="46" stroke="#e63b2e" strokeWidth="1.5" strokeDasharray="30 20 10 40" fill="none" />
              </svg>
              <svg className="hud-circle-inner" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" strokeDasharray="5 5" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#D4AF37" strokeWidth="1" strokeDasharray="80 40" fill="none" />
              </svg>
              
              <div className="rotating-device-wrapper">
                <div className="device-silhouette">
                  <div className="device-screen">
                    <div className="device-home-button" />
                    <div className="device-camera" />
                  </div>
                </div>
                <div className="rotation-arrow-wrapper">
                  <svg className="rotation-arrow-svg" viewBox="0 0 100 100">
                    <path d="M 15 50 A 35 35 0 0 1 85 50" fill="none" stroke="#e63b2e" strokeWidth="2" strokeDasharray="5 3" />
                    <path d="M 85 50 A 35 35 0 0 1 15 50" fill="none" stroke="#e63b2e" strokeWidth="2" strokeDasharray="5 3" />
                    <polygon points="85,50 90,40 80,42" fill="#e63b2e" />
                    <polygon points="15,50 10,60 20,58" fill="#e63b2e" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Warnings, Logs & Override button */}
          <div className="hud-right-pane">
            <div className="warning-card">
              <div className="warning-header">
                <div className="warning-icon-bg">
                  <ShieldAlert className="warning-icon" />
                </div>
                <div className="warning-titles">
                  <span className={`warning-tag ${glitchActive ? 'glitch-text' : ''}`}>
                    {glitchActive ? '▲ CR1T1C4L_ERR' : '▲ CRITICAL ALIGNMENT'}
                  </span>
                  <h1 className="warning-title">ROTATION REQUIRED</h1>
                </div>
              </div>

              <p className="warning-description">
                This website is built with highly detailed interactions tailored for a <strong className="text-white">portrait screen orientation</strong>. 
                Please rotate your device back to portrait mode to experience the portfolio correctly.
              </p>

              {/* Monospace telemetry logs */}
              <div className="telemetry-logs">
                <div className="log-line">
                  <span className="log-label">[ENV]</span> DEVICE_TYPE: <span className="log-val text-amber-400">MOBILE_PORTABLE</span>
                </div>
                <div className="log-line">
                  <span className="log-label">[SYS]</span> CURR_RATIO: <span className="log-val text-red-500">{(dimensions.width / (dimensions.height || 1)).toFixed(2)} (LANDSCAPE)</span>
                </div>
                <div className="log-line">
                  <span className="log-label">[SYS]</span> RESOLUTION: <span className="log-val text-amber-400">{dimensions.width}px x {dimensions.height}px</span>
                </div>
                <div className="log-line">
                  <span className="log-label">[SYS]</span> STATE_LOCK: <span className="log-val text-red-500 font-bold animate-pulse">PENDING_USER_ROTATION...</span>
                </div>
              </div>

              {/* Sci-Fi Override button */}
              <button 
                onClick={handleBypass} 
                className="hud-override-btn"
                aria-label="Override orientation warning"
              >
                <span className="btn-glitch-layer" />
                <span className="btn-content">
                  <AlertTriangle className="btn-icon" />
                  BYPASS SYSTEM OVERRIDE
                </span>
                <span className="btn-scanner" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .landscape-warning-container {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background-color: #050404;
          color: #f5f0eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          overflow: hidden;
          padding: 24px;
        }

        /* ── Sci-Fi HUD Background Elements ── */
        .hud-grid {
          position: absolute;
          inset: 0;
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(230, 59, 46, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(230, 59, 46, 0.04) 1px, transparent 1px);
          pointer-events: none;
          z-index: 1;
        }

        .hud-scanner {
          position: absolute;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, rgba(230, 59, 46, 0.08), transparent);
          opacity: 0.8;
          pointer-events: none;
          z-index: 2;
          animation: scan-vertical 5s linear infinite;
        }

        .hud-ambient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(230, 59, 46, 0.03) 0%, transparent 80%);
          pointer-events: none;
          z-index: 1;
        }

        @keyframes scan-vertical {
          0% {
            transform: translateY(-120px);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        /* ── Corner Brackets ── */
        .hud-bracket {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(230, 59, 46, 0.4);
          z-index: 5;
          pointer-events: none;
        }
        .top-left { top: 16px; left: 16px; border-right: none; border-bottom: none; }
        .top-right { top: 16px; right: 16px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 16px; left: 16px; border-right: none; border-top: none; }
        .bottom-right { bottom: 16px; right: 16px; border-left: none; border-top: none; }

        /* ── Top Bar ── */
        .hud-top-bar {
          position: absolute;
          top: 16px;
          left: 48px;
          right: 48px;
          height: 20px;
          display: flex;
          align-items: center;
          font-size: 8px;
          letter-spacing: 0.15em;
          color: rgba(245, 240, 235, 0.45);
          border-bottom: 1px solid rgba(230, 59, 46, 0.15);
          padding-bottom: 4px;
          z-index: 5;
          pointer-events: none;
        }
        .hud-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .pulsing-red {
          background-color: #e63b2e;
          box-shadow: 0 0 6px #e63b2e;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
        .hud-bar-separator {
          flex-grow: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(230, 59, 46, 0.15), transparent 40%, transparent 60%, rgba(230, 59, 46, 0.15));
          margin: 0 16px;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* ── Content Grid Layout ── */
        .hud-content {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 2.2fr 3.8fr;
          gap: 32px;
          width: 100%;
          max-width: 860px;
          align-items: center;
        }

        /* ── Left Pane (Device Rotation Display) ── */
        .hud-left-pane {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .telemetry-wrapper {
          position: relative;
          width: clamp(140px, 25vw, 190px);
          height: clamp(140px, 25vw, 190px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-circle-outer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          animation: spin-clockwise 25s linear infinite;
        }

        .hud-circle-inner {
          position: absolute;
          inset: 8%;
          width: 84%;
          height: 84%;
          animation: spin-counter-clockwise 15s linear infinite;
        }

        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-counter-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        .rotating-device-wrapper {
          position: relative;
          width: 44px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-silhouette {
          position: absolute;
          width: 44px;
          height: 82px;
          border: 2px solid rgba(245, 240, 235, 0.85);
          border-radius: 6px;
          background-color: rgba(5, 4, 4, 0.9);
          box-shadow: 0 0 15px rgba(245, 240, 235, 0.1);
          animation: rotate-device 4s cubic-bezier(0.77, 0, 0.175, 1) infinite;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-screen {
          position: relative;
          width: 38px;
          height: 70px;
          border: 1px solid rgba(245, 240, 235, 0.2);
          border-radius: 3px;
        }

        .device-home-button {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          border: 1px solid rgba(245, 240, 235, 0.4);
        }

        .device-camera {
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: rgba(245, 240, 235, 0.4);
        }

        .rotation-arrow-wrapper {
          position: absolute;
          inset: -22px;
          pointer-events: none;
        }
        
        .rotation-arrow-svg {
          width: 100%;
          height: 100%;
          opacity: 0.7;
          animation: arrow-glow 2s ease-in-out infinite;
        }

        @keyframes rotate-device {
          0%, 15% {
            transform: rotate(90deg);
          }
          40%, 65% {
            transform: rotate(0deg);
          }
          85%, 100% {
            transform: rotate(90deg);
          }
        }

        @keyframes arrow-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* ── Right Pane (Texts and Logs) ── */
        .hud-right-pane {
          display: flex;
          flex-direction: column;
        }

        .warning-card {
          width: 100%;
          text-align: left;
        }

        .warning-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .warning-icon-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 4px;
          background-color: rgba(230, 59, 46, 0.12);
          border: 1px solid rgba(230, 59, 46, 0.35);
          box-shadow: 0 0 10px rgba(230, 59, 46, 0.15);
        }

        .warning-icon {
          width: 22px;
          height: 22px;
          color: #e63b2e;
        }

        .warning-titles {
          display: flex;
          flex-direction: column;
        }

        .warning-tag {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #e63b2e;
          text-shadow: 0 0 4px rgba(230, 59, 46, 0.4);
        }

        .warning-title {
          font-family: 'Space Mono', monospace; /* Futuristic look */
          font-size: clamp(16px, 3.5vw, 22px);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #ffffff;
          line-height: 1.1;
          margin: 2px 0 0 0;
        }

        .warning-description {
          font-size: clamp(10px, 2vw, 12px);
          line-height: 1.5;
          color: rgba(245, 240, 235, 0.7);
          margin-bottom: 16px;
        }

        /* ── Telemetry Logs ── */
        .telemetry-logs {
          background-color: rgba(5, 4, 4, 0.5);
          border: 1px solid rgba(230, 59, 46, 0.12);
          border-radius: 4px;
          padding: 10px 14px;
          margin-bottom: 18px;
        }

        .log-line {
          font-size: clamp(8px, 1.8vw, 10px);
          line-height: 1.6;
          color: rgba(245, 240, 235, 0.6);
          letter-spacing: 0.05em;
        }

        .log-label {
          color: rgba(230, 59, 46, 0.65);
        }

        .log-val {
          font-weight: 600;
        }

        /* ── Sci-Fi Override Button ── */
        .hud-override-btn {
          position: relative;
          background-color: transparent;
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #D4AF37;
          border-radius: 4px;
          font-family: 'Space Mono', monospace;
          font-size: clamp(9px, 2.2vw, 11px);
          font-weight: 700;
          letter-spacing: 0.18em;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hud-override-btn:hover {
          background-color: rgba(212, 175, 55, 0.08);
          border-color: #D4AF37;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
        }

        .btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-icon {
          width: 13px;
          height: 13px;
        }

        .btn-scanner {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15), transparent);
          z-index: 1;
          animation: btn-sweep 4s linear infinite;
        }

        @keyframes btn-sweep {
          0% { left: -100%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }

        /* ── Glitch Text Effect ── */
        .glitch-text {
          animation: glitch-anim 0.15s linear infinite;
          text-shadow: 1px 0 #00fffa, -1px 0 #e63b2e;
        }

        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }

        /* ── Responsive adjustments for very small landscape screens (like iPhone SE landscape) ── */
        @media (max-height: 380px) {
          .landscape-warning-container {
            padding: 12px;
          }
          .hud-top-bar {
            display: none;
          }
          .hud-bracket {
            width: 12px;
            height: 12px;
          }
          .hud-content {
            gap: 16px;
          }
          .warning-description {
            margin-bottom: 8px;
          }
          .telemetry-logs {
            padding: 6px 10px;
            margin-bottom: 8px;
          }
          .hud-override-btn {
            padding: 6px 12px;
          }
          .warning-header {
            margin-bottom: 6px;
          }
          .warning-icon-bg {
            width: 32px;
            height: 32px;
          }
          .warning-icon {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </>
  );
}
