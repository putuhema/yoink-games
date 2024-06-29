import { Link } from "@tanstack/react-router";

export default function Nav() {
  return (
    <Link to="/">
      <nav className="p-4 flex justify-between items-center border-b fixed top-0 left-0 bg-white w-full ">
        <p className="font-bold text-2xl">🐷</p>
        <button className="border border-black rounded-sm px-6 py-2 hover:bg-black hover:text-primary-foreground">Login</button>
      </nav>
    </Link>
  )
}
