import { FaHouseUser } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { SiWpexplorer } from "react-icons/si";
import { IoExit } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import Logo from "../Brand";
import LinkNavegacao from "../NavigationLink/LinkNavegacao";
import "./MenuNavegacao.css";
import { authService } from "../../service/authService";
import { useNavigate } from "react-router-dom";

export default function MenuNavegacao() {
    const usuario = authService.obterSessao();
    const navigate = useNavigate();
    
    return (
        <div className="menu">
            <Logo />

            <div className="links">
                <LinkNavegacao destino="/inicio" texto="Inicio" Icon={FaHouseUser} />
                <LinkNavegacao destino="/colecao" texto="ColeÃ§Ã£o" Icon={FaBookOpen} />
                <LinkNavegacao destino="/exploracao" texto="ExploraÃ§Ã£o" Icon={SiWpexplorer} />
                <LinkNavegacao destino="/configuracoes" texto="ConfiguraÃ§Ãµes" Icon={IoMdSettings} />
            </div>

            <div className="perfil">
                <img src={`${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}${usuario?.fotoPerfil || "/images/perfil-padrao.png"}`} alt="Foto do usuÃ¡rio" />

                <div className="perfil-info">
                    <p>{usuario?.nomeUsuario}</p>
                    <LinkNavegacao destino="/configuracoes" texto="Ver perfil >" />
                </div>
            </div>

            <div className="sair">
                <button className="link-navegacao" onClick={() => { authService.encerrarSessao(); navigate("/"); }}><IoExit /><span>Sair</span></button>
            </div>
        </div>
    );
}



