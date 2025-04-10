import { useEffect, useState, useRef } from "react";
import { SessionController } from "../controllers/SessionController";
import { StudySession } from "../models/SessionModel";
import Timer from "../components/Timer";
import SessionCard from "../components/SessionCard";
import ConfettiAnimation from "../components/ConfettiAnimation";
import PerformanceChart from "../components/PerformanceChart";
import UnifiedChart from "../components/UnifiedChart";
import { getRandomQuote } from "../utils/motivationalQuotes";
import { getDay } from "date-fns";

import sessionCompleteSound from "../assets/sounds/session_complete.mp3";

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [focusTime, setFocusTime] = useState(25);
  const [totalCycles, setTotalCycles] = useState(1);
  const [category, setCategory] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [shouldStart, setShouldStart] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem("studyFlowMuted") === "true");
  const [userName] = useState(() => localStorage.getItem("studyFlowUserName") || "");

  const vantaRef = useRef(null);
  const sessionCompleteAudio = new Audio(sessionCompleteSound);
  const sessionController = new SessionController();

  const [showCharts, setShowCharts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("studyFlowSessions");
    if (stored) {
      const parsed = JSON.parse(stored) as StudySession[];
      parsed.forEach((s) =>
        sessionController.createSession(s.title, s.focusTime, s.breakTime, s.totalCycles || 1, s.category)
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
      return () => effect && effect.destroy();
    }
  }, []);

  const handleCreateSession = () => {
    const newSession = sessionController.createSession(title, focusTime, 5, totalCycles, category);
    setSessions([...sessions, newSession]);
    setTitle("");
    setFocusTime(25);
    setTotalCycles(1);
    setCategory("");
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

  const filteredSessions = sessions.filter((s) => {
    const dayMatch = selectedDays.length === 0 || selectedDays.includes(getDay(new Date(s.createdAt)));
    const categoryMatch = selectedCategory === "" || s.category === selectedCategory;
    return dayMatch && categoryMatch;
  });

  return (
    <div ref={vantaRef} className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <ConfettiAnimation />
        </div>
      )}

      <div className="relative z-10 flex-grow">
        <div className="max-w-2xl mx-auto p-4 bg-black/60 backdrop-blur-md rounded-xl shadow-xl mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">Nova Sessão</h2>
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
          </div>

          {/* Campos com labels agora */}
          <div className="space-y-3">
            <div>
              <label className="text-sm">📌 Título da Sessão</label>
              <input className="w-full p-2 rounded bg-gray-800 border border-gray-600" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">🏷️ Categoria</label>
              <input className="w-full p-2 rounded bg-gray-800 border border-gray-600" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">⏱️ Duração do Ciclo (min):</label>
              <input type="number" className="w-full p-2 rounded bg-gray-800 border border-gray-600" value={focusTime} onChange={(e) => setFocusTime(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">🔁 Ciclos Pomodoro:</label>
              <input type="number" className="w-full p-2 rounded bg-gray-800 border border-gray-600" value={totalCycles} onChange={(e) => setTotalCycles(Number(e.target.value))} />
            </div>
          </div>

          <button className="bg-green-600 hover:bg-green-700 w-full py-2 mt-4 rounded font-semibold tracking-wide" onClick={handleCreateSession}>
            🚀 Criar Sessão
          </button>

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
              {userName ? `Parabéns, ${userName}! ` : ""}{motivationalMessage}
            </p>
          )}

          <div className="space-y-4 mt-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onComplete={handleComplete} onDelete={handleDelete} onStart={handleStartSession} />
            ))}
          </div>

          {/* Botão sempre visível abaixo da lista de sessões */}
          {sessions.length > 0 && (
            <div className="mt-8 mb-4">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
              >
                {showCharts ? "🔽 Ocultar Estatísticas" : "📊 Ver Estatísticas"}
              </button>
            </div>
          )}

          {/* Gráficos + Filtros */}
          {showCharts && (
            <>
              <div className="bg-gray-800 p-4 rounded-lg space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-300">Filtrar por Categoria:</label>
                  <select className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Todas</option>
                    {[...new Set(sessions.map((s) => s.category))].map((cat, idx) => (
                      <option key={idx} value={cat}>{cat || "Sem Categoria"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-300">Filtrar por Dia da Semana:</label>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-white">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, i) => (
                      <label key={i} className="flex items-center gap-1">
                        <input type="checkbox" checked={selectedDays.includes(i)} onChange={() => toggleDay(i)} />
                        {dia}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <PerformanceChart sessions={filteredSessions} />
              <UnifiedChart sessions={filteredSessions} />
            </>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-400 z-10 py-6">
        © 2025 · Desenvolvido por <span className="text-[#13b83a] font-mono">adriolivdev &lt;/&gt;</span>
      </footer>
    </div>
  );
}
