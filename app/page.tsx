"use client";

import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { Stats } from "./components/landing/Stats";
import { Features } from "./components/landing/Features";
import { HowItWorks } from "./components/landing/HowItWorks";
import { Benefits } from "./components/landing/Benefits";
import { UseCases } from "./components/landing/UseCases";
import { ApiDocs } from "./components/landing/ApiDocs";
import { Integrations } from "./components/landing/Integrations";
import { Testimonials } from "./components/landing/Testimonials";
import { CTA } from "./components/landing/CTA";
import { Footer } from "./components/landing/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Benefits />
        <UseCases />
        <ApiDocs />
        <Integrations />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
