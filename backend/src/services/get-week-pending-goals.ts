import dayjs from "dayjs";
import { goalCompletions, goals } from "../db/schema";
import { db } from "../db";
import { count, gte, lte, and, eq, sql } from "drizzle-orm";

export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf("week").toDate();
  const firstDayOfWeek = dayjs().startOf("week").toDate();

  const goalsCreatedUpToThisWeek = db.$with("goalsCreatedUpToThisWeek").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  );

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
          lte(goalCompletions.completedAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreatedUpToThisWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToThisWeek.id,
      title: goalsCreatedUpToThisWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToThisWeek.desiredWeeklyFrequency,
      completionCounts: sql`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalsCreatedUpToThisWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalsCreatedUpToThisWeek.id, goalCompletionCounts.goalId)
    );

  return {
    pendingGoals,
  };
}
