import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "fallback-secret-change-in-production"
);

export async function createAdminToken(): Promise<string> {
    return new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === "admin";
    } catch {
        return false;
    }
}

export async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return false;
    return verifyAdminToken(token);
}
