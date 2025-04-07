import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

/**
 * Componente de confete em tela cheia para celebrações.
 * Ocupa toda a viewport com z-index alto e desaparece após 4 segundos.
 */
export default function ConfettiAnimation() {
  const [show, setShow] = useState(true);
  const { width, height } = useWindowSize(); // Pega o tamanho da janela da tela

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        gravity={0.3}
        recycle={false}
      />
    </div>
  );
}
