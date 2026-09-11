import Input from "../../components/Inputs/Input";
import Button from "../../components/Buttons/Button";
import ButtonLink from "../../components/Buttons/ButtonNavegacao";
import Logo from "../../components/Logo";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailUsuario,
                    senhaUsuario
                })
            });

            if (!response.ok) {
                throw new Error("Email ou senha inválidos.");
            }

            const usuario = await response.json();
            localStorage.setItem("usuario", JSON.stringify(usuario));
            console.log(usuario);

            alert("Login realizado com sucesso!");

            navigate("/inicio");

        } catch (error) {
            console.error(error);
            alert("Erro ao realizar login.");
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