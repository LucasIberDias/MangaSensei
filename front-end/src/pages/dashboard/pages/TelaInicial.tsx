import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaBullseye, FaChartBar, FaMoneyBillWave } from "react-icons/fa";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { DashboardCard } from "../components/DashboardCard/DashboardCard";
import GraficoBarras from "../components/GraficoBarras/GraficoBarras";
import { authService } from "../../../service/authService";
import { dashboardService } from "../../../service/dashboardService";
import { getErrorMessage } from "../../../service/api";
import type { Dashboard } from "../../../types";
import "./TelaInicial.css";

export default function TelaInicial() {
    const usuario = authService.obterSessao();
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [erro, setErro] = useState("");

    /*
     * UC16 - APRESENTAR DASHBOARD
     */
    useEffect(() => {
        if (!usuario) return;
        dashboardService.apresentar()
            .then(setDashboard)
            .catch((error: unknown) => setErro(getErrorMessage(error, "Não foi possível carregar sua dashboard.")));
    }, [usuario?.idUsuario]);

    const faixasInvestimento = dashboard ? [
        { faixa: "R$ 0 - R$ 25", quantidade: dashboard.investimentoAte25 },
        { faixa: "R$ 25 - R$ 50", quantidade: dashboard.investimento25a50 },
        { faixa: "+ R$ 50", quantidade: dashboard.investimentoAcima50 },
    ] : [];

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>Bem vindo de volta, {usuario?.nomeUsuario}!</h1>
                    <p>Está na hora de gerenciar sua coleção!</p>
                </div>
                {erro && <p role="alert">{erro}</p>}

                {/* CARTÕES DE RESUMO */}
                <div className="dashboard">
                    <DashboardCard title="Mangás na coleção" icon={<FaBook />} color="#b07a52" value={dashboard?.volumesNaColecao ?? "—"} bottom="volumes" />
                    <DashboardCard title="Obras diferentes" icon={<FaChartBar />} color="#83bb55" value={dashboard?.obrasDiferentes ?? "—"} bottom="séries" />
                    <DashboardCard title="Valor total" icon={<FaMoneyBillWave />} color="#b1528f" value={dashboard ? formatarValor(dashboard.valorTotal) : "—"} bottom="em toda coleção" />
                    <DashboardCard title="Obras completas" icon={<FaBullseye />} color="#3b8fd6" value={dashboard?.obrasCompletas ?? "—"} bottom={`de ${dashboard?.obrasDiferentes ?? 0} séries`} />
                </div>

                <div className="dashboardInferior">
                    <div className="colunaEsquerda">

                        {/* ESTADO DA COLEÇÃO */}
                        <section className="areaEstado">
                            <h2>Estado da coleção</h2>
                            {dashboard?.volumesNaColecao
                                ? <GraficoBarras dados={dashboard.estadoColecao} />
                                : <p>Adicione volumes para ver o estado da sua coleção.</p>}
                        </section>

                        {/* FAIXA DE INVESTIMENTO */}
                        <section className="areaFaixa">
                            <h2>Faixa de investimento</h2>
                            <div className="faixasInvestimento">
                                {faixasInvestimento.map(({ faixa, quantidade }) => (
                                    <div key={faixa} className="faixaInvestimento">
                                        <span>{faixa}</span>
                                        <strong>{quantidade}</strong>
                                        <span>volumes.</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="colunaDireita">

                        {/* ÚLTIMOS ADICIONADOS */}
                        <section className="areaUltimos">
                            <h2>Últimos adicionados</h2>
                            {dashboard?.ultimosAdicionados.length ? (
                                <ul className="listaUltimos">
                                    {dashboard.ultimosAdicionados.map((item, i) => (
                                        <li key={`${item.idColecao}-${item.numeroVolume}-${i}`}>
                                            <Link to={`/colecao/gerenciamento/${item.idColecao}`} className="ultimoAdicionado">
                                                <div className="capaUltimo">
                                                    {item.capa ? <img src={item.capa} alt={item.tituloManga} loading="lazy" /> : <FaBook />}
                                                    <span className="volumeUltimo">Vol. {item.numeroVolume}</span>
                                                </div>
                                                <strong>{item.tituloManga}</strong>
                                                <span>{descreverData(item.dataAdicao)}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>Sua coleção ainda está vazia.</p>}
                        </section>

                        {/* PRINCIPAIS GÊNEROS */}
                        <section className="areaPrincipais">
                            <h2>Principais gêneros</h2>
                            {dashboard?.principaisDemografias.length
                                ? <GraficoBarras dados={dashboard.principaisDemografias} />
                                : <p>Adicione mangás para ver suas demografias.</p>}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Formato o valor em reais, ex: R$ 1.384,00
function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Mostro a data como Hoje, Ontem, Anteontem ou a data completa
function descreverData(data: string | null) {
    if (!data) return "—";

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dias = Math.round((hoje.getTime() - new Date(`${data}T00:00:00`).getTime()) / 86_400_000);

    if (dias <= 0) return "Hoje";
    if (dias === 1) return "Ontem";
    if (dias === 2) return "Anteontem";
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}
