import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Home({ sair }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = db.collection("usuarios").doc(user.uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          setUsername(docSnap.data().username);
        }
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await auth.signOut();
    sair(); // volta para login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {username}!</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent: "center", alignItems:"center", padding: 20 },
  title: { fontSize:24, marginBottom:20, fontWeight:"bold" },
  button: { backgroundColor:"#f44336", padding:15, borderRadius:5 },
  buttonText: { color:"#fff", fontWeight:"bold" },
});
