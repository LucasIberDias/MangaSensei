import "./TelaInicial.css";
import "./../../config/style.css";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import { DashboardCard } from "../../../components/Cards/DashboardCard/DashboardCard";

import { FaBook } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { CiMoneyBill } from "react-icons/ci";
import { GrCapacity } from "react-icons/gr";



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
                        color="#83bb55"
                        value="158"
                        bottom="de 824 volumes."
                    />

                    <DashboardCard
                        title="Progresso geral"
                        icon={<GiBookshelf />}
                        color="#f0b97f"
                        value="52%"
                        progress={52}
                    />

                    <DashboardCard
                        title="Valor total"
                        icon={<CiMoneyBill />}
                        color="#b1528f"
                        value="R$ 1384,00"
                        bottom="em toda coleção"
                    />

                    <DashboardCard
                        title="Obras completas"
                        icon={<GrCapacity />}
                        color="#da1f1c"
                        value="10"
                        bottom="de 4 obras"
                    />

                </div>


                <div className="dashboardInferior">

                    <div className="colunaEsquerda">

                        <div className="areaEstado">
                            <h3>Estado da coleção</h3>
                        </div>

                        <div className="areaFaixa">
                            <h3>Faixa de investimento</h3>
                        </div>

                    </div>


                    <div className="colunaDireita">

                        <div className="areaUltimos">
                            <h3>Últimos adicionados</h3>
                        </div>

                        <div className="areaPrincipais">
                            <h3>Principais gêneros</h3>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}