import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { Stats } from "./components/landing/Stats";
import { Features } from "./components/landing/Features";
import { HowItWorks } from "./components/landing/HowItWorks";
import { GlobalReach } from "./components/landing/GlobalReach";
import { Integrations } from "./components/landing/Integrations";
import { CTA } from "./components/landing/CTA";
import { Footer } from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <GlobalReach />
      <Integrations />
      <CTA />
      <Footer />
    </main>
  );
}
