import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const goals = pgTable("goals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  desiredWeeklyFrequency: integer("desired_weekly_frequency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const goalCompletions = pgTable("goal_completions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text("goal_id")
    .references(() => goals.id, { onDelete: "cascade" })
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
