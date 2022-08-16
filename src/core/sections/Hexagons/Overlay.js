import React from 'react'
import { motion } from 'framer-motion'
import { WordPill } from 'core/components/WordPill'
import { INFINITE, overlayTypes, overlayVariants } from './constants'

const Overlay = ({ type, onExit }) => {
  if (!overlayTypes[type]) throw new Error(`Hexagon hero overlay type not valid: ${type}`)
  const { word, copy, component: Component } = overlayTypes[type]
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      className="
        fixed top-0 left-0 z-50 bg-black w-screen max-w-screen h-screen
        text-white flex flex-col justify-center items-center
        overflow-hidden
      "
      onClick={onExit}
    >
      <h1
        className="relative type-h1 flex flex-col text-center z-50"
        onClick={(ev) => ev.stopPropagation()}
      >
        <span>
          <span className="animate-[appear-up_0.5s_0.5s_ease_both]">{INFINITE}</span>&nbsp;
          <WordPill delay={0.75}>{word}</WordPill>
        </span>
        <span className="relative animate-[appear-up_0.5s_1.25s_ease_both]">
          {copy}
          <svg
            className="w-full absolute top-full left-0"
            viewBox="0 0 556 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="animate-[draw-line_0.5s_1.25s_ease_both] stroke-aquamarine"
              d="M5 21C187.005 12.1233 368.98 5 551 5"
              pathLength={100}
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>
      {!!Component && <Component />}
    </motion.div>
  )
}

export default Overlay
