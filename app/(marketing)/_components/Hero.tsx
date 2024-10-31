// components/Hero.tsx
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fancy background with gradient and shapes */}
      <div className="absolute inset-0 w-full h-full dark:bg-grid-white/[0.2] bg-grid-black/[0.2] bg-[size:60px_60px] flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute pointer-events-none inset-0 dark:bg-gradient-to-r dark:from-purple-500/20 dark:via-cyan-500/20 dark:to-blue-500/20" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Transform Your School Management
            <span className="text-blue-600 dark:text-blue-400"> Experience</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline administration, enhance learning, and connect your entire school community with our comprehensive management system.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}