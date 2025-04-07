import { useEffect, useState } from "react";
import { SessionController } from "../controllers/SessionController";
import { StudySession } from "../models/SessionModel";

import Header from "../components/Header";
import Timer from "../components/Timer";
import SessionCard from "../components/SessionCard";
import ConfettiAnimation from "../components/ConfettiAnimation";
import { getRandomQuote } from "../utils/motivationalQuotes";

import sessionCompleteSound from "../assets/sounds/session_complete.mp3";

/**
 * Página principal do app Study Flow.
 * Gerencia sessões de estudo com cronômetro, sons e feedback visual.
 */
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

  const sessionCompleteAudio = new Audio(sessionCompleteSound);
  const sessionController = new SessionController();

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

  useEffect(() => {
    localStorage.setItem("studyFlowSessions", JSON.stringify(sessions));
  }, [sessions]);

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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Cabeçalho fixo do app */}
      <Header />

      {/* Conteúdo centralizado */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Botão para ativar/desativar som */}
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

        {/* Criar nova sessão */}
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

          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            onClick={handleCreateSession}
          >
            Criar Sessão
          </button>
        </div>

        {/* Timer visível se houver sessão ativa */}
        {activeSession && (
          <Timer
            focusTime={activeSession.focusTime}
            autoStart={shouldStart}
            isMuted={isMuted}
          />
        )}

        {/* Confete e frase de motivação */}
        {showConfetti && <ConfettiAnimation />}
        {motivationalMessage && (
          <p className="text-center text-green-400 font-semibold mt-4 text-lg">
            {userName ? `Parabéns, ${userName}! ` : ""}{motivationalMessage}
          </p>
        )}

        {/* Lista de sessões */}
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
  );
}
