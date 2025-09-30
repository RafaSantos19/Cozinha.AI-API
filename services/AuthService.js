import DoAuth from "../config/Auth.js";

class AuthService {
    constructor() {
        this.doAuth = new DoAuth();
    }

    async userSignUp(email, password) {
        try {
            const result = await this.doAuth.doCreateUserWithEmailAndPassword(email, password);

            if (!result.success){
                console.error("Erro ao cadastrar usuário");
            }
            
            return result;

        } catch (error) {
            console.error("[AuthService::userSignUp]: " , error);
        }
    }

    async userLogin(email, password) {
        try {
            const userCredendial = await this.doAuth.doSignInWithEmailAndPassword(email, password);
            if (!userCredendial.data.emailVerified) {
                return {
                    success: false,
                    message: "E-mail não verificado"
                }
            }
            return {
                success: true,
                message: "Login realizado com sucesso",
                userData: userCredendial.data
            };
        } catch (error) {
            console.error("[AuthService::userLogin]:", error);
            throw error;
        }
    }

    async userPasswordReset(email) {
         try {
            await this.doAuth.doPasswordReset(email);
            return {
                success: true,
                message: "E-mail de redefinição enviado com sucesso"
            };
        } catch (error) {
            console.error("[AuthService::sendPasswordResetEmail]:", error);
            throw error;
        }
    }

    async deleteUserAccount(){}
}

export default AuthService;