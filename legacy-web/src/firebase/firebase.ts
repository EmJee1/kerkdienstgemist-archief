import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyBfomVC1it6-GDh4YydRo1NMyHm24CWmEA',
	authDomain: 'kerdienstgemist-archief.firebaseapp.com',
	projectId: 'kerdienstgemist-archief',
	storageBucket: 'kerdienstgemist-archief.appspot.com',
	messagingSenderId: '136769075655',
	appId: '1:136769075655:web:382dff9f5ea90a538b01e2',
}

export const app = initializeApp(firebaseConfig)
export const firestore = getFirestore()
export const auth = getAuth()
