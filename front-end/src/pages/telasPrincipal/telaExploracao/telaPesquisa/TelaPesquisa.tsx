import "./TelaPesquisa.css";
import "./../../../config/style.css";

import MenuNavegacao from "../../../../components/Menus/menuNavegacao/MenuNavegacao";

import { FaArrowLeft } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

export default function TelaPesquisa() {

    const location = useLocation();
    const navigate = useNavigate();

    const { mangaPesquisado, erro } = location.state || {};

    return (
        <div className="pagina">

            <MenuNavegacao />

            <div className="conteudo">

                <div className="topo">
                    <h1>Exploração</h1>
                    <p>
                        Descubra novos mangás para aumentar sua coleção!
                    </p>
                </div>

                {erro || !mangaPesquisado ? (

                    <div className="manga-nao-encontrado">
                        <h2>Mangá não encontrado</h2>
                        <p>
                            Não foi possível encontrar o mangá pesquisado.
                        </p>
                    </div>

                ) : (

                    <div className="manga-encontrado">
                        <div className="coluna-esquerda">

                            <button
                                className="voltar"
                                onClick={() => navigate("/exploracao")}
                            >
                                <FaArrowLeft />
                                <span>Voltar para a pesquisa</span>
                            </button>

                            <img
                                className="capa-manga"
                                src={mangaPesquisado.capaManga}
                                alt={mangaPesquisado.tituloManga}
                            />

                        </div>

                        <div className="coluna-central">

                            <h2>
                                {mangaPesquisado.tituloManga}
                            </h2>

                            <div className="informacoes">

                                <div className="informacao">
                                    <FaUser />

                                    <h3>Autor</h3>

                                    <span>
                                        {mangaPesquisado.autorManga}
                                    </span>
                                </div>


                                <div className="informacao">
                                    <FaBuilding />

                                    <h3>Editora</h3>

                                    <span>
                                        {mangaPesquisado.editoraManga}
                                    </span>
                                </div>


                                <div className="informacao">
                                    <FaUsers />

                                    <h3>Demografia</h3>

                                    <span>
                                        {mangaPesquisado.demografiaManga}
                                    </span>
                                </div>


                                <div className="informacao">
                                    <FaBook />

                                    <h3>Quantidade de volumes</h3>

                                    <span>
                                        {mangaPesquisado.quantidadeVolumes}
                                    </span>
                                </div>

                            </div>

                        </div>


                    </div>

                )}

            </div>

        </div>
    );
}