'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

const ProblemSolution = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            The BizTrack Advantage
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            See how BizTrack transforms your business management
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Without BizTrack</h3>
            <ul className="space-y-4">
              <ListItem icon={XCircle} color="text-red-500">
                Time-consuming manual data entry
              </ListItem>
              <ListItem icon={XCircle} color="text-red-500">
                Prone to human errors and inconsistencies
              </ListItem>
              <ListItem icon={XCircle} color="text-red-500">
                Difficulty in managing multiple businesses
              </ListItem>
              <ListItem icon={XCircle} color="text-red-500">
                Limited insights into business performance
              </ListItem>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4">With BizTrack</h3>
            <ul className="space-y-4">
              <ListItem icon={CheckCircle} color="text-green-500">
                Automated data management and synchronization
              </ListItem>
              <ListItem icon={CheckCircle} color="text-green-500">
                Accurate and real-time information across all businesses
              </ListItem>
              <ListItem icon={CheckCircle} color="text-green-500">
                Seamless multi-business management from a single dashboard
              </ListItem>
              <ListItem icon={CheckCircle} color="text-green-500">
                Comprehensive analytics and financial insights
              </ListItem>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-2xl font-semibold text-indigo-400">
            Experience up to 75% increase in efficiency with BizTrack
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const ListItem = ({ icon: Icon, color, children }) => (
  <li className="flex items-center space-x-3">
    <Icon className={`h-6 w-6 ${color}`} />
    <span className="text-white">{children}</span>
  </li>
)

export default ProblemSolution

