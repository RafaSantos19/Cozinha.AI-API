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

    async addSuggestion(uid, suggestionData) {
        try {

            if (!uid) {
                throw new Error("UID do usuário não informado");
            }

            const userRef = doc(db, this.user, uid);
            const suggestionsRef = collection(userRef, this.subcollections.suggestions);

            const snapshot = await getDocs(suggestionsRef);

            let suggestionsDocRef;
            let receitasAtuais = [];

            if (snapshot.empty) {
                suggestionsDocRef = await addDoc(suggestionsRef, {
                    receitas: [],
                    createdAt: Timestamp.now(),
                });
            } else {
                const docSnap = snapshot.docs[0];
                suggestionsDocRef = docSnap.ref;
                const data = docSnap.data();
                receitasAtuais = Array.isArray(data.receitas) ? data.receitas : [];
            }

            const novasReceitas = Array.isArray(suggestionData)
                ? suggestionData
                : [suggestionData];

            const novasReceitasComTimestamp = novasReceitas.map((r) => ({
                ...r,
                createdAt: Timestamp.now(),
            }));

            let todasReceitas = [...receitasAtuais, ...novasReceitasComTimestamp];

            if (todasReceitas.length > 10) {
                const excesso = todasReceitas.length - 10;
                todasReceitas = todasReceitas.slice(excesso);
            }

            await updateDoc(suggestionsDocRef, {
                receitas: todasReceitas,
                updatedAt: Timestamp.now(),
            });

            return { success: true, message: "Sugestões adicionadas com sucesso!" };
        } catch (error) {
            console.error(`[Database::addSuggestion] uid:${uid}:`, error);
            throw error;
        }
    }


    async getSuggestions(uid) {
        try {
            const userRef = doc(db, this.user, uid);
            const suggestionsRef = collection(userRef, this.subcollections.suggestions);

            const snapshot = await getDocs(suggestionsRef);

            if (snapshot.empty) {
                return { success: false, message: "Nenhuma sugestão encontrada para esse usuário." };
            }

            const suggestionsDoc = snapshot.docs[0].data();
            const receitas = Array.isArray(suggestionsDoc.receitas)
                ? suggestionsDoc.receitas
                : [];

            return { success: true, data: receitas };
        } catch (error) {
            console.error(`[Database::getUserSuggestions] uid:${uid}:`, error);
            throw error;
        }
    }

    async getSuggestionByName(uid, nomeReceita) {
        try {
            if (!uid) {
                throw new Error("UID do usuário não informado");
            }

            if (!nomeReceita) {
                throw new Error("Nome da receita não informado");
            }

            const userRef = doc(db, this.user, uid);
            const suggestionsRef = collection(userRef, this.subcollections.suggestions);

            const snapshot = await getDocs(suggestionsRef);

            if (snapshot.empty) {
                return { success: false, message: "Nenhuma sugestão encontrada para esse usuário." };
            }

            // Pelo seu modelo atual você usa só o primeiro doc de sugestões
            const suggestionsDoc = snapshot.docs[0].data();
            const receitas = Array.isArray(suggestionsDoc.receitas)
                ? suggestionsDoc.receitas
                : [];

            // Aqui filtro pelo nome. Dá pra usar 'nome' ou 'name' pra ser mais resiliente.
            const encontradas = receitas.filter((r) => {
                const nome = r.nome || r.name || "";
                return nome.toLowerCase() === nomeReceita.toLowerCase();
            });

            if (encontradas.length === 0) {
                return {
                    success: false,
                    message: "Nenhuma sugestão encontrada com esse nome.",
                    data: []
                };
            }

            return {
                success: true,
                message: "Sugestões encontradas com sucesso.",
                data: encontradas
            };
        } catch (error) {
            console.error(`[Database::getSuggestionByName] uid:${uid}, nome:${nomeReceita}`, error);
            throw error;
        }
    }


    async addFavorite(uid, favoriteData) {
        try {

            if (!uid) {
                throw new Error("UID do usuário não informado");
            }

            if (!favoriteData) {
                throw new Error("Nenhuma receita enviada para favoritar");
            }

            const nomeReceita = favoriteData.nome || favoriteData.name;
            if (!nomeReceita) {
                throw new Error("Receita favorita precisa ter um campo 'nome'.");
            }

            const userRef = doc(db, this.user, uid);
            const favoritesRef = collection(userRef, this.subcollections.favorites);

            const snapshot = await getDocs(favoritesRef);

            let favoritesDocRef;
            let receitasAtuais = [];

            if (snapshot.empty) {

                favoritesDocRef = await addDoc(favoritesRef, {
                    receitas: [],
                    createdAt: Timestamp.now(),
                });
            } else {
                const docSnap = snapshot.docs[0];
                favoritesDocRef = docSnap.ref;
                const data = docSnap.data();
                receitasAtuais = Array.isArray(data.receitas) ? data.receitas : [];
            }

            const indexExistente = receitasAtuais.findIndex(
                (r) => r.nome === nomeReceita
            );

            let acao;

            if (indexExistente !== -1) {

                receitasAtuais.splice(indexExistente, 1);
                acao = "removed";
            } else {

                receitasAtuais.push({
                    ...favoriteData,
                    favoritedAt: Timestamp.now(),
                });
                acao = "added";
            }


            await updateDoc(favoritesDocRef, {
                receitas: receitasAtuais,
                updatedAt: Timestamp.now(),
            });

            return {
                success: true,
                action: acao,
                message:
                    acao === "added"
                        ? "Receita adicionada aos favoritos com sucesso!"
                        : "Receita removida dos favoritos com sucesso!",
            };
        } catch (error) {
            console.error(`[Database::addFavorite] uid:${uid}:`, error);
            throw error;
        }
    }


    async getUserFavorites(uid) {
        try {
            const userRef = doc(db, this.user, uid);
            const favoritesRef = collection(userRef, this.subcollections.favorites);

            const snapshot = await getDocs(favoritesRef);

            if (snapshot.empty) {
                return { success: false, message: "Nenhum favorito encontrado para esse usuário." };
            }

            const favoritesDoc = snapshot.docs[0].data();
            const receitas = Array.isArray(favoritesDoc.receitas)
                ? favoritesDoc.receitas
                : [];

            return { success: true, data: receitas };
        } catch (error) {
            console.error(`[Database::getUserFavorites] uid:${uid}:`, error);
            throw error;
        }
    }

    async getFavoriteByName(uid, nomeReceita) {
    try {
        if (!uid) {
            throw new Error("UID do usuário não informado");
        }

        if (!nomeReceita) {
            throw new Error("Nome da receita não informado");
        }

        const userRef = doc(db, this.user, uid);
        const favoritesRef = collection(userRef, this.subcollections.favorites);

        const snapshot = await getDocs(favoritesRef);

        if (snapshot.empty) {
            return { success: false, message: "Nenhum favorito encontrado para esse usuário." };
        }

        // Pelo seu modelo atual você usa só o primeiro doc de favoritos
        const favoritesDoc = snapshot.docs[0].data();
        const receitas = Array.isArray(favoritesDoc.receitas)
            ? favoritesDoc.receitas
            : [];

        // Filtro pelo nome. Considero 'nome' e 'name' para ser mais resiliente.
        const encontrados = receitas.filter((r) => {
            const nome = r.nome || r.name || "";
            return nome.toLowerCase() === nomeReceita.toLowerCase();
        });

        if (encontrados.length === 0) {
            return {
                success: false,
                message: "Nenhum favorito encontrado com esse nome.",
                data: []
            };
        }

        return {
            success: true,
            message: "Favoritos encontrados com sucesso.",
            data: encontrados
        };
    } catch (error) {
        console.error(`[Database::getFavoriteByName] uid:${uid}, nome:${nomeReceita}`, error);
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