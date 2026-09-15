import "./TelaPesquisa.css";
import "./../../../config/style.css";

import MenuNavegacao from "../../../../components/Menus/menuNavegacao/MenuNavegacao";

import { FaArrowLeft } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";


interface Volume {
    idVolumeManga: number;
    capaVolume: string;
    isbnVolume: string;
}


export default function TelaPesquisa() {

    const location = useLocation();
    const navigate = useNavigate();

    const { mangaPesquisado, erro } = location.state || {};


    return (
        <div className="pagina">

            <MenuNavegacao />

            <div className="conteudo">

                <div className="topo">

                    <h1>
                        Exploração
                    </h1>

                    <p>
                        Descubra novos mangás para aumentar sua coleção!
                    </p>

                </div>


                {erro || !mangaPesquisado ? (

                    <div className="manga-nao-encontrado">

                        <h2>
                            Mangá não encontrado
                        </h2>

                        <p>
                            Não foi possível encontrar o mangá pesquisado.
                        </p>

                    </div>

                ) : (

                    <div className="manga-encontrado">

                        {/* BOTÃO VOLTAR */}

                        <button
                            className="voltar"
                            onClick={() => navigate("/exploracao")}
                        >
                            <FaArrowLeft />

                            <span>
                                Voltar para a pesquisa
                            </span>

                        </button>


                        {/* INFORMAÇÕES DO MANGÁ */}

                        <div className="informacoes-manga">


                            {/* CAPA */}

                            <div className="coluna-esquerda">

                                <img
                                    className="capa-manga"
                                    src={mangaPesquisado.capaManga}
                                    alt={mangaPesquisado.tituloManga}
                                />

                            </div>


                            {/* INFORMAÇÕES */}

                            <div className="coluna-central">

                                <h2>
                                    {mangaPesquisado.tituloManga}
                                </h2>


                                <div className="informacoes">


                                    {/* AUTOR */}

                                    <div className="informacao">

                                        <FaUser />

                                        <h3>
                                            Autor
                                        </h3>

                                        <span>
                                            {mangaPesquisado.autorManga}
                                        </span>

                                    </div>


                                    {/* EDITORA */}

                                    <div className="informacao">

                                        <FaBuilding />

                                        <h3>
                                            Editora
                                        </h3>

                                        <span>
                                            {mangaPesquisado.editoraManga}
                                        </span>

                                    </div>


                                    {/* DEMOGRAFIA */}

                                    <div className="informacao">

                                        <FaUsers />

                                        <h3>
                                            Demografia
                                        </h3>

                                        <span>
                                            {mangaPesquisado.demografiaManga}
                                        </span>

                                    </div>


                                    {/* QUANTIDADE DE VOLUMES */}

                                    <div className="informacao">

                                        <FaBook />

                                        <h3>
                                            Quantidade de volumes
                                        </h3>

                                        <span>
                                            {mangaPesquisado.quantidadeVolumes}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* SOBRE */}

                            <div className="coluna-sobre">

                                <h2>
                                    Sobre
                                </h2>

                                <p>
                                    {mangaPesquisado.descricaoManga}
                                </p>

                            </div>

                        </div>


                        {/* VOLUMES */}

                        <div className="volumes">

                            <div className="titulo-volumes">

                                <FaBook />

                                <h2>
                                    Volumes
                                </h2>

                                <span className="quantidade-volumes">
                                    {mangaPesquisado.quantidadeVolumes} volumes
                                </span>

                            </div>


                            <div className="lista-volumes">

                                {mangaPesquisado.volumes &&
                                    mangaPesquisado.volumes.map(
                                        (volume: Volume) => (

                                            <div
                                                className="volume"
                                                key={volume.idVolumeManga}
                                            >

                                                <img
                                                    src={volume.capaVolume}
                                                    alt="Capa do volume"
                                                />

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}