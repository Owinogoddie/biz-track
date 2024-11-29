'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Users, BarChart, Briefcase } from 'lucide-react'

const features = [
  {
    name: 'Inventory Management',
    description: 'Keep track of your stock levels, set reorder points, and manage multiple warehouses.',
    icon: ClipboardList,
  },
  {
    name: 'Service Tracking',
    description: 'Log and monitor services provided, schedule appointments, and manage customer history.',
    icon: Users,
  },
  {
    name: 'Multi-Business Support',
    description: 'Manage multiple businesses from a single account with separate inventories and reports.',
    icon: Briefcase,
  },
  {
    name: 'Advanced Analytics',
    description: 'Gain insights into your business performance with detailed reports and dashboards.',
    icon: BarChart,
  },
]

const Features = () => {
  return (
    <div id="features" className="py-12 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base text-indigo-400 font-semibold tracking-wide uppercase"
          >
            Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Everything you need to manage your business
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto"
          >
            InventoryPro provides a comprehensive suite of tools to help you manage your inventory and services efficiently.
          </motion.p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-300">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Features

