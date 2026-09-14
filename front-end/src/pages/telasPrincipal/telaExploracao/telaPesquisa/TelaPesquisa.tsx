import "./TelaPesquisa.css";
import "./../../../config/style.css";

import MenuNavegacao from "../../../../components/Menus/menuNavegacao/MenuNavegacao";


import { FaArrowLeft } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";


import { useLocation } from "react-router-dom";

export default function TelaPesquisa() {

    const location = useLocation();

    const { mangaPesquisado, erro } = location.state || {};

    return (
        <div className="pagina">
            <MenuNavegacao />
            <div className="conteudo">


                <div className="topo">

                    <h1>Exploração</h1>
                    <p>Descubra novos mangás para aumentar sua coleção!</p>

                </div>

                {erro || !mangaPesquisado ? (

                    <p>Mangá não encontrado.</p>

                ) : (
                    <div className="manga-encontrado">
                        <div className="coluna-esquerda">
                            <div className="voltar">
                                <div className="voltar">
                                <FaArrowLeft />
                                <h3>Voltar página</h3>
                                </div>

                                <img src={mangaPesquisado.capaManga} alt="" />
                            </div>
                        </div>

                        <div className="coluna-direita">
                            <h1>{mangaPesquisado.tituloManga}</h1>
                            <div className="informacoes">
                                <FaUser />
                                <h3>Autor:</h3>
                            </div>
                        </div>
                    </div>
                )}



            </div>

        </div>
    );
}