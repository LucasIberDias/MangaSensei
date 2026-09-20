import "./TelaExploracao.css";
import "./../../config/style.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";

interface Manga {
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
}

interface MangasPorDemografia {
    [demografia: string]: Manga[];
}

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");

    const [mangasPorDemografia, setMangasPorDemografia] =
        useState<MangasPorDemografia>({});

    const [quantidadeDemografias, setQuantidadeDemografias] = useState(2);

    const navigate = useNavigate();

    useEffect(() => {

        const carregarDemografias = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/manga/demografia"
                );

                if (!response.ok) return;

                const dados = await response.json();

                setMangasPorDemografia(dados);

            } catch (error) {

                console.error("Erro ao carregar demografias:", error);

            }

        };

        carregarDemografias();

    }, []);

    useEffect(() => {

        const carregarMaisDemografias = () => {

            const alturaTotal =
                document.documentElement.scrollHeight;

            const posicaoAtual =
                window.innerHeight + window.scrollY;

            if (posicaoAtual >= alturaTotal - 300) {

                setQuantidadeDemografias((quantidadeAtual) => {

                    const total =
                        Object.keys(mangasPorDemografia).length;

                    if (quantidadeAtual >= total) {
                        return quantidadeAtual;
                    }

                    return quantidadeAtual + 2;

                });

            }

        };

        window.addEventListener(
            "scroll",
            carregarMaisDemografias
        );

        return () => {
            window.removeEventListener(
                "scroll",
                carregarMaisDemografias
            );
        };

    }, [mangasPorDemografia]);

    const pesquisarManga = async (titulo?: string) => {

        const tituloPesquisa = titulo ?? pesquisa;

        if (tituloPesquisa.trim() === "") return;

        try {

            const response = await fetch(
                `http://localhost:8080/manga?titulo=${encodeURIComponent(tituloPesquisa)}`
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

            console.error("Erro ao pesquisar mangá:", error);

            navigate("/pesquisa", {
                state: {
                    mangaPesquisado: null,
                    erro: true
                }
            });

        }

    };

    const abrirManga = (manga: Manga) => {
        pesquisarManga(manga.tituloManga);
    };

    const demografiasVisiveis =
        Object.entries(mangasPorDemografia)
            .slice(0, quantidadeDemografias);

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

                <div className="lista-demografias">

                    {demografiasVisiveis.map(
                        ([demografia, mangas]) => (

                            <section
                                className="secao-demografia"
                                key={demografia}
                            >

                                <div className="cabecalho-demografia">

                                    <h2>{demografia}</h2>

                                </div>

                                <div className="lista-mangas">

                                    {mangas.map((manga) => (

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

                                                <span className="volume-manga">
                                                    {manga.quantidadeVolumes} volumes
                                                </span>

                                            </div>

                                            <p className="titulo-manga">
                                                {manga.tituloManga}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                            </section>

                        )
                    )}

                </div>

            </div>

        </div>

    );
}