import { useEffect, useMemo, useState } from "react";
import { FaBook } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { CiMoneyBill } from "react-icons/ci";
import { GrCapacity } from "react-icons/gr";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { DashboardCard } from "../components/DashboardCard/DashboardCard";
import { authService } from "../../../service/authService";
import { colecaoService } from "../../../service/colecaoService";
import { getErrorMessage } from "../../../service/api";
import type { Colecao } from "../../../types";
import "./TelaInicial.css";

export default function TelaInicial() {
    const usuario = authService.obterSessao();
    const [colecoes, setColecoes] = useState<Colecao[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!usuario) return;
        colecaoService.listar(usuario.idUsuario)
            .then(setColecoes)
            .catch((error: unknown) => setErro(getErrorMessage(error, "Não foi possível carregar sua coleção.")));
    }, [usuario?.idUsuario]);

    const totais = useMemo(() => {
        const volumesPossuidos = colecoes.reduce((total, item) => total + item.volumesPossuidos, 0);
        const volumesTotais = colecoes.reduce((total, item) => total + item.quantidadeVolumes, 0);
        const obrasCompletas = colecoes.filter((item) => item.quantidadeVolumes > 0 && item.volumesPossuidos >= item.quantidadeVolumes).length;
        const obrasEmAndamento = colecoes.filter((item) => item.volumesPossuidos > 0 && item.volumesPossuidos < item.quantidadeVolumes).length;
        const obrasNaoIniciadas = colecoes.filter((item) => item.volumesPossuidos === 0).length;
        const progresso = volumesTotais ? Math.round(volumesPossuidos * 100 / volumesTotais) : 0;
        const demografias = colecoes.reduce<Record<string, number>>((resultado, item) => {
            const nome = item.demografiaManga || "Sem demografia";
            resultado[nome] = (resultado[nome] ?? 0) + 1;
            return resultado;
        }, {});
        return { volumesPossuidos, volumesTotais, obrasCompletas, obrasEmAndamento, obrasNaoIniciadas, progresso, demografias };
    }, [colecoes]);

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>Olá! {usuario?.nomeUsuario}</h1>
                    <p>Aqui está um resumo da sua coleção!</p>
                </div>
                {erro && <p role="alert">{erro}</p>}

                <div className="dashboard">
                    <DashboardCard title="Volumes possuídos" icon={<FaBook />} color="#83bb55" value={totais.volumesPossuidos} bottom={`de ${totais.volumesTotais} volumes`} />
                    <DashboardCard title="Progresso geral" icon={<GiBookshelf />} color="#f0b97f" value={`${totais.progresso}%`} progress={totais.progresso} />
                    <DashboardCard title="Valor total" icon={<CiMoneyBill />} color="#b1528f" value="—" bottom="Valor de compra indisponível" />
                    <DashboardCard title="Obras completas" icon={<GrCapacity />} color="#da1f1c" value={totais.obrasCompletas} bottom={`de ${colecoes.length} obras`} />
                </div>

                <div className="dashboardInferior">
                    <div className="colunaEsquerda">
                        <section className="areaEstado">
                            <h2>Estado da coleção</h2>
                            <p>Completas: <strong>{totais.obrasCompletas}</strong></p>
                            <p>Em andamento: <strong>{totais.obrasEmAndamento}</strong></p>
                            <p>Não iniciadas: <strong>{totais.obrasNaoIniciadas}</strong></p>
                        </section>
                        <section className="areaFaixa">
                            <h2>Faixa de investimento</h2>
                            <p>A API ainda não fornece os valores pagos pelos volumes.</p>
                        </section>
                    </div>
                    <div className="colunaDireita">
                        <section className="areaUltimos">
                            <h2>Últimos adicionados</h2>
                            {colecoes.length ? <ul>{colecoes.slice(0, 5).map((item) => <li key={item.idColecao}>{item.tituloManga}</li>)}</ul> : <p>Sua coleção ainda está vazia.</p>}
                        </section>
                        <section className="areaPrincipais">
                            <h2>Principais gêneros</h2>
                            {Object.keys(totais.demografias).length ? <ul>{Object.entries(totais.demografias).sort((a, b) => b[1] - a[1]).map(([nome, quantidade]) => <li key={nome}>{nome}: {quantidade}</li>)}</ul> : <p>Adicione mangás para ver suas demografias.</p>}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}