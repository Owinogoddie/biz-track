// components/Features.tsx
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  ChartBar, 
  MessageCircle, 
  Shield 
} from "lucide-react";

const features = [
  {
    title: "Academic Management",
    description: "Track grades, attendance, and curriculum planning all in one place.",
    icon: BookOpen,
  },
  {
    title: "Schedule Planning",
    description: "Effortlessly manage class schedules and academic calendar.",
    icon: Calendar,
  },
  {
    title: "Student Portal",
    description: "Give students access to assignments, grades, and resources.",
    icon: Users,
  },
  // Add more features...
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Everything you need to manage your school efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}