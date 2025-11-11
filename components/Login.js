import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";

export default function Login({ trocarTela }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Função entra dentro do componente
  const entrar = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      await auth.signInWithEmailAndPassword(email, senha);
      Alert.alert("Sucesso", "Login realizado!");
      trocarTela("home"); // Vai para a tela Home
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={entrar}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 15, textAlign: "center" }}>
        Não tem conta?{" "}
        <Text style={{ color: "blue" }} onPress={() => trocarTela("cadastro")}>
          Cadastre-se
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
