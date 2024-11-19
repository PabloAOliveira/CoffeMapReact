// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Modal,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   SafeAreaView,
// } from "react-native";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// import { auth, db } from "../config/firebase";
// import * as Location from "expo-location";
// import MapView, { Marker } from "react-native-maps";
// import MaskInput from "react-native-mask-input";

// const SCREEN_HEIGHT = Dimensions.get("window").height;
// const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.35; // 35% of screen height for image

// export default function CadastroScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [nome, setNome] = useState("");
//   const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
//   const [location, setLocation] = useState(null);
//   const [mapVisible, setMapVisible] = useState(false);
//   const [telefone, setTelefone] = useState("");
//   const [horario1, setHorario1] = useState("");
//   const [horario2, setHorario2] = useState("");
//   const [horario3, setHorario3] = useState("");
//   const [horario4, setHorario4] = useState("");

//   const handleSelectLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permissão negada",
//         "É necessária a permissão de localização para definir a localização da cafeteria."
//       );
//       return;
//     }
//     setMapVisible(true);
//   };

//   const handleMapPress = (event) => {
//     const { latitude, longitude } = event.nativeEvent.coordinate;
//     setLocation({ latitude, longitude });
//   };

//   const handleCadastro = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       await setDoc(doc(db, "usuarios", user.uid), {
//         email: email,
//         tipo: "proprietario",
//         nome: nome,
//         nomeEstabelecimento: nomeEstabelecimento,
//         telefone: telefone,
//         horariosFuncionamento: [horario1, horario2, horario3, horario4],
//         dataCadastro: new Date(),
//         location: location,
//       });

//       Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
//       setMapVisible(false);
//       navigation.navigate("LoginScreen");
//     } catch (error) {
//       Alert.alert("Erro", "Falha no cadastro: " + error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground
//         source={require("../../assets/cadastro.png")}
//         style={styles.container}
//         resizeMode="cover"
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.formWrapper}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContainer}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.formContainer}>
//               <Text style={styles.title}>Cadastre sua Cafeteria</Text>

//               <TextInput
//                 style={styles.input}
//                 value={nome}
//                 onChangeText={setNome}
//                 placeholder="Nome da cafeteria"
//                 placeholderTextColor="#666"
//               />
//               <TextInput
//                 style={styles.input}
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Email"
//                 placeholderTextColor="#666"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               <TextInput
//                 style={styles.input}
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Senha"
//                 placeholderTextColor="#666"
//                 secureTextEntry
//               />
//               <MaskInput
//                 style={styles.input}
//                 value={telefone}
//                 onChangeText={(masked, unmasked) => setTelefone(masked)}
//                 mask={[
//                   "(",
//                   /\d/,
//                   /\d/,
//                   ")",
//                   " ",
//                   /\d/,
//                   /\d/,
//                   /\d/,
//                   /\d/,
//                   /\d/,
//                   "-",
//                   /\d/,
//                   /\d/,
//                   /\d/,
//                   /\d/,
//                 ]}
//                 placeholder="Telefone"
//                 placeholderTextColor="#666"
//                 keyboardType="phone-pad"
//               />
//               <TextInput
//                 style={[styles.input, styles.descriptionInput]}
//                 value={nomeEstabelecimento}
//                 onChangeText={setNomeEstabelecimento}
//                 placeholder="Descrição"
//                 multiline
//                 numberOfLines={4}
//                 placeholderTextColor="#666"
//               />

//               <Text style={styles.inputLabel}>Horário de funcionamento</Text>
//               <View style={styles.horariosContainer}>
//                 {[horario1, horario2, horario3, horario4].map(
//                   (horario, index) => (
//                     <MaskInput
//                       key={index}
//                       style={styles.horarioInput}
//                       value={horario}
//                       onChangeText={(masked, unmasked) => {
//                         const setters = [
//                           setHorario1,
//                           setHorario2,
//                           setHorario3,
//                           setHorario4,
//                         ];
//                         setters[index](masked);
//                       }}
//                       mask={[/\d/, /\d/, ":", /\d/, /\d/]}
//                       placeholder="00:00"
//                       placeholderTextColor="#666"
//                       keyboardType="numeric"
//                     />
//                   )
//                 )}
//               </View>

//               <TouchableOpacity
//                 style={styles.locationButton}
//                 onPress={handleSelectLocation}
//               >
//                 <Text style={styles.buttonText}>Selecionar Localização</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.cadastrarButton}
//                 onPress={handleCadastro}
//               >
//                 <Text style={styles.buttonText}>Cadastrar</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </ImageBackground>

//       <Modal visible={mapVisible} animationType="slide">
//         <MapView
//           style={StyleSheet.absoluteFillObject}
//           initialRegion={{
//             latitude: -23.55052,
//             longitude: -46.633308,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//           onPress={handleMapPress}
//         >
//           {location && <Marker coordinate={location} />}
//         </MapView>
//         <View style={styles.mapButtonContainer}>
//           <TouchableOpacity
//             style={styles.confirmLocationButton}
//             onPress={() => setMapVisible(false)}
//           >
//             <Text style={styles.buttonText}>Confirmar Localização</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   formWrapper: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingTop: 250,
//     paddingBottom: 40,
//     maxHeight: SCREEN_HEIGHT / 2,
//   },
//   formContainer: {
//     width: "100%",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     marginBottom: 20,
//     textAlign: "center",
//     textShadowColor: "rgba(0, 0, 0, 0.75)",
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   input: {
//     height: 50,
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     fontSize: 16,
//     color: "#333",
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: "top",
//     paddingTop: 12,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#8B4513",
//     marginBottom: 8,
//   },
//   horariosContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   horarioInput: {
//     width: "22%",
//     height: 50,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },
//   locationButton: {
//     backgroundColor: "#8B4513",
//     borderRadius: 8,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   cadastrarButton: {
//     backgroundColor: "#8B4513",
//     borderRadius: 8,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   mapButtonContainer: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },
//   confirmLocationButton: {
//     backgroundColor: "#8B4513",
//     borderRadius: 8,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MaskInput from "react-native-mask-input";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Component({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
  const [location, setLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [horario1, setHorario1] = useState("");
  const [horario2, setHorario2] = useState("");
  const [horario3, setHorario3] = useState("");
  const [horario4, setHorario4] = useState("");

  const handleSelectLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessária a permissão de localização para definir a localização da cafeteria."
      );
      return;
    }
    setMapVisible(true);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handleCadastro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        email: email,
        tipo: "proprietario",
        nome: nome,
        nomeEstabelecimento: nomeEstabelecimento,
        telefone: telefone,
        horariosFuncionamento: [horario1, horario2, horario3, horario4],
        dataCadastro: new Date(),
        location: location,
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      setMapVisible(false);
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Erro", "Falha no cadastro: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastre sua Cafeteria</Text>

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome da cafeteria"
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor="#666"
              secureTextEntry
            />
            <MaskInput
              style={styles.input}
              value={telefone}
              onChangeText={(masked, unmasked) => setTelefone(masked)}
              mask={[
                "(",
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              placeholder="Telefone"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={nomeEstabelecimento}
              onChangeText={setNomeEstabelecimento}
              placeholder="Descrição"
              multiline
              numberOfLines={4}
              placeholderTextColor="#666"
            />

            <Text style={styles.inputLabel}>Horário de funcionamento</Text>
            <View style={styles.horariosContainer}>
              {[horario1, horario2, horario3, horario4].map(
                (horario, index) => (
                  <MaskInput
                    key={index}
                    style={styles.horarioInput}
                    value={horario}
                    onChangeText={(masked, unmasked) => {
                      const setters = [
                        setHorario1,
                        setHorario2,
                        setHorario3,
                        setHorario4,
                      ];
                      setters[index](masked);
                    }}
                    mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                    placeholder="00:00"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleSelectLocation}
            >
              <Text style={styles.buttonText}>Selecionar Localização</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cadastrarButton}
              onPress={handleCadastro}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={mapVisible} animationType="slide">
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: -23.55052,
            longitude: -46.633308,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {location && <Marker coordinate={location} />}
        </MapView>
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity
            style={styles.confirmLocationButton}
            onPress={() => setMapVisible(false)}
          >
            <Text style={styles.buttonText}>Confirmar Localização</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE8E0",
  },
  formWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8B4513",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
    width: SCREEN_WIDTH - 40,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B4513",
    marginBottom: 8,
  },
  horariosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  horarioInput: {
    width: (SCREEN_WIDTH - 60) / 4,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  locationButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    width: SCREEN_WIDTH - 40,
  },
  cadastrarButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    width: SCREEN_WIDTH - 40,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  mapButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  confirmLocationButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
