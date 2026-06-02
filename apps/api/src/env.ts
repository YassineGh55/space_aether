import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
export const isProduction = process.env.NODE_ENV === "production";
/** Secure cookies only when the client is served over HTTPS (e.g. production deploy). */
export const useSecureCookies = clientUrl.startsWith("https://");
export const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
