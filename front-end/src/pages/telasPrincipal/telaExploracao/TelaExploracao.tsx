import "./TelaExploracao.css";
import "./../../config/style.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");

    const navigate = useNavigate();

    const pesquisarManga = async () => {

        if (pesquisa.trim() === "") {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/manga?titulo=${encodeURIComponent(pesquisa)}`
            );

            if (!response.ok) {

                navigate("/pesquisa", {
                    state: {
                        mangaPesquisado: null,
                        erro: true
                    }
                });

                return;
            }

            const mangaPesquisado = await response.json();

            navigate("/pesquisa", {
                state: {
                    mangaPesquisado,
                    erro: false
                }
            });

        } catch (error) {

            navigate("/pesquisa", {
                state: {
                    mangaPesquisado: null,
                    erro: true
                }
            });
        }
    };

    return (
        <div className="pagina">

            <MenuNavegacao />

            <div className="conteudo">

                <div className="topo">

                    <h1>Exploração</h1>

                    <p>
                        Descubra novos mangás para aumentar sua coleção!
                    </p>

                    <div className="acoes">

                        <InputPesquisa
                            value={pesquisa}
                            onChange={setPesquisa}
                            onEnter={pesquisarManga}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}