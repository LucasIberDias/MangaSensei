import "./TelaInicial.css";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import { DashboardCard } from "../../../components/Cards/DashboardCard/DashboardCard";

import { FaBook, FaBullseye, FaWallet, FaCalendarAlt } from "react-icons/fa";

export default function TelaInicial() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    return (
        <div className="pagina">
            <MenuNavegacao />
            <div className="conteudo">
                <div className="topo">
                    <h1>Olá! {usuario?.nome}</h1>
                    <p>Aqui está um resumo da sua coleção!</p>
                </div>

                <div className="dashboard">
                    <DashboardCard
                        title="Volumes possuídos"
                        icon={<FaBook />}
                        color="#4CAF50"
                        value="158"
                        bottom="de 824 volumes."
                    />

                    <DashboardCard
                        title="Progresso geral"
                        icon={<FaBullseye />}
                        color="#5B9BD5"
                        value="52%"
                        progress={52}
                    />

                    <DashboardCard
                        title="Valor total"
                        icon={<FaWallet />}
                        color="#9C6ADE"
                        value="R$ 1384,00"
                        bottom="em toda coleção"
                    />

                    <DashboardCard
                        title="Obras completas"
                        icon={<FaCalendarAlt />}
                        color="#E07A5F"
                        value="10"
                        bottom="de 4 obras"
                    />
                </div>
            </div>
        </div>
    );
}