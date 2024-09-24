type PendingGoals = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCounts: number;
}[]
export async function GetPendingGoals():Promise<PendingGoals> {
  const res = await fetch("http://localhost:3000/pending-goals")
  const data = await res.json()
  return data.pendingGoals
}