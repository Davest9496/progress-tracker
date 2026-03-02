import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const connectionString =
    process.env.PRISMA_DATABASE_URL ??
    process.env.DATABASE_URL ??
    "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const TRACKER_PATH = path.join(__dirname, "../../Dave_Progress_Tracker.md");

const goals = [
    { title: "MS-900 Microsoft 365 Fundamentals", deadline: new Date("2026-03-10") },
    { title: "ITIL 4 Foundation", deadline: new Date("2026-04-03") },
    { title: "Driving Theory Test", deadline: new Date("2026-04-11") },
    { title: "Homelab (5 Phases)", deadline: new Date("2026-04-11") },
];

function parseTracker() {
    const content = fs.readFileSync(TRACKER_PATH, "utf-8");
    const lines = content.split("\n");

    const phases: Array<{
        title: string;
        theme: string;
        tasks: Array<{ title: string; category: string }>;
    }> = [];

    let currentPhase: (typeof phases)[0] | null = null;
    let currentCategory = "General";

    for (const raw of lines) {
        const line = raw.trim();

        if (line.startsWith("# 📅 WEEK")) {
            if (currentPhase) phases.push(currentPhase);
            currentPhase = { title: line.replace("# 📅 ", "").trim(), theme: "", tasks: [] };
        }

        if (
            line.startsWith("**") &&
            line.endsWith("**") &&
            (line.includes("Morning") ||
                line.includes("Midday") ||
                line.includes("Evening") ||
                line.includes("Lab") ||
                line.includes("Daily"))
        ) {
            currentCategory = line.replace(/\*\*/g, "").trim();
        }

        if (line.startsWith("- [ ]") && currentPhase) {
            const title = line.replace("- [ ]", "").trim();
            if (
                title.length > 3 &&
                !title.startsWith("Day ") &&
                !title.startsWith("Exam Day") &&
                !title.includes("MILESTONE")
            ) {
                currentPhase.tasks.push({ title, category: currentCategory });
            }
        }
    }
    if (currentPhase) phases.push(currentPhase);
    return phases;
}

async function main() {
    console.log("🌱 Seeding database...");
    console.log("DB URL prefix:", connectionString.slice(0, 20));

    await prisma.task.deleteMany();
    await prisma.phase.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.dailyLog.deleteMany();

    for (const goal of goals) {
        await prisma.goal.create({ data: goal });
    }
    console.log(`✅ Seeded ${goals.length} goals`);

    const phases = parseTracker();
    let taskCount = 0;

    for (const p of phases) {
        const phase = await prisma.phase.create({
            data: { title: p.title, theme: p.theme },
        });
        for (const t of p.tasks) {
            await prisma.task.create({
                data: { title: t.title, category: t.category, phaseId: phase.id },
            });
            taskCount++;
        }
    }

    console.log(`✅ Seeded ${phases.length} phases and ${taskCount} tasks`);
    console.log("🎉 Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
