import { useState } from "react";
import "./TelaExploracao.css";
import { FaBarcode } from "react-icons/fa6";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";
import Button from "../../../components/Buttons/Button";
import CategoriaManga from "./../../../components/CategoriaManga/CategoriaManga";

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");

    const mangasTeste = [
        {
            id: 1,
            titulo: "One Piece",
            capa: "https://m.media-amazon.com/images/I/716EGgqzyOL._SY466_.jpg",
            quantidadeVolumes: 111,
        },
        {
            id: 2,
            titulo: "Blue Lock",
            capa: "https://m.media-amazon.com/images/I/41kczlYS5LL._SY445_SX342_ML2_.jpg",
            quantidadeVolumes: 34,
        },
        {
            id: 3,
            titulo: "Sense Life",
            capa: "https://m.media-amazon.com/images/I/715ylFmrROL._SY466_.jpg",
            quantidadeVolumes: 2,
        },
        {
            id: 5,
            titulo: "Atelier of Witch Hat",
            capa: "https://m.media-amazon.com/images/I/91oJ3MqHQQL._AC_UL320_.jpg",
            quantidadeVolumes: 13,
        },
        {
            id: 6,
            titulo: "Naruto",
            capa: "https://m.media-amazon.com/images/I/91xUwI2UEVL._AC_UL320_.jpg",
            quantidadeVolumes: 72,
        },
    ];

    return (
        <div className="exploracao-page">

            <MenuNavegacao />

            <div className="conteudo-exploracao">

                <div className="itens-superior">

                    <div className="cabecalho">

                        <div>
                            <h1>Exploração</h1>

                            <p>
                                Descubra novos mangás para aumentar sua coleção!
                            </p>
                        </div>

                        <div className="acoes-superior">

                            <Button
                                texto="Escanear ISBN"
                                cor="terciaria"
                                tipo="button"
                                Icon={FaBarcode}
                            />

                            <InputPesquisa
                                value={pesquisa}
                                onChange={setPesquisa}
                            />


                        </div>

                    </div>
                    <div className="mangas">
                        <CategoriaManga
                            titulo="Shounen"
                            mangas={mangasTeste}
                        />

                        <CategoriaManga
                            titulo="Seinen"
                            mangas={mangasTeste}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}