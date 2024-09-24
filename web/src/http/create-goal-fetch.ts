interface CreateGoalResponse {
  title: string;
  desiredWeeklyFrequency: number;
}
export async function CreateGoalFetch({
  title,
  desiredWeeklyFrequency,
}: CreateGoalResponse) {
  await fetch("http://localhost:3000/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, desiredWeeklyFrequency }),
  });
}
