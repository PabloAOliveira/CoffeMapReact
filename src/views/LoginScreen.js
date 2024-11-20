// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   TouchableOpacity,
//   ImageBackground,
// } from "react-native";
// import {
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import { auth } from "../config/firebase";
// import { useNavigation } from "@react-navigation/native";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../config/firebase";

// const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();

//   const handleLogin = async () => {
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
//         return;
//       }

//       const userData = userDoc.data();

//       if (userData.tipo !== "proprietario") {
//         Alert.alert(
//           "Acesso Negado",
//           "Esta área é exclusiva para proprietários."
//         );
//         await auth.signOut();
//         return;
//       }

//       navigation.navigate("ProfileScreen");
//     } catch (error) {
//       Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
//     }
//   };

//   const handleCadastro = () => {
//     navigation.navigate("CadastroScreen");
//   };

//   const handleEsqueceuSenha = async () => {
//     if (!email) {
//       Alert.alert(
//         "Email Necessário",
//         "Por favor, insira seu email no campo de email antes de redefinir a senha."
//       );
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       Alert.alert(
//         "Redefinição de Senha",
//         "Um link para redefinir sua senha foi enviado para o seu email."
//       );
//     } catch (error) {
//       let errorMessage = "Erro ao enviar email de redefinição de senha.";

//       switch (error.code) {
//         case "auth/invalid-email":
//           errorMessage = "Email inválido. Verifique o endereço de email.";
//           break;
//         case "auth/user-not-found":
//           errorMessage = "Nenhum usuário encontrado com este email.";
//           break;
//         case "auth/too-many-requests":
//           errorMessage =
//             "Muitas tentativas. Por favor, tente novamente mais tarde.";
//           break;
//       }

//       Alert.alert("Erro", errorMessage);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/Login.png")}
//       style={styles.background}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.whiteContainer}>
//           <View style={styles.authContainer}>
//             <Text style={styles.title}>Bem vindo!</Text>
//             <Text style={styles.subtitle}>
//               Faça o login para acessar sua conta
//             </Text>

//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Email"
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />

//             <TextInput
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//               placeholder="Senha"
//               secureTextEntry
//             />

//             <TouchableOpacity
//               style={styles.forgotPassword}
//               onPress={handleEsqueceuSenha}
//             >
//               <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//               <Text style={styles.loginButtonText}>Entrar</Text>
//             </TouchableOpacity>

//             <View style={styles.bottomContainer}>
//               <Text style={styles.registerText}>Novo por aqui? </Text>
//               <TouchableOpacity onPress={handleCadastro}>
//                 <Text style={styles.registerLink}>Cadastrar agora</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   container: {
//     flexGrow: 1,
//     justifyContent: "flex-end",
//   },
//   whiteContainer: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     minHeight: "70%",
//   },
//   authContainer: {
//     width: "100%",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#7D5745",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#7D5745",
//     marginBottom: 25,
//   },
//   input: {
//     backgroundColor: "#F5F5F5",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     marginBottom: 20,
//   },
//   forgotPasswordText: {
//     color: "#4A2B1C",
//   },
//   loginButton: {
//     backgroundColor: "#7D5745",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   loginButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   bottomContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   registerText: {
//     color: "#666",
//   },
//   registerLink: {
//     color: "#4A2B1C",
//     fontWeight: "bold",
//   },
// });

// export default LoginScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
  ActivityIndicator, // Importando o ActivityIndicator
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Definindo o estado de loading
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true); // Inicia o carregamento

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
        setLoading(false); // Finaliza o carregamento após erro
        return;
      }

      const userData = userDoc.data();

      if (userData.tipo !== "proprietario") {
        Alert.alert(
          "Acesso Negado",
          "Esta área é exclusiva para proprietários."
        );
        await auth.signOut();
        setLoading(false); // Finaliza o carregamento após erro
        return;
      }

      navigation.navigate("ProfileScreen");
      setLoading(false); // Finaliza o carregamento após sucesso

    } catch (error) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
      setLoading(false); // Finaliza o carregamento em caso de erro
    }
  };

  const handleCadastro = () => {
    navigation.navigate("CadastroScreen");
  };

  const handleEsqueceuSenha = async () => {
    if (!email) {
      Alert.alert(
        "Email Necessário",
        "Por favor, insira seu email no campo de email antes de redefinir a senha."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Redefinição de Senha",
        "Um link para redefinir sua senha foi enviado para o seu email."
      );
    } catch (error) {
      let errorMessage = "Erro ao enviar email de redefinição de senha.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido. Verifique o endereço de email.";
          break;
        case "auth/user-not-found":
          errorMessage = "Nenhum usuário encontrado com este email.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Muitas tentativas. Por favor, tente novamente mais tarde.";
          break;
      }

      Alert.alert("Erro", errorMessage);
    }
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

            {/* Exibir o botão de login ou o indicador de carregamento */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading} // Desabilita o botão enquanto está carregando
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
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
    color: "#7D5745",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7D5745",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4A2B1C",
  },
  loginButton: {
    backgroundColor: "#7D5745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
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
