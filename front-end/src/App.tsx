import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import Inicio from "./pages/telasPrincipal/telaInicial/TelaInicial"
import Exploracao  from "./pages/telasPrincipal/telaExploracao/TelaExploracao";
import Colecao from "./pages/telasPrincipal/telaColecao/TelaColecao";
import Configuracao from "./pages/telasPrincipal/telaConfiguracao/TelaConfiguracao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/colecao" element={<Colecao />} />
        <Route path="/exploracao" element={<Exploracao />} />
        <Route path="/configuracoes" element={<Configuracao />}/>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;