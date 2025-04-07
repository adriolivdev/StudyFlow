import Header from "./components/Header";
import Home from "./pages/Home";

/**
 * Componente principal do aplicativo.
 * Renderiza o cabeçalho e a página Home.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Home />
    </div>
  );
}
