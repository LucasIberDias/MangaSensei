import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import ButtonLink from "../../../components/Button/ButtonNavegacao";
import Logo from "../../../components/Brand";
import "./Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../service/authService";
import { getErrorMessage } from "../../../service/api";

export default function criarUsuario() {
    const [nomeUsuario, setNome] = useState("");
    const [emailUsuario, setEmail] = useState("");
    const [senhaUsuario, setSenha] = useState("");
    const [tst_senha, setTst_senha] = useState("");

    const navigate = useNavigate();

    const criarConta = async () => {

        if (senhaUsuario !== tst_senha) {
            alert("As senhas nÃ£o coincidem!");
            return;
        }

        try {

            await authService.cadastrar({ nomeUsuario, emailUsuario, senhaUsuario });

            alert("Conta criada com sucesso!");

            navigate("/");

        } catch (error) {
            alert(getErrorMessage(error, "Não foi possível cadastrar o usuário."));
        }
    };

    return (
        <div className="cadastro-page">
            <div className="cadastro-container">
                <Logo />

                <h2>Cadastre-se</h2>
                <p className="cadastro-subtitulo">
                    Crie uma conta e comece a gerenciar seus mangÃ¡s e HQ's
                </p>

                <label>UsuÃ¡rio</label>
                <Input
                    tipo="user"
                    texto="Escolha um nome de usuÃ¡rio"
                    onChange={setNome}
                />

                <label>E-mail</label>
                <Input
                    tipo="email"
                    texto="Digite seu e-mail"
                    onChange={setEmail}
                />

                <label>Senha</label>
                <Input
                    tipo="password"
                    texto="Crie uma senha com mÃ­nimo de 8 dÃ­gitos"
                    onChange={setSenha}
                />

                <label>Repetir Senha</label>
                <Input
                    tipo="password"
                    texto="Repita a senha anterior"
                    onChange={setTst_senha}
                />

                <div className="cadastro-buttons">
                    <ButtonLink
                        destino="/"
                        texto="VOLTAR"
                        cor="secundaria"
                    />

                    <Button
                        tipo="submit"
                        texto="CRIAR CONTA"
                        cor="primaria"
                        onClick={criarConta}
                    />
                </div>
            </div>
        </div>
    );
}





