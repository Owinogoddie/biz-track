// components/CTA.tsx
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of schools already using our platform to improve their
            management and student experience.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}