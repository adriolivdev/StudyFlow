import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";

/**
 * Componente principal do aplicativo.
 * Define as rotas e renderiza o cabeçalho e conteúdo conforme a página.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Router>
        {/* Cabeçalho fixo */}
        <Header />

        {/* Rotas principais */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
