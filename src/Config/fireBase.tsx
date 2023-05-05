// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';

declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult:any
    }
  }
const firebaseConfig = {
    apiKey: "AIzaSyDvuL2Nnq6CUxadOUgJPfMVmKG4X2Yg47M",
    authDomain: "chat-ab158.firebaseapp.com",
    projectId: "chat-ab158",
    storageBucket: "chat-ab158.appspot.com",
    messagingSenderId: "22014586639",
    appId: "1:22014586639:web:9ede88f2a4763b179c587a"
  };
const app = firebase.initializeApp(firebaseConfig);
export default app;
