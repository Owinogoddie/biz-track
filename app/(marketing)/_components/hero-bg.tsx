import { Button } from "@/components/custom/button";
import GridPattern from "@/components/magic-ui/animated-grid-pattern";
import PulsatingButton from "@/components/magic-ui/pulsating-button";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  // Rocket,
  BookOpen,
  BarChart3,
  MessageCircle,
  ClipboardList
} from "lucide-react";

export function HeroBg() {
  return (
    <div className="relative w-full min-h-[800px] flex items-center justify-center overflow-hidden  dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0">
        <GridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "w-full h-full"
          )}
        />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h1 className="text-6xl font-bold text-black dark:text-white mb-6">
            Transform Your School Management
            <span className="text-blue-600 dark:text-blue-400 block mt-2">
              With Smart Solutions
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Streamline administration, enhance learning experiences, and drive better outcomes
            with our comprehensive school management platform.
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-16">
          <PulsatingButton className="px-8 py-4">
            {/* <Rocket className="mr-2 h-5 w-5" /> */}
            Start Free Trial
          </PulsatingButton>
          <Button size="lg" variant="outline" className="px-8">
            <BookOpen className="mr-2 h-5 w-5" />
            Book Demo
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <GraduationCap className="w-12 h-12 text-blue-600 mb-4 mx-auto stroke-[1.5]" />
            <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive tools for curriculum management and student assessment
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <BarChart3 className="w-12 h-12 text-blue-600 mb-4 mx-auto stroke-[1.5]" />
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time analytics and performance tracking for informed decisions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4 mx-auto stroke-[1.5]" />
            <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enhanced communication between staff, students, and parents
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Trusted by leading educational institutions
          </p>
          <div className="flex justify-center gap-8 opacity-70">
            {/* Add your school/client logos here */}
          </div>
        </div>
      </div>
    </div>
  );
}