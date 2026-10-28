import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaInfoCircle } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { authService } from "../../../service/authService";
import { usuarioService } from "../../../service/usuarioService";
import { getErrorMessage } from "../../../service/api";
import "./TelaConfiguracao.css";

export default function TelaConfiguracao() {
    const [usuario, setUsuario] = useState(authService.obterSessao());
    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState(usuario?.nomeUsuario ?? "");
    const [email, setEmail] = useState(usuario?.emailUsuario ?? "");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);
    const navigate = useNavigate();

    const salvarPerfil = async () => {
        if (!usuario) return;
        setSalvando(true);
        setErro("");
        try {
            const atualizado = await usuarioService.atualizar(usuario.idUsuario, { nomeUsuario: nome, emailUsuario: email });
            authService.salvarSessao(atualizado);
            setUsuario(atualizado);
            setEditando(false);
        } catch (error) {
            setErro(getErrorMessage(error, "NÃ£o foi possÃ­vel atualizar o perfil."));
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>ConfiguraÃ§Ãµes</h1>
                    <p>Personalize sua experiÃªncia no MangaSensei.</p>
                </div>
                <div className="grid-config">
                    <section className="card-config">
                        <div className="titulo-card"><FaUserCircle /><h2>Perfil</h2></div>
                        <div className="perfil-info">
                            <div className="foto-perfil">
                                {usuario?.fotoPerfil ? <img src={`${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}${usuario.fotoPerfil}`} alt="Foto de perfil" /> : <FaUserCircle size={90} />}
                            </div>
                            <div className="dados-perfil">
                                <span>Nome de usuÃ¡rio</span>
                                {editando ? <input value={nome} onChange={(event) => setNome(event.target.value)} /> : <h3>{usuario?.nomeUsuario}</h3>}
                                <span>E-mail</span>
                                {editando ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /> : <p>{usuario?.emailUsuario}</p>}
                                {editando ? (
                                    <div className="botoes-sobre">
                                        <button onClick={() => { setEditando(false); setNome(usuario?.nomeUsuario ?? ""); setEmail(usuario?.emailUsuario ?? ""); }}>Cancelar</button>
                                        <button onClick={salvarPerfil} disabled={salvando}>{salvando ? "Salvando..." : "Salvar perfil"}</button>
                                    </div>
                                ) : <button className="btn-editar" onClick={() => setEditando(true)}>Editar perfil</button>}
                            </div>
                        </div>
                        {erro && <p role="alert" className="mensagemErro">{erro}</p>}
                    </section>
                    <section className="card-config">
                        <div className="titulo-card"><FaLock /><h2>Conta</h2></div>
                        <button className="item-config" onClick={() => { authService.encerrarSessao(); navigate("/"); }}>
                            <div><h4>Sair da conta</h4><p>Encerre sua sessÃ£o neste dispositivo.</p></div><FiChevronRight />
                        </button>
                    </section>
                    <section className="card-config sobre">
                        <div className="titulo-card"><FaInfoCircle /><h2>Sobre o MangaSensei</h2></div>
                        <p><strong>VersÃ£o:</strong> 1.0.0</p>
                        <p>Desenvolvido com â¤ï¸ para colecionadores de mangÃ¡s.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}


