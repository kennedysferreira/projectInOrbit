type SummaryType = {
  completed: number;
  total: number;
  goalsPerDay: Record<string, {
      id: string;
      title: string;
      completedAt: string;
  }[]>;
}

export async function GetSummary(): Promise<SummaryType> {
 const res = await fetch("http://localhost:3000/summary")
  const data = await res.json()
  return data.summary
}