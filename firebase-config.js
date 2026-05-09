import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
getAuth
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
getStorage
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const firebaseConfig = {
apiKey: "AIzaSyBKK9rimThpuHcyZpHfP3bT3HgmfTsfWUo",
authDomain: "student-id-cms.firebaseapp.com",
projectId: "student-id-cms",
storageBucket: "student-id-cms.firebasestorage.app",
messagingSenderId: "371259641893",
appId: "1:371259641893:web:815fde920209ce070aafcc"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
app,
auth,
db,
storage
};