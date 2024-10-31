// app/page.tsx
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Stats from "./_components/Stats";
import TestimonialMarquee from "./_components/TestimonialMarquee";
import SchoolsMarquee from "./_components/SchoolsMarquee";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SchoolsMarquee />
      <Features />
      <Stats />
      <TestimonialMarquee />
      <CTA />
      <Footer />
    </div>
  );
}