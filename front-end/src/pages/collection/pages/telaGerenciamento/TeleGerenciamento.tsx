import "./TelaGerenciamento.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaPlus, FaTrashAlt, FaRegQuestionCircle, FaRegCheckCircle, FaRegStar, FaCheckCircle, FaQuestionCircle, FaSyncAlt, FaBook } from "react-icons/fa";

import MenuNavegacao from "../../../../components/NavigationMenu/MenuNavegacao";
import FormularioVolume from "../../components/FormularioVolume/FormularioVolume";
import { colecaoService } from "../../../../service/colecaoService";
import { getErrorMessage } from "../../../../service/api";
import { EstadoVolume, type AdicionarVolume, type ColecaoDetalhe, type VolumeColecao } from "../../../../types";

const VOLUMES_POR_PAGINA = 16;

export default function TeleGerenciamento() {
    const { idColecao } = useParams();
    const navigate = useNavigate();

    const [colecao, setColecao] = useState<ColecaoDetalhe | null>(null);
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    const [pagina, setPagina] = useState(1);

    const [volumeSelecionado, setVolumeSelecionado] = useState<VolumeColecao | null>(null);

    const [formularioAberto, setFormularioAberto] = useState(false);

    const [estadoEditado, setEstadoEditado] = useState<EstadoVolume>(EstadoVolume.NOVO);
    const [statusEditado, setStatusEditado] = useState<"possuido" | "faltando">("faltando");
    const [valorEditado, setValorEditado] = useState("");
    const [dataEditada, setDataEditada] = useState("");

    const hoje = new Date().toLocaleDateString("sv-SE");

    /*
     * Sempre que trocar o volume selecionado, os campos de edição voltam para os valores dele
     */
    const [volumeAnterior, setVolumeAnterior] = useState<VolumeColecao | null>(null);
    if (volumeSelecionado !== volumeAnterior) {
        setVolumeAnterior(volumeSelecionado);
        setEstadoEditado(volumeSelecionado?.estadoVolume ?? EstadoVolume.NOVO);
        setStatusEditado(volumeSelecionado?.possuido ? "possuido" : "faltando");
        setValorEditado(volumeSelecionado?.valorPago != null ? String(volumeSelecionado.valorPago) : "");
        setDataEditada(volumeSelecionado?.dataCompra ?? "");
    }

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

    /*
     * UC12 - ADICIONAR VOLUME À COLEÇÃO
     */
    const adicionarVolume = async (dados: AdicionarVolume) => {
        if (!colecao) return;

        await colecaoService.adicionarVolume(colecao.idColecao, dados);

        const atualizada = await colecaoService.consultar(colecao.idColecao);
        setColecao(atualizada);
        setVolumeSelecionado(atualizada.volumes.find((volume) => volume.idVolumeManga === dados.idVolumeManga) ?? null);
        setFormularioAberto(false);
        setMensagemErro("");
    };

    /*
     * UC13 - REMOVER VOLUME DA COLEÇÃO
     */
    const removerVolume = async () => {
        if (!colecao || !volumeSelecionado?.idItem) return;
        if (!window.confirm(`Deseja remover o volume ${volumeSelecionado.numeroVolume} da coleção?`)) return;

        try {
            await colecaoService.removerVolume(colecao.idColecao, volumeSelecionado.idItem);

            // Recarrego a coleção para atualizar os volumes e as estatísticas
            const atualizada = await colecaoService.consultar(colecao.idColecao);
            setColecao(atualizada);
            setVolumeSelecionado(atualizada.volumes.find((volume) => volume.numeroVolume === volumeSelecionado.numeroVolume) ?? null);
            setMensagemErro("");
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível remover o volume."));
        }
    };

    /*
     * UC14 - REGISTRAR VOLUME REPETIDO
     */
    const registrarVolumeRepetido = async () => {
        if (!colecao || !volumeSelecionado?.idItem) return;
        if (!window.confirm(`Deseja registrar mais uma cópia do volume ${volumeSelecionado.numeroVolume}?`)) return;

        try {
            await colecaoService.registrarVolumeRepetido(colecao.idColecao, volumeSelecionado.idItem);

            // Recarrego a coleção para atualizar a quantidade do volume
            const atualizada = await colecaoService.consultar(colecao.idColecao);
            setColecao(atualizada);
            setVolumeSelecionado(atualizada.volumes.find((volume) => volume.numeroVolume === volumeSelecionado.numeroVolume) ?? null);
            setMensagemErro("");
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível registrar o volume repetido."));
        }
    };

    /*
     * UC15 - ATUALIZAR VOLUME
     */
    const atualizarVolume = async () => {
        if (!colecao || !volumeSelecionado) return;

        const novoPossuido = statusEditado === "possuido";

        // Se o status mudou para faltando, o volume é removido da coleção (UC13)
        if (volumeSelecionado.possuido && !novoPossuido) {
            await removerVolume();
            return;
        }

        // Monto as informações do volume, campos vazios vão como null
        const dados = {
            estadoVolume: estadoEditado,
            valorPago: valorEditado === "" ? null : Number(valorEditado),
            dataCompra: dataEditada || null,
        };

        try {
            if (!volumeSelecionado.possuido && novoPossuido) {
                // Se o status mudou para possuído, o volume é adicionado à coleção com as informações preenchidas (UC12)
                if (volumeSelecionado.idVolumeManga == null) return;

                await colecaoService.adicionarVolume(colecao.idColecao, {
                    idVolumeManga: volumeSelecionado.idVolumeManga,
                    ...dados,
                });
            } else if (volumeSelecionado.idItem) {
                // Se o status continua possuído, atualizo a condição, o valor pago e a data da compra
                await colecaoService.atualizarVolume(colecao.idColecao, volumeSelecionado.idItem, dados);
            }

            // Recarrego a coleção para atualizar os volumes e as estatísticas
            const atualizada = await colecaoService.consultar(colecao.idColecao);
            setColecao(atualizada);
            setVolumeSelecionado(atualizada.volumes.find((volume) => volume.numeroVolume === volumeSelecionado.numeroVolume) ?? null);
            setMensagemErro("");
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível atualizar o volume."));
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

    // Verifico se o usuario mudou algum dos campos, para liberar o botão de atualizar
    const alteracaoPendente = volumeSelecionado != null && (
        statusEditado !== (volumeSelecionado.possuido ? "possuido" : "faltando")
        || (statusEditado === "possuido" && (
            estadoEditado !== volumeSelecionado.estadoVolume
            || valorEditado !== (volumeSelecionado.valorPago != null ? String(volumeSelecionado.valorPago) : "")
            || dataEditada !== (volumeSelecionado.dataCompra ?? "")
        ))
    );

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
                                            <select
                                                value={statusEditado === "possuido" ? estadoEditado : ""}
                                                onChange={(e) => setEstadoEditado(e.target.value as EstadoVolume)}
                                                disabled={statusEditado === "faltando"}
                                            >
                                                {statusEditado === "faltando" && <option value="">—</option>}
                                                {Object.values(EstadoVolume).map((estado) => (
                                                    <option key={estado} value={estado}>{estado}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Status
                                            <select
                                                value={statusEditado}
                                                onChange={(e) => setStatusEditado(e.target.value as "possuido" | "faltando")}
                                                disabled={volumeSelecionado.idVolumeManga == null}
                                            >
                                                <option value="possuido">Possuído</option>
                                                <option value="faltando">Faltando</option>
                                            </select>
                                        </label>
                                        <label>
                                            Valor pago (R$)
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder={statusEditado === "faltando" ? "—" : "0,00"}
                                                value={statusEditado === "possuido" ? valorEditado : ""}
                                                onChange={(e) => setValorEditado(e.target.value)}
                                                disabled={statusEditado === "faltando"}
                                            />
                                        </label>
                                        <label>
                                            Data da compra
                                            <input
                                                type="date"
                                                max={hoje}
                                                value={statusEditado === "possuido" ? dataEditada : ""}
                                                onChange={(e) => setDataEditada(e.target.value)}
                                                disabled={statusEditado === "faltando"}
                                            />
                                        </label>
                                    </div>

                                    <dl className="detalhesVolume">
                                        <div><dt>ISBN</dt><dd>{volumeSelecionado.isbnVolume ?? "—"}</dd></div>
                                        <div><dt>Quantidade</dt><dd>{volumeSelecionado.quantidade ?? "—"}</dd></div>
                                    </dl>

                                    <div className="acoesVolume">
                                        {!volumeSelecionado.possuido && (
                                            <button type="button" className="botaoAcao" onClick={() => setFormularioAberto(true)}>
                                                <FaPlus /> Adicionar este Volume
                                            </button>
                                        )}
                                        {volumeSelecionado.possuido && (
                                            <button type="button" className="botaoAcao" onClick={removerVolume}>
                                                <FaTrashAlt /> Remover Volume
                                            </button>
                                        )}
                                        {volumeSelecionado.possuido && (
                                            <button type="button" className="botaoAcao" onClick={registrarVolumeRepetido}>
                                                <FaSyncAlt /> Registrar Volume Repetido
                                            </button>
                                        )}
                                        <button type="button" className="botaoAcao" onClick={atualizarVolume} disabled={!alteracaoPendente}>
                                            <FaSyncAlt /> Atualizar Volume
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

            {formularioAberto && volumeSelecionado && !volumeSelecionado.possuido && (
                <FormularioVolume
                    volume={volumeSelecionado}
                    tituloManga={colecao.tituloManga}
                    onSalvar={adicionarVolume}
                    onFechar={() => setFormularioAberto(false)}
                />
            )}
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
