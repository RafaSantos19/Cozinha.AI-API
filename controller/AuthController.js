import AuthService from "../services/AuthService.js";
import { registerUserUseCase } from "../use-case/RegisterUserUseCase.js";

class AuthController{
    constructor() {
        this.authService = new AuthService();
    }

    async userSignUp(req, res){
        const {name, email, password} = req.body;

        if(!name && !email && !password){
            return res.status(400).json({message: "Dados inválidos"});
        }

        const user = {
            name: name,
            email: email,
            password: password,
        }

        try {
            await registerUserUseCase(user);
            return res.status(201).json({message: "Usuário cadastrado com sucesso"});
        } catch (error) {
            console.error("[AuthController::userSignUp]: ", error);
            return res.status(500).json({message: "Erro ao criar usuário", error});
        }
    }

    async userLogin(req, res){
        const { email, password } = req.body;

        if(!email && !password){
            return res.status(400).json({message: "Dados inválidos"});
        }

        try {
            const result = await this.authService.userLogin(email, password);
            
            if(result.success === false) {
                return res.status(400).json({message: "Email não verificado"});
            }
                return res.status(200).json({ message: "Login realizado com sucesso", result})
        } catch (error) {
            console.error("[AuthController::userLogin]: ", error);
            return res.status(500).json({message: "Erro ao realizar login", error});           
        }
    }

    async userPasswordReset(req, res){
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email inválido" });
        }

        try {
            await this.authService.sendPasswordResetEmail(email);
            return res.status(200).json({ message: "Email de recuperação enviado com sucesso" });
        } catch (error) {
            console.error("[AuthController::passwordReset]:", error);
            return res.status(500).json({ message: "Erro ao enviar email de recuperação", error });
        }
    }

}

export default AuthController;