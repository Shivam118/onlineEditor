import { initializeApp } from "firebase/app";
// import firebase from "firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTbb9TiTOcc1430uie4ECiEYHiDM3cJeM",
  authDomain: "flodata-1921b.firebaseapp.com",
  projectId: "flodata-1921b",
  storageBucket: "flodata-1921b.appspot.com",
  messagingSenderId: "192352271434",
  appId: "1:192352271434:web:fe0da3412691ef91757ab3",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account ",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
