import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Cadastro({ trocarTela }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    senha: "",
    cep: "",
    logradouro: "",
    bairro: "",
    localidade: "",
    uf: "",
  });

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    if (campo === "cep" && valor.replace(/\D/g, "").length === 8) {
      buscarCEP(valor.replace(/\D/g, ""));
    }
  };

  const buscarCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await response.json();
      if (!dados.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          localidade: dados.localidade,
          uf: dados.uf,
        }));
      } else {
        Alert.alert("Erro", "CEP não encontrado");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível buscar o CEP");
    }
  };

  const cadastrar = async () => {
    if (!form.username || !form.email || !form.senha) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(form.email, form.senha);
      const user = userCredential.user;

      // Salva dados no Firestore
      await db.collection("usuarios").doc(user.uid).set({
        username: form.username,
        email: form.email,
        cep: form.cep,
        logradouro: form.logradouro,
        bairro: form.bairro,
        localidade: form.localidade,
        uf: form.uf,
      });

      Alert.alert("Sucesso", "Cadastro realizado!");
      trocarTela("login");
    } catch (err) {
      Alert.alert("Erro no cadastro", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput style={styles.input} placeholder="Nome de usuário" value={form.username} onChangeText={(t) => handleChange("username", t)} />
      <TextInput style={styles.input} placeholder="E-mail" value={form.email} onChangeText={(t) => handleChange("email", t)} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={form.senha} onChangeText={(t) => handleChange("senha", t)} />

      <TextInput style={styles.input} placeholder="CEP" value={form.cep} onChangeText={(t) => handleChange("cep", t)} maxLength={9} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Rua" value={form.logradouro} onChangeText={(t) => handleChange("logradouro", t)} />
      <TextInput style={styles.input} placeholder="Bairro" value={form.bairro} onChangeText={(t) => handleChange("bairro", t)} />
      <TextInput style={styles.input} placeholder="Cidade" value={form.localidade} onChangeText={(t) => handleChange("localidade", t)} />
      <TextInput style={styles.input} placeholder="UF" value={form.uf} onChangeText={(t) => handleChange("uf")} maxLength={2} />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 15, textAlign: "center" }}>
        Já tem conta? <Text style={{ color: "blue" }} onPress={() => trocarTela("login")}>Entrar</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#f0f0f0" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
