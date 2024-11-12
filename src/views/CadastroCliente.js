import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const CadastroCliente = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validarCampos = () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return false;
    }

    if (!termsAccepted) {
      Alert.alert("Erro", "Você precisa aceitar os termos de uso");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return false;
    }

    const telefoneRegex =
      /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!telefoneRegex.test(telefone)) {
      Alert.alert("Erro", "Por favor, insira um telefone válido");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return false;
    }

    return true;
  };

  const handleCadastroCliente = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        email: email,
        tipo: "cliente",
        nome: nome,
        dataCadastro: new Date(),
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("LoginCliente");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha no cadastro: " + error.message);
    }
  };

  const formatarTelefone = (texto) => {
    const numeroLimpo = texto.replace(/\D/g, "");
    let numeroFormatado = numeroLimpo;

    if (numeroLimpo.length <= 11) {
      numeroFormatado = numeroLimpo
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }

    setTelefone(numeroFormatado);
  };

  return (
    <ImageBackground
      source={require("../../assets/cadastro.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.spacer} />
        <View style={styles.authContainer}>
          <Text style={styles.title}>Cadastre-se</Text>
          <Text style={styles.subtitle}>Crie sua nova conta</Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
            placeholderTextColor="#666"
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={formatarTelefone}
            placeholder="Telefone"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            maxLength={15}
          />

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
          />

          <View style={styles.termsContainer}>
            <Checkbox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              color={termsAccepted ? "#8B4513" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              Concordo com os <Text style={styles.linkText}>Termos de Uso</Text>{" "}
              e a <Text style={styles.linkText}>Política de Privacidade</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCadastroCliente}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Entre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    padding: 15,
  },
  spacer: {
    height: "35%",
  },
  authContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    color: "#8B4513",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    color: "#666",
    flex: 1,
  },
  linkText: {
    color: "#8B4513",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#8B4513",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
  },
});

export default CadastroCliente;
