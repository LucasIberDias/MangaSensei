import "./TelaExploracao.css";
import "./../../config/style.css";

import { useState } from "react";

import { FaBarcode } from "react-icons/fa6";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";
import Button from "../../../components/Buttons/Button";
import CategoriaManga from "./../../../components/CategoriaManga/CategoriaManga";

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");

    const pesquisarManga = async () => {

        if (pesquisa.trim() === "") {
            return;
        }

        const response = await fetch(
            `http://localhost:8080/manga?titulo=${encodeURIComponent(pesquisa)}`
        );

        const manga = await response.json();

        console.log(manga);
    };

    return (
        <div className="pagina">
            <MenuNavegacao />

            <div className="conteudo">
                <div className="topo">
                    <h1>Exploração</h1>
                    <p>Descubra novos mangás para aumentar sua coleção!</p>

                    <div className="acoes">
                        <InputPesquisa value={pesquisa} onChange={setPesquisa} onEnter={pesquisarManga}/>
                    </div>
                </div>
            </div>
        </div>
    );
}