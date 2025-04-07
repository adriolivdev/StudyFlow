import Confetti from "react-confetti";
import { useEffect, useState } from "react";

/**
 * Componente de animação de confete para celebrar conquistas.
 * Desaparece automaticamente após 4 segundos.
 */
export default function ConfettiAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return show ? (
    <Confetti width={window.innerWidth} height={window.innerHeight} />
  ) : null;
}
