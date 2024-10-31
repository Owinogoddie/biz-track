// components/TestimonialMarquee.tsx
import React from "react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote: "EduManagePro has transformed our administrative processes completely.",
    author: "Dr. Sarah Johnson",
    role: "Principal",
    school: "Lincoln High School",
    image: "/testimonials/sarah.jpg",
  },
  {
    quote: "The best investment we've made for our school's digital transformation.",
    author: "Michael Chang",
    role: "IT Director",
    school: "Westfield Academy",
    image: "/testimonials/michael.jpg",
  },
  // Add more testimonials...
];

export default function TestimonialMarquee() {
  return (
    <div className="relative overflow-hidden py-20 bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 dark:bg-dot-white/[0.2] bg-dot-black/[0.2]" />
      
      <div className="relative">
        <h2 className="text-4xl font-bold text-center mb-16">
          Trusted by Educators Worldwide
        </h2>
        
        <div className="flex overflow-hidden space-x-8">
          <div className="flex space-x-8 animate-marquee">
            {testimonials.map((item, index) => (
              <Card key={index} className="w-[400px] p-6 flex-shrink-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex-shrink-0" />
                  <div>
                    <p className="text-lg mb-4">"{item.quote}"</p>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.role}, {item.school}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex space-x-8 animate-marquee" aria-hidden="true">
            {testimonials.map((item, index) => (
              <Card key={index} className="w-[400px] p-6 flex-shrink-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex-shrink-0" />
                  <div>
                    <p className="text-lg mb-4">"{item.quote}"</p>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.role}, {item.school}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}