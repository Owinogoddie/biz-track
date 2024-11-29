'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
              >
                <span className="block xl:inline">Streamline Your Business</span>{' '}
                <span className="block text-indigo-600 xl:inline">with BizTrack</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                BizTrack helps businesses of all sizes manage their inventory, track services, and gain financial insights. Multiple accounts, multiple businesses, all in one powerful platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <div className="rounded-md shadow">
                  <Button asChild size="lg" className="w-full">
                    <Link href="#">Get started</Link>
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="#">Live demo</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
      >
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
          alt="Team working on inventory management"
        />
      </motion.div>
    </div>
  )
}

export default Hero

