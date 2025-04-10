import { useEffect, useState, useRef } from "react";
import { SessionController } from "../controllers/SessionController";
import { StudySession } from "../models/SessionModel";

import Timer from "../components/Timer";
import SessionCard from "../components/SessionCard";
import ConfettiAnimation from "../components/ConfettiAnimation";
import { getRandomQuote } from "../utils/motivationalQuotes";

import sessionCompleteSound from "../assets/sounds/session_complete.mp3";

// Tipagem global do VANTA (animação de fundo)
declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Home() {
  // Estados para criação de nova sessão
  const [title, setTitle] = useState("");
  const [focusTime, setFocusTime] = useState(25);
  const [totalCycles, setTotalCycles] = useState(1);
  const [category, setCategory] = useState(""); // 🌟 Novo campo: Categoria

  // Lista de sessões criadas
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [shouldStart, setShouldStart] = useState(false);

  // Feedback visual e auditivo
  const [showConfetti, setShowConfetti] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem("studyFlowMuted");
    return saved === "true";
  });

  // Nome do usuário salvo
  const [userName] = useState(() => {
    return localStorage.getItem("studyFlowUserName") || "";
  });

  // Referência para fundo animado
  const vantaRef = useRef(null);
  const sessionCompleteAudio = new Audio(sessionCompleteSound);
  const sessionController = new SessionController();

  // Carrega sessões salvas ao iniciar
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

  // Salva sessões no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("studyFlowSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Inicializa animação do fundo com Vanta.js
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

  // Cria uma nova sessão com os dados do formulário
  const handleCreateSession = () => {
    const newSession = sessionController.createSession(title, focusTime, 5, totalCycles, category);
    setSessions([...sessions, newSession]);

    // Limpa os campos após criar
    setTitle("");
    setFocusTime(25);
    setTotalCycles(1);
    setCategory("");
  };

  // Quando uma sessão é concluída
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

  // Exclui uma sessão
  const handleDelete = (id: string) => {
    sessionController.deleteSession(id);
    setSessions([...sessionController.getAllSessions()]);
    if (activeSession?.id === id) setActiveSession(null);
  };

  // Inicia uma sessão
  const handleStartSession = (session: StudySession) => {
    setActiveSession(session);
    setShouldStart(true);
    setShowConfetti(false);
    setMotivationalMessage("");
  };

  return (
    <div ref={vantaRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Confetes quando sessão for concluída */}
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <ConfettiAnimation />
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-2xl mx-auto p-4 bg-black/60 backdrop-blur-md rounded-xl shadow-xl mt-6">
          {/* Botão sons ativados/desativados */}
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

          {/* Formulário de criação de sessão */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">📝 Título da sessão:</label>
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400"
                placeholder="Ex: Revisar lógica de programação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">📚 Categoria:</label>
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400"
                placeholder="Ex: Front-End, Banco de Dados, Leitura Técnica"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">⏱️ Duração de cada ciclo (minutos):</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400"
                value={focusTime}
                onChange={(e) => setFocusTime(Number(e.target.value))}
                placeholder="Ex: 25"
                min={5}
                max={180}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">🔁 Número de ciclos Pomodoro:</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400"
                value={totalCycles}
                onChange={(e) => setTotalCycles(Number(e.target.value))}
                placeholder="Ex: 4"
                min={1}
                max={10}
              />
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold tracking-wide transition-all"
              onClick={handleCreateSession}
            >
              🚀 Criar Sessão
            </button>
          </div>

          {/* Timer ativo durante a sessão */}
          {activeSession && (
            <Timer
              focusTime={activeSession.focusTime}
              autoStart={shouldStart}
              isMuted={isMuted}
              sessionId={activeSession.id}
              onCycleComplete={() => handleComplete(activeSession.id)}
            />
          )}

          {/* Mensagem motivacional após concluir */}
          {motivationalMessage && (
            <p className="text-center text-green-400 font-semibold mt-4 text-lg">
              {userName ? `Parabéns, ${userName}! ` : ""}
              {motivationalMessage}
            </p>
          )}

          {/* Lista de sessões criadas */}
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

      {/* Rodapé */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 z-10">
        © 2025 · Desenvolvido por{" "}
        <span className="text-[#13b83a] font-mono">adriolivdev &lt;/&gt;</span>
      </footer>
    </div>
  );
}
