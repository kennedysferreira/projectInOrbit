import { count, and, gte, lte, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals} from "../db/schema";
import dayjs from "dayjs";

interface createGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: createGoalCompletionRequest) {

  const lastDayOfWeek = dayjs().endOf("week").toDate();
  const firstDayOfWeek = dayjs().startOf("week").toDate();

  const goalCompletionCounts = db.$with("goal-completion-counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.completedAt, firstDayOfWeek),
          lte(goalCompletions.completedAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const resultCounts = await db
  .with(goalCompletionCounts)
  .select({
    desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    completionCounts: sql`
      COALESCE(${goalCompletionCounts.completionCount}, 0)
    `.mapWith(Number),
  })
  .from(goals)
  .leftJoin(
    goalCompletionCounts,
    eq(goals.id, goalCompletionCounts.goalId)
  )
  .where(eq(goals.id, goalId))
  .limit(1);

  const { desiredWeeklyFrequency, completionCounts} = resultCounts[0];

  if (completionCounts >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed");
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();

  const goalCompletion = insertResult[0];

  return {
    goalCompletion,
  };
}
