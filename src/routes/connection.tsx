import { createFileRoute } from '@tanstack/react-router'
import { format } from "date-fns"
import Card from '@/components/connection/card'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import toast, { Toaster } from 'react-hot-toast'
import { motion, useAnimation } from 'framer-motion'

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

function Connection() {
  const [card, setCard] = useState<Array<string>>([])
  const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
  const [mistakesRemaining, setMistakesRemaining] = useState(4)
  const [previousGuess, setPreviousGuess] = useState<Array<String[]>>([])
  const [answer, setAnswer] = useState<Group[]>([])
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [isWrong, setIsWrong] = useState(false)

  useEffect(() => {
    const newCard = groups.map(g => g.answer).flat()
    const suffledCard = handleOnSuffle(newCard)
    setCard(suffledCard)
  }, [])

  function handleOnPick(pickedWord: string) {
    const isInCurrentGuess = currentGuess.includes(pickedWord)
    const isInPreviousGuess = previousGuess.flat().includes(pickedWord)
    setIsWrong(false)
    if (disabledSubmit && isInPreviousGuess) {
      setDisabledSubmit(false)
    }
    if (currentGuess.length < 4 || isInCurrentGuess) {
      setCurrentGuess(prevCurrentGuess =>
        prevCurrentGuess.includes(pickedWord) ?
          prevCurrentGuess.filter(card => card != pickedWord) : [...prevCurrentGuess, pickedWord]
      )
    }
  }

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
      setDisabledSubmit(true)
      toast("Already Guessed.")
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
      setIsWrong(true)
      newMistakesRemaining -= 1
      if (newMistakesRemaining > 0) {
        setPreviousGuess([...previousGuess, currentGuess])
      } else {
        setPreviousGuess([])
      }

      setDisabledSubmit(true)
      setMistakesRemaining(newMistakesRemaining)
    }


  }

  // Framer motion animation
  const DURATION = 0.1
  const STAGGER_DELAY = 0.05
  const FADE_DURATION = 1
  const FADE_DELAY = 2


  const itemVariants = {
    initial: {
      y: 0,
      opacity: 1
    },
    jumpy: {
      y: [0, -5, 5, -5, 0],
    },
    fadeOutAndShake: {
      opacity: [1, 0.5, 0.5, 1],
      x: [0, 5, -5, 5, 0],
    }
  };

  const containerVariants = {
    jumpy: {
      transition: {
        staggerChildren: STAGGER_DELAY,
        delayChildren: 0.3,
        x: {
          duration: FADE_DURATION
        },
        opacity: {
          times: [0, 0.2, 0.8, 1],
          duration: FADE_DURATION + FADE_DELAY
        },
        y: {
          type: 'spring',
          stiffness: 200,
          damping: 10,
          duration: DURATION,
        },
      },
    }
  };

  const controls = useAnimation()
  useEffect(() => {
    if (isWrong) {
      const animateSequence = async () => {
        await controls.start('jumpy');
        await controls.start('fadeOutAndShake');
      };
      animateSequence();
    } else {
      controls.start('initial');
    }

  }, [isWrong, controls]);
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
            <motion.div
              variants={containerVariants}
              initial='initial'
              animate={controls}
              className='grid grid-cols-4 gap-2'>
              {
                card.map((text) => {
                  const isPick = currentGuess.includes(text)
                  return (
                    <Card
                      variants={isPick ? itemVariants : {}}
                      text={text} key={text}
                      isPick={isPick}
                      onPick={() => { handleOnPick(text) }} />
                  )

                }
                )
              }
            </motion.div>
          </div>

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

          <div className='flex gap-4 items-center  justify-center'>
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
              setDisabledSubmit(false)
              setCard([
                "two", "unite", "put", "too", "couple", "wall", "laid", "sat", "wed", "wild", "tue", "placed", "tie", "to", "sun", "may"
              ])
            }}>Reset</Button>
            <Button disabled={currentGuess.length !== 4 || mistakesRemaining === 0 || disabledSubmit} variant="outline" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
        <Toaster toastOptions={{
          className: '',
          style: {
            background: '#000000',
            color: '#ffffff',
            borderRadius: '4px'
          }
        }} />
      </div>
    </>
  )
}