// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getApp } from "firebase/app";

// export default function ProfileScreen() {
//   const navigation = useNavigation();
//   const [cafeteriaData, setCafeteriaData] = useState(null);
//   const [userData, setUserData] = useState({
//     email: "",
//     telefone: "",
//   });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) {
//           setMessage(`Erro : ${error.message || "Usuário não autenticado"}`);

//           return;
//         }

//         const db = getFirestore(getApp());

//         try {
//           const userRef = doc(db, "usuarios", user.uid);
//           const userSnap = await getDoc(userRef);

//           if (!userSnap.exists()) {
//             setMessage(
//               `Erro : ${error.message || "Dados do usuário não encontrados"}`
//             );
//             return;
//           }

//           const userInfo = userSnap.data();
//           setUserData({
//             email: userInfo.email || "",
//             telefone: userInfo.telefone || "",
//           });

//           const cafeteriaRef = doc(db, "cafeterias", user.uid);
//           const cafeteriaSnap = await getDoc(cafeteriaRef);

//           if (cafeteriaSnap.exists()) {
//             setCafeteriaData(cafeteriaSnap.data());
//           } else {
//             setMessage(`Erro : ${error.message || "Cafeteria não encontrada"}`);
//           }
//         } catch (error) {
//           setMessage(`Erro : ${error.message || "Erro de permissão"}`);
//         }
//       } catch (error) {
//         setMessage(`Erro : ${error.message || "Erro ao buscar dados"}`);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {/* Back Button */}
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>←</Text>
//         </TouchableOpacity>

//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <Image
//             source={{
//               uri: cafeteriaData
//                 ? cafeteriaData.profileImage
//                 : "/placeholder.svg",
//             }}
//             style={styles.profileImage}
//           />
//           <Text style={styles.profileText}>
//             {userData.email} | {userData.telefone}
//           </Text>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//             <Text style={styles.activeTabText}>Meu perfil</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>Minha Cafeteria</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuContainer}>
//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuText}>Editar Perfil</Text>
//           </TouchableOpacity>

//           {/* Renderizar os dados da cafeteria */}
//           {cafeteriaData && (
//             <>
//               <View style={styles.menuItem}>
//                 <Text style={styles.menuText}>Nome: {cafeteriaData.nome}</Text>
//               </View>

//               <View style={styles.menuItem}>
//                 <Text style={styles.menuText}>
//                   Descrição: {cafeteriaData.descricaoEstabelecimento}
//                 </Text>
//               </View>

//               <View style={styles.menuItem}>
//                 <Text style={styles.menuText}>
//                   Horários de Funcionamento:{" "}
//                   {cafeteriaData.horariosFuncionamento.join(" | ")}
//                 </Text>
//               </View>

//               <View style={styles.menuItem}>
//                 <Text style={styles.menuText}>
//                   Telefone: {cafeteriaData.telefone}
//                 </Text>
//               </View>
//             </>
//           )}

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuText}>Notificações</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <View style={styles.languageContainer}>
//               <Text style={styles.menuText}>Idioma</Text>
//               <Text style={styles.languageText}>Português</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuText}>Segurança</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuText}>Ajuda</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuText}>Termos e Condições</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FAF7F7",
//   },
//   backButton: {
//     padding: 16,
//   },
//   backButtonText: {
//     fontSize: 24,
//     color: "#000",
//   },
//   profileSection: {
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   profileText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#000",
//   },
//   tabText: {
//     color: "#666",
//   },
//   activeTabText: {
//     color: "#000",
//     fontWeight: "500",
//   },
//   menuContainer: {
//     paddingHorizontal: 20,
//   },
//   menuItem: {
//     paddingVertical: 15,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#DDD",
//   },
//   menuText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   languageContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   languageText: {
//     color: "#666",
//     fontSize: 14,
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const [cafeteriaData, setCafeteriaData] = useState(null);
  const [userData, setUserData] = useState({
    email: '',
    telefone: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error('Usuário não autenticado');
          return;
        }

        const db = getFirestore(getApp());

        // Buscar dados do usuário
        const userRef = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userInfo = userSnap.data();
          setUserData({
            email: userInfo.email || '',
            telefone: userInfo.telefone || '',
          });
        }

        // Buscar a cafeteria do usuário logado
        const cafeteriasRef = collection(db, 'cafeterias');
        const q = query(cafeteriasRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const cafeteriaDoc = querySnapshot.docs[0];
          const cafeteriaData = cafeteriaDoc.data();
          
          // Formatar os horários de funcionamento
          const horarios = {
            "Segunda-Feira": `${cafeteriaData.horariosFuncionamento[0]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Terça-Feira": `${cafeteriaData.horariosFuncionamento[0]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Quarta-Feira": `${cafeteriaData.horariosFuncionamento[0]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Quinta-Feira": `${cafeteriaData.horariosFuncionamento[0]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Sexta": `${cafeteriaData.horariosFuncionamento[0]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Sábado": `${cafeteriaData.horariosFuncionamento[1]} - ${cafeteriaData.horariosFuncionamento[3]}`,
            "Domingo": `${cafeteriaData.horariosFuncionamento[2]} - ${cafeteriaData.horariosFuncionamento[3]}`
          };

          setCafeteriaData({
            nome: cafeteriaData.nome,
            nomeEstabelecimento: cafeteriaData.nomeEstabelecimento,
            telefone: cafeteriaData.telefone,
            tipo: cafeteriaData.tipo,
            horariosFuncionamento: horarios,
            location: cafeteriaData.location,
            email: cafeteriaData.email
          });
        } else {
          console.error('Cafeteria não encontrada para este usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchUserData();
  }, []);

  const renderProfileTab = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Notificações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Segurança</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Ajuda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Termos e Condições</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCafeteriaTab = () => (
    <View style={styles.cafeteriaContainer}>
      {cafeteriaData ? (
        <>
          <View style={styles.cafeteriaSection}>
            <Text style={styles.cafeteriaTitle}>{cafeteriaData.nome}</Text>
            <Text style={styles.cafeteriaSubtitle}>{cafeteriaData.nomeEstabelecimento}</Text>
            <Text style={styles.cafeteriaAddress}>
              Latitude: {cafeteriaData.location.latitude}
              {'\n'}
              Longitude: {cafeteriaData.location.longitude}
            </Text>
          </View>
          <View style={styles.cafeteriaSection}>
            <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
            {Object.entries(cafeteriaData.horariosFuncionamento).map(([dia, horario]) => (
              <View key={dia} style={styles.horarioRow}>
                <Text style={styles.horarioDia}>{dia}</Text>
                <Text style={styles.horarioText}>{horario}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Cafeteria</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noDataText}>Nenhuma cafeteria encontrada para este usuário.</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Text style={styles.editImageButtonText}>✎</Text>
          </TouchableOpacity>
          <Text style={styles.profileText}>
            {userData.email} | {userData.telefone}
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'profile' && styles.activeTabText,
              ]}
            >
              Meu perfil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cafeteria' && styles.activeTab]}
            onPress={() => setActiveTab('cafeteria')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'cafeteria' && styles.activeTabText,
              ]}
            >
              Minha Cafeteria
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'profile' ? renderProfileTab() : renderCafeteriaTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F7',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editImageButton: {
    position: 'absolute',
    right: 130,
    bottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  editImageButtonText: {
    fontSize: 16,
  },
  profileText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  cafeteriaContainer: {
    paddingHorizontal: 20,
  },
  cafeteriaSection: {
    marginBottom: 20,
  },
  cafeteriaTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  cafeteriaSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  cafeteriaAddress: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  horarioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  horarioDia: {
    fontSize: 14,
    color: '#333',
  },
  horarioText: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});