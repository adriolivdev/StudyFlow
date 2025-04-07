import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer"; // importa o footer

/**
 * Componente principal do aplicativo.
 * Renderiza o cabeçalho, conteúdo principal e o rodapé.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Home />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
