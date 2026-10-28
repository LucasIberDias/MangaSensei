import "./TelaColecao.css";

import { useEffect, useState } from "react";

import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { authService } from "../../../service/authService";
import { colecaoService } from "../../../service/colecaoService";
import CollectionCard from "../components/CollectionCard";
import { mangaService } from "../../../service/mangaService";
import { getErrorMessage } from "../../../service/api";
import type { Manga, Colecao } from "../../../types";



export default function TelaColecao() {

    const [colecoes, setColecoes] = useState<Colecao[]>([]);
    const usuario = authService.obterSessao();

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    const [pesquisa, setPesquisa] = useState("");

    const [mangaPesquisado, setMangaPesquisado] =
        useState<Manga | null>(null);

    const [erro, setErro] = useState(false);
    const [mensagemErro, setMensagemErro] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [colecaoRemovendo, setColecaoRemovendo] = useState<number | null>(null);

    const idUsuario = usuario?.idUsuario;

    const removerColecao = async (idColecao: number) => {
        if (!window.confirm("Remover esta obra da sua coleção?")) return;
        setColecaoRemovendo(idColecao);
        setMensagemErro("");
        try {
            await colecaoService.remover(idColecao);
            await carregarColecoes();
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível remover a coleção."));
        } finally {
            setColecaoRemovendo(null);
        }
    };


    /*
     * BUSCAR COLEÇÕES
     */
    const carregarColecoes = async () => {

        try {

            if (!idUsuario) return;
            setColecoes(await colecaoService.listar(idUsuario));
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível carregar as coleções."));
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
            setMensagemErro("");

            setMangaPesquisado(null);

            const manga = await mangaService.pesquisar(pesquisa);
            setMangaPesquisado(manga);

        } catch (error) {
            setErro(true);
            setMensagemErro(getErrorMessage(error, "Não foi possível encontrar o mangá."));

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

            if (!idUsuario) throw new Error("Faça login para adicionar à coleção.");
            await colecaoService.adicionar(mangaPesquisado.idManga, idUsuario);
            /*
             * Fecha a janela
             */
            fecharAdicionar();

            /*
             * Busca novamente as coleções
             */
            carregarColecoes();

        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível adicionar o mangá à coleção."));
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
        setMensagemErro("");

    };


    /*
     * FECHAR JANELA
     */
    const fecharAdicionar = () => {

        setMostrarAdicionar(false);

        setPesquisa("");

        setMangaPesquisado(null);

        setErro(false);
        setMensagemErro("");

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

                {mensagemErro && !mostrarAdicionar && <p className="mensagemErro" role="alert">{mensagemErro}</p>}


                {/* ÁREA DAS COLEÇÕES */}

                <div className="areaColecoes">

                    <div className="cabecalhoColecoes">

                        <h2>
                            Progresso das coleções
                        </h2>

                    </div>


                    <div className="listaColecoes">

                        {colecoes.map((colecao) => (
                            <CollectionCard key={colecao.idColecao} colecao={colecao} onRemove={removerColecao} removing={colecaoRemovendo === colecao.idColecao} />
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
                                {mensagemErro || "Não foi possível encontrar o mangá."}
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

