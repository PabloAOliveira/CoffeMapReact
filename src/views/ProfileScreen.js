import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [cafeteriaData, setCafeteriaData] = useState(null);
  const [userData, setUserData] = useState({
    email: "",
    telefone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setMessage(`Erro : ${error.message || "Usuário não autenticado"}`);

          return;
        }

        const db = getFirestore(getApp());

        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            setMessage(
              `Erro : ${error.message || "Dados do usuário não encontrados"}`
            );
            return;
          }

          const userInfo = userSnap.data();
          setUserData({
            email: userInfo.email || "",
            telefone: userInfo.telefone || "",
          });

          const cafeteriaRef = doc(db, "cafeterias", user.uid);
          const cafeteriaSnap = await getDoc(cafeteriaRef);

          if (cafeteriaSnap.exists()) {
            setCafeteriaData(cafeteriaSnap.data());
          } else {
            setMessage(`Erro : ${error.message || "Cafeteria não encontrada"}`);
          }
        } catch (error) {
          setMessage(`Erro : ${error.message || "Erro de permissão"}`);
        }
      } catch (error) {
        setMessage(`Erro : ${error.message || "Erro ao buscar dados"}`);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: cafeteriaData
                ? cafeteriaData.profileImage
                : "/placeholder.svg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>
            {userData.email} | {userData.telefone}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>Meu perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Minha Cafeteria</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Editar Perfil</Text>
          </TouchableOpacity>

          {/* Renderizar os dados da cafeteria */}
          {cafeteriaData && (
            <>
              <View style={styles.menuItem}>
                <Text style={styles.menuText}>Nome: {cafeteriaData.nome}</Text>
              </View>

              <View style={styles.menuItem}>
                <Text style={styles.menuText}>
                  Descrição: {cafeteriaData.descricaoEstabelecimento}
                </Text>
              </View>

              <View style={styles.menuItem}>
                <Text style={styles.menuText}>
                  Horários de Funcionamento:{" "}
                  {cafeteriaData.horariosFuncionamento.join(" | ")}
                </Text>
              </View>

              <View style={styles.menuItem}>
                <Text style={styles.menuText}>
                  Telefone: {cafeteriaData.telefone}
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Notificações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.languageContainer}>
              <Text style={styles.menuText}>Idioma</Text>
              <Text style={styles.languageText}>Português</Text>
            </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F7",
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileText: {
    color: "#333",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "500",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDD",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageText: {
    color: "#666",
    fontSize: 14,
  },
});
