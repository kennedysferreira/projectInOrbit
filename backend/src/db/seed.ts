import dayjs from "dayjs";
import { db } from ".";
import { goalCompletions, goals } from "./schema";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result =await db.insert(goals).values([
    { title: "Learn Node.js", desiredWeeklyFrequency: 5 },
    { title: "Learn React.js", desiredWeeklyFrequency: 3 },
    { title: "Learn Drizzle", desiredWeeklyFrequency: 3 },
  ]).returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id , completedAt: startOfWeek.toDate() },
    { goalId: result[1].id , completedAt: startOfWeek.add(1, "days").toDate() },
  ]);
}

seed().finally(() => process.exit());
