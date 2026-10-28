import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import ButtonLink from "../../../components/Button/ButtonNavegacao";
import Logo from "../../../components/Brand";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../service/authService";
import { getErrorMessage } from "../../../service/api";

export default function Login() {
    const [emailUsuario, setEmail] = useState("");
    const [senhaUsuario, setSenha] = useState("");

    const navigate = useNavigate();

    const login = async () => {

        if (emailUsuario.trim().length === 0 || senhaUsuario.trim().length === 0) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const sessao = await authService.login(emailUsuario, senhaUsuario);
            authService.salvarSessao(sessao.usuario, sessao.token);
            navigate("/inicio");

        } catch (error) {
            alert(getErrorMessage(error, "Não foi possível realizar o login."));
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Logo />

                <h2>LOGIN</h2>

                <p className="login-subtitulo">
                    Faça login na sua conta e tenha uma coleção organizada!
                </p>

                <label>E-mail</label>
                <Input
                    tipo="email"
                    texto="Digite seu e-mail"
                    onChange={setEmail}
                />

                <label>Senha</label>
                <Input
                    tipo="password"
                    texto="Digite sua senha"
                    onChange={setSenha}
                />

                <div className="login-buttons">
                    <ButtonLink
                        destino="cadastro"
                        texto="CADASTRAR"
                        cor="secundaria"
                    />

                    <Button
                        tipo="button"
                        texto="ENTRAR"
                        cor="primaria"
                        onClick={login}
                    />
                </div>
            </div>
        </div>
    );
}



