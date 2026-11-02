import "./TelaRelatorio.css";

import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaChevronDown, FaChevronUp, FaFileCsv } from "react-icons/fa";

import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { relatorioService } from "../../../service/relatorioService";
import { getErrorMessage } from "../../../service/api";
import type { Relatorio, RelatorioManga } from "../../../types";

export default function TelaRelatorio() {
    const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    /*
     * UC19 - GERAR RELATÓRIO EM TELA
     */
    useEffect(() => {
        const carregarRelatorio = async () => {
            try {
                setRelatorio(await relatorioService.gerar());
            } catch (error) {
                setMensagemErro(getErrorMessage(error, "Não foi possível gerar o relatório."));
            } finally {
                setCarregando(false);
            }
        };

        carregarRelatorio();
    }, []);

    /*
     * UC20 - EXPORTAR COLEÇÃO PARA CSV
     */
    const exportarCsv = () => {
        if (!relatorio) return;

        // Crio o arquivo com o CSV e faço o navegador baixar ele
        const arquivo = new Blob([gerarCsv(relatorio.mangas)], { type: "text/csv;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(arquivo);
        link.download = "colecao-mangasensei.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="pagina">
            <MenuNavegacao />

            <main className="conteudo relatorio">

                {/* TOPO */}
                <div className="topo topoRelatorio">
                    <div>
                        <h1>Relatórios</h1>
                        <p>Um resumo completo de toda a sua coleção.</p>
                    </div>

                    {relatorio && (
                        <button type="button" className="botaoAdicionar botaoExportar" onClick={exportarCsv}>
                            <FaFileCsv /> Exportar CSV
                        </button>
                    )}
                </div>

                {mensagemErro && <p className="mensagemErro" role="alert">{mensagemErro}</p>}
                {carregando && <p className="avisoRelatorio">Gerando relatório...</p>}

                {relatorio && (
                    <>
                        {/* RESUMO DA COLEÇÃO */}
                        <section className="cartaoRelatorio">
                            <h2>Resumo da coleção</h2>

                            <div className="progressoRelatorio">
                                <div className="barraRelatorio"><div style={{ width: `${relatorio.progressoGeral}%` }} /></div>
                                <span>{relatorio.progressoGeral}% da coleção completa</span>
                            </div>

                            <div className="resumoRelatorio">
                                <ItemResumo titulo="Obras na coleção" valor={relatorio.totalObras} />
                                <ItemResumo titulo="Obras completas" valor={relatorio.obrasCompletas} />
                                <ItemResumo titulo="Em andamento" valor={relatorio.obrasEmAndamento} />
                                <ItemResumo titulo="Não iniciadas" valor={relatorio.obrasNaoIniciadas} />
                                <ItemResumo titulo="Volumes possuídos" valor={relatorio.volumesPossuidos} />
                                <ItemResumo titulo="Volumes faltando" valor={relatorio.volumesFaltando} />
                                <ItemResumo titulo="Volumes repetidos" valor={relatorio.volumesRepetidos} />
                                <ItemResumo titulo="Valor total" valor={formatarValor(relatorio.valorTotal)} />
                                <ItemResumo titulo="Valor médio por volume" valor={formatarValor(relatorio.valorMedioVolume)} />
                            </div>
                        </section>

                        {/* LISTA DE MANGÁS */}
                        <section className="cartaoRelatorio">
                            <h2>Meus mangás <span>({relatorio.mangas.length})</span></h2>

                            {relatorio.mangas.length === 0 ? (
                                <p className="avisoRelatorio">Sua coleção ainda está vazia. <Link to="/colecao">Adicione um mangá</Link>.</p>
                            ) : (
                                <div className="tabelaRolagem">
                                    <table className="tabelaRelatorio">
                                        <thead>
                                            <tr>
                                                <th>Mangá</th>
                                                <th>Demografia</th>
                                                <th>Editora</th>
                                                <th>Volumes</th>
                                                <th>Repetidos</th>
                                                <th>Valor investido</th>
                                                <th>Última compra</th>
                                                <th aria-label="Ver volumes" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {relatorio.mangas.map((manga) => <LinhaManga key={manga.idColecao} manga={manga} />)}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

/*
 * CARTÃO COM UM NÚMERO DO RESUMO
 */
function ItemResumo({ titulo, valor }: { titulo: string; valor: React.ReactNode }) {
    return (
        <div className="itemResumo">
            <span>{titulo}</span>
            <strong>{valor}</strong>
        </div>
    );
}

/*
 * LINHA DE UM MANGÁ, AO CLICAR NA SETA MOSTRA OS VOLUMES QUE A PESSOA POSSUI
 */
function LinhaManga({ manga }: { manga: RelatorioManga }) {
    const [aberto, setAberto] = useState(false);

    return (
        <Fragment>
            <tr className={aberto ? "linhaManga aberta" : "linhaManga"}>
                <td>
                    <Link to={`/colecao/gerenciamento/${manga.idColecao}`} className="mangaRelatorio">
                        {manga.capaManga
                            ? <img src={manga.capaManga} alt="" loading="lazy" />
                            : <span className="semCapaRelatorio"><FaBook /></span>}
                        <div>
                            <strong>{manga.tituloManga}</strong>
                            <span>{manga.autorManga}</span>
                        </div>
                    </Link>
                </td>
                <td>{manga.demografiaManga || "—"}</td>
                <td>{manga.editoraManga || "—"}</td>
                <td>
                    <div className="volumesRelatorio">
                        <span>{manga.volumesPossuidos} / {manga.quantidadeVolumes}</span>
                        <div className="barraRelatorio pequena"><div style={{ width: `${manga.porcentagem}%` }} /></div>
                        <small>{manga.volumesFaltando > 0 ? `faltam ${manga.volumesFaltando}` : "completa"}</small>
                    </div>
                </td>
                <td>{manga.volumesRepetidos}</td>
                <td>{formatarValor(manga.valorInvestido)}</td>
                <td>{formatarData(manga.ultimaCompra)}</td>
                <td>
                    <button
                        type="button"
                        className="botaoExpandir"
                        onClick={() => setAberto(!aberto)}
                        aria-expanded={aberto}
                        aria-label={aberto ? `Esconder volumes de ${manga.tituloManga}` : `Ver volumes de ${manga.tituloManga}`}
                    >
                        {aberto ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </td>
            </tr>

            {/* VOLUMES DO MANGÁ */}
            {aberto && (
                <tr className="linhaVolumes">
                    <td colSpan={8}>
                        {manga.volumes.length === 0 ? (
                            <p className="avisoRelatorio">Nenhum volume deste mangá na coleção ainda.</p>
                        ) : (
                            <table className="tabelaVolumes">
                                <thead>
                                    <tr>
                                        <th>Volume</th>
                                        <th>Condição</th>
                                        <th>Valor pago</th>
                                        <th>Data da compra</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manga.volumes.map((volume) => (
                                        <tr key={volume.numeroVolume}>
                                            <td>Vol. {volume.numeroVolume}</td>
                                            <td>{volume.estadoVolume ?? "—"}</td>
                                            <td>{volume.valorPago != null ? formatarValor(volume.valorPago) : "—"}</td>
                                            <td>{formatarData(volume.dataCompra)}</td>
                                            <td>{volume.quantidade ?? 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </td>
                </tr>
            )}
        </Fragment>
    );
}

/*
 * MONTA O CSV COM UMA LINHA PARA CADA VOLUME QUE A PESSOA POSSUI
 * Os mangás já vêm em ordem alfabética e os volumes em ordem de número, então o arquivo fica na ordem da coleção
 * Uso ";" para separar as colunas, assim o Excel em português abre o arquivo certinho
 */
function gerarCsv(mangas: RelatorioManga[]) {
    const cabecalho = ["Mangá", "Volume", "ISBN", "Condição", "Valor pago", "Data da compra", "Quantidade"];

    const linhas = mangas.flatMap((manga) => manga.volumes.map((volume) => [
        manga.tituloManga,
        volume.numeroVolume,
        volume.isbnVolume ?? "",
        volume.estadoVolume ?? "",
        volume.valorPago != null ? volume.valorPago.toFixed(2).replace(".", ",") : "",
        volume.dataCompra ? formatarData(volume.dataCompra) : "",
        volume.quantidade ?? 1,
    ]));

    // O BOM no começo do arquivo faz o Excel reconhecer os acentos
    const bom = String.fromCharCode(0xfeff);

    return bom + [cabecalho, ...linhas]
        .map((linha) => linha.map(celulaCsv).join(";"))
        .join("\r\n");
}

// Coloco o valor entre aspas, assim ";" ou aspas dentro do título não quebram as colunas
function celulaCsv(valor: string | number) {
    return `"${String(valor).replace(/"/g, '""')}"`;
}

// Formato o valor em reais, ex: R$ 1.384,00
function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Formato a data no padrão brasileiro, ex: 01/11/2026
function formatarData(data: string | null) {
    return data ? new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR") : "—";
}
