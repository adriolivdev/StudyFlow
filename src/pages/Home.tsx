import { useEffect, useState, useRef } from "react";
import { SessionController } from "../controllers/SessionController";
import { StudySession } from "../models/SessionModel";

import Header from "../components/Header";
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

  // Carrega sessões salvas no início
  useEffect(() => {
    const stored = localStorage.getItem("studyFlowSessions");
    if (stored) {
      const parsed = JSON.parse(stored) as StudySession[];
      parsed.forEach((s) =>
        sessionController.createSession(s.title, s.focusTime, s.breakTime)
      );
      setSessions(sessionController.getAllSessions());
    }
  }, []);

  // Salva sessões sempre que forem alteradas
  useEffect(() => {
    localStorage.setItem("studyFlowSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Ativa fundo Vanta.js
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
    const newSession = sessionController.createSession(title, focusTime, 5);
    setSessions([...sessions, newSession]);
    setTitle("");
    setFocusTime(25);
  };

  const handleComplete = (id: string) => {
    sessionController.markAsCompleted(id);
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
    <div ref={vantaRef} className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1 w-full flex justify-center items-start p-4">
          <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6">
            <button
              className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => {
                const newMute = !isMuted;
                setIsMuted(newMute);
                localStorage.setItem("studyFlowMuted", String(newMute));
              }}
            >
              {isMuted ? "🔇 Sons desativados" : "🔊 Sons ativados"}
            </button>

            <div className="space-y-2">
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
              />
            )}

            {showConfetti && <ConfettiAnimation />}
            {motivationalMessage && (
              <p className="text-center text-green-400 font-semibold text-lg">
                {userName ? `Parabéns, ${userName}! ` : ""}
                {motivationalMessage}
              </p>
            )}

            <div className="space-y-4">
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
        </main>

        {/* Footer igual ao da Welcome */}
        <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400 z-10">
          © 2025 · Desenvolvido por <span className="text-[#13b83a] font-mono">adriolivdev &lt;/&gt;</span>
        </footer>
      </div>
    </div>
  );
}
