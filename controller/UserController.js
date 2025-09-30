import UserService from "../services/UserService.js";

class UserController{
    constructor(){
        this.userService = new UserService();
    }

    async getUserByUid(req, res){
        const teste = req.headers

        console.log(teste);
    }

    async getUserByEmail(req, res){}

    async updateUser(req, res){}

    async deleteUser(req, res){}

    async deactivateUser(req, res){}

}

export default UserController;