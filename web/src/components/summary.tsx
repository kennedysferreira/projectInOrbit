import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { GetSummary } from "../http/get-summary";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { PendingGoals } from "./pending-goals";

export function Summary() {
  const { data } = useQuery({
    queryKey: ["summary"],
    queryFn: GetSummary,
    staleTime: 1000 * 5,
  });

  if (!data) return null;

  const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

  const completedPercentage = Math.round((data.completed / data.total) * 100);
  const dataEntries = Object.entries(data.goalsPerDay || {});

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Register a goal
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={data.total} value={data.completed}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex justify-between items-center text-xs text-zinc-400">
          <span>
            Completed <span className="text-zinc-100">{data.completed}</span> of{" "}
            <span className="text-zinc-100">{data.total}</span> goals this week.
          </span>
          <span>{`${completedPercentage}`}%</span>
        </div>
      </div>

      <Separator />
      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Your week</h2>

        {dataEntries.map(([date, goals]) => {
          const weekDay = dayjs(date).format("dddd");
          const formattedDay = dayjs(date).format("D [de] MMMM");

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                {weekDay}{" "}
                <span className="text-zinc-400 text-xs">({formattedDay})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map((goal) => {
                  const completedHour = dayjs(goal.completedAt).format("HH:mm");
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        You completed "
                        <span className="text-zinc-100 font-medium">
                          {goal.title}
                        </span>
                        " at{" "}
                        <span className="text-zinc-100 font-medium">
                          {completedHour}h
                        </span>{" "}
                        Undo{" "}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
