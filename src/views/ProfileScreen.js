import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { getApp } from 'firebase/app';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const [cafeteriaData, setCafeteriaData] = useState(null);
  const [userData, setUserData] = useState({
    email: '',
    telefone: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

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
      const cafeteriasRef = collection(db, 'usuarios');
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

        const formattedData = {
          nome: cafeteriaData.nome,
          nomeEstabelecimento: cafeteriaData.DescricaoEstabelecimento,
          telefone: cafeteriaData.telefone,
          tipo: cafeteriaData.tipo,
          horariosFuncionamento: horarios,
          location: cafeteriaData.location,
          email: cafeteriaData.email
        };

        setCafeteriaData(formattedData);
        setEditedData(formattedData);
      } else {
        console.error('Cafeteria não encontrada para este usuário');
      }
    } catch (error) {
    }
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const db = getFirestore();
      const cafeteriaRef = doc(db, 'usuarios', user.uid);

      const updatedData = {
        ...editedData,
        horariosFuncionamento: [
          editedData.horariosFuncionamento["Segunda-Feira"].split(' - ')[0],
          editedData.horariosFuncionamento["Sábado"].split(' - ')[0],
          editedData.horariosFuncionamento["Domingo"].split(' - ')[0],
          editedData.horariosFuncionamento["Segunda-Feira"].split(' - ')[1],
        ],
      };

      await updateDoc(cafeteriaRef, updatedData);
      setCafeteriaData(editedData);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Dados da cafeteria atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados da cafeteria.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Deletar Cafeteria",
      "Você tem certeza que deseja deletar sua cafeteria? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sim, deletar", 
          onPress: () => deleteCafeteria(),
          style: "destructive"
        }
      ]
    );
  };

  const deleteCafeteria = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const db = getFirestore();
      const cafeteriaRef = doc(db, 'usuarios', user.uid);

      // Delete cafeteria document
      await deleteDoc(cafeteriaRef);

      // Voltar para a tela anterior
      navigation.goBack();

      Alert.alert('Sucesso', 'Sua cafeteria foi deletada e você foi deslogado.');
    } catch (error) {
      console.error('Erro ao deletar cafeteria:', error);
      Alert.alert('Erro', 'Não foi possível deletar a cafeteria.');
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const menuItems = [
    { icon: 'home', label: 'Home', onPress: () => {
      navigation.navigate('HomeMap');
      setMenuVisible(false);
    }},
    { icon: 'person', label: 'Perfil', onPress: () => {
      setActiveTab('profile');
      setMenuVisible(false);
    }},
    { icon: 'help-outline', label: 'Suporte', onPress: () => {
      setMenuVisible(false);
    }},
  ];

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
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editedData.nome}
                  onChangeText={(text) => setEditedData({...editedData, nome: text})}
                  placeholder="Nome"
                />
                <TextInput
                  style={styles.input}
                  value={editedData.nomeEstabelecimento}
                  onChangeText={(text) => setEditedData({...editedData, nomeEstabelecimento: text})}
                  placeholder="Nome do Estabelecimento"
                />
                <TextInput
                  style={styles.input}
                  value={editedData.telefone}
                  onChangeText={(text) => setEditedData({...editedData, telefone: text})}
                  placeholder="Telefone"
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  value={editedData.location.latitude.toString()}
                  onChangeText={(text) => setEditedData({...editedData, location: {...editedData.location, latitude: parseFloat(text)}})}
                  placeholder="Latitude"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={editedData.location.longitude.toString()}
                  onChangeText={(text) => setEditedData({...editedData, location: {...editedData.location, longitude: parseFloat(text)}})}
                  placeholder="Longitude"
                  keyboardType="numeric"
                />
              </>
            ) : (
              <>
                <Text style={styles.cafeteriaTitle}>{cafeteriaData.nome}</Text>
                <Text style={styles.cafeteriaSubtitle}>{cafeteriaData.nomeEstabelecimento}</Text>
                <Text style={styles.cafeteriaAddress}>
                  Latitude: {cafeteriaData.location.latitude}
                  {'\n'}
                  Longitude: {cafeteriaData.location.longitude}
                </Text>
              </>
            )}
          </View>
          <View style={styles.cafeteriaSection}>
            <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
            {Object.entries(isEditing ? editedData.horariosFuncionamento : cafeteriaData.horariosFuncionamento).map(([dia, horario]) => (
              <View key={dia} style={styles.horarioRow}>
                <Text style={styles.horarioDia}>{dia}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.horarioInput}
                    value={horario}
                    onChangeText={(text) => setEditedData({
                      ...editedData,
                      horariosFuncionamento: {
                        ...editedData.horariosFuncionamento,
                        [dia]: text
                      }
                    })}
                    placeholder="00:00 - 00:00"
                  />
                ) : (
                  <Text style={styles.horarioText}>{horario}</Text>
                )}
              </View>
            ))}
          </View>
          {isEditing ? (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Editar Cafeteria</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Deletar Cafeteria</Text>
              </TouchableOpacity>
            </>
          )}
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
          style={styles.menuButton}
          onPress={toggleMenu}
        >
          <Icon name={menuVisible ? "close" : "menu"} size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/fotop.png')}
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

      {menuVisible && (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          style={styles.sideMenu}
        >
          <View style={styles.menuContent}>
            <View>
              <View style={styles.menuHeader}>
                <Image 
                  source={require('../../assets/img.png')} 
                  style={styles.menuLogo}
                />
              </View>
              
              {
menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <Icon name={item.icon} size={24} color="#666" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={() => {
                navigation.navigate('WelcomeScreen');
                setMenuVisible(false);
              }}
            >
              <Icon name="logout" size={24} color="#FF4444" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F7',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 15,
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
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  horarioInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 5,
    width: '60%',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
  sideMenu: {
    position: 'absolute',
    width: screenWidth * 0.75,
    height: '110%',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  menuLogo: {
    width: 240,
    height: 90,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
});

