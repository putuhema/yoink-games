import { cn } from "@/lib/utils";

type CardProps = {
  isPick: boolean;
  text: string;
  onPick: () => void;
}

export default function Card({ text, onPick, isPick }: CardProps) {
  return (
    <div onClick={onPick} className={cn("rounded-md bg-stone-200 hover:bg-stone-300 cursor-pointer grid place-content-center p-8", isPick && "bg-stone-500 hover:bg-stone-600 text-white")}>
      <p className="text-xl font-semibold capitalize">{text}</p>
    </div>
  )
}
