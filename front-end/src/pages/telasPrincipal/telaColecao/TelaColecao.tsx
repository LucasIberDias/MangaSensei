import "./TelaColecao.css";

import { useEffect, useState } from "react";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";

const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

interface Manga {
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
}

interface Colecao {
    idColecao: number;
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
    volumesPossuidos: number;
    porcentagem: number;
}

export default function TelaColecao() {

    const [colecoes, setColecoes] = useState<Colecao[]>([]);

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [pesquisa, setPesquisa] = useState("");

    const [mangaPesquisado, setMangaPesquisado] =
        useState<Manga | null>(null);

    const [erro, setErro] = useState(false);

    const [carregando, setCarregando] = useState(false);

    const idUsuario = usuario?.idUsuario;


    /*
     * BUSCAR COLEÇÕES
     */
    const carregarColecoes = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/colecao?idUsuario=${idUsuario}`
            );

            if (!response.ok) {

                console.error("Erro ao carregar coleções");

                return;
            }

            const dados = await response.json();

            setColecoes(dados);

        } catch (error) {

            console.error(
                "Erro ao carregar coleções:",
                error
            );

        }

    };


    /*
     * CARREGA AS COLEÇÕES QUANDO A TELA ABRE
     */
    useEffect(() => {

        carregarColecoes();

    }, []);


    /*
     * PESQUISAR MANGÁ
     */
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

            console.error(
                "Erro ao pesquisar mangá:",
                error
            );

            setErro(true);

        }

    };


    /*
     * ADICIONAR MANGÁ À COLEÇÃO
     */
    const adicionarColecao = async () => {

        if (!mangaPesquisado) {
            return;
        }

        try {

            setCarregando(true);

            const response = await fetch(
                `http://localhost:8080/colecao?idManga=${mangaPesquisado.idManga}&idUsuario=${idUsuario}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {

                const mensagem =
                    await response.text();

                console.error(
                    "Erro ao criar coleção:",
                    mensagem
                );

                return;
            }

            /*
             * Fecha a janela
             */
            fecharAdicionar();

            /*
             * Busca novamente as coleções
             */
            carregarColecoes();

        } catch (error) {

            console.error(
                "Erro ao criar coleção:",
                error
            );

        } finally {

            setCarregando(false);

        }

    };


    /*
     * ABRIR JANELA
     */
    const abrirAdicionar = () => {

        setMostrarAdicionar(true);

        setPesquisa("");

        setMangaPesquisado(null);

        setErro(false);

    };


    /*
     * FECHAR JANELA
     */
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

                {/* TOPO */}

                <div className="topo">

                    <div>

                        <h1>Coleção</h1>

                        <p>
                            Gerencie todos os seus mangás.
                        </p>

                    </div>


                    <div className="acoes">

                        <button
                            className="botaoAdicionar"
                            onClick={abrirAdicionar}
                        >
                            +&nbsp; Adicionar mangá
                        </button>

                    </div>

                </div>


                {/* ÁREA DAS COLEÇÕES */}

                <div className="areaColecoes">

                    <div className="cabecalhoColecoes">

                        <h2>
                            Progresso das coleções
                        </h2>

                    </div>


                    <div className="listaColecoes">

                        {colecoes.map((colecao) => (

                            <div
                                className="cardColecao"
                                key={colecao.idColecao}
                            >

                                <img
                                    src={colecao.capaManga}
                                    alt={colecao.tituloManga}
                                    className="capaColecao"
                                />


                                <div className="informacoesColecao">

                                    <h3>
                                        {colecao.tituloManga}
                                    </h3>

                                    <p className="autorColecao">
                                        {colecao.autorManga}
                                    </p>


                                    <div className="progressoColecao">

                                        <span className="quantidadeVolumes">
                                            {colecao.volumesPossuidos}/
                                            {colecao.quantidadeVolumes} volumes
                                        </span>


                                        <div className="barraContainer">

                                            <div
                                                className="barraProgresso"
                                                style={{
                                                    width: `${colecao.porcentagem}%`
                                                }}
                                            />

                                        </div>


                                        <span
                                            className={
                                                colecao.porcentagem >= 100
                                                    ? "porcentagem completa"
                                                    : "porcentagem"
                                            }
                                        >
                                            {colecao.porcentagem >= 100
                                                ? "Completa!"
                                                : `${colecao.porcentagem}%`
                                            }
                                        </span>

                                    </div>


                                    <p className="demografiaColecao">
                                        {colecao.demografiaManga}
                                    </p>

                                </div>


                                <button className="menuColecao">
                                    ⋮
                                </button>

                            </div>

                        ))}

                    </div>


                    {colecoes.length === 0 && (

                        <div className="colecaoVazia">

                            <p>
                                Você ainda não possui nenhuma coleção.
                            </p>

                            <button
                                onClick={abrirAdicionar}
                            >
                                + Adicionar primeiro mangá
                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* MODAL DE ADICIONAR */}

            {mostrarAdicionar && (

                <div className="fundoModal">

                    <div className="modalAdicionar">

                        <button
                            className="fecharModal"
                            onClick={fecharAdicionar}
                        >
                            ×
                        </button>


                        <h2>
                            Adicionar mangá
                        </h2>


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


                            <button
                                onClick={pesquisarManga}
                            >
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
                                        Autor:{" "}
                                        {mangaPesquisado.autorManga}
                                    </p>

                                    <p>
                                        Editora:{" "}
                                        {mangaPesquisado.editoraManga}
                                    </p>

                                    <p>
                                        {mangaPesquisado.quantidadeVolumes}
                                        {" "}volumes
                                    </p>


                                    <button
                                        className="botaoAdicionarColecao"
                                        onClick={adicionarColecao}
                                        disabled={carregando}
                                    >
                                        {carregando
                                            ? "Adicionando..."
                                            : "Adicionar à coleção"
                                        }
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}