import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";

/**
 * Componente principal do aplicativo.
 * Define as rotas e renderiza o cabeçalho e conteúdo conforme a página.
 */
export default function App() {
  const userName = localStorage.getItem("studyFlowUserName");

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Router>
        {/* Cabeçalho visível em todas as rotas */}
        <Header />

        <main className="flex-1">
          <Routes>
            {/* Rota inicial redireciona para welcome */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />

            {/* Página de boas-vindas */}
            <Route path="/welcome" element={<Welcome />} />

            {/* Página home só acessível se o nome foi preenchido */}
            <Route
              path="/home"
              element={
                userName ? <Home /> : <Navigate to="/welcome" replace />
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
