import GamesCard from '@/components/games-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})


function Index() {
  return (
    <>
      <div className="h-[300px] bg-blue-300 grid place-content-center space-y-2">
        <p className="text-5xl text-center">🐷</p>
        <p>games that i yoink from other. ehe.</p>
      </div>
      <div className="px-10 lg:px-0 xl:max-w-4xl mx-auto py-4 pt-10">
        <p className="text-center font-bold">More Games</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center mx-auto py-8 w-full">
          <GamesCard link='connection' bgColor="bg-yellow-300" title="Connection" desc="group words that share a common thread." />
        </div>
      </div>
    </>
  )
}