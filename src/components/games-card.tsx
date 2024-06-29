import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type GamesCardProps = {
  bgColor?: string;
  title: string;
  link: string;
  desc?: string;
  icon?: string;
}

export default function GamesCard({ bgColor = "bg-white", title, desc, link }: GamesCardProps) {
  return (
    <Link to={link}>
      <div className="border rounded-md space-y-2">
        <div className={cn(bgColor, "rounded-t-md text-center min-h-[200px] grid place-content-center")}>
          <p className="text-2xl font-bold">{title}</p>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground text-center">{desc}</p>
          <button className="rounded-full w-full py-2 border font-semibold">Play</button>
        </div>
      </div>
    </Link>
  )
}
