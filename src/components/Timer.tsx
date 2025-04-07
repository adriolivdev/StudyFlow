import { useEffect, useRef, useState } from "react";
import { formatTime, isTimeOver } from "../utils/pomodoroTimer";

// 🔊 Som de início da sessão
import startBeep from "../assets/sounds/start_beep.mp3";

interface TimerProps {
  focusTime: number;
  autoStart?: boolean;
  isMuted?: boolean;
}

/**
 * Componente Timer com visual tecnológico.
 * Controla tempo de foco e pausa no modo Pomodoro.
 */
export default function Timer({ focusTime, autoStart, isMuted }: TimerProps) {
  const breakTime = 5;

  const [minutes, setMinutes] = useState(focusTime);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const startAudioRef = useRef<HTMLAudioElement>(null);

  // Início automático do timer
  useEffect(() => {
    if (autoStart) {
      setIsRunning(true);
      if (!isMuted) {
        startAudioRef.current?.play().catch(() => {});
      }
    }
  }, [autoStart, isMuted]);

  // Loop da contagem regressiva
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
          // Quando termina o tempo → alterna foco/pausa
          if (!isOnBreak) {
            setMinutes(breakTime);
            setSeconds(0);
            setIsOnBreak(true);
          } else {
            setIsRunning(false);
            setIsOnBreak(false);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isOnBreak]);

  // Alterna entre iniciar e pausar
  const toggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState && !isOnBreak && !isMuted) {
      startAudioRef.current?.play().catch(() => {});
    }
  };

  // Reinicia o tempo de foco
  const resetTimer = () => {
    setIsRunning(false);
    setIsOnBreak(false);
    setMinutes(focusTime);
    setSeconds(0);
  };

  return (
    <div className="bg-black/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center shadow-lg max-w-sm mx-auto mt-6">
      {/* Som de início */}
      <audio ref={startAudioRef} src={startBeep} preload="auto" />

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
        {isOnBreak ? "⏸️ Pausa" : "⏱️ Foco"}
      </h2>

      <div className="text-6xl font-mono text-[#13b83a] drop-shadow-neon mb-4">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="bg-[#13b83a] hover:bg-green-700 px-4 py-2 rounded font-semibold text-black transition"
          onClick={toggleTimer}
        >
          {isRunning ? "Pausar" : "Iniciar"}
        </button>

        <button
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition"
          onClick={resetTimer}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
