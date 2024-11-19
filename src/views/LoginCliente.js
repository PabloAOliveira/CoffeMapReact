// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   TouchableOpacity,
//   ImageBackground,
//   ActivityIndicator,
// } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../config/firebase";
// import { useNavigation } from "@react-navigation/native";
// import { getDoc, doc } from "firebase/firestore";
// import { db } from "../config/firebase";
// import * as Location from "expo-location";

// const LoginCliente = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const navigation = useNavigation();

//   const loadLocation = async () => {
//     try {
//       setLocationLoading(true);
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Erro", "Permissão para acessar a localização foi negada");
//         setLocationLoading(false);
//         return;
//       }

//       const currentLocation = await Location.getCurrentPositionAsync({});
//       setLocationLoading(false);
//       return currentLocation;
//     } catch (error) {
//       setMessage(`Erro : ${error.message || "Tente novamente mais tarde."}`);
//       setLocationLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       const userDoc = await getDoc(doc(db, "usuarios", user.uid));

//       if (!userDoc.exists()) {
//         Alert.alert("Erro", "Usuário não encontrado!");
//         setLoading(false);
//         return;
//       }

//       const userData = userDoc.data();

//       if (userData.tipo !== "cliente") {
//         Alert.alert("Acesso Negado", "Esta área é exclusiva para clientes.");
//         await auth.signOut();
//         setLoading(false);
//       }

//       navigation.navigate("HomeMap");

//       const currentLocation = await loadLocation();
//       if (currentLocation) {
//         navigation.setParams({ location: currentLocation });
//       }

//       setLoading(false);
//     } catch (error) {
//       Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
//       setLoading(false);
//     }
//   };

//   const handleCadastro = () => {
//     navigation.navigate("CadastroCliente");
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/cadastro.png")}
//       style={styles.background}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.spacer} />
//         <View style={styles.authContainer}>
//           <Text style={styles.title}>Bem vindo!</Text>
//           <Text style={styles.subtitle}>
//             Faça o login para acessar a sua conta
//           </Text>

//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Email"
//             placeholderTextColor="#999"
//             autoCapitalize="none"
//             keyboardType="email-address"
//             autoComplete="email"
//           />

//           <TextInput
//             style={styles.input}
//             value={password}
//             onChangeText={setPassword}
//             placeholder="Senha"
//             placeholderTextColor="#999"
//             secureTextEntry
//             autoCapitalize="none"
//           />

//           <View style={styles.rememberContainer}>
//             <TouchableOpacity
//               style={styles.checkbox}
//               onPress={() => setRememberMe(!rememberMe)}
//             >
//               {rememberMe && <View style={styles.checked} />}
//             </TouchableOpacity>
//             <Text style={styles.rememberText}>Lembre de mim</Text>
//             <TouchableOpacity style={styles.forgotPassword}>
//               <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ActivityIndicator size="large" color="#7D5745" />
//           ) : (
//             <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//               <Text style={styles.loginButtonText}>Entrar</Text>
//             </TouchableOpacity>
//           )}

//           {locationLoading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#7D5745" />
//               <Text style={styles.loadingText}>Carregando localização...</Text>
//             </View>
//           )}

//           <Text style={styles.orText}>Ou continue com</Text>

//           <TouchableOpacity style={styles.googleButton}>
//             <Text style={styles.googleButtonText}>Google</Text>
//           </TouchableOpacity>

//           <View style={styles.bottomContainer}>
//             <Text style={styles.newHereText}>Novo por aqui? </Text>
//             <TouchableOpacity onPress={handleCadastro}>
//               <Text style={styles.cadastrarText}>Cadastrar agora</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   container: {
//     flexGrow: 1,
//     padding: 15,
//   },
//   spacer: {
//     height: "35%",
//   },
//   authContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     padding: 20,
//     borderRadius: 15,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#7D5745",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#7D5745",
//     marginBottom: 24,
//   },
//   input: {
//     height: 50,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   rememberContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: "#7D5745",
//     borderRadius: 4,
//     marginRight: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checked: {
//     width: 12,
//     height: 12,
//     backgroundColor: "#7D5745",
//     borderRadius: 2,
//   },
//   rememberText: {
//     color: "#7D5745",
//     flex: 1,
//   },
//   forgotText: {
//     color: "#7D5745",
//     textDecorationLine: "underline",
//   },
//   loginButton: {
//     backgroundColor: "#7D5745",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   loginButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   orText: {
//     color: "#7D5745",
//     textAlign: "center",
//     marginVertical: 16,
//   },
//   googleButton: {
//     backgroundColor: "#FFFFFF",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#7D5745",
//   },
//   googleButtonText: {
//     color: "#7D5745",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   bottomContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   newHereText: {
//     color: "#7D5745",
//   },
//   cadastrarText: {
//     color: "#7D5745",
//     fontWeight: "bold",
//   },
//   loadingContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#7D5745",
//   },
// });

// export default LoginCliente;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import * as Location from "expo-location";

const LoginCliente = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigation = useNavigation();

  const loadLocation = async () => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão para acessar a localização foi negada");
        setLocationLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocationLoading(false);
      return currentLocation;
    } catch (error) {
      Alert.alert(
        "Erro",
        `Erro ao carregar localização: ${
          error.message || "Tente novamente mais tarde."
        }`
      );
      setLocationLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (!userDoc.exists()) {
        console.log("User Data:", userData);
        Alert.alert("Erro", "Usuário não encontrado!");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (userData.tipo !== "cliente") {
        Alert.alert("Acesso Negado", "Esta área é exclusiva para clientes.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const currentLocation = await loadLocation();
      if (currentLocation) {
        navigation.setParams({ location: currentLocation });
      }

      navigation.navigate("HomeMap");
      setLoading(false);
    } catch (error) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
      setLoading(false);
    }
  };

  // Nova função para redefinição de senha
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        "Erro",
        "Por favor, insira seu email primeiro para redefinir a senha."
      );
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Redefinição de Senha",
        "Um link para redefinir sua senha foi enviado para o seu email."
      );
    } catch (error) {
      let errorMessage = "Erro ao enviar o link de redefinição de senha.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido. Verifique o endereço de email.";
          break;
        case "auth/user-not-found":
          errorMessage = "Não existe uma conta associada a este email.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Muitas tentativas. Por favor, tente novamente mais tarde.";
          break;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = () => {
    navigation.navigate("CadastroCliente");
  };

  return (
    <ImageBackground
      source={require("../../assets/cadastro.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.spacer} />
        <View style={styles.authContainer}>
          <Text style={styles.title}>Bem vindo!</Text>
          <Text style={styles.subtitle}>
            Faça o login para acessar a sua conta
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <View style={styles.checked} />}
            </TouchableOpacity>
            <Text style={styles.rememberText}>Lembre de mim</Text>
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#7D5745" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          )}

          {locationLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7D5745" />
              <Text style={styles.loadingText}>Carregando localização...</Text>
            </View>
          )}

          <Text style={styles.orText}>Ou continue com</Text>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
            <Text style={styles.newHereText}>Novo por aqui? </Text>
            <TouchableOpacity onPress={handleCadastro}>
              <Text style={styles.cadastrarText}>Cadastrar agora</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#7D5745",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7D5745",
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#7D5745",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: "#7D5745",
    borderRadius: 2,
  },
  rememberText: {
    color: "#7D5745",
    flex: 1,
  },
  forgotPassword: {
    // Opcional: pode adicionar estilos específicos para o link
  },
  forgotText: {
    color: "#7D5745",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#7D5745",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#7D5745",
    textAlign: "center",
    marginVertical: 16,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#7D5745",
  },
  googleButtonText: {
    color: "#7D5745",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  newHereText: {
    color: "#7D5745",
  },
  cadastrarText: {
    color: "#7D5745",
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#7D5745",
  },
});

export default LoginCliente;
