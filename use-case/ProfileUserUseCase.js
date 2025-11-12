// usecases/profileUserUseCase.js
import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

const authService = new AuthService();
const userService = new UserService();

export async function profileUserUseCase(email, password) {
  try {
    // 1) Login → pega uid e token
    const credentials = await authService.userLogin(email, password);
    const uid   = credentials?.userData?.uid;
    const token = credentials?.userData?.token;
    if (!uid || !token) throw new Error("LOGIN_MALFORMED");

    // 2) Injeta token no UserService (se sua API exige Authorization)
    if (userService.setAuthToken) userService.setAuthToken(token);

    // 3) Busca perfil
    const profileRes = await userService.getUserByUid(uid);

    if (!profileRes?.success || !profileRes?.data) {
      throw new Error("USER_PROFILE_NOT_FOUND");
    }

    // (Opcional) normalizar createdAt se vier como Timestamp do Firestore
    const data = { ...profileRes.data };
    if (data?.createdAt?.seconds != null) {
      data.createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
    }

    // 4) Compor token dentro do data — mesmo shape do seu exemplo + token
    return {
      success: true,
      data: {
        ...data,
        token, 
      },
    };
  } catch (err) {
    const msg = err?.message ?? "UNKNOWN";
    throw new Error(`AUTH_PROFILE_FLOW_FAILED:${msg}`);
  }
}