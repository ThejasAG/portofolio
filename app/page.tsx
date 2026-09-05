"use client";

import Shell from "@/components/Shell";
import Hero from "@/components/Hero";
import IntroStatement from "@/components/IntroStatement";
import Projects from "@/components/Projects";
import TechnicalCases from "@/components/TechnicalCases";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Shell>
        {(ready) => (
          <>
            <Hero ready={ready} />
            <IntroStatement />
            <Projects />
            <TechnicalCases />
            <About />
            <Experience />
            <Skills />
            <Achievements />
            <Contact />
          </>
        )}
      </Shell>
      <Footer />
    </>
  );
}
