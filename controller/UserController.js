import UserService from "../services/UserService.js";
import { deleteUserUseCase } from "../use-case/DeleteUserUseCase.js"

class UserController{
    constructor(){
        this.userService = new UserService();
    }

    async getUserByUid(req, res){
        const { uid } = req.user;

        if(!uid) {
            return res.status(400).json({message: "Dados inválidos"});
        }

        try {
            const result = await this.userService.getUserByUid(uid);
            return res.status(201).json({message: "Usuário encontrado", user: result});
        } catch (error) {
            console.error("[UserController::getUserByUid]: ", error);
            return res.status(500).json({message: "Usuário não encontrado"});            
        } 
    }

    async getUserByEmail(req, res){
        const { email } = req.user;

        if(!email) {
            return res.status(400).json({message: "Dados inválidos"});
        }

        try {
            const result = await this.userService.getUserByEmail(email);
            return res.status(201).json({message: "Usuário encontrado", user: result});
        } catch (error) {
            console.error("[UserController::getUserByEmail]: ", error);
            return res.status(500).json({message: "Usuário não encontrado"});            
        } 
    }

    async updateUser(req, res){
       const { uid } = req.user;
       const newData = req.body;

       if(!uid || !newData){
            return res.status(400).json({message: "Dados inválidos"})
       }

       try {
        const result = await this.userService.updateUser(uid, newData);
        if(result.success === true){
            return res.status(201).json({message: result.message});
        }
       } catch (error) {
            console.error("[UserController::updateUser]: ", error)
            return res.status(500).json({message: "Erro ao atualizar usuário"})
       }
    }

    async deleteUser(req, res){
        const { uid } = req.user;

        if(!uid){
            return res.status(400).json({message: "Dados inválidos"});
        }

        try {
            await deleteUserUseCase(uid);
            return res.status(201).json({message:"Usuário excluído com sucesso"})
        } catch (error) {
            console.error("[UserController::deleteUser]: ", error);
            return res.status(500).json({message: "Erro ao deletar o usuário"})
        }
    }

}

export default UserController;