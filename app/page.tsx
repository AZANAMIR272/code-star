import { TopBar } from "@/components/landing/TopBar";
import { Hero } from "@/components/landing/Hero";
import { Proof } from "@/components/landing/Proof";
import { Panels } from "@/components/landing/Panels";
import { Preview } from "@/components/landing/Preview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Stats } from "@/components/landing/Stats";
import { CtaFooter } from "@/components/landing/CtaFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sun text-ink">
      <TopBar />
      <main>
        <Hero />
        <Proof />
        <Panels />
        <Preview />
        <Testimonials />
        <Stats />
        <CtaFooter />
      </main>
    </div>
  );
}
