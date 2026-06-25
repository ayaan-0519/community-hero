const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBX-5OvH8H7jwb97XHTT1d7DoNRTDdJGmw",
  authDomain: "community-hero-a4a9a.firebaseapp.com",
  projectId: "community-hero-a4a9a",
  storageBucket: "community-hero-a4a9a.firebasestorage.app",
  messagingSenderId: "954430031747",
  appId: "1:954430031747:web:08f54b4463d576c09e18b6"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = db;