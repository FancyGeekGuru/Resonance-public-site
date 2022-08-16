import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

export const ScaleAnimation = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={variants}
    className="absolute top-0 left-0 w-full h-full animate-[zoom-in_5s_linear_both]"
  >
    <Image src="/images/warehouse.jpg" priority alt="" layout="fill" objectFit="cover" objectPosition="center" />
  </motion.div>
)
