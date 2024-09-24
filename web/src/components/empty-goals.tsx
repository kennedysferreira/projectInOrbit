import logo from "../assets/logo.svg";
import letsStart from "../assets/lets-start.svg";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
        <img src={logo} alt="logo iin.orbit" />
        <img src={letsStart} alt="iin.orbit background" />
        <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
          You haven't registered any goals yet, how about registering one right
          now?
        </p>
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Register a goal
          </Button>
        </DialogTrigger>
      </div>
  )
}