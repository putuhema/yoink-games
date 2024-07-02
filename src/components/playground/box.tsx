import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useCallback, useState } from "react"
import { Button } from "../ui/button"

const NUMBERS = Array.from({ length: 16 }, (_, i) => i + 1)

export function Box() {
  const [numbers, setNumbers] = useState(NUMBERS)
  const [pickedBox, setPickedBox] = useState(new Set<number>())
  const [correctBox, setCorrectBox] = useState<Array<number[]>>([])

  const toggleNumber = useCallback((n: number) => {
    setPickedBox(prev => {
      const newSet = new Set(prev)
      if (newSet.has(n)) {
        newSet.delete(n)
      } else {
        newSet.add(n)
      }
      return newSet
    })
  }, [])
  const handleSubmit = useCallback(() => {
    if (pickedBox.size === 4) {
      setNumbers(prev => prev.filter(item => !pickedBox.has(item)))
      setCorrectBox([...correctBox, Array.from(pickedBox)])
      setPickedBox(new Set<number>())
    }
  }, [pickedBox])

  return (
    <>
      <p>Layout Animation</p>
      <motion.div className="grid grid-cols-4 gap-2">
        {
          correctBox.map((n, i) => (
            <motion.div layout key={i} className="col-span-4 border h-[80px] grid place-content-center">{n.join(", ")}</motion.div>
          ))
        }
        {
          numbers.map((n) => {
            return (
              <motion.div onClick={() => toggleNumber(n)} layout key={n} className={cn(pickedBox.has(n) && "bg-slate-100", "h-[80px] hover:bg-slate-100 cursor-pointer rounded-md grid place-content-center border")}>{n}</motion.div>
            )
          }
          )
        }
      </motion.div>
      <Button disabled={pickedBox.size !== 4} onClick={handleSubmit} className="mt-8" variant="outline">Submit</Button>
    </>
  )
}
