// const { getStorage } = require("firebase/storage");
const { getStorage } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
require("firebase/storage")


// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
  apiKey: "AIzaSyACW8EIlOwvNOSUm834780383MF67fuKxQ",
  authDomain: "iagora-dev.firebaseapp.com",
  databaseURL: "https://iagora-dev-default-rtdb.firebaseio.com",
  projectId: "iagora-dev",
  storageBucket: "iagora-dev.appspot.com",
  messagingSenderId: "1094014984889",
  appId: "1:1094014984889:web:275b3c89ffc19f9e22f168",
  measurementId: "G-CBLVC745E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
exports.db_firebase = getDatabase(app);
exports.storage_firebase = getStorage(app);
