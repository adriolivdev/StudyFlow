import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-studyflow.jpg";

// Tipagem global pro VANTA funcionar
declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Welcome() {
  const [name, setName] = useState("");
  const [typedTitle, setTypedTitle] = useState("");
  const navigate = useNavigate();
  const fullTitle = "Bem-vindo ao Study Flow";

  // Efeito de digitação no título
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Vanta background
  useEffect(() => {
    const effect = window.VANTA.NET({
      el: "#vanta-bg",
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
  }, []);

  // Envio do nome com ENTER ou clique
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("studyFlowUserName", name.trim());
      navigate("/home");
    }
  };

  return (
    <div
      id="vanta-bg"
      className="h-screen w-full relative overflow-hidden text-white flex flex-col justify-center items-center"
    >
      <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-xl space-y-6 text-center z-10">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo Study Flow"
          className="w-24 mx-auto mb-2 rounded shadow"
        />

        {/* Título com efeito de digitação e neon */}
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="whitespace-pre text-white">
            {typedTitle.replace("Study Flow", "")}
          </span>
          <span className="text-[#13b83a] drop-shadow-neon">
            {typedTitle.includes("Study Flow") ? "Study Flow" : ""}
          </span>
          <span className="animate-pulse text-[#13b83a]">|</span>
        </h1>

        {/* Descrição do app */}
        <p className="text-gray-300 text-base leading-relaxed">
          O <span className="text-[#13b83a] font-semibold">Study Flow</span> é um aplicativo feito
          para te ajudar a estudar com foco e organização. Aqui você pode criar sessões de estudo
          usando a técnica Pomodoro, visualizar seu progresso e se manter motivado(a).
        </p>

        <p className="text-gray-400 text-sm italic">
          “Transforme disciplina em progresso – uma sessão por vez.”
        </p>

        {/* Formulário de entrada de nome */}
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <label className="text-sm block">Como você quer ser chamado(a)?</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#13b83a]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-[#13b83a] hover:bg-green-700 py-2 rounded text-lg font-semibold disabled:opacity-50"
          >
            Começar
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-400 z-10">
        © 2025 · Desenvolvido por{" "}
        <span className="text-[#13b83a] font-mono">adriolivdev &lt;/&gt;</span>
      </footer>
    </div>
  );
}
