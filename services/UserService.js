 import Database from "../config/Database.js";

 class UserService {
    constructor(){
        this.db = new Database
    }

    async createUser(uid, data){
        try {
            return await this.db.createUserDoc(uid, data);
        } catch (error) {
            console.error("[UserService::createUser]: ". error);
            throw new Error("Erro ao criar usuário");
        }
    }

    async getUserByUid(uid){
        //Filtrar se vai buscar tudo de user ou não(subcollections)
        try {
            return await this.db.getDocByUid(uid);
        } catch (error) {
            console.error("[UserService::getUserByUid]: ", error);
            throw new Error("Erro ao buscar dados do usuário");        
        }
    }

    async getUserByEmail(email){
        try {
            return await this.db.getUserByEmail(email);
        } catch (error) {
            console.error("[UserService::getUserByEmail]: ", error);
            throw new Error("Erro ao buscar usuário pelo email");
        }
    }

    async updateUser(uid, newData){
        try {
            return await this.db.updateUserDoc(uid, newData);
        } catch (error) {
            console.error("[UserService::updateUser]: ", error);
            throw new Error("Erro ao atualizar dados do usuário");
        }
    }

 }

 export default UserService