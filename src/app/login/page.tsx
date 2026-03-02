"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/");
                router.refresh();
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass rounded-2xl p-8 w-full max-w-sm space-y-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Admin Login</h1>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Enter your password to enable admin controls.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                            Password
                        </label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••••••"
                            required
                            className="bg-[hsl(var(--secondary))] border-[hsl(var(--border))]"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-[hsl(var(--destructive))]">❌ {error}</p>
                    )}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold"
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
                    Visitors can view progress without logging in.
                </p>
            </div>
        </div>
    );
}
