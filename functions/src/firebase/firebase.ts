import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const app = initializeApp();

export const firestore = getFirestore(app);
export const bucket = getStorage(app).bucket();
