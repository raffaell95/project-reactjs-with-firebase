import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgkylKwQcU2a05ZpUGTZFJUwkfqEuymjc",
  authDomain: "webcarros-ed244.firebaseapp.com",
  projectId: "webcarros-ed244",
  storageBucket: "webcarros-ed244.appspot.com",
  messagingSenderId: "742195986439",
  appId: "1:742195986439:web:c3393542b56095cf07eaa2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }