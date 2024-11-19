import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getApp } from "firebase/app";
import { PLACES_API_KEY } from "@env";

const screenWidth = Dimensions.get("window").width;
const GOOGLE_PLACES_API_KEY = PLACES_API_KEY;

export default function HomeMap() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [cafeterias, setCafeterias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setLocation(newLocation);

      if (mapRef.current && !location) {
        mapRef.current.animateToRegion(newLocation, 300);
      }
    };

    fetchLocation();
  }, [location]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const db = getFirestore(getApp());
        const cafeteriasCollection = collection(db, "cafeterias");
        const cafeteriasSnapshot = await getDocs(cafeteriasCollection);
        const cafeteriasList = cafeteriasSnapshot.docs.map((doc) => doc.data());
        setCafeterias(cafeteriasList);
      } catch (error) {
        setMessage(
          `Erro ao buscar cafeterias: ${
            error.message || "Tente novamente mais tarde."
          }`
        );
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
        setMessage(`Erro : ${error.message || "Tente novamente mais tarde."}`);
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
      setMessage(`Erro : ${error.message || "Tente novamente mais tarde."}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>

      {/* Search Bar */}
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

      {/* Mapa */}
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

        {/* Renderizando as cafeterias no mapa */}
        {cafeterias.map((cafeteria, index) => {
          const horarios = cafeteria.horariosFuncionamento.join(" | ");
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: cafeteria.location.latitude,
                longitude: cafeteria.location.longitude,
              }}
              title={cafeteria.nome}
              description={cafeteria.descricaoEstabelecimento}
            >
              <Callout>
                <View>
                  <Text style={styles.markerTitle}>{cafeteria.nome}</Text>
                  <Text style={styles.markerDescription}>
                    {cafeteria.descricaoEstabelecimento}
                  </Text>
                  <Text style={styles.markerHorarios}>
                    Horários: {horarios}
                  </Text>
                  <Text style={styles.markerTelefone}>
                    Telefone: {cafeteria.telefone}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Menu lateral deslizante */}
      {menuVisible && (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          style={styles.sideMenu}
        >
          <TouchableOpacity onPress={() => setMenuVisible(false)}>
            <Text style={styles.closeButton}>Fechar Menu</Text>
          </TouchableOpacity>
          <Text style={styles.menuContent}>Conteúdo do Menu</Text>
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
  menuButtonText: {
    color: "black",
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
    width: screenWidth * 0.5,
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  closeButton: {
    fontWeight: "bold",
    marginTop: 50,
    color: "red",
  },
  menuContent: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
    top: 40,
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
