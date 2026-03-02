"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
    title: string;
    deadline: Date;
    colour: string;
    emoji: string;
}

export function CountdownCard({ title, deadline, colour, emoji }: CountdownProps) {
    const [daysLeft, setDaysLeft] = useState(0);
    const [hoursLeft, setHoursLeft] = useState(0);

    useEffect(() => {
        function calculate() {
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();
            const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
            const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            setDaysLeft(days);
            setHoursLeft(hours);
        }
        calculate();
        const interval = setInterval(calculate, 60000);
        return () => clearInterval(interval);
    }, [deadline]);

    const isCritical = daysLeft <= 10;
    const isPast = daysLeft === 0 && hoursLeft === 0;

    return (
        <div
            className={`glass rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02] ${isCritical && !isPast ? "glow-red border-[hsl(var(--destructive))/0.4]" : ""}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{emoji} {title}</span>
                {isPast ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✅ Done</span>
                ) : isCritical ? (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">CRITICAL</span>
                ) : null}
            </div>
            <div className="flex items-end gap-2 mt-1">
                <span className={`text-5xl font-bold tabular-nums`} style={{ color: `hsl(${colour})` }}>
                    {daysLeft}
                </span>
                <span className="text-[hsl(var(--muted-foreground))] mb-1 text-sm">days {hoursLeft}h</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {new Date(deadline).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
        </div>
    );
}
