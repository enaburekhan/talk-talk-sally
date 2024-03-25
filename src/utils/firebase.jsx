import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAD_umzsy6aeAAeiFYG4ROEUAFK5LSXRtk',
  authDomain: 'work-the-talk-blog.firebaseapp.com',
  projectId: 'work-the-talk-blog',
  storageBucket: 'work-the-talk-blog.appspot.com',
  messagingSenderId: '399765662168',
  appId: '1:399765662168:web:9e763e738031249658eaad',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
