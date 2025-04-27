'use client';

import { motion } from 'framer-motion';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    uses: '5 uses',
    features: [
      '5 free watermark removals',
      'Basic image processing',
      'Standard quality output',
    ],
  },
  {
    name: 'Pro',
    price: '$5',
    uses: '100 uses',
    features: [
      '100 watermark removals',
      'Advanced image processing',
      'High quality output',
      'Priority support',
    ],
  },
  {
    name: 'Unlimited',
    price: '$15',
    uses: 'Unlimited',
    features: [
      'Unlimited watermark removals',
      'Premium image processing',
      'Highest quality output',
      'Priority support',
      'Batch processing',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                tier.name === 'Pro' ? 'border-2 border-primary' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-4">{tier.name}</h2>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-gray-500"> / {tier.uses}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.name === 'Pro'
                    ? 'bg-primary hover:bg-secondary text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {tier.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-primary hover:text-secondary font-semibold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 