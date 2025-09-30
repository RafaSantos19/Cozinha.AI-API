import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

import serviceAccount from "./admin.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();

export { admin, adminAuth };
