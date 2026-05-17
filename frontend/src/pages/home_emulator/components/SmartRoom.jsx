import React, { useEffect, useRef } from "react";
import { Volume2, Tv } from "lucide-react";

/* ─────────────────────────────────────────────
   DISCO BALL
───────────────────────────────────────────── */
function DiscoBall({ active }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const BALL_CX = canvas.width / 2, BALL_CY = 110, BALL_R = 52;
    const COLOURS = ["#ff2d6d","#ff6a00","#ffe600","#00ffe0","#00b4ff","#a855f7","#ff2dce","#39ff14"];
    const ROWS = 7, COLS = 10;
    const facets = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const phi = (r / (ROWS - 1)) * Math.PI, theta = (c / COLS) * Math.PI * 2;
        facets.push({ x: BALL_CX + BALL_R * Math.sin(phi) * Math.cos(theta), y: BALL_CY + BALL_R * Math.cos(phi), size: 7 + 3 * Math.sin(phi), r, c, colorOff: (r * 3 + c * 7) % COLOURS.length });
      }
    const beams = Array.from({ length: 8 }, (_, i) => ({ baseAngle: (i / 8) * Math.PI * 2, swingAmp: 0.45 + Math.random() * 0.4, swingSpeed: 0.7 + Math.random() * 0.8, swingPhase: Math.random() * Math.PI * 2, colorIdx: i % COLOURS.length }));
    const spots = Array.from({ length: 6 }, (_, i) => ({ baseX: (canvas.width / 7) * (i + 1), phase: (i / 6) * Math.PI * 2, colorIdx: (i * 3) % COLOURS.length, speed: 0.5 + Math.random() * 0.6 }));
    const rgb = (hex) => `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;

    function draw(t) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      const pulse = (((t*128)/60)%1) < 0.12 ? (1-(((t*128)/60)%1)/0.12)*0.9 : 0;
      const bci = Math.floor(t*2) % COLOURS.length;
      ctx.fillStyle=`rgba(${rgb(COLOURS[bci])},${0.06+pulse*0.14})`; ctx.fillRect(0,0,W,H);
      spots.forEach(sp => {
        const cx = sp.baseX + Math.sin(t*sp.speed+sp.phase)*55, cy = H-22, col = COLOURS[(sp.colorIdx+Math.floor(t*1.5))%COLOURS.length];
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,50+pulse*30);
        g.addColorStop(0,`rgba(${rgb(col)},${0.55+pulse*0.3})`); g.addColorStop(1,`rgba(${rgb(col)},0)`);
        ctx.beginPath(); ctx.arc(cx,cy,50+pulse*30,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      beams.forEach(bm => {
        const angle = bm.baseAngle+t*0.4+Math.sin(t*bm.swingSpeed+bm.swingPhase)*bm.swingAmp;
        const col = COLOURS[(bm.colorIdx+Math.floor(t*1.2))%COLOURS.length];
        const fx = BALL_CX+Math.cos(angle)*320, fy = H-10, a = 0.18+pulse*0.22;
        const g = ctx.createLinearGradient(BALL_CX,BALL_CY,fx,fy);
        g.addColorStop(0,`rgba(${rgb(col)},${a*0.4})`); g.addColorStop(0.4,`rgba(${rgb(col)},${a})`); g.addColorStop(1,`rgba(${rgb(col)},0)`);
        const perp = angle+Math.PI/2, spread = 18+pulse*10;
        ctx.beginPath(); ctx.moveTo(BALL_CX,BALL_CY); ctx.lineTo(fx+Math.cos(perp)*spread,fy); ctx.lineTo(fx-Math.cos(perp)*spread,fy);
        ctx.closePath(); ctx.fillStyle=g; ctx.fill();
      });
      for (let ring=3;ring>=1;ring--) {
        ctx.beginPath(); ctx.arc(BALL_CX,BALL_CY,BALL_R+ring*20+pulse*ring*12,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${rgb(COLOURS[(bci+ring)%COLOURS.length])},${(0.04/ring+pulse*0.05)*2})`; ctx.lineWidth=ring===1?2.5:1.5; ctx.stroke();
      }
      const bg=ctx.createRadialGradient(BALL_CX-16,BALL_CY-18,4,BALL_CX,BALL_CY,BALL_R);
      bg.addColorStop(0,"#e2e8f0"); bg.addColorStop(0.5,"#94a3b8"); bg.addColorStop(1,"#1e2130");
      ctx.beginPath(); ctx.arc(BALL_CX,BALL_CY,BALL_R,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill();
      const spin=t*0.6;
      facets.forEach(f => {
        const col=COLOURS[Math.floor(t*3+f.colorOff)%COLOURS.length], br=0.55+0.45*Math.sin(t*4+f.r+f.c);
        ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(spin+f.c*0.3);
        const s=f.size*(0.85+pulse*0.2);
        ctx.beginPath(); ctx.roundRect(-s/2,-s/2,s,s*0.65,1.5); ctx.fillStyle=`rgba(${rgb(col)},${br*(0.65+pulse*0.35)})`; ctx.fill();
        ctx.beginPath(); ctx.roundRect(-s/4,-s/3,s/3,s/5,1); ctx.fillStyle=`rgba(255,255,255,${0.4+pulse*0.4})`; ctx.fill();
        ctx.restore();
      });
      const shine=ctx.createRadialGradient(BALL_CX-16,BALL_CY-18,1,BALL_CX-14,BALL_CY-16,18);
      shine.addColorStop(0,"rgba(255,255,255,0.55)"); shine.addColorStop(1,"rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(BALL_CX,BALL_CY,BALL_R,0,Math.PI*2); ctx.fillStyle=shine; ctx.fill();
      ctx.fillStyle="#1e2130"; ctx.fillRect(BALL_CX-3,0,6,BALL_CY-BALL_R+2);
    }
    function loop(ts) { draw(ts/1000); rafRef.current=requestAnimationFrame(loop); }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} width={480} height={260} className="absolute inset-0 w-full h-full rounded-[1.5rem] pointer-events-none" style={{ mixBlendMode:"screen" }} />;
}

/* ─────────────────────────────────────────────
   ROOM INTERIOR — always rendered at 700×520,
   parent scales it down via CSS transform
───────────────────────────────────────────── */
function RoomInterior({ devices, deviceTabs, voiceText }) {
  const lightOn    = devices.light?.on ?? false;
  const brightness = devices.light?.brightness ?? 70;
  const discoMode  = devices.light?.mode === "disco" || devices.light?.disco === true;
  const doorOpen   = devices.door?.open ?? false;
  const doorLocked = devices.door?.locked ?? false;
  const tvOn       = devices.tv?.on ?? false;
  const tvVolume   = devices.tv?.volume ?? 40;
  const tvApp      = devices.tv?.app ?? "home";
  const speakerOn      = devices.speaker?.on ?? false;
  const speakerPlaying = devices.speaker?.playing ?? false;

  const tvApps = {
    youtube: { name:"YouTube", logo:"https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", bg:"radial-gradient(circle at center,rgba(239,68,68,0.35),#020617 70%)", glow:"0 0 55px rgba(239,68,68,0.35)" },
    netflix:  { name:"Netflix",  logo:"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",  bg:"radial-gradient(circle at center,rgba(220,38,38,0.35),#020617 70%)", glow:"0 0 55px rgba(220,38,38,0.35)" },
    disney:   { name:"Disney+",  logo:"https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",    bg:"radial-gradient(circle at center,rgba(59,130,246,0.4),#020617 70%)",  glow:"0 0 55px rgba(59,130,246,0.35)" },
    home:     { name:"Smart TV Home", logo:null, bg:"radial-gradient(circle at center,rgba(59,130,246,0.45),#020617 70%)", glow:"0 0 50px rgba(59,130,246,0.3)" },
  };
  const app = tvApps[tvApp] || tvApps.home;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d0d12] shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
      style={{ width:700, height:520 }}>

      <div className="absolute inset-0 transition-all duration-700" style={{ background: discoMode ? "linear-gradient(to bottom,#1a0a2e 0%,#07070f 72%)" : lightOn ? "linear-gradient(to bottom,#3b382c 0%,#171713 72%)" : "linear-gradient(to bottom,#15151d 0%,#09090d 72%)" }} />
      <DiscoBall active={discoMode} />

      {lightOn && !discoMode && <>
        <div className="absolute left-1/2 top-8 h-[350px] w-[620px] -translate-x-1/2 rounded-full blur-3xl" style={{ background:`rgba(255,221,120,${brightness/700})` }} />
        <div className="absolute bottom-0 left-0 h-[150px] w-full" style={{ background:`linear-gradient(to top,rgba(255,205,120,${brightness/1300}),transparent)` }} />
      </>}

      <div className="absolute bottom-0 h-[135px] w-full" style={{ background: discoMode ? "linear-gradient(to bottom,rgba(10,5,20,0.85),#060609)" : lightOn ? "linear-gradient(to bottom,#161611,#0e0e0b)" : "linear-gradient(to bottom,#09090d,#060609)" }} />
      <div className="absolute bottom-[132px] left-8 right-8 h-px bg-white/10" />

      {/* ceiling light */}
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
        {!discoMode && <div className={`h-12 w-[3px] ${lightOn?"bg-yellow-200/50":"bg-zinc-700"}`} />}
        {!discoMode && (
          <div className="relative flex h-16 w-28 items-center justify-center rounded-b-[1.7rem] border border-white/10 bg-[#111116] shadow-2xl">
            {lightOn && <div className="absolute top-7 h-36 w-36 rounded-full blur-3xl" style={{ background:`rgba(250,204,21,${brightness/450})` }} />}
            <div className={`relative z-10 h-8 w-16 rounded-full border ${lightOn?"border-yellow-200/50 bg-yellow-300":"border-white/10 bg-zinc-700"}`}
              style={{ boxShadow:lightOn?`0 0 ${brightness}px rgba(250,204,21,0.75)`:"none" }} />
          </div>
        )}
      </div>
      {discoMode && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 pointer-events-none">
          <div className="mx-auto h-12 w-[3px] bg-zinc-800" />
          <div className="flex h-7 w-14 items-center justify-center rounded-b-2xl border border-white/10 bg-[#111116]">
            <div className="h-4 w-8 rounded-full bg-zinc-800 border border-white/10" />
          </div>
        </div>
      )}

      {/* door */}
      <div className="absolute bottom-[135px] left-[55px] h-[220px] w-[120px] rounded-t-3xl border border-white/10 bg-[#0b0b10] shadow-2xl">
        <div className="absolute inset-2 rounded-t-2xl bg-black/30" />
        <div className="absolute inset-2 origin-left rounded-t-2xl border border-emerald-400/20 bg-gradient-to-br from-[#2b231b] to-[#15100c] transition-transform duration-700"
          style={{ transformStyle:"preserve-3d", transform:doorOpen?"perspective(800px) rotateY(-72deg)":"perspective(800px) rotateY(0deg)", boxShadow:doorOpen?"18px 8px 30px rgba(0,0,0,0.35)":"inset -18px 0 25px rgba(0,0,0,0.25)" }}>
          <div className="absolute left-4 right-4 top-7 h-16 rounded-xl border border-white/10 bg-white/[0.025]" />
          <div className="absolute bottom-7 left-4 right-4 h-20 rounded-xl border border-white/10 bg-white/[0.025]" />
          <div className={`absolute right-4 top-1/2 h-3.5 w-3.5 rounded-full border border-white/30 ${doorLocked?"bg-red-400":"bg-emerald-400"}`} />
        </div>
        {[50,110,170].map(y=><div key={y} className="absolute left-1 h-7 w-1.5 rounded-full bg-white/15" style={{top:y}} />)}
        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-1 text-[9px] font-mono ${doorOpen?"border-emerald-400/30 bg-emerald-400/10 text-emerald-300":doorLocked?"border-red-400/30 bg-red-400/10 text-red-300":"border-white/10 bg-white/5 text-zinc-400"}`}>
          {doorOpen?"OPEN":doorLocked?"LOCKED":"CLOSED"}
        </div>
      </div>

      {/* TV */}
      <div className="absolute left-1/2 top-[105px] w-[320px] -translate-x-1/2">
        <div className="h-[170px] rounded-[1.3rem] border border-white/10 bg-black p-2 shadow-2xl">
          <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[1rem]"
            style={{ background:tvOn?app.bg:"#030305", boxShadow:tvOn?app.glow:"none" }}>
            {tvOn ? (
              <>
                {app.logo ? (
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <img src={app.logo} alt={app.name} className="max-h-16 max-w-[190px] object-contain" />
                    <p className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] font-mono text-zinc-300">VOL {tvVolume}%</p>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Tv size={44} className="text-blue-200" />
                    <p className="font-mono text-[11px] text-blue-200">SMART TV HOME</p>
                    <p className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] font-mono text-zinc-300">VOL {tvVolume}%</p>
                  </div>
                )}
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[8px] font-mono text-white/70">{app.name}</div>
              </>
            ) : <p className="relative z-10 font-mono text-xs text-zinc-800">TV OFF</p>}
          </div>
        </div>
        <div className="mx-auto h-6 w-2.5 bg-[#111116]" />
        <div className="mx-auto h-2.5 w-28 rounded-full bg-[#111116]" />
      </div>

      {/* speaker */}
      <div className="absolute bottom-[135px] right-[75px] flex h-[190px] w-[95px] flex-col items-center rounded-[1.7rem] border border-white/10 bg-gradient-to-b from-[#17171f] to-[#09090d] p-4 shadow-2xl">
        <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border ${speakerOn?"border-pink-400/30 bg-pink-400/10":"border-white/10 bg-black/30"}`}>
          {speakerPlaying && <>
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-pink-400/20" />
            <div className="absolute h-24 w-24 animate-ping rounded-full border border-pink-400/10" />
          </>}
          <div className={`h-8 w-8 rounded-full ${speakerOn?"bg-pink-400/50":"bg-zinc-800"}`} />
        </div>
        <div className={`mt-5 flex h-12 w-12 items-center justify-center rounded-full border ${speakerOn?"border-pink-400/20 bg-pink-400/5":"border-white/10 bg-black/20"}`}>
          <div className={`h-6 w-6 rounded-full ${speakerOn?"bg-pink-400/40":"bg-zinc-800"}`} />
        </div>
        <div className="mt-auto flex items-end gap-1">
          {[12,20,10,24,16].map((h,i)=>(
            <div key={i} className={`w-1 rounded-full ${speakerPlaying?"bg-pink-400":"bg-zinc-700"}`} style={{height:speakerPlaying?`${h}px`:"6px"}} />
          ))}
        </div>
        <p className="mt-2 text-[9px] font-mono text-zinc-500">{speakerPlaying?"PLAYING":speakerOn?"ON":"OFF"}</p>
      </div>

      {/* sofa */}
      <div className="absolute bottom-[35px] left-1/2 flex -translate-x-1/2 flex-col items-center">
        <div className="flex gap-2">
          {[1,2,3].map(i=>(
            <div key={i} className="h-20 w-28 rounded-t-[1.7rem] border border-white/5"
              style={{ background:discoMode?"#22162d":lightOn?"#33312d":"#17171f" }} />
          ))}
        </div>
        <div className="h-16 w-[380px] rounded-[1.7rem] border border-white/5"
          style={{ background:discoMode?"#1b1430":lightOn?"#282722":"#121218" }} />
        <div className="absolute -left-6 bottom-2 h-20 w-11 rounded-2xl bg-[#111116]" />
        <div className="absolute -right-6 bottom-2 h-20 w-11 rounded-2xl bg-[#111116]" />
      </div>

      {/* status bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-nowrap">
          {deviceTabs.map(tab=>(
            <div key={tab.key} className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-mono whitespace-nowrap ${tab.active?"border-emerald-400/20 bg-white/10 text-white":"border-white/10 bg-black/20 text-zinc-500"}`}>
              {tab.label}: {tab.status}
            </div>
          ))}
          {discoMode && <div className="shrink-0 animate-pulse rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2.5 py-1 text-[9px] font-mono text-fuchsia-300">DISCO MODE</div>}
        </div>
        {voiceText && (
          <div className="flex shrink-0 max-w-[180px] items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] text-zinc-400 backdrop-blur">
            <Volume2 size={11} className="shrink-0" /><span className="truncate">{voiceText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SMART ROOM
   - h-full: fills whatever the parent flex cell gives
   - ResizeObserver on the outer div measures ACTUAL px
   - Scale = min(availW/700, availH/520)
   - Room is centered, never clipped
───────────────────────────────────────────── */
export default function SmartRoom({ devices, deviceTabs, voiceText }) {
  const lightOn = devices.light?.on ?? false;
  const brightness = devices.light?.brightness ?? 70;
  const discoMode =
    devices.light?.mode === "disco" || devices.light?.disco === true;

  const outerRef = useRef(null);
  const [scale, setScale] = React.useState(1);

  const DW = 700;
  const DH = 520;

  useEffect(() => {
  const el = outerRef.current;
  if (!el) return;

  const obs = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;

    const nextScale = Math.min(
      width / DW,
      height / DH
    );

    setScale(nextScale);
  });

  obs.observe(el);

  return () => obs.disconnect();
}, []);

  return (
    <section
      ref={outerRef}
      className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] shadow-2xl"
    >
      {lightOn && !discoMode && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[1.5rem] transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 15%, rgba(255,220,120,${
              brightness / 1000
            }), transparent 60%)`,
          }}
        />
      )}

      {discoMode && (
        <div
          className="pointer-events-none absolute inset-0 animate-pulse rounded-[1.5rem]"
          style={{
            boxShadow:
              "0 0 60px rgba(168,85,247,0.35), 0 0 120px rgba(59,130,246,0.15)",
          }}
        />
      )}

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DW,
          height: DH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <RoomInterior
          devices={devices}
          deviceTabs={deviceTabs}
          voiceText={voiceText}
        />
      </div>
    </section>
  );
}