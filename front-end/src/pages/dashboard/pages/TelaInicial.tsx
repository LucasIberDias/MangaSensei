import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { GrCapacity } from "react-icons/gr";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import { DashboardCard } from "../components/DashboardCard/DashboardCard";
import { authService } from "../../../service/authService";
import { colecaoService } from "../../../service/colecaoService";
import { getErrorMessage } from "../../../service/api";
import type { Colecao } from "../../../service/types";
import "./TelaInicial.css";

export default function TelaInicial() {
    const usuario = authService.obterSessao();
    const [colecoes, setColecoes] = useState<Colecao[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!usuario) return;
        colecaoService.listar(usuario.idUsuario)
            .then(setColecoes)
            .catch((error: unknown) => setErro(getErrorMessage(error, "NÃ£o foi possÃ­vel carregar sua coleÃ§Ã£o.")));
    }, [usuario?.idUsuario]);

    const volumesPossuidos = colecoes.reduce((total, item) => total + item.volumesPossuidos, 0);
    const volumesTotais = colecoes.reduce((total, item) => total + item.quantidadeVolumes, 0);
    const progresso = volumesTotais ? Math.round(volumesPossuidos * 100 / volumesTotais) : 0;
    const obrasCompletas = colecoes.filter((item) => item.quantidadeVolumes > 0 && item.volumesPossuidos >= item.quantidadeVolumes).length;

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>OlÃ¡! {usuario?.nomeUsuario}</h1>
                    <p>Aqui estÃ¡ um resumo da sua coleÃ§Ã£o.</p>
                </div>
                {erro && <p role="alert">{erro}</p>}
                <div className="dashboard">
                    <DashboardCard title="Volumes possuÃ­dos" icon={<FaBook />} color="#83bb55" value={volumesPossuidos} bottom={`de ${volumesTotais} volumes`} />
                    <DashboardCard title="Progresso geral" icon={<GiBookshelf />} color="#f0b97f" value={`${progresso}%`} progress={progresso} />
                    <DashboardCard title="Obras completas" icon={<GrCapacity />} color="#da1f1c" value={obrasCompletas} bottom={`de ${colecoes.length} obras na coleÃ§Ã£o`} />
                </div>
                {colecoes.length > 0 && (
                    <section className="dashboardInferior">
                        <div className="areaUltimos">
                            <h2>Suas coleÃ§Ãµes</h2>
                            <ul>{colecoes.slice(0, 5).map((item) => <li key={item.idColecao}>{item.tituloManga}: {item.volumesPossuidos}/{item.quantidadeVolumes} volumes</li>)}</ul>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

