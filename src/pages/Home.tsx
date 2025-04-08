import { useEffect, useState, useRef } from "react";
import { SessionController } from "../controllers/SessionController";
import { StudySession } from "../models/SessionModel";

import Timer from "../components/Timer";
import SessionCard from "../components/SessionCard";
import ConfettiAnimation from "../components/ConfettiAnimation";
import { getRandomQuote } from "../utils/motivationalQuotes";

import sessionCompleteSound from "../assets/sounds/session_complete.mp3";

// Tipagem global do VANTA
declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [focusTime, setFocusTime] = useState(25);
  const [totalCycles, setTotalCycles] = useState(1);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [shouldStart, setShouldStart] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem("studyFlowMuted");
    return saved === "true";
  });

  const [userName] = useState(() => {
    return localStorage.getItem("studyFlowUserName") || "";
  });

  const vantaRef = useRef(null);
  const sessionCompleteAudio = new Audio(sessionCompleteSound);
  const sessionController = new SessionController();

  useEffect(() => {
    const stored = localStorage.getItem("studyFlowSessions");
    if (stored) {
      const parsed = JSON.parse(stored) as StudySession[];
      parsed.forEach((s) =>
        sessionController.createSession(s.title, s.focusTime, s.breakTime, s.totalCycles || 1)
      );
      setSessions(sessionController.getAllSessions());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studyFlowSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (window.VANTA) {
      const effect = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x13b83a,
        backgroundColor: 0x000000,
      });
      return () => {
        if (effect) effect.destroy();
      };
    }
  }, []);

  const handleCreateSession = () => {
    const newSession = sessionController.createSession(title, focusTime, 5, totalCycles);
    setSessions([...sessions, newSession]);
    setTitle("");
    setFocusTime(25);
    setTotalCycles(1);
  };

  const handleComplete = (id: string) => {
    sessionController.incrementCycle(id);
    setSessions([...sessionController.getAllSessions()]);
    setShowConfetti(true);
    setMotivationalMessage(getRandomQuote());
    setActiveSession(null);

    if (!isMuted) {
      sessionCompleteAudio.currentTime = 0;
      sessionCompleteAudio.play().catch(() => {});
    }
  };

  const handleDelete = (id: string) => {
    sessionController.deleteSession(id);
    setSessions([...sessionController.getAllSessions()]);
    if (activeSession?.id === id) setActiveSession(null);
  };

  const handleStartSession = (session: StudySession) => {
    setActiveSession(session);
    setShouldStart(true);
    setShowConfetti(false);
    setMotivationalMessage("");
  };

  return (
    <div ref={vantaRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <ConfettiAnimation />
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-2xl mx-auto p-4 bg-black/60 backdrop-blur-md rounded-xl shadow-xl mt-6">
          <button
            className="text-sm mb-4 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            onClick={() => {
              const newMute = !isMuted;
              setIsMuted(newMute);
              localStorage.setItem("studyFlowMuted", String(newMute));
            }}
          >
            {isMuted ? "🔇 Sons desativados" : "🔊 Sons ativados"}
          </button>

          <div className="mb-6 space-y-2">
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Título da sessão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={focusTime}
              onChange={(e) => setFocusTime(Number(e.target.value))}
              placeholder="Tempo de foco (min)"
              min={5}
              max={180}
            />
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={totalCycles}
              onChange={(e) => setTotalCycles(Number(e.target.value))}
              placeholder="Quantos ciclos (pomodoros)?"
              min={1}
              max={10}
            />
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={handleCreateSession}
            >
              Criar Sessão
            </button>
          </div>

          {activeSession && (
            <Timer
              focusTime={activeSession.focusTime}
              autoStart={shouldStart}
              isMuted={isMuted}
              sessionId={activeSession.id}
              onCycleComplete={() => handleComplete(activeSession.id)}
            />
          )}

          {motivationalMessage && (
            <p className="text-center text-green-400 font-semibold mt-4 text-lg">
              {userName ? `Parabéns, ${userName}! ` : ""}
              {motivationalMessage}
            </p>
          )}

          <div className="space-y-4 mt-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onStart={handleStartSession}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 z-10">
        © 2025 · Desenvolvido por{" "}
        <span className="text-[#13b83a] font-mono">adriolivdev &lt;/&gt;</span>
      </footer>
    </div>
  );
}
