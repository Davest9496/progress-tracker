"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isAdmin, createAdminToken, verifyAdminToken } from "@/lib/auth";

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";

    if (password !== adminPassword) {
        return { error: "Invalid password" };
    }

    const token = await createAdminToken();
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    });

    return { success: true };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    revalidatePath("/");
}

export async function toggleTaskAction(taskId: string, isDone: boolean) {
    const admin = await isAdmin();
    if (!admin) throw new Error("Unauthorized");

    await prisma.task.update({
        where: { id: taskId },
        data: { isDone },
    });
    revalidatePath("/");
}

export async function submitDailyLogAction(formData: FormData) {
    const admin = await isAdmin();
    if (!admin) throw new Error("Unauthorized");

    const completed = formData.get("completed") as string;
    const struggled = formData.get("struggled") as string;
    const worries = formData.get("worries") as string;

    await prisma.dailyLog.create({
        data: { completed, struggled, worries },
    });

    revalidatePath("/");
    return { success: true };
}
