import { and, eq, lte, gte, sql, desc} from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

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

  const goalsCompletedInWeek = db.$with("goal-completion-counts").as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedAt: goalCompletions.completedAt,
        completedAtDate: sql`DATE(${goalCompletions.completedAt})`.as(
          "completedAtDate"
        ),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.completedAt, firstDayOfWeek),
          lte(goalCompletions.completedAt, lastDayOfWeek)
        )
      )
      .orderBy(desc(goalCompletions.completedAt))
  );

  const goalsCompletedByWeekDay = db.$with("goalsCompletedByWeekDay").as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql`JSON_AGG(
        JSON_BUILD_OBJECT(
        'id', ${goalsCompletedInWeek.id},
        'title', ${goalsCompletedInWeek.title},
        'completedAt', ${goalsCompletedInWeek.completedAt}
        ))`.as("completions"),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  );

  type GoalsPerDay = Record<string, {
    id: string;
    title: string;
    completedAt: string;
  }[]>

  const result = await db
    .with(
      goalsCreatedUpToThisWeek,
      goalsCompletedInWeek,
      goalsCompletedByWeekDay
    )
    .select({
      completed: sql`
    (SELECT COUNT(*) FROM ${goalsCompletedInWeek})
    `.mapWith(Number),
      total:
        sql`(SELECT SUM(${goalsCreatedUpToThisWeek.desiredWeeklyFrequency}::NUMERIC) FROM ${goalsCreatedUpToThisWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql <GoalsPerDay>`JSON_OBJECT_AGG(
    ${goalsCompletedByWeekDay.completedAtDate},
    ${goalsCompletedByWeekDay.completions}
    )`.as("goalsPerDay"),
    })
    .from(goalsCompletedByWeekDay);

  return {
    summary: result[0],
  };
}
