import "./GraficoBarras.css";

import type { ItemGrafico } from "../../../../types";

const CORES_GRAFICO = ["#5c3825", "#c8a96a", "#f6d79e", "#f3e3c3", "#f0b97f"];

const LINHAS_GRADE = 4;

export default function GraficoBarras({ dados }: { dados: ItemGrafico[] }) {
    /*
     * ESCALA DO GRÁFICO
     * Arredondo o maior valor para cima, assim as linhas da grade ficam com números inteiros
     */
    const maiorValor = Math.max(0, ...dados.map((item) => item.quantidade));
    const passo = Math.max(1, Math.ceil(maiorValor / LINHAS_GRADE));
    const topo = passo * LINHAS_GRADE;
    const linhas = Array.from({ length: LINHAS_GRADE + 1 }, (_, i) => i * passo);

    const cor = (i: number) => CORES_GRAFICO[i % CORES_GRAFICO.length];

    return (
        <div className="graficoBarras">
            <ul className="legendaGrafico">
                {dados.map((item, i) => (
                    <li key={item.nome}>
                        <span style={{ backgroundColor: cor(i) }} />
                        {item.nome}
                    </li>
                ))}
            </ul>

            <div className="areaGrafico">
                {/* EIXO COM OS VALORES */}
                <div className="eixoGrafico">
                    {linhas.map((valor) => (
                        <span key={valor} style={{ bottom: `${(valor / topo) * 100}%` }}>{valor}</span>
                    ))}
                </div>

                {/* BARRAS COM AS LINHAS DA GRADE ATRÁS */}
                <div className="barrasGrafico">
                    {linhas.map((valor) => (
                        <div key={valor} className="linhaGrade" style={{ bottom: `${(valor / topo) * 100}%` }} />
                    ))}

                    {dados.map((item, i) => (
                        <div key={item.nome} className="colunaGrafico">
                            <div
                                className="barraGrafico"
                                style={{ height: `${(item.quantidade / topo) * 100}%`, backgroundColor: cor(i) }}
                                title={`${item.nome}: ${item.quantidade}`}
                            />
                        </div>
                    ))}
                </div>

                {/* NOMES EMBAIXO DE CADA BARRA */}
                <div className="nomesGrafico">
                    {dados.map((item) => <span key={item.nome}>{item.nome}</span>)}
                </div>
            </div>
        </div>
    );
}
