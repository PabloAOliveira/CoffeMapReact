// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";

// const screenWidth = Dimensions.get("window").width;

// export default function HomeMap() {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [location, setLocation] = useState(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permissão para acessar a localização foi negada");
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       const newLocation = {
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       };
//       setLocation(newLocation);

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(newLocation, 500);
//       }
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.menuButton}
//         onPress={() => setMenuVisible(true)}
//       >
//         <Text style={styles.menuButtonText}>Abrir Menu</Text>
//       </TouchableOpacity>

//       {/* Mapa */}
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: -23.55052,
//           longitude: -46.633308,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         showsUserLocation={true}
//       >
//         {location && (
//           <Marker
//             coordinate={location}
//             title="Você está aqui"
//             description="Localização atual"
//           />
//         )}
//       </MapView>

//       {/* Menu lateral deslizante */}
//       {menuVisible && (
//         <Animated.View
//           entering={SlideInLeft}
//           exiting={SlideOutLeft}
//           style={styles.sideMenu}
//         >
//           <TouchableOpacity onPress={() => setMenuVisible(false)}>
//             <Text style={styles.closeButton}>Fechar Menu</Text>
//           </TouchableOpacity>
//           <Text style={styles.menuContent}>Conteúdo do Menu</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   menuButton: {
//     position: "absolute",
//     top: 60,
//     left: 10,
//     zIndex: 10,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//   },
//   menuButtonText: {
//     color: "black",
//   },
//   sideMenu: {
//     position: "absolute",
//     width: screenWidth * 0.5,
//     height: "100%",
//     top: 0,
//     left: 0,
//     backgroundColor: "#fff",
//     padding: 20,
//     zIndex: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//   },
//   closeButton: {
//     fontWeight: "bold",
//     marginTop: 50,
//     color: "red",
//   },
//   menuContent: {
//     marginTop: 20,
//     fontSize: 16,
//     color: "black",
//     top: 40,
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width;

export default function HomeMap() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão para acessar a localização foi negada");
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

      // Use animation only if location has been set
      if (mapRef.current && !location) {
        mapRef.current.animateToRegion(newLocation, 300); // Animação mais rápida
      }
    };

    fetchLocation();
  }, [location]); // A dependência "location" garante que a animação ocorra uma vez

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={styles.menuButtonText}>Abrir Menu</Text>
      </TouchableOpacity>

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
    top: 60,
    left: 10,
    zIndex: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  menuButtonText: {
    color: "black",
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
});
