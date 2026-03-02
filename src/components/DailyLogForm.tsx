"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitDailyLogAction } from "@/app/actions";

export function DailyLogForm() {
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await submitDailyLogAction(formData);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        });
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    ✅ Completed today
                </label>
                <Textarea
                    name="completed"
                    placeholder="e.g. Studied ITIL 4 Guiding Principles, ran onboard-user.ps1 lab..."
                    className="bg-[hsl(var(--secondary))] border-[hsl(var(--border))] resize-none text-sm min-h-[80px]"
                    required
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    🤔 Struggled with
                </label>
                <Textarea
                    name="struggled"
                    placeholder="e.g. Confused by Conditional Access policies..."
                    className="bg-[hsl(var(--secondary))] border-[hsl(var(--border))] resize-none text-sm min-h-[60px]"
                    required
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    😬 Worries for tomorrow
                </label>
                <Textarea
                    name="worries"
                    placeholder="e.g. Practice exam tomorrow, not sure if I'm ready..."
                    className="bg-[hsl(var(--secondary))] border-[hsl(var(--border))] resize-none text-sm min-h-[60px]"
                    required
                />
            </div>
            <Button
                type="submit"
                disabled={isPending}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90"
            >
                {isPending ? "Saving..." : submitted ? "✅ Saved!" : "Submit Daily Handover"}
            </Button>
        </form>
    );
}
