import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

const authService = new AuthService();
const userService = new UserService();

export async function registerUserUseCase(user) {
  try {
    const { data } = await authService.userSignUp(user.email, user.password);
    const { uid } = data;

    const dataUser = {
      name: user.name,
      email: user.email,
    };

    return await userService.createUser(uid, dataUser);
  } catch (error) {
    console.error("[RegisterUserUseCase]: ", error);
    throw new Error("Erro de caso de uso");        
  }
}
