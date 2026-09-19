import "./TelaExploracao.css";
import "./../../config/style.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";

interface VolumeManga {
    idVolumeManga: number;
    capaVolume: string;
    isbnVolume: string;
}

interface Manga {
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
    volumes?: VolumeManga[];
}

interface MangasPorDemografia {
    [demografia: string]: Manga[];
}

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");
    const [mangasPorDemografia, setMangasPorDemografia] =
        useState<MangasPorDemografia>({});

    const navigate = useNavigate();

    useEffect(() => {

        const carregarDemografias = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/manga/demografia"
                );

                if (!response.ok) {
                    return;
                }

                const dados = await response.json();

                setMangasPorDemografia(dados);

            } catch (error) {

                console.error("Erro ao carregar demografias:", error);

            }
        };

        carregarDemografias();

    }, []);

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

    const abrirManga = (manga: Manga) => {

        navigate("/pesquisa", {
            state: {
                mangaPesquisado: manga,
                erro: false
            }
        });

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

                        <button className="botao-isbn">
                            <span>▥</span>
                            Escanear ISBN
                        </button>

                        <InputPesquisa
                            value={pesquisa}
                            onChange={setPesquisa}
                            onEnter={pesquisarManga}
                        />

                    </div>

                </div>

                <div className="lista-demografias">

                    {Object.entries(mangasPorDemografia).map(
                        ([demografia, mangas]) => (

                            <section
                                className="secao-demografia"
                                key={demografia}
                            >

                                <div className="cabecalho-demografia">

                                    <h2>{demografia}</h2>

                                    <button className="botao-seta">
                                        &gt;
                                    </button>

                                </div>

                                <div className="lista-mangas">

                                    {mangas.map((manga) => {

                                        const volume =
                                            manga.volumes &&
                                            manga.volumes.length > 0
                                                ? manga.volumes[0]
                                                : null;

                                        return (
                                            <div
                                                className="card-manga"
                                                key={manga.idManga}
                                                onClick={() =>
                                                    abrirManga(manga)
                                                }
                                            >

                                                <div className="capa-container">

                                                    <img
                                                        src={manga.capaManga}
                                                        alt={manga.tituloManga}
                                                        className="capa-manga"
                                                    />

                                                    {volume && (
                                                        <span className="volume-manga">
                                                            Vol.{" "}
                                                            {
                                                                volume.idVolumeManga
                                                            }
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="titulo-manga">
                                                    {manga.tituloManga}
                                                </p>

                                            </div>
                                        );

                                    })}

                                </div>

                            </section>

                        )
                    )}

                </div>

            </div>

        </div>
    );
}