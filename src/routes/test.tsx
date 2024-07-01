import Dice from '@/components/playground/dice'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { motion, useAnimation, } from 'framer-motion'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/test')({
  component: Test
})


function Test() {
  const [isAnimating, setIsAnimating] = useState(false)
  const DURATION = 0.5
  const STAGGER_DELAY = 0.2
  const FADE_DURATION = 1
  const FADE_DELAY = 2


  const itemVariants = {
    initial: {
      y: 0,
      opacity: 1
    },
    animate: {
      y: [0, -5, 5, -5, 0],
    },
    fadeOutAndShake: {
      opacity: [1, 0.5, 0.5, 1],
      x: [0, 5, -5, 5, 0],
    }
  };

  const containerVariants = {
    animate: {
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
    if (isAnimating) {
      const animateSequence = async () => {
        await controls.start('animate');
        await controls.start('fadeOutAndShake');
      };
      animateSequence();
    } else {
      controls.start('initial');
    }
  }, [isAnimating, controls]);
  return (
    <div className='mt-24 min-w-xl'>
      <div className='w-max mx-auto'>
        <motion.div
          variants={containerVariants}
          initial='initial'
          animate={controls}
          className='grid grid-cols-2 gap-2 p-2 border border-red-400 rounded-md'>
          {
            Array(4).fill(0).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className='w-24 h-24 rounded-md bg-red-400'></motion.div>
            ))
          }
        </motion.div>
        <Button
          className='mt-10'
          onClick={() => {
            setIsAnimating(true)
            setTimeout(() => {
              setIsAnimating(false)
            }, (DURATION + STAGGER_DELAY * 3) * 1000)
          }}>{isAnimating ? 'Animating...' : 'Start'}</Button>
        <Dice />
      </div>
    </div>
  )
}
