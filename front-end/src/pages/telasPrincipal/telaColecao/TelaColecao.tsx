import "./TelaColecao.css";

import { useState } from "react";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";

interface Manga {
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
}

export default function TelaColecao() {

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [pesquisa, setPesquisa] = useState("");

    const [mangaPesquisado, setMangaPesquisado] =
        useState<Manga | null>(null);

    const [erro, setErro] = useState(false);

    const pesquisarManga = async () => {

        if (pesquisa.trim() === "") {
            return;
        }

        try {

            setErro(false);
            setMangaPesquisado(null);

            const response = await fetch(
                `http://localhost:8080/manga?titulo=${encodeURIComponent(pesquisa)}`
            );

            if (!response.ok) {

                setErro(true);

                return;
            }

            const manga = await response.json();

            setMangaPesquisado(manga);

        } catch (error) {

            console.error("Erro ao pesquisar mangá:", error);

            setErro(true);
        }
    };

    const abrirAdicionar = () => {

        setMostrarAdicionar(true);

        setPesquisa("");
        setMangaPesquisado(null);
        setErro(false);
    };

    const fecharAdicionar = () => {

        setMostrarAdicionar(false);

        setPesquisa("");
        setMangaPesquisado(null);
        setErro(false);
    };

    return (

        <div className="pagina">

            <MenuNavegacao />

            <div className="conteudo">

                <div className="topo">

                    <div>

                        <h1>Coleção</h1>

                        <p>
                            Gerencie sua coleção de maneira inteligente!
                        </p>

                    </div>

                    <button
                        className="botaoAdicionar"
                        onClick={abrirAdicionar}
                    >
                        + Adicionar mangá
                    </button>

                </div>

            </div>


            {mostrarAdicionar && (

                <div className="fundoModal">

                    <div className="modalAdicionar">

                        <button
                            className="fecharModal"
                            onClick={fecharAdicionar}
                        >
                            ×
                        </button>


                        <h2>Adicionar mangá</h2>

                        <p>
                            Pesquise o mangá que deseja adicionar à sua coleção.
                        </p>


                        <div className="campoPesquisa">

                            <input
                                type="text"
                                value={pesquisa}
                                onChange={(event) =>
                                    setPesquisa(event.target.value)
                                }
                                onKeyDown={(event) => {

                                    if (event.key === "Enter") {
                                        pesquisarManga();
                                    }

                                }}
                                placeholder="Digite o nome do mangá..."
                            />

                            <button onClick={pesquisarManga}>
                                Pesquisar
                            </button>

                        </div>


                        {erro && (

                            <p className="mensagemErro">
                                Não foi possível encontrar o mangá.
                            </p>

                        )}


                        {mangaPesquisado && (

                            <div className="resultadoManga">

                                <img
                                    src={mangaPesquisado.capaManga}
                                    alt={mangaPesquisado.tituloManga}
                                    className="capaResultado"
                                />

                                <div className="informacoesManga">

                                    <h3>
                                        {mangaPesquisado.tituloManga}
                                    </h3>

                                    <p>
                                        Autor: {mangaPesquisado.autorManga}
                                    </p>

                                    <p>
                                        Editora: {mangaPesquisado.editoraManga}
                                    </p>

                                    <p>
                                        {mangaPesquisado.quantidadeVolumes} volumes
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}