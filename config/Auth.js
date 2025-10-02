import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    
} from "firebase/auth";
import { auth } from "./firebase.js";
import { adminAuth } from "./admin.js";

class DoAuth {

    async doCreateUserWithEmailAndPassword(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            return {
                success: true,
                data: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    emailVerified: userCredential.user.emailVerified
                }
            };
        } catch (error) {
            console.error("[Auth::doCreateUserWithEmailAndPassword]:", error);
            throw error;
        }
    };

    async doSignInWithEmailAndPassword(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            
            return {
                success: true,
                data: {
                    token: token,
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    emailVerified: userCredential.user.emailVerified
                }
            };
        } catch (error) {
            console.error("[Auth::doSignInWithEmailAndPassword]:", error);
            throw {
                success: false,
                message: error.message,
                code: error.code
            };
        }
    }

    async doPasswordReset(email) {
        try {
            await sendPasswordResetEmail(auth, email)
            return {success: true}
        } catch (error) {
            console.error("[Auth::doPasswordReset]:", error);
            throw error;
        }
    }
    
        async doDeleteUser(uid){
        try {
            await adminAuth.deleteUser(uid);
            return {success: true};
        } catch (error) {
            console.error("[Auth::doDeleteUser]: ", error);
            throw error;
        }
    }

    async doDeactvateUser(){}
}

export default DoAuth;