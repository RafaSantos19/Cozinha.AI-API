import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

const authService = new AuthService();
const userService = new UserService();

export async function deleteUserUseCase(uid) {
  try {

    await authService.deleteUserAccount(uid);
    await userService.deleteUser(uid);

    return true;
  } catch (error) {
    console.error("[DeleteUserUseCase]: ", error);
    throw new Error("Erro de caso de uso");        
  }
}
