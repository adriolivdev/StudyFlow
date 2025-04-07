import logo from "../assets/logo-studyflow.jpg"; // Caminho da logo

/**
 * Cabeçalho da aplicação com logotipo e nome.
 */
export default function Header() {
  return (
    <header className="w-full bg-gray-950 px-4 py-4 shadow-md border-b border-gray-800">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logotipo */}
          <img src={logo} alt="Logo Study Flow" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"/>
          
          {/* Nome do app */}
          <h1 className="text-2xl font-bold text-green-400">Study Flow</h1>
        </div>

        {/* Futuro: perfil ou navegação */}
      </div>
    </header>
  );
}
