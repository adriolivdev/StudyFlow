import { useEffect, useRef, useState } from "react";
import { formatTime, isTimeOver } from "../utils/pomodoroTimer";
import startBeep from "../assets/sounds/start_beep.mp3";

interface TimerProps {
  focusTime: number;              // Tempo de foco em minutos
  autoStart?: boolean;           // Inicia automaticamente se true
  isMuted?: boolean;             // Desativa som se true
  sessionId: string;             // ID da sessão atual
  onCycleComplete: (id: string) => void; // Função para informar ciclo concluído
}

/**
 * Componente Timer para o modo Pomodoro.
 * Executa o tempo de foco + pausa para cada ciclo definido na sessão.
 */
export default function Timer({ focusTime, autoStart, isMuted, sessionId, onCycleComplete }: TimerProps) {
  const breakTime = 5; // Tempo fixo de pausa entre os ciclos (em minutos)

  const [minutes, setMinutes] = useState(focusTime);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const startAudioRef = useRef<HTMLAudioElement>(null);

  /**
   * Inicia automaticamente o timer se autoStart for true
   */
  useEffect(() => {
    if (autoStart) {
      setIsRunning(true);
      if (!isMuted) {
        startAudioRef.current?.play().catch(() => {});
      }
    }
  }, [autoStart, isMuted]);

  /**
   * Lógica de contagem regressiva do cronômetro (foco e pausa)
   */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        if (!isTimeOver(minutes, seconds)) {
          if (seconds > 0) {
            setSeconds((prev) => prev - 1);
          } else if (minutes > 0) {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          // Se o tempo terminou:
          if (!isOnBreak) {
            // Vai para pausa
            setMinutes(breakTime);
            setSeconds(0);
            setIsOnBreak(true);
          } else {
            // Finalizou um ciclo completo (foco + pausa)
            setIsRunning(false);
            setIsOnBreak(false);
            onCycleComplete(sessionId); // ⏱️ Informa que o ciclo foi concluído
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isOnBreak, sessionId, onCycleComplete]);

  /**
   * Inicia ou pausa manualmente o timer
   */
  const toggleTimer = () => {
    const next = !isRunning;
    setIsRunning(next);
    if (next && !isMuted && !isOnBreak) {
      startAudioRef.current?.play().catch(() => {});
    }
  };

  /**
   * Reinicia o tempo da sessão
   */
  const resetTimer = () => {
    setIsRunning(false);
    setIsOnBreak(false);
    setMinutes(focusTime);
    setSeconds(0);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-6 text-center shadow-md max-w-sm mx-auto mt-6">
      {/* 🔊 Som de início */}
      <audio ref={startAudioRef} src={startBeep} preload="auto" />

      <h2 className="text-2xl font-bold mb-4">
        {isOnBreak ? "Pausa" : "Foco"}
      </h2>

      <div className="text-6xl font-mono text-green-400 mb-4">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          onClick={toggleTimer}
        >
          {isRunning ? "Pausar" : "Iniciar"}
        </button>

        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          onClick={resetTimer}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
