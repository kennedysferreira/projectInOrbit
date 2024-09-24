import { Dialog } from "./components/ui/dialog";
import { CreateGoal } from "./components/create-goal";
import { Summary } from "./components/summary";
import { EmptyGoals } from "./components/empty-goals";
import { useQuery } from "@tanstack/react-query";
import { GetSummary } from "./http/get-summary";

export function App() {

  // const [summary, setSummary] = useState({} as SummaryType)

  // useEffect(() => {
  //   fetch("http://localhost:3000/summary")
  //   .then(res => res.json())
  //   .then(data => setSummary(data.summary))
  // }, [])

  const {data} = useQuery({
    queryKey: ['summary'],
    queryFn: GetSummary,
    staleTime: 1000 * 60 ,
  })

  return (
    <Dialog>
      {data?.total && data?.total > 0 ? <Summary /> : <EmptyGoals />}
      <CreateGoal />
    </Dialog>
  );
}
