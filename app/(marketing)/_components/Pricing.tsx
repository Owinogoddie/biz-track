'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: ['1 Business', 'Up to 1,000 inventory items', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Professional',
    price: 99,
    features: ['Up to 5 Businesses', 'Unlimited inventory items', 'Advanced analytics', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 299,
    features: ['Unlimited Businesses', 'Unlimited inventory items', 'Custom analytics', '24/7 dedicated support'],
  },
]

const Pricing = () => {
  return (
    <div id="pricing" className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-gray-300"
          >
            Choose the plan that's right for your business
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <Card key={plan.name} className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-extrabold text-white">
                  ${plan.price}<span className="text-base font-medium text-gray-300">/mo</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get started</Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Pricing

