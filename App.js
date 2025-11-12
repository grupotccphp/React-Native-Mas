import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

// IMPORTANTE: Substitua este IP pelo endereço IPv4 da sua máquina na rede local.
// Exemplo: 'http://192.168.1.10/pasta_do_projeto/api2.php'
const API_URL = "http://192.168.0.9/PRETCC/api2.php";

// Componente que busca e exibe as frases (a nova tela "Home")
function FrasesScreen({ sair }) {
  const [loading, setLoading] = useState(true);
  const [frases, setFrases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFrases = async () => {
      try {
        const response = await fetch(API_URL);
        // Se a resposta não for 'ok' (status 200-299), lança um erro
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API. Verifique a URL e o servidor.");
        }
        const data = await response.json();
        setFrases(data);
      } catch (e) {
        // Captura erros de rede (ex: IP errado, servidor offline) ou o erro lançado acima
        setError(e.message);
      } finally {
        // Garante que o loading seja desativado ao final, com sucesso ou erro
        setLoading(false);
      }
    };

    fetchFrases();
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez, quando o componente é montado.

  // Renderiza um indicador de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando frases...</Text>
      </View>
    );
  }

  // Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ocorreu um erro:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Renderiza um item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.fraseText}>"{item.frase}"</Text>
      <Text style={styles.autorText}>- {item.autor}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Frases Motivacionais</Text>
        <TouchableOpacity onPress={sair} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={frases} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{ paddingBottom: 20 }} />
    </SafeAreaView>
  );
}

export default function App() {
  // Controla qual tela está visível: 'login', 'cadastro' ou 'home'
  const [tela, setTela] = useState("login");

  const trocarTela = (nomeTela) => {
    setTela(nomeTela);
  };

  // Renderiza a tela correta com base no estado 'tela'
  return (
    <>
      {tela === "login" && <Login trocarTela={trocarTela} />}
      {tela === "cadastro" && <Cadastro trocarTela={trocarTela} />}
      {tela === "home" && <FrasesScreen sair={() => setTela("login")} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginVertical: 20 },
  header: { fontSize: 26, fontWeight: "bold", color: "#333" },
  itemContainer: { backgroundColor: "#fff", borderRadius: 8, padding: 20, marginVertical: 8, marginHorizontal: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  fraseText: { fontSize: 18, fontStyle: "italic", color: "#444" },
  autorText: { fontSize: 14, color: "#666", textAlign: "right", marginTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", textAlign: "center" },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#f44336", borderRadius: 5 },
  logoutButtonText: { color: "#fff", fontWeight: "bold" },
});
