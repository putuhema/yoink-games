import { createFileRoute } from '@tanstack/react-router'
import { format } from "date-fns"
import Card from '@/components/connection/card'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/connection')({
  component: Connection
})
enum Difficulty {
  Straighforward,
  Moderate,
  Challenging,
  Tricky
}
type Group = {
  name: string;
  answer: Array<string>
  difficulty: Difficulty;
}

const difficulty = [
  {
    level: "straightforward",
    color: "bg-yellow-300"
  },
  {
    level: "moderate",
    color: "bg-green-300"
  },
  {
    level: "challenging",
    color: "bg-blue-300"
  },
  {
    level: "tricky",
    color: "bg-purple-300"
  },
]

function Connection() {
  const [card, setCard] = useState<Array<string>>([])
  const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
  const [mistakesRemaining, setMistakesRemaining] = useState(4)
  const [previousGuess, setPreviousGuess] = useState<Array<String[]>>([])
  const [answer, setAnswer] = useState<Group[]>([])
  const [isGuessInPrevGuess, setIsGuessInPrevGuess] = useState(false)
  const groups: Group[] = [
    {
      name: "homophones",
      answer: ["to", "too", "two", "tue"],
      difficulty: Difficulty.Straighforward
    },
    {
      name: "place down",
      answer: ["laid", "placed", "put", "sat"],
      difficulty: Difficulty.Moderate
    },
    {
      name: "___flower",
      answer: ["may", "sun", "wall", "wild"],
      difficulty: Difficulty.Challenging
    },
    {
      name: "connect",
      answer: ["couple", "tie", "unite", "wed"],
      difficulty: Difficulty.Tricky
    }
  ]

  useEffect(() => {
    const newCard = groups.map(g => g.answer).flat()
    const suffledCard = handleOnSuffle(newCard)
    setCard(suffledCard)
  }, [])


  function handleOnSuffle<T>(array: T[]): T[] {
    const suffledArray = [...array]
    for (let i = suffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [suffledArray[i], suffledArray[j]] = [suffledArray[j], suffledArray[i]]
    }
    return suffledArray
  }

  function checkAnswer<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) {
      return false
    }
    const sortedArray1 = [...array1.sort()]
    const sortedArray2 = [...array2.sort()]

    for (let i = 0; i < sortedArray1.length; i++) {
      if (sortedArray1[i] !== sortedArray2[i]) {
        return false
      }
    }
    return true
  }

  function checkIfIsInPrevGuess() {
    for (let i = 0; i < previousGuess.length; i++) {
      if (checkAnswer(previousGuess[i], currentGuess)) {
        return false
      }
    }
    return true
  }

  function handleSubmit() {
    if (!checkIfIsInPrevGuess()) {
      setIsGuessInPrevGuess(true)
      return
    }

    let foundCorrectAnswer = false;
    let newMistakesRemaining = mistakesRemaining
    const updatedAnswer = [...answer]

    for (let i = 0; i < groups.length; i++) {
      if (checkAnswer(groups[i].answer, currentGuess)) {
        updatedAnswer.push(groups[i])
        foundCorrectAnswer = true;
        break;
      }
    }

    if (foundCorrectAnswer) {
      const flattenedAnswer = updatedAnswer.map(a => a.answer).flat()
      const filteredCard = card.filter(word => !flattenedAnswer.includes(word))

      setCard(filteredCard)
      setPreviousGuess([])
      setCurrentGuess([])
      setAnswer(updatedAnswer)
    } else {
      newMistakesRemaining -= 1
      if (newMistakesRemaining > 0) {
        setPreviousGuess([...previousGuess, currentGuess])
      } else {
        setPreviousGuess([])
      }

      setMistakesRemaining(newMistakesRemaining)
    }
  }
  return (
    <>
      <div className='mt-24 p-8'>
        <h1 className='text-2xl font-bold'>Connection</h1>
        <p>{format(Date(), "PP")}</p>
        <div className="xl:max-w-4xl mx-auto py-4 pt-10 space-y-5">
          <p className='text-center mb-6'>Create four groups of four!</p>
          <div className='space-y-2'>
            {
              answer.map(a => (
                <div key={a.name} className={cn(difficulty[a.difficulty].color, "w-full rounded-md p-4 text-center",)}>
                  <p className='font-bold uppercase'>{a.name}</p>
                  <div className='flex justify-center gap-1 text-xl'>
                    {
                      a.answer.map((an, i) => i === a.answer.length - 1 ? (
                        <p key={an} className='uppercase'>{an}</p>
                      ) :
                        <p key={an} className='uppercase'>{an},</p>
                      )
                    }
                  </div>
                </div>
              ))
            }
            <div className='grid grid-cols-4 gap-2'>
              {
                card.map((text) => (
                  <Card text={text} key={text} isPick={currentGuess.includes(text)} onPick={() => {
                    if (currentGuess.length < 4 || currentGuess.includes(text)) {
                      setCurrentGuess(prevCurrentGuess =>
                        prevCurrentGuess.includes(text) ?
                          prevCurrentGuess.filter(card => card != text) : [...prevCurrentGuess, text]
                      )
                    }
                    setIsGuessInPrevGuess(false)
                  }} />
                ))
              }
            </div>
          </div>
          {
            isGuessInPrevGuess && (
              <div className='w-full p-4 bg-black text-white'>
                <p className='text-center'>Already Guessed</p>
              </div>
            )
          }
          <div className='flex gap-4 items-center justify-center'>
            <p>Mistakes Remaining:</p>
            <div className='flex items-center gap-1'>
              {
                Array(mistakesRemaining).fill(0).map((_, i) =>
                  <div key={i} className='h-4 w-4 rounded-full bg-slate-500'></div>
                )
              }
            </div>
          </div>

          <div className='flex gap-4 items-center justify-center'>
            <Button variant="outline" onClick={() => {
              const suffledCard = handleOnSuffle(card)
              setCard(suffledCard)
            }} >Suffle</Button>
            <Button variant="outline" onClick={() => setCurrentGuess([])}>Deselect All</Button>
            <Button variant="outline" onClick={() => {
              setMistakesRemaining(4)
              setPreviousGuess([])
              setCurrentGuess([])
              setAnswer([])
              setIsGuessInPrevGuess(false)
              setCard([
                "two", "unite", "put", "too", "couple", "wall", "laid", "sat", "wed", "wild", "tue", "placed", "tie", "to", "sun", "may"
              ])
            }}>Reset</Button>
            <Button disabled={currentGuess.length !== 4 || mistakesRemaining === 0} variant="outline" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  )
}