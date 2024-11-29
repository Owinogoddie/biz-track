'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'

const CallToAction = () => {
  return (
    <section className="py-20 bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-xl text-indigo-100">
            Join thousands of businesses already using BizTrack to streamline their operations.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
        >
          {[
            'Boost Efficiency by up to 75%',
            'Reduce Errors by 90%',
            'Gain Real-time Business Insights',
          ].map((benefit, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-6 w-6 text-indigo-300 mr-2" />
              <span className="text-white">{benefit}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
            <Link href="#">Start Your Free 30-Day Trial</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center text-base text-indigo-100"
        >
          No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}

export default CallToAction

