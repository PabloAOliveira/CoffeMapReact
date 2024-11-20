import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TipoUsuario = () => {
  const navigation = useNavigation();

  const handleUserTypeSelection = (userType) => {
    if (userType === "cliente") {
      navigation.navigate("LoginCliente");
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/ClienteProprietário.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Encontre o café perfeito perto de você</Text>
        <Text style={styles.subtitle}>Entrar como</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUserTypeSelection("cliente")}
          >
            <Text style={styles.buttonText}>Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUserTypeSelection("proprietario")}
          >
            <Text style={styles.buttonText}>Proprietário</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    
    width: "100%",
    gap: 16,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 140,
  },
  buttonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default TipoUsuario;
