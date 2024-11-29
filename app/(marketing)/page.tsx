// app/page.tsx
import Navbar from "./_components/Navbar";
// import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Stats from "./_components/Stats";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";
import { HeroBg } from "./_components/hero-bg";
import { Testimonials } from "./_components/testimonials";
import { SchoolsMarquee } from "./_components/SchoolsMarquee";
import CallToAction from "./_components/CallToAction";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* <HeroBg /> */}
      <Hero/>
      <SchoolsMarquee/>
      <Features />
      <Stats />
      <Testimonials />
      <CallToAction/>
      <Footer />
    </div>
  );
}