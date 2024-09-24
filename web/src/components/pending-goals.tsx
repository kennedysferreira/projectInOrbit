import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPendingGoals } from "../http/get-peding-goals";
import { OutlineButton } from "./ui/outline-button";
import { Plus } from "lucide-react";
import { CreateGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: GetPendingGoals,
    staleTime: 1000 * 5,
  });

  if (!data) return null;

  function handleCompleteGoal(goalId: string) {
    CreateGoalCompletion(goalId);

    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
  }
  

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((goal) => {
        return (
          <OutlineButton key={goal.id} disabled={goal.completionCounts >= goal.desiredWeeklyFrequency} onClick={() => handleCompleteGoal(goal.id)}>
            <Plus className="size-4 text-zinc-400" />
            {goal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
}
