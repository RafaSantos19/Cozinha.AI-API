import {
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
    where,
    query,
    Timestamp
} from "firebase/firestore";

import { db } from "./firebase.js";

import { user, favorites, suggestions } from "../models/models.js"

//Talvez eu tenha que adicionar o parâmetro 'collName' para deixar os métodos genéricos
class Database {
    constructor() {
        this.user = "user";
        this.subcollections = {
            favorites: "favorites",
            suggestions: "suggestions"
        };
    }

    async createUserDoc(uid, data) {
        try {
            const userRef = doc(db, this.user, uid);
            const userDocData = { ...user, ...data, createdAt: Timestamp.now() }; 
            await setDoc(userRef, userDocData);

            const favoritesRef = collection(userRef, this.subcollections.favorites);
            await addDoc(favoritesRef, { ...favorites, createdAt: Timestamp.now() });

            const suggestionsRef = collection(userRef, this.subcollections.suggestions);
            await addDoc(suggestionsRef, { ...suggestions, createdAt: Timestamp.now() });

            return { success: true, uid: uid };
        } catch (error) {
            console.error(`[Database::createUserDoc]`, error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const userRef = collection(db, this.user);
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, message: MESSAGES.NOT_FOUND };
            }

            const userDoc = snapshot.docs[0];
            const user = { uid: userDoc.id, ...userDoc.data() };
            return { success: true, message: MESSAGES.FETCH_SUCCESS, data: user };
        } catch (error) {
            console.error(`[Database::getUserDocumentByEmail] ${MESSAGES.FETCH_ERROR} email:${email}:`, error);
            throw error;
        }
    }

    async updateUserDoc(uid, newData) {
        try {
            const userRef = doc(db, this.collectionName, uid);
            const snapshot = await getDoc(userRef);
            if (!snapshot.exists()) return { success: false, message: MESSAGES.NOT_FOUND };

            await updateDoc(userRef, newData);
            return { success: true, message: MESSAGES.UPDATE_SUCCESS, updatedAt: new Date().toISOString() };
        } catch (error) {
            console.error(`[Database::updateUserDocument] ${MESSAGES.UPDATE_ERROR} uid:${uid}:`, error);
            throw error;
        }
    }

    /* Métodos Génericos */

    async getDocByUid(uid, collName) {
        try {
            const docRef = doc(db, collName, uid);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) {
                return { success: false, message: MESSAGES.NOT_FOUND };
            }
            const data = { uid, ...snapshot.data() }
            return { success: true, data: data };
        } catch (error) {
            console.error(`[Database::getDocByUid]`, error);
            throw error;
        }
    }

    async updateDoc() { }

}

export default Database;