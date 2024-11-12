import { initializeApp } from "@firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_KEY } from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "fir-auth-login-d71e1.firebaseapp.com",
  projectId: "fir-auth-login-d71e1",
  storageBucket: "fir-auth-login-d71e1.appspot.com",
  messagingSenderId: "864499409695",
  appId: "1:864499409695:web:5ecbfe278a562cb58e462a",
  measurementId: "G-V4QCEB7HBV",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
