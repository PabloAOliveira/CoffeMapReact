import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
  Image
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getApp } from "firebase/app";
import { PLACES_API_KEY } from "@env";
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;
const GOOGLE_PLACES_API_KEY = PLACES_API_KEY;

export default function HomeMap() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [cafeterias, setCafeterias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar sua localização.");
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setLocation(newLocation);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newLocation, 300);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert("Erro", "Não foi possível obter sua localização.");
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const db = getFirestore(getApp());
        const cafeteriasCollection = collection(db, "usuarios");
        const cafeteriasSnapshot = await getDocs(cafeteriasCollection);
        const cafeteriasList = cafeteriasSnapshot.docs
          .filter(doc => {
            const data = doc.data();
            return data.tipo === "proprietario" && 
                   data.location && 
                   typeof data.location.latitude === 'number' && 
                   typeof data.location.longitude === 'number';
          })
          .map(doc => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              horariosFuncionamento: data.horariosFuncionamento || [],
              location: {
                latitude: data.location.latitude,
                longitude: data.location.longitude
              }
            };
          });
        
        if (cafeteriasList.length === 0) {
          Alert.alert("Aviso", "Nenhuma cafeteria encontrada.");
        }
        
        setCafeterias(cafeteriasList);
      } catch (error) {
        console.error("Erro ao buscar cafeterias:", error);
        Alert.alert("Erro", "Não foi possível carregar as cafeterias.");
      }
    };
  
    fetchCafeterias();
  }, []);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data.predictions);
      } catch (error) {
        console.error(`Erro na busca de cidades: ${error.message}`);
        Alert.alert("Erro", "Não foi possível buscar cidades.");
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      if (
        data.result &&
        data.result.geometry &&
        data.result.geometry.location
      ) {
        const { lat, lng } = data.result.geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      setSearchQuery("");
      setSuggestions([]);
    } catch (error) {
      console.error(`Erro ao selecionar cidade: ${error.message}`);
      Alert.alert("Erro", "Não foi possível selecionar a cidade.");
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const menuItems = [
    { icon: 'home', label: 'Home', onPress: () => setMenuVisible(false) },
    {
      icon: 'settings',
      label: 'Configurações',
      onPress: () => {
        const db = getFirestore(getApp());
        const usuariosCollection = collection(db, "usuarios");
    
        getDocs(usuariosCollection)
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              const userData = doc.data();
    
              if (userData.tipo === 'proprietario') {
                navigation.navigate('ProfileScreen', { userData });
              } else if (userData.tipo === 'cliente') {
                navigation.navigate('ProfileCliente', { userData });
              }
            });
          })
          .catch((error) => {
            console.error("Erro ao buscar usuários:", error);
            Alert.alert("Erro", "Não foi possível verificar o tipo de usuário.");
          });
      },
    },
    { icon: 'help-outline', label: 'Suporte', onPress: () => {/* Adicione a lógica de suporte aqui */} },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={toggleMenu}
      >
        <Icon name={menuVisible ? "close" : "menu"} size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar cidade"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectCity(item.place_id)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Você está aqui"
            description="Localização atual"
          />
        )}

        {cafeterias.map((cafeteria) => {
          if (!cafeteria.location || 
              typeof cafeteria.location.latitude !== 'number' || 
              typeof cafeteria.location.longitude !== 'number') {
            return null; 
          }

          const horarios = Array.isArray(cafeteria.horariosFuncionamento) 
            ? cafeteria.horariosFuncionamento.join(" | ") 
            : "Horários não disponíveis";

          return (
            <Marker
              key={cafeteria.id}
              coordinate={{
                latitude: cafeteria.location.latitude,
                longitude: cafeteria.location.longitude,
              }}
              title={cafeteria.nome}
              description={cafeteria.DescricaoEstabelecimento}
            >
              <Callout>
                <View>
                  <Text style={styles.markerTitle}>{cafeteria.nome || "Nome não disponível"}</Text>
                  <Text style={styles.markerDescription}>
                    {cafeteria.DescricaoEstabelecimento || "Sem descrição"}
                  </Text>
                  <Text style={styles.markerHorarios}>
                    Horários: {horarios}
                  </Text>
                  <Text style={styles.markerTelefone}>
                    Telefone: {cafeteria.telefone || "Não disponível"}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {menuVisible && (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          style={styles.sideMenu}
        >
          <View style={styles.menuHeader}>
            <Image 
              source={require('../../assets/logomenu.png')} 
              style={styles.menuLogo}
            />
          </View>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Icon name={item.icon} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          
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
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  menuButton: {
    position: "absolute",
    top: 80,
    left: 10,
    zIndex: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
  },
  searchContainer: {
    position: "absolute",
    top: 80,
    left: 60,
    right: 30,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 13,
    borderRadius: 10,
  },
  suggestionsList: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sideMenu: {
    position: "absolute",
    width: screenWidth * 0.75,
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  menuLogo: {
    width: 260,
    height: 60,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
  markerTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  markerDescription: {
    fontSize: 14,
    marginVertical: 5,
  },
  markerHorarios: {
    fontSize: 14,
    marginVertical: 5,
  },
  markerTelefone: {
    fontSize: 14,
    marginVertical: 5,
  },
});
