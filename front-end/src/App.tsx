import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/pages/Login";
import Cadastro from "./pages/auth/pages/Cadastro";
import Inicio from "./pages/dashboard/pages/TelaInicial";
import Exploracao from "./pages/manga/pages/TelaExploracao";
import TelaPesquisa from "./pages/manga/pages/TelaPesquisa";
import Colecao from "./pages/collection/pages/TelaColecao";
import Configuracao from "./pages/profile/pages/TelaConfiguracao";
import ProtectedRoute from "./app/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />

                <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />

                <Route path="/colecao" element={<ProtectedRoute><Colecao /></ProtectedRoute>} />

                <Route path="/exploracao" element={<ProtectedRoute><Exploracao /></ProtectedRoute>} />

                <Route path="/pesquisa" element={<ProtectedRoute><TelaPesquisa /></ProtectedRoute>} />

                <Route path="/configuracoes" element={<ProtectedRoute><Configuracao /></ProtectedRoute>} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;

