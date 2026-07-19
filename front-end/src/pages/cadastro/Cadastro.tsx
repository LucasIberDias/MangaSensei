import Input from "../../components/Inputs/Input";
import Button from "../../components/Buttons/Button";
import ButtonLink from "../../components/Buttons/ButtonNavegacao";
import Logo from "../../components/Logo";
import "./Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function criarUsuario() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tst_senha, setTst_senha] = useState("");

    const navigate = useNavigate();

    const criarConta = async () => {

        if (senha !== tst_senha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {

            const response = await fetch("http://localhost:8080/usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao criar conta");
            }

            alert("Conta criada com sucesso!");

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar usuário.");
        }
    };

    return (
        <div className="cadastro-page">
            <div className="cadastro-container">
                <Logo />

                <h2>Cadastre-se</h2>
                <p className="cadastro-subtitulo">
                    Crie uma conta e comece a gerenciar seus mangás e HQ's
                </p>

                <label>Usuário</label>
                <Input
                    tipo="user"
                    texto="Escolha um nome de usuário"
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
                    texto="Crie uma senha com mínimo de 8 dígitos"
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