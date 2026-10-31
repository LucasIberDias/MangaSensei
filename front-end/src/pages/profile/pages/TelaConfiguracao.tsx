import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaInfoCircle, FaKey, FaExclamationTriangle, FaSignOutAlt, FaCamera } from "react-icons/fa";
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

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [avisoSenha, setAvisoSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [textoExclusao, setTextoExclusao] = useState("");
    const [avisoExclusao, setAvisoExclusao] = useState("");
    const [deletando, setDeletando] = useState(false);
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

    const alterarSenha = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (novaSenha.length < 8) {
            setAvisoSenha("A nova senha deve possuir no mínimo 8 caracteres.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setAvisoSenha("A confirmação não corresponde à nova senha.");
            return;
        }
        setSalvandoSenha(true);
        setAvisoSenha("");
        try {
            await usuarioService.atualizarSenha(senhaAtual, novaSenha);
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
            setAvisoSenha("Senha atualizada com sucesso.");
        } catch (error) {
            setAvisoSenha(getErrorMessage(error, "Não foi possível atualizar a senha."));
        } finally {
            setSalvandoSenha(false);
        }
    };

    const cancelarExclusao = () => {
        setConfirmandoExclusao(false);
        setTextoExclusao("");
        setAvisoExclusao("");
    };

    const deletarConta = async () => {
        if (textoExclusao !== usuario?.nomeUsuario) return;
        setDeletando(true);
        setAvisoExclusao("");
        try {
            await usuarioService.deletarConta();
            authService.encerrarSessao();
            navigate("/", { replace: true });
        } catch (error) {
            setAvisoExclusao(getErrorMessage(error, "Não foi possível deletar a conta."));
            setDeletando(false);
        }
    };

    const urlFoto = fotoPerfil || (usuario?.fotoPerfil?.startsWith("data:image/")
        ? usuario.fotoPerfil
        : usuario?.fotoPerfil && `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}${usuario.fotoPerfil}`);

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo configuracoes">
                <div className="topo">
                    <h1>Configurações</h1>
                    <p>Personalize sua experiência no MangaSensei.</p>
                </div>

                <div className="grid-config">
                    <section className="card-config card-perfil">
                        <div className="titulo-card"><FaUserCircle /><h2>Perfil</h2></div>
                        <div className="perfil-info">
                            <div className="foto-perfil">
                                <div className="moldura-foto">
                                    {urlFoto ? <img src={urlFoto} alt="Foto de perfil" /> : <FaUserCircle className="foto-vazia" />}
                                </div>
                                {editando && <>
                                    <label className="botao-foto" htmlFor="foto-perfil" role="button" tabIndex={0} onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            document.getElementById("foto-perfil")?.click();
                                        }
                                    }}><FaCamera /> Alterar foto</label>
                                    <input id="foto-perfil" className="input-foto" type="file" accept="image/*" onChange={selecionarFoto} />
                                </>}
                            </div>
                            <div className="dados-conta">
                                <label className="campo">
                                    <span>Nome de usuário</span>
                                    {editando ? <input value={nome} onChange={(event) => setNome(event.target.value)} /> : <strong>{usuario?.nomeUsuario}</strong>}
                                </label>
                                <label className="campo">
                                    <span>E-mail</span>
                                    {editando ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /> : <strong>{usuario?.emailUsuario}</strong>}
                                </label>
                                {editando ? (
                                    <div className="botoes-acao">
                                        <button className="botao-secundario" onClick={cancelarEdicao} disabled={salvando}>Cancelar</button>
                                        <button className="botao-primario" onClick={salvarPerfil} disabled={salvando}>{salvando ? "Salvando..." : "Salvar perfil"}</button>
                                    </div>
                                ) : <button className="botao-primario" onClick={() => setEditando(true)}>Editar perfil</button>}
                            </div>
                        </div>
                        {erro && <p role="alert" className="mensagem mensagem-erro">{erro}</p>}
                    </section>

                    <section className="card-config">
                        <div className="titulo-card"><FaKey /><h2>Alterar senha</h2></div>
                        <form className="form-senha" onSubmit={alterarSenha}>
                            <label className="campo">
                                <span>Senha atual</span>
                                <input type="password" autoComplete="current-password" value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} required />
                            </label>
                            <label className="campo">
                                <span>Nova senha</span>
                                <input type="password" autoComplete="new-password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} required />
                            </label>
                            <label className="campo">
                                <span>Confirmar nova senha</span>
                                <input type="password" autoComplete="new-password" value={confirmarSenha} onChange={(event) => setConfirmarSenha(event.target.value)} required />
                            </label>
                            <button type="submit" className="botao-primario" disabled={salvandoSenha}>{salvandoSenha ? "Atualizando..." : "Atualizar senha"}</button>
                        </form>
                        {avisoSenha && <p role="status" className="mensagem">{avisoSenha}</p>}
                    </section>

                    <div className="coluna-config">
                        <section className="card-config">
                            <div className="titulo-card"><FaLock /><h2>Conta</h2></div>
                            <button className="item-config" onClick={() => { authService.encerrarSessao(); navigate("/"); }}>
                                <FaSignOutAlt className="icone-item" />
                                <div><h4>Sair da conta</h4><p>Encerre sua sessão neste dispositivo.</p></div>
                                <FiChevronRight />
                            </button>
                        </section>

                        <section className="card-config">
                            <div className="titulo-card"><FaInfoCircle /><h2>Sobre o MangaSensei</h2></div>
                            <p className="texto-sobre"><strong>Versão:</strong> 1.0.0</p>
                            <p className="texto-sobre">Desenvolvido com ❤️ para colecionadores de mangás.</p>
                        </section>
                    </div>

                    <section className="card-config card-perigo">
                        <div className="titulo-card"><FaExclamationTriangle /><h2>Deletar conta</h2></div>
                        <p className="texto-perigo">Ao deletar sua conta, todas as suas coleções e dados serão removidos permanentemente. Essa ação não pode ser desfeita.</p>
                        {confirmandoExclusao ? (
                            <div className="confirmacao-exclusao">
                                <label className="campo">
                                    <span>Digite <strong>{usuario?.nomeUsuario}</strong> para confirmar</span>
                                    <input value={textoExclusao} onChange={(event) => setTextoExclusao(event.target.value)} />
                                </label>
                                <div className="botoes-acao">
                                    <button className="botao-secundario" onClick={cancelarExclusao} disabled={deletando}>Cancelar</button>
                                    <button className="botao-perigo" disabled={deletando || textoExclusao !== usuario?.nomeUsuario} onClick={deletarConta}>{deletando ? "Deletando..." : "Deletar definitivamente"}</button>
                                </div>
                            </div>
                        ) : <button className="botao-perigo" onClick={() => setConfirmandoExclusao(true)}>Deletar minha conta</button>}
                        {avisoExclusao && <p role="alert" className="mensagem mensagem-erro">{avisoExclusao}</p>}
                    </section>
                </div>
            </main>
        </div>
    );
}
