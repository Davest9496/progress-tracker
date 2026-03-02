"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTaskAction } from "@/app/actions";

interface Task {
    id: string;
    title: string;
    isDone: boolean;
    category: string | null;
}

interface TaskItemProps {
    task: Task;
    isAdmin: boolean;
}

export function TaskItem({ task, isAdmin }: TaskItemProps) {
    const [isPending, startTransition] = useTransition();

    const handleFormAction = async () => {
        if (!isAdmin) return;
        // We toggle the *opposite* of the current state
        await toggleTaskAction(task.id, !task.isDone);
    };

    return (
        <form action={handleFormAction}>
            <div
                className={`flex items-start gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 group ${isPending ? "opacity-50" : ""
                    } ${task.isDone ? "opacity-60" : ""} ${isAdmin ? "hover:bg-[hsl(var(--secondary))]" : ""}`}
            >
                <Checkbox
                    id={task.id}
                    checked={task.isDone}
                    disabled={!isAdmin || isPending}
                    onCheckedChange={(checked) => {
                        if (!isAdmin) return;
                        startTransition(() => {
                            toggleTaskAction(task.id, checked as boolean);
                        });
                    }}
                    className="mt-0.5 flex-shrink-0"
                />
                <label
                    htmlFor={task.id}
                    className={`text-sm leading-relaxed cursor-${isAdmin ? "pointer" : "default"} ${task.isDone ? "line-through text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]"
                        }`}
                >
                    {task.title}
                </label>
            </div>
        </form>
    );
}
