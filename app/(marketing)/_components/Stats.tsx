// components/Stats.tsx
export default function Stats() {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 dark:bg-dot-white/[0.2] bg-dot-black/[0.2] bg-[size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-5xl font-bold text-blue-600 mb-2">1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Schools Trust Us</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-blue-600 mb-2">500K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Students</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-blue-600 mb-2">99%</h3>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
    );
  }