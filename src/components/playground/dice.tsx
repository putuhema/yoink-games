import { motion } from "framer-motion"
import { useState } from "react";
import { Button } from "../ui/button";

export default function Dice() {
  const [isAnimating, setAnimating] = useState(false)

  const container = {
    // // hidden: { rotate: 90 },
    show: {
      // rotate: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemA = {
    hidden: { scale: 0, top: 100 },
    show: { scale: 1, top: 30 }
  };

  const itemB = {
    hidden: { scale: 0, top: 200 },
    show: { scale: 1, top: 80 }
  };
  return (
    <div>
      <motion.div
        variants={container}
        initial="hidden"
        animate={isAnimating ? "show" : "hidden"}
        className="w-[150px] h-[150px] rounded-lg bg-white relative border">
        <motion.div
          variants={itemA}
          className="w-10 h-10 rounded-full bg-blue-500 absolute left-[30px]"></motion.div>
        <motion.div
          variants={itemA}
          className="w-10 h-10 rounded-full bg-blue-500 absolute left-[80px]"></motion.div>
        <motion.div
          variants={itemB}
          className="w-10 h-10 rounded-full bg-blue-500 absolute left-[30px]"></motion.div>
        <motion.div
          variants={itemB}
          className="w-10 h-10 rounded-full bg-blue-500 absolute left-[80px]"></motion.div>
      </motion.div>
      <Button onClick={() => setAnimating(!isAnimating)}>Animate</Button>
    </div>
  )
}
