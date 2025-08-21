'use client';

import { motion } from 'framer-motion';
import nProgress from 'nprogress'
import { useEffect } from 'react'

export default function Loading() {
  useEffect(() => {
    nProgress.start()
    return () => {
      nProgress.done()
    }
  }, [])

  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Gold shimmer / pulse */}
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-gold border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
    </motion.div>
  )
}