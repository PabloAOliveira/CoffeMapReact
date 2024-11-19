import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (!userDoc.exists()) {
        Alert.alert("Erro", "Usuário não encontrado!");
        return;
      }

      const userData = userDoc.data();

      if (userData.tipo !== "proprietario") {
        Alert.alert(
          "Acesso Negado",
          "Esta área é exclusiva para proprietários."
        );
        await auth.signOut();
        return;
      }

      navigation.navigate("ProfileScreen");
    } catch (error) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
    }
  };

  const handleCadastro = () => {
    navigation.navigate("CadastroScreen");
  };

  const handleEsqueceuSenha = () => {
    navigation.navigate("RecuperarSenha");
  };

  return (
    <ImageBackground
      source={require("../../assets/Login.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.whiteContainer}>
          <View style={styles.authContainer}>
            <Text style={styles.title}>Bem vindo!</Text>
            <Text style={styles.subtitle}>
              Faça o login para acessar sua conta
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleEsqueceuSenha}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.bottomContainer}>
              <Text style={styles.registerText}>Novo por aqui? </Text>
              <TouchableOpacity onPress={handleCadastro}>
                <Text style={styles.registerLink}>Cadastrar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  whiteContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    minHeight: "70%",
  },
  authContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A2B1C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4A2B1C",
  },
  loginButton: {
    backgroundColor: "#4A2B1C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#4A2B1C",
    fontWeight: "bold",
  },
});

export default LoginScreen;
