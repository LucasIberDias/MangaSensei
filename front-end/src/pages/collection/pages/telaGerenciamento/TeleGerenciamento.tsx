import "./TelaGerenciamento.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaPlus, FaTrashAlt, FaRegQuestionCircle, FaRegCheckCircle, FaRegStar, FaCheckCircle, FaQuestionCircle, FaSyncAlt, FaBook } from "react-icons/fa";

import MenuNavegacao from "../../../../components/NavigationMenu/MenuNavegacao";
import { colecaoService } from "../../../../service/colecaoService";
import { getErrorMessage } from "../../../../service/api";
import type { ColecaoDetalhe, VolumeColecao } from "../../../../types";

const VOLUMES_POR_PAGINA = 16;

export default function TeleGerenciamento() {
    const { idColecao } = useParams();
    const navigate = useNavigate();

    const [colecao, setColecao] = useState<ColecaoDetalhe | null>(null);
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    const [pagina, setPagina] = useState(1);

    const [volumeSelecionado, setVolumeSelecionado] = useState<VolumeColecao | null>(null);

    /*
     * UC11 - CONSULTAR COLEÇÃO
     */
    useEffect(() => {
        const carregarColecao = async () => {
            try {
                setCarregando(true);
                const dados = await colecaoService.consultar(Number(idColecao));
                setColecao(dados);
                setVolumeSelecionado(dados.volumes.find((volume) => volume.possuido) ?? dados.volumes[0] ?? null);
            } catch (error) {
                setMensagemErro(getErrorMessage(error, "Não foi possível carregar a coleção."));
            } finally {
                setCarregando(false);
            }
        };

        carregarColecao();
    }, [idColecao]);

    const condicaoMedia = useMemo(() => {
        const contagem = new Map<string, number>();
        colecao?.volumes.forEach((volume) => {
            if (volume.estadoVolume) contagem.set(volume.estadoVolume, (contagem.get(volume.estadoVolume) ?? 0) + 1);
        });
        let maisComum = "—";
        let maior = 0;
        contagem.forEach((quantidade, estado) => {
            if (quantidade > maior) {
                maior = quantidade;
                maisComum = estado;
            }
        });
        return maisComum;
    }, [colecao]);

    /*
     * PAGINAÇÃO DOS VOLUMES
     */
    const volumes = colecao?.volumes ?? [];
    const totalPaginas = Math.max(1, Math.ceil(volumes.length / VOLUMES_POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const inicio = (paginaAtual - 1) * VOLUMES_POR_PAGINA;
    const volumesPagina = volumes.slice(inicio, inicio + VOLUMES_POR_PAGINA);

    /*
     * UC10 - REMOVER COLEÇÃO
     */
    const removerColecao = async () => {
        if (!colecao || !window.confirm(`Deseja remover a coleção ${colecao.tituloManga}?`)) return;

        try {
            await colecaoService.remover(colecao.idColecao);
            navigate("/colecao");
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível remover a coleção."));
        }
    };

    if (carregando || !colecao) {
        return (
            <div className="pagina">
                <MenuNavegacao />
                <main className="conteudo gerenciamento">
                    <TopoGerenciamento />
                    <section className="cartaoGerenciamento">
                        <Link to="/colecao" className="voltarColecao"><FaArrowLeft /> Voltar para a coleção</Link>
                        {mensagemErro
                            ? <p className="mensagemErro" role="alert">{mensagemErro}</p>
                            : <p className="carregandoColecao">Carregando coleção...</p>}
                    </section>
                </main>
            </div>
        );
    }

    const volumesFaltando = colecao.quantidadeVolumes - colecao.volumesPossuidos;

    return (
        <div className="pagina">
            <MenuNavegacao />

            <main className="conteudo gerenciamento">

                <TopoGerenciamento />

                {mensagemErro && <p className="mensagemErro" role="alert">{mensagemErro}</p>}

                <div className="layoutGerenciamento">

                    <div className="colunaPrincipal">

                        {/* RESUMO DA COLEÇÃO */}
                        <section className="cartaoGerenciamento resumoColecao">
                            <Link to="/colecao" className="voltarColecao"><FaArrowLeft /> Voltar para a coleção</Link>

                            <div className="conteudoResumo">
                                <img src={colecao.capaManga} alt={colecao.tituloManga} className="capaResumo" />

                                <div className="infoResumo">
                                    <h2>{colecao.tituloManga}</h2>
                                    <p className="autorResumo">{colecao.autorManga}</p>
                                    <div className="tagsResumo">
                                        {colecao.demografiaManga && <span className="tag">{colecao.demografiaManga}</span>}
                                        {colecao.editoraManga && <span className="tag">{colecao.editoraManga}</span>}
                                    </div>
                                </div>
    
                                <ul className="estatisticasResumo">
                                    <li>
                                        <FaBookOpen />
                                        <div className="estatisticaTexto">
                                            <span>Volumes na coleção</span>
                                            <div className="barraResumo"><div style={{ width: `${colecao.porcentagem}%` }} /></div>
                                        </div>
                                        <strong>{colecao.volumesPossuidos} / {colecao.quantidadeVolumes}</strong>
                                    </li>
                                    <li><FaRegCheckCircle /><span className="estatisticaTexto">Volumes comprados</span><strong>{colecao.volumesPossuidos}</strong></li>
                                    <li><FaRegQuestionCircle /><span className="estatisticaTexto">Volumes faltando</span><strong>{volumesFaltando}</strong></li>
                                    <li><FaRegStar /><span className="estatisticaTexto">Condição média</span><strong>{condicaoMedia}</strong></li>
                                </ul>
                            </div>
                        </section>

                        <section className="cartaoGerenciamento areaVolumes">
                            <h2>Volumes</h2>

                            <div className="gradeVolumes">
                                {volumesPagina.map((volume) => (
                                    <button
                                        key={volume.numeroVolume}
                                        type="button"
                                        className={[
                                            "cardVolume",
                                            volume.possuido ? "possuido" : "faltando",
                                            volumeSelecionado?.numeroVolume === volume.numeroVolume ? "selecionado" : "",
                                        ].join(" ")}
                                        onClick={() => setVolumeSelecionado(volume)}
                                        aria-label={`Volume ${volume.numeroVolume} - ${volume.possuido ? "Possuído" : "Faltando"}`}
                                    >
                                        <span className="numeroVolume">{volume.numeroVolume}</span>
                                        {volume.capaVolume
                                            ? <img src={volume.capaVolume} alt="" loading="lazy" />
                                            : <span className="semCapa"><FaBook /></span>}
                                        <span className="statusVolume">
                                            {volume.possuido ? <><FaCheckCircle /> Possuído</> : <><FaQuestionCircle /> Faltando</>}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {colecao.volumes.length === 0 && <p className="semVolumes">Nenhum volume encontrado.</p>}

                            <div className="rodapeVolumes">
                                <span>
                                    {colecao.volumes.length > 0
                                        ? `Mostrando ${inicio + 1} - ${inicio + volumesPagina.length} de ${colecao.volumes.length} volumes`
                                        : "Mostrando 0 volumes"}
                                </span>

                                <div className="paginacao">
                                    <button type="button" onClick={() => setPagina(paginaAtual - 1)} disabled={paginaAtual === 1} aria-label="Página anterior">‹</button>
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                                        <button
                                            key={numero}
                                            type="button"
                                            className={numero === paginaAtual ? "ativa" : ""}
                                            onClick={() => setPagina(numero)}
                                        >
                                            {numero}
                                        </button>
                                    ))}
                                    <button type="button" onClick={() => setPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} aria-label="Próxima página">›</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="painelLateral">

                        <section className="cartaoGerenciamento acoesColecaoPainel">
                            <button type="button" className="botaoAcao" onClick={removerColecao}>
                                <FaTrashAlt /> Remover Coleção
                            </button>

                            <button type="button" className="botaoAcao" disabled title="Em breve">
                                <FaPlus /> Adicionar Volume
                            </button>
                        </section>

                        <section className="cartaoGerenciamento gerenciarVolume">
                            <h3><FaBookOpen /> Gerenciar Volume</h3>

                            {volumeSelecionado ? (
                                <>
                                    <div className="volumeSelecionado">
                                        {volumeSelecionado.capaVolume
                                            ? <img src={volumeSelecionado.capaVolume} alt="" className={volumeSelecionado.possuido ? "" : "cinza"} />
                                            : <span className="semCapa"><FaBook /></span>}
                                        <div>
                                            <strong>Volume {volumeSelecionado.numeroVolume}</strong>
                                            <p>{colecao.tituloManga}</p>
                                            <span className={volumeSelecionado.possuido ? "selo possuido" : "selo faltando"}>
                                                {volumeSelecionado.possuido ? <><FaCheckCircle /> Possuído</> : <><FaQuestionCircle /> Faltando</>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="camposVolume">
                                        <label>
                                            Condição
                                            <select value={volumeSelecionado.estadoVolume ?? ""} disabled>
                                                <option value="">{volumeSelecionado.estadoVolume ?? "—"}</option>
                                            </select>
                                        </label>
                                        <label>
                                            Status
                                            <select value={volumeSelecionado.possuido ? "possuido" : "faltando"} disabled>
                                                <option value="possuido">Possuído</option>
                                                <option value="faltando">Faltando</option>
                                            </select>
                                        </label>
                                    </div>

                                    <dl className="detalhesVolume">
                                        <div><dt>ISBN</dt><dd>{volumeSelecionado.isbnVolume ?? "—"}</dd></div>
                                        <div><dt>Valor pago</dt><dd>{volumeSelecionado.valorPago != null ? volumeSelecionado.valorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</dd></div>
                                        <div><dt>Data da compra</dt><dd>{volumeSelecionado.dataCompra ? new Date(`${volumeSelecionado.dataCompra}T00:00:00`).toLocaleDateString("pt-BR") : "—"}</dd></div>
                                    </dl>

                                    <div className="acoesVolume">
                                        <button type="button" className="botaoAcao" disabled title="Em breve">
                                            <FaTrashAlt /> Remover Volume <span className="codigoUC">UC13</span>
                                        </button>
                                        <button type="button" className="botaoAcao" disabled title="Em breve">
                                            <FaSyncAlt /> Registrar Volume Repetido <span className="codigoUC">UC14</span>
                                        </button>
                                        <button type="button" className="botaoAcao" disabled title="Em breve">
                                            <FaSyncAlt /> Atualizar Estado <span className="codigoUC">UC15</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="semVolumes">Selecione um volume.</p>
                            )}
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

function TopoGerenciamento() {
    return (
        <div className="topo">
            <div>
                <h1>Gerenciar coleção</h1>
                <p>Consulte e gerencie os volumes da sua coleção.</p>
            </div>
        </div>
    );
}
