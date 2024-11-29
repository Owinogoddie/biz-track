'use client'

import { motion } from 'framer-motion'
import { Briefcase, ClipboardList, Wrench, BarChart } from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Multi-business Management',
    description: 'Effortlessly manage multiple businesses from a single dashboard.',
  },
  {
    icon: ClipboardList,
    title: 'Comprehensive Inventory Tracking',
    description: 'Keep real-time tabs on your stock across all locations.',
  },
  {
    icon: Wrench,
    title: 'Service Log Capabilities',
    description: 'Track and manage all your service operations in one place.',
  },
  {
    icon: BarChart,
    title: 'Financial Insights',
    description: 'Gain valuable financial insights with our advanced analytics.',
  },
]

const FeatureHighlights = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Feature Highlights
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Discover what makes BizTrack the ultimate business management solution.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-500 text-white">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-lg font-medium text-white text-center">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-300 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureHighlights

