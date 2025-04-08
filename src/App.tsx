import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";

/**
 * Define as rotas do aplicativo e exibe ou oculta o Header conforme a rota.
 */
function AppRoutes() {
  const location = useLocation();
  const userName = localStorage.getItem("studyFlowUserName");

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Exibe o Header somente se não estiver na página de boas-vindas */}
      {location.pathname !== "/welcome" && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/home"
            element={
              userName ? <Home /> : <Navigate to="/welcome" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
