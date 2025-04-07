import logo from "../assets/logo-studyflow.jpg"; // Caminho da logo

/**
 * Cabeçalho da aplicação com logotipo e nome estilizados
 * Segue o visual tech e responsivo do Study Flow
 */
export default function Header() {
  return (
    <header className="w-full bg-black/80 backdrop-blur-md px-4 py-4 shadow-md border-b border-gray-800 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logotipo e nome */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Study Flow"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded shadow"
          />

          <h1 className="text-2xl sm:text-3xl font-bold text-[#13b83a] drop-shadow-neon">
            Study Flow
          </h1>
        </div>

        {/* Espaço reservado para navegação futura */}
        <div />
      </div>
    </header>
  );
}
