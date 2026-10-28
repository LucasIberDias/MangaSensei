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
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);
    const navigate = useNavigate();

    const salvarPerfil = async () => {
        if (!usuario) return;
        setSalvando(true);
        setErro("");
        try {
            const atualizado = await usuarioService.atualizar({
                nomeUsuario: nome,
                emailUsuario: email,
                ...(fotoPerfil ? { fotoPerfil } : {}),
            });
            authService.salvarUsuarioSessao(atualizado);
            setUsuario(atualizado);
            setFotoPerfil("");
            setEditando(false);
        } catch (error) {
            setErro(getErrorMessage(error, "Não foi possível atualizar o perfil."));
        } finally {
            setSalvando(false);
        }
    };

    const selecionarFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = event.target.files?.[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            setErro("Selecione um arquivo de imagem.");
            return;
        }
        if (arquivo.size > 1024 * 1024) {
            setErro("A imagem deve ter no máximo 1 MB.");
            return;
        }

        const leitor = new FileReader();
        leitor.onload = () => {
            if (typeof leitor.result === "string") {
                setFotoPerfil(leitor.result);
                setErro("");
            }
        };
        leitor.onerror = () => setErro("Não foi possível carregar a imagem selecionada.");
        leitor.readAsDataURL(arquivo);
    };

    const cancelarEdicao = () => {
        setEditando(false);
        setNome(usuario?.nomeUsuario ?? "");
        setEmail(usuario?.emailUsuario ?? "");
        setFotoPerfil("");
        setErro("");
    };

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>Configurações</h1>
                    <p>Personalize sua experiência no MangaSensei.</p>
                </div>
                <div className="grid-config">
                    <section className="card-config">
                        <div className="titulo-card"><FaUserCircle /><h2>Perfil</h2></div>
                        <div className="perfil-info">
                            <div className="foto-perfil">
                                {(fotoPerfil || usuario?.fotoPerfil) ? <img src={fotoPerfil || (usuario?.fotoPerfil?.startsWith("data:image/") ? usuario.fotoPerfil : `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}${usuario?.fotoPerfil}`)} alt="Foto de perfil" /> : <FaUserCircle size={90} />}
                                {editando && <>
                                    <label className="botao-foto" htmlFor="foto-perfil" role="button" tabIndex={0} onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            document.getElementById("foto-perfil")?.click();
                                        }
                                    }}>Alterar foto</label>
                                    <input id="foto-perfil" className="input-foto" type="file" accept="image/*" onChange={selecionarFoto} />
                                </>}
                            </div>
                            <div className="dados-conta">
                                <span>Nome de usuário</span>
                                {editando ? <input value={nome} onChange={(event) => setNome(event.target.value)} /> : <h3>{usuario?.nomeUsuario}</h3>}
                                <span>E-mail</span>
                                {editando ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /> : <p>{usuario?.emailUsuario}</p>}
                                {editando ? (
                                    <div className="botoes-sobre">
                                        <button onClick={cancelarEdicao} disabled={salvando}>Cancelar</button>
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
                            <div><h4>Sair da conta</h4><p>Encerre sua sessão neste dispositivo.</p></div><FiChevronRight />
                        </button>
                    </section>
                    <section className="card-config sobre">
                        <div className="titulo-card"><FaInfoCircle /><h2>Sobre o MangaSensei</h2></div>
                        <p><strong>Versão:</strong> 1.0.0</p>
                        <p>Desenvolvido com ❤️ para colecionadores de mangás.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}


