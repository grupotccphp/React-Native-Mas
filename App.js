import React, { useState } from "react";
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";
import Home from "./components/Home";

export default function App() {
  const [tela, setTela] = useState("login"); // login, cadastro, home

  const trocarTela = (nomeTela) => {
    setTela(nomeTela);
  };

  return (
    <>
      {tela === "login" && <Login trocarTela={trocarTela} />}
      {tela === "cadastro" && <Cadastro trocarTela={trocarTela} />}
      {tela === "home" && <Home sair={() => setTela("login")} />}
    </>
  );
}
