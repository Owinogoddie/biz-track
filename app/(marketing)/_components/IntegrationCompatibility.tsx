'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const integrations = [
  { name: 'Shopify', logo: '/placeholder.svg?height=60&width=60' },
  { name: 'QuickBooks', logo: '/placeholder.svg?height=60&width=60' },
  { name: 'Salesforce', logo: '/placeholder.svg?height=60&width=60' },
  { name: 'Slack', logo: '/placeholder.svg?height=60&width=60' },
  { name: 'Zapier', logo: '/placeholder.svg?height=60&width=60' },
]

const IntegrationCompatibility = () => {
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
            Seamless Integrations
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            BizTrack works with your favorite tools to streamline your workflow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-700">
                <Image
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <p className="mt-4 text-lg font-medium text-white">{integration.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-xl text-gray-300"
        >
          Connect BizTrack with over 100+ apps and services to automate your workflow and boost productivity.
        </motion.p>
      </div>
    </section>
  )
}

export default IntegrationCompatibility

