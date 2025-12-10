"use client";

import { useEffect, useState } from "react";

export default function EscapeRoomPage() {
  useEffect(() => {
    document.body.setAttribute("data-route", "/escapeRoom");
    return () => document.body.removeAttribute("data-route");
  }, []);

  const [minutes, setMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] =
    useState<"success" | "fail" | null>(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const [stage1Input, setStage1Input] = useState("");
  const [stage2Input, setStage2Input] = useState("");
  const [stage3Input, setStage3Input] = useState("");
  const [stage4Input, setStage4Input] = useState("");
  const [error, setError] = useState("");

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && timerRunning) endGame("fail");
  }, [timeLeft, timerRunning]);

  const startGame = () => {
    const total = minutes * 60;
    if (total <= 0) return;
    setTimeLeft(total);
    setTimerRunning(true);
    setGameStarted(true);
    setGameEnded(false);
    setGameResult(null);
    setCurrentStage(0);
    setInventory([]);
  };

  const endGame = (result: "success" | "fail") => {
    setTimerRunning(false);
    setGameEnded(true);
    setGameResult(result);
    setActiveStage(null);
  };

  const resetGame = () => {
    setTimerRunning(false);
    setGameStarted(false);
    setGameEnded(false);
    setGameResult(null);
    setCurrentStage(0);
    setInventory([]);
    setActiveStage(null);
    setTimeLeft(0);
    setStage1Input("");
    setStage2Input("");
    setStage3Input("");
    setStage4Input("");
    setError("");
    setShowHint(false);
  };

  const unlockNextStage = () => {
    const next = currentStage + 1;
    setShowHint(false);
    setCurrentStage(next);
    setInventory((prev) => [...prev, `Item ${next}`]);
    if (next === 4) endGame("success");
  };

  // ANSWERS
  const checkStage1 = () => {
    if (
      stage1Input.trim() ===
      `function add(a, b) {
  return a + b;
}`
    ) {
      setActiveStage(null);
      unlockNextStage();
      setError("");
    } else setError("❌ Code formatting is incorrect.");
  };

  const checkStage2 = () => {
    if (
      stage2Input.trim() ===
      `for (let i = 0; i <= 10; i++) {
  console.log(i);
}`
    ) {
      setActiveStage(null);
      unlockNextStage();
      setError("");
    } else setError("❌ Loop still incorrect.");
  };

  const checkStage3 = () => {
    if (
      stage3Input.trim() ===
      `let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}`
    ) {
      setActiveStage(null);
      unlockNextStage();
      setError("");
    } else setError("❌ Array sum logic incorrect.");
  };

  const checkStage4 = () => {
    if (
      stage4Input.trim() ===
      `function escape() {
  return "You escaped!";
}`
    ) {
      setActiveStage(null);
      unlockNextStage();
      setError("");
    } else setError("❌ Final function is incorrect.");
  };

  const hotspot = (unlocked: boolean) => ({
    position: "absolute" as const,
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    cursor: unlocked ? "pointer" : "not-allowed",
    boxShadow: unlocked
      ? "0 0 18px 6px rgba(46,204,113,0.9)"
      : "0 0 6px 2px rgba(0,0,0,0.4)",
    border: unlocked ? "2px solid #2ecc71" : "2px solid #555",
    background: unlocked ? "rgba(46,204,113,0.25)" : "rgba(0,0,0,0.2)",
  });

  return (
    <div style={pageWrap}>
      <div style={darkOverlay} />

      <div style={uiLayer}>
        {/* HUD */}
        <div style={hud}>
          <div>
            <h2>Stage {currentStage} / 4</h2>
            <p>Inventory: {inventory.join(" | ") || "Empty"}</p>
          </div>

          {gameStarted && !gameEnded && (
            <div style={timerBox}>
              ⏳ {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {!gameStarted && (
          <div style={setupCard}>
            <h2>Set Escape Timer</h2>
            <input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(+e.target.value)}
              style={setupInput}
            />
            <button onClick={startGame} style={primaryBtn}>
              Start Escape
            </button>
          </div>
        )}

        {gameStarted && !gameEnded && (
          <>
            <div onClick={() => currentStage === 0 && setActiveStage(1)} style={{ ...hotspot(currentStage === 0), top: "55%", left: "18%" }} />
            <div onClick={() => currentStage === 1 && setActiveStage(2)} style={{ ...hotspot(currentStage === 1), top: "38%", left: "55%" }} />
            <div onClick={() => currentStage === 2 && setActiveStage(3)} style={{ ...hotspot(currentStage === 2), top: "75%", left: "30%" }} />
            <div onClick={() => currentStage === 3 && setActiveStage(4)} style={{ ...hotspot(currentStage === 3), top: "50%", left: "82%" }} />
          </>
        )}

        {activeStage === 1 && !gameEnded && (
          <Modal title="Stage 1 – Function Format" error={error}>
            <pre>{`function add(a,b){return a+b;}`}</pre>
            <textarea style={codeBox} value={stage1Input} onChange={(e) => setStage1Input(e.target.value)} />
            <button onClick={() => setShowHint(!showHint)} style={hintBtn}>💡 Hint</button>
            {showHint && <p>💡 Proper spacing and line breaks are required.</p>}
            <button onClick={checkStage1} style={primaryBtn}>Submit</button>
          </Modal>
        )}

        {activeStage === 2 && !gameEnded && (
          <Modal title="Stage 2 – Fix Loop" error={error}>
            <pre>{`for (let i = 0; i <= 10; i--) {}`}</pre>
            <textarea style={codeBox} value={stage2Input} onChange={(e) => setStage2Input(e.target.value)} />
            <button onClick={() => setShowHint(!showHint)} style={hintBtn}>💡 Hint</button>
            {showHint && <p>💡 The loop must INCREASE, not decrease.</p>}
            <button onClick={checkStage2} style={primaryBtn}>Submit</button>
          </Modal>
        )}

        {activeStage === 3 && !gameEnded && (
          <Modal title="Stage 3 – Sum Array" error={error}>
            <pre>{`let arr = [5,10,15];`}</pre>
            <textarea style={codeBox} value={stage3Input} onChange={(e) => setStage3Input(e.target.value)} />
            <button onClick={() => setShowHint(!showHint)} style={hintBtn}>💡 Hint</button>
            {showHint && <p>💡 Use a loop and add every value into a running total.</p>}
            <button onClick={checkStage3} style={primaryBtn}>Submit</button>
          </Modal>
        )}

        {activeStage === 4 && !gameEnded && (
          <Modal title="Stage 4 – Final Function" error={error}>
            <pre>{`Return "You escaped!"`}</pre>
            <textarea style={codeBox} value={stage4Input} onChange={(e) => setStage4Input(e.target.value)} />
            <button onClick={() => setShowHint(!showHint)} style={hintBtn}>💡 Hint</button>
            {showHint && <p>💡 The function must RETURN a string.</p>}
            <button onClick={checkStage4} style={primaryBtn}>Finish</button>
          </Modal>
        )}

        {gameEnded && (
          <Modal title={gameResult === "success" ? "✅ YOU ESCAPED!" : "❌ TIME’S UP"}>
            <button onClick={resetGame} style={primaryBtn}>Replay</button>
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({
  children,
  title,
  error,
}: {
  children: React.ReactNode;
  title: string;
  error?: string;
}) {
  return (
    <div style={overlay}>
      <div style={modalCard}>
        <h2>{title}</h2>
        {children}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      </div>
    </div>
  );
}

// STYLES
const pageWrap = {
  backgroundImage: "url('/EscapeRoom.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  width: "100vw",
  position: "relative",
};

const darkOverlay = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.25)",
};

const uiLayer = {
  position: "relative" as const,
  padding: "2rem",
  color: "white",
};

const hud = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const timerBox = {
  background: "rgba(0,0,0,0.55)",
  padding: "10px 18px",
  borderRadius: "14px",
  fontWeight: 700,
};

const setupCard = {
  background: "white",
  padding: "28px",
  borderRadius: "18px",
  width: "420px",
  color: "black",
};

const setupInput = {
  width: "100%",
  height: "42px",
  marginBottom: "16px",
  fontSize: "18px",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
};

const modalCard = {
  background: "white",
  color: "black",
  padding: "30px",
  borderRadius: "20px",
  width: "540px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "14px",
};

const codeBox = {
  width: "100%",
  height: "140px",
  fontSize: "15px",
  padding: "12px",
  fontFamily: "monospace",
};

const primaryBtn = {
  background: "#2ecc71",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const hintBtn = {
  background: "#f1c40f",
  color: "white",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};