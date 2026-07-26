import "./TelaConfiguracao.css";
import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import { FaUserCircle, FaLock, FaInfoCircle, FaCamera } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

export default function TelaConfiguracao() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    return (
        <div className="page-configuracao">
            <MenuNavegacao />

            <div className="conteudo-config">
                <div className="topo-config">
                    <h1>Configurações</h1>
                    <p>Personalize sua experiência no MangaSensei.</p>
                </div>

                <div className="grid-config">

                    <div className="card-config">
                        <div className="titulo-card">
                            <FaUserCircle />
                            <h2>Perfil</h2>
                        </div>

                        <div className="perfil-info">

                            <div className="foto-perfil">
                                {usuario.imagem ? (
                                    <img src={usuario.imagem} alt="Perfil" />
                                ) : (
                                    <FaUserCircle size={90} />
                                )}

                                <button>
                                    <FaCamera />
                                    Alterar foto
                                </button>
                            </div>

                            <div className="dados-perfil">
                                <span>Nome de usuário</span>
                                <h3>{usuario.nome}</h3>

                                <span>E-mail</span>
                                <p>{usuario.email}</p>

                                <button className="btn-editar">
                                    Editar Perfil
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="card-config">
                        <div className="titulo-card">
                            <FaLock />
                            <h2>Conta</h2>
                        </div>

                        <div className="item-config">
                            <div>
                                <h4>Alterar senha</h4>
                                <p>Atualize sua senha de acesso.</p>
                            </div>

                            <FiChevronRight />
                        </div>

                        <div className="item-config excluir">
                            <div>
                                <h4>Excluir conta</h4>
                                <p>Essa ação é permanente.</p>
                            </div>

                            <FiChevronRight />
                        </div>
                    </div>

                    <div className="card-config sobre">
                        <div className="titulo-card">
                            <FaInfoCircle />
                            <h2>Sobre o MangaSensei</h2>
                        </div>

                        <p><strong>Versão:</strong> 1.0.0</p>

                        <p>
                            Desenvolvido com ❤️ para colecionadores de mangás.
                        </p>

                        <div className="botoes-sobre">
                            <button>Central de ajuda</button>
                            <button>Enviar feedback</button>
                            <button>Sobre o app</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}