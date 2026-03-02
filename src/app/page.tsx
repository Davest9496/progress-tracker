export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { Progress } from "@/components/ui/progress";
import { CountdownCard } from "@/components/CountdownCard";
import { TaskItem } from "@/components/TaskItem";
import { DailyLogForm } from "@/components/DailyLogForm";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const GOALS = [
  { title: "MS-900", deadline: new Date("2026-03-10"), colour: "217 91% 60%", emoji: "🔵" },
  { title: "ITIL 4 Foundation", deadline: new Date("2026-04-03"), colour: "27 96% 61%", emoji: "🟠" },
  { title: "Driving Theory", deadline: new Date("2026-04-11"), colour: "142 70% 45%", emoji: "🟢" },
  { title: "Homelab (5 Phases)", deadline: new Date("2026-04-11"), colour: "258 90% 66%", emoji: "🔧" },
];

export default async function Home() {
  const admin = await isAdmin();

  const phases = await prisma.phase.findMany({
    include: { tasks: true },
    orderBy: { id: "asc" },
  });

  const recentLogs = await prisma.dailyLog.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });

  const allTasks = phases.flatMap((p) => p.tasks);
  const completedCount = allTasks.filter((t) => t.isDone).length;
  const totalCount = allTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            JourneyTracker
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Dave Ejezie · MSP Help Desk Sprint · March–April 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          {admin ? (
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit" className="text-xs border-[hsl(var(--border))]">
                Logout
              </Button>
            </form>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs border-[hsl(var(--border))]">
                Admin Login
              </Button>
            </Link>
          )}
          {admin && (
            <span className="text-xs bg-[hsl(var(--accent))/0.15] text-[hsl(var(--accent))] px-2 py-1 rounded-full border border-[hsl(var(--accent))/0.3]">
              ⚡ Admin Mode
            </span>
          )}
        </div>
      </header>

      {/* Overall Progress */}
      <section className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Overall Journey Progress
          </h2>
          <span className="text-2xl font-bold text-[hsl(var(--primary))]">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-3 bg-[hsl(var(--secondary))]" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {completedCount} of {totalCount} tasks completed across {phases.length} weeks
        </p>
      </section>

      {/* Countdown Cards */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
          🎯 Goals &amp; Deadlines
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GOALS.map((g) => (
            <CountdownCard key={g.title} {...g} />
          ))}
        </div>
      </section>

      {/* Phases & Tasks */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          📅 Weekly Phases
        </h2>
        {phases.map((phase) => {
          const done = phase.tasks.filter((t) => t.isDone).length;
          const total = phase.tasks.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div key={phase.id} className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[hsl(var(--border)/0.5)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-[hsl(var(--foreground))]">
                    {phase.title}
                  </h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {done}/{total} · {pct}%
                  </span>
                </div>
                <Progress value={pct} className="h-1.5 bg-[hsl(var(--secondary))]" />
              </div>
              <div className="px-2 py-2 max-h-[400px] overflow-y-auto">
                {phase.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} isAdmin={admin} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Daily Handover */}
      {admin && (
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            📝 Daily Shift Handover
          </h2>
          <DailyLogForm />
        </section>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            📋 Recent Handover Logs
          </h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="border-l-2 border-[hsl(var(--primary))] pl-4 space-y-2">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {new Date(log.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-sm"><span className="text-green-400 font-medium">✅ Completed:</span> {log.completed}</p>
                <p className="text-sm"><span className="text-yellow-400 font-medium">🤔 Struggled:</span> {log.struggled}</p>
                <p className="text-sm"><span className="text-orange-400 font-medium">😬 Worries:</span> {log.worries}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-[hsl(var(--muted-foreground))] py-4">
        Built by Dave Ejezie · <a href="https://duejezie.dev" className="hover:text-[hsl(var(--primary))] transition-colors">duejezie.dev</a>
      </footer>
    </main>
  );
}
