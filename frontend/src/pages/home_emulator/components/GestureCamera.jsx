import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Hand,
  Video,
  X,
  GripHorizontal,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

const HOLD_DURATION_MS = 1800;
const STATIC_COOLDOWN_MS = 2200;

const MEDIAPIPE_GESTURE_MAP = {
  Open_Palm: "open_palm",
  Closed_Fist: "closed_fist",
  Thumb_Up: "thumbs_up",
  Thumb_Down: "thumbs_down",
  Victory: "peace_sign",
  ILoveYou: "rock_sign",
};

export default function GestureCamera() {
  const videoRef = useRef(null);
  const animFrameRef = useRef(null);
  const recognizerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const lastSentTimeRef = useRef(0);
  const lastGestureRef = useRef("");

  const holdGestureRef = useRef(null);
  const holdStartRef = useRef(null);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const popupRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState("None");
  const [holdProgress, setHoldProgress] = useState(0);
  const [camDevices, setCamDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });

  useEffect(() => {
    async function loadModel() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      recognizerRef.current = recognizer;
      setReady(true);
    }

    loadModel().catch(console.error);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const onGripMouseDown = useCallback((e) => {
    e.preventDefault();

    const el = popupRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
    };

    function onMove(e) {
      if (!dragRef.current.dragging) return;

      const newX = dragRef.current.origX + (e.clientX - dragRef.current.startX);
      const newY = dragRef.current.origY + (e.clientY - dragRef.current.startY);

      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - el.offsetWidth)),
        y: Math.max(0, Math.min(newY, window.innerHeight - el.offsetHeight)),
      });
    }

    function onUp() {
      dragRef.current.dragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  function getSessionId() {
    let sessionId = localStorage.getItem("smart_home_session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("smart_home_session_id", sessionId);
    }
    return sessionId;
  }

  async function loadCamDevices() {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = all.filter((d) => d.kind === "videoinput");

      setCamDevices(videoDevices);

      setSelectedDeviceId((prev) =>
        !prev && videoDevices.length > 0 ? videoDevices[0].deviceId : prev
      );
    } catch (err) {
      console.error("Could not enumerate devices:", err);
    }
  }

  async function sendGesture(gesture) {
    const now = Date.now();

    if (
      lastGestureRef.current === gesture &&
      now - lastSentTimeRef.current < STATIC_COOLDOWN_MS
    ) {
      return;
    }

    lastGestureRef.current = gesture;
    lastSentTimeRef.current = now;

    try {
      const res = await fetch("https://smartasync.onrender.com/api/gesture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gesture,
          sessionId: getSessionId(),
        }),
      });

      const data = await res.json();
      console.log("Gesture result:", data);
    } catch (error) {
      console.error("Gesture send failed:", error);
    }
  }

  const distance = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const isFingerUp = (l, tip, pip) => l[tip].y < l[pip].y - 0.02;
  const isFingerDown = (l, tip, pip) => l[tip].y > l[pip].y + 0.02;

  const isIndexUp = (l) => isFingerUp(l, 8, 6);
  const isMiddleUp = (l) => isFingerUp(l, 12, 10);
  const isRingUp = (l) => isFingerUp(l, 16, 14);
  const isPinkyUp = (l) => isFingerUp(l, 20, 18);

  const isIndexDown = (l) => isFingerDown(l, 8, 6);
  const isMiddleDown = (l) => isFingerDown(l, 12, 10);
  const isRingDown = (l) => isFingerDown(l, 16, 14);
  const isPinkyDown = (l) => isFingerDown(l, 20, 18);

  const isThumbExtended = (l) => {
    return distance(l[4], l[9]) > distance(l[3], l[9]);
  };

  const getExtendedCount = (l) => {
    let count = 0;

    if (isIndexUp(l)) count++;
    if (isMiddleUp(l)) count++;
    if (isRingUp(l)) count++;
    if (isPinkyUp(l)) count++;

    return count;
  };

  const isPinch = (l) =>
    distance(l[4], l[8]) < 0.07 &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isPinkyDown(l);

  const isOkSign = (l) =>
    distance(l[4], l[8]) < 0.06 &&
    isMiddleUp(l) &&
    isRingUp(l) &&
    isPinkyUp(l);

  const isLShape = (l) =>
    isIndexUp(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isPinkyDown(l) &&
    isThumbExtended(l) &&
    Math.abs(l[4].x - l[5].x) > 0.1;

  const isThreeFingers = (l) =>
    isIndexUp(l) && isMiddleUp(l) && isRingUp(l) && isPinkyDown(l);

  const isFourFingers = (l) => getExtendedCount(l) === 4 && !isThumbExtended(l);

  const isRaisedIndex = (l) =>
    isIndexUp(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isPinkyDown(l) &&
    !isThumbExtended(l);

  const isRaisedPinky = (l) =>
    isPinkyUp(l) &&
    isIndexDown(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    !isThumbExtended(l);

  const isIndexPointRight = (l) =>
    isIndexUp(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isPinkyDown(l) &&
    l[8].x > l[6].x + 0.05;

  const isIndexPointLeft = (l) =>
    isIndexUp(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isPinkyDown(l) &&
    l[8].x < l[6].x - 0.05;

  const isCrossedFingers = (l) =>
    isIndexUp(l) &&
    isMiddleUp(l) &&
    isRingDown(l) &&
    isPinkyDown(l) &&
    distance(l[8], l[12]) < 0.045;

  const isMiddleFinger = (l) =>
    isMiddleUp(l) && isIndexDown(l) && isRingDown(l) && isPinkyDown(l);

  const isCallMeSign = (l) =>
    isThumbExtended(l) &&
    isPinkyUp(l) &&
    isIndexDown(l) &&
    isMiddleDown(l) &&
    isRingDown(l);

  const isSpidermanSign = (l) =>
    isIndexUp(l) &&
    isPinkyUp(l) &&
    isMiddleDown(l) &&
    isRingDown(l) &&
    isThumbExtended(l);

  function resolveGesture(results) {
    const { gestures, landmarks } = results;

    if (!landmarks || !landmarks.length) return null;

    const hand = landmarks[0];

    if (isPinch(hand)) return "pinch";
    if (isCrossedFingers(hand)) return "crossed_fingers";
    if (isOkSign(hand)) return "ok_sign";
    if (isLShape(hand)) return "l_sign";
    if (isCallMeSign(hand)) return "call_me_sign";
    if (isSpidermanSign(hand)) return "spiderman_sign";
    if (isMiddleFinger(hand)) return "middle_finger";
    if (isThreeFingers(hand)) return "three_fingers";
    if (isFourFingers(hand)) return "four_fingers";
    if (isIndexPointRight(hand)) return "index_point_right";
    if (isIndexPointLeft(hand)) return "index_point_left";
    if (isRaisedPinky(hand)) return "raised_pinky";
    if (isRaisedIndex(hand)) return "raised_index";

    if (gestures?.length) {
      const top = gestures[0][0];

      if (top.score > 0.7) {
        const mapped = MEDIAPIPE_GESTURE_MAP[top.categoryName];

        if (mapped) return mapped;
      }
    }

    return null;
  }

  function processStaticHold(gesture) {
    const now = Date.now();

    if (gesture !== holdGestureRef.current) {
      holdGestureRef.current = gesture;
      holdStartRef.current = gesture ? now : null;
      setHoldProgress(0);
      return;
    }

    if (!gesture || !holdStartRef.current) return;

    const elapsed = now - holdStartRef.current;
    setHoldProgress(Math.min((elapsed / HOLD_DURATION_MS) * 100, 100));

    if (elapsed >= HOLD_DURATION_MS) {
      sendGesture(gesture);
      holdStartRef.current = now + HOLD_DURATION_MS;
      setHoldProgress(0);
    }
  }

  function resetHold() {
    holdGestureRef.current = null;
    holdStartRef.current = null;
    setHoldProgress(0);
  }

  function detectLoop() {
    const video = videoRef.current;
    const recognizer = recognizerRef.current;

    if (!video || !recognizer || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const nowMs = performance.now();

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;

      const results = recognizer.recognizeForVideo(video, nowMs);
      const detected = resolveGesture(results);

      if (detected) {
        setDetectedGesture(detected);
        processStaticHold(detected);
      } else {
        resetHold();
        setDetectedGesture(results.landmarks?.length > 0 ? "Unknown" : "None");
      }
    }

    animFrameRef.current = requestAnimationFrame(detectLoop);
  }

  async function startCamera() {
    if (!ready) {
      alert("Gesture model is still loading, please wait.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          ...(selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: "user" }),
        },
      });

      await loadCamDevices();

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          setCameraOn(true);
          animFrameRef.current = requestAnimationFrame(detectLoop);
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera permission denied or unavailable.");
    }
  }

  function stopCamera() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }

    lastGestureRef.current = "";
    lastSentTimeRef.current = 0;
    lastVideoTimeRef.current = -1;
    holdGestureRef.current = null;
    holdStartRef.current = null;

    setCameraOn(false);
    setDetectedGesture("None");
    setHoldProgress(0);
  }

  function handleClose() {
    stopCamera();
    setOpen(false);
    setMinimized(false);
  }

  const isHolding = holdProgress > 0;
  const secondsLeft = Math.ceil(
    ((100 - holdProgress) / 100) * (HOLD_DURATION_MS / 1000)
  );

  const popupStyle =
    position.x !== null
      ? {
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }
      : {
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
        };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Toggle Gesture Camera"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
          cameraOn
            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
            : "border-white/10 bg-white/5 text-zinc-400 hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-300"
        }`}
      >
        <Camera size={13} />
        <span>Gesture Cam</span>
        {cameraOn && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        )}
      </button>

      {open && (
        <div
          ref={popupRef}
          style={popupStyle}
          className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/95 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl ${
            minimized ? "w-[220px]" : "w-[340px]"
          }`}
        >
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-2 py-1.5">
            <div
              onMouseDown={onGripMouseDown}
              className="flex cursor-grab items-center active:cursor-grabbing"
              title="Drag to move"
            >
              <GripHorizontal size={13} className="text-zinc-600" />
            </div>

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
              <Camera size={11} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold leading-tight text-white">
                Gesture Camera
              </p>

              <p className="text-[9px] leading-tight text-zinc-500">
                {!ready
                  ? "Loading model…"
                  : cameraOn
                  ? "Live · hold static gesture"
                  : "Ready"}
              </p>
            </div>

            {!minimized && camDevices.length > 1 && (
              <div
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Video size={10} className="shrink-0 text-zinc-500" />

                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={cameraOn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-[80px] truncate bg-transparent text-[10px] text-zinc-300 outline-none disabled:opacity-40"
                >
                  {camDevices.map((d, i) => (
                    <option
                      key={d.deviceId}
                      value={d.deviceId}
                      className="bg-zinc-900 text-white"
                    >
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={cameraOn ? stopCamera : startCamera}
              disabled={!ready}
              className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold disabled:opacity-40 ${
                cameraOn
                  ? "border-red-400/30 bg-red-400/10 text-red-300"
                  : "border-blue-400/30 bg-blue-400/10 text-blue-300"
              }`}
            >
              {cameraOn ? <CameraOff size={10} /> : <Camera size={10} />}
              {cameraOn ? "Stop" : "Start"}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setMinimized((v) => !v)}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            >
              {minimized ? <Maximize2 size={10} /> : <Minimize2 size={10} />}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleClose}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              <X size={10} />
            </button>
          </div>

          {!minimized && (
            <div className="relative bg-black" style={{ height: 220 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full scale-x-[-1] object-cover ${
                  cameraOn ? "block" : "hidden"
                }`}
              />

              {!cameraOn && (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={!ready}
                  className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-600 transition hover:text-blue-300 disabled:cursor-wait"
                >
                  <Camera size={30} />

                  <span className="text-[10px]">
                    {ready ? "Tap Start or click here" : "Loading model…"}
                  </span>
                </button>
              )}

              {cameraOn && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </div>
              )}

              {cameraOn && camDevices.length > 1 && (
                <div className="absolute left-2 top-7 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-zinc-400">
                  <Video size={9} />
                  {camDevices.find((d) => d.deviceId === selectedDeviceId)
                    ?.label || "Camera"}
                </div>
              )}

              {cameraOn && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] text-white">
                  <Hand size={10} />
                  {detectedGesture}
                </div>
              )}

              {cameraOn && isHolding && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                  Hold {secondsLeft}s
                </div>
              )}

              {cameraOn && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                  <div
                    className="h-full bg-amber-400 transition-all duration-100"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}