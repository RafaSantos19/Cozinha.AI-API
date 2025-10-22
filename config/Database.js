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
                return { success: false, message: "Usuário não encontrado" };
            }

            const userDoc = snapshot.docs[0];
            const user = { uid: userDoc.id, ...userDoc.data() };
            return { success: true, message: "Usuário encontrado com sucesso", data: user };
        } catch (error) {
            console.error(`[Database::getUserDocumentByEmail] ${MESSAGES.FETCH_ERROR} email:${email}:`, error);
            throw error;
        }
    }

    async updateUserDoc(uid, newData) {
        try {
            const userRef = doc(db, this.user, uid);
            const snapshot = await getDoc(userRef);
            if (!snapshot.exists()) return { success: false, message: "Erro ao atualizar dados" };

            await updateDoc(userRef, newData);
            return { success: true, message: "Dados atualizados com sucesso", updatedAt: new Date().toISOString() };
        } catch (error) {
            console.error(`[Database::updateUserDocument] uid:${uid}:`, error);
            throw error;
        }
    }

    /* Métodos Génericos */

    async getDocByUid(uid, collName) {
        try {
            const docRef = doc(db, collName, uid);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) {
                return { success: false, message: "Dados recuperados com sucesso" };
            }
            const data = { uid, ...snapshot.data() }
            return { success: true, data: data };
        } catch (error) {
            console.error(`[Database::getDocByUid]`, error);
            throw error;
        }
    }

    async updateDoc() { }

    async deleteDoc(uid, collName) {

        try {
            const docRef = doc(db, collName, uid);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return { success: false, message: "Documento não encontrado" };
            }

            const subcollections = ["favorites", "suggestions"];
            for (const sub of subcollections) {
                const subColRef = collection(docRef, sub);
                const subSnapshot = await getDocs(subColRef);

                for (const subDoc of subSnapshot.docs) {
                    await deleteDoc(doc(subColRef, subDoc.id));
                }
            }

            await deleteDoc(docRef);

            return { success: true, message: "Documento e subcollections deletados com sucesso", deletedAt: new Date().toISOString() };
        } catch (error) {
            console.error(`[Database::deleteDoc] uid:${uid}, collName:${collName}`, error);
            throw error;
        }
    }

}

export default Database;