import { X } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "./ui/radio-group";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGoalFetch } from "../http/create-goal-fetch";
import { useQueryClient } from "@tanstack/react-query";

const createGoalForm = z.object({
  title: z.string().min(1, "Enter the activity you want to do"),
  desiredWeekFrequency: z.coerce.number().min(1).max(7),
});

type CreateGoalForm = z.infer<typeof createGoalForm>;

export function CreateGoal() {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(createGoalForm),
  });

  async function handleCreateGoal(data: CreateGoalForm) {
    await CreateGoalFetch({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeekFrequency,
    });

    
    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });

    reset()
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <DialogTitle>Register a goal</DialogTitle>
          <DialogClose>
            <X className="size-4 text-zinc-600" />
          </DialogClose>
        </div>
        <div>
          <DialogDescription>
            Add activities that{" "}
            <span className="underline">are good for you</span> and that you
            want to continue practicing every week.
          </DialogDescription>
        </div>
        <Separator />
        <form onSubmit={handleSubmit(handleCreateGoal)} className="flex flex-col flex-1 justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="activity">What is the activity?</label>
              <Input
                id="activity"
                autoFocus
                placeholder="Exercising, meditating, etc."
                {...register("title")}
              />

              {formState.errors.title && (
                <span className="text-sm text-red-500">
                  {formState.errors.title.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="duration">How many times a week?</label>
              <Controller
                control={control}
                name="desiredWeekFrequency"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          1x a week
                        </span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          2x a week
                        </span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          3x a week
                        </span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          4x a week
                        </span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          5x a week
                        </span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          6x a week
                        </span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-sm text-zinc-300 font-medium leading-none">
                          7x a week
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="flex-1">
                Close
              </Button>
            </DialogClose>

            <Button className="flex-1">Save</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
