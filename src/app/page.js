import VoicesShowcase from "../components/VoicesShowcase";
import Hero from "../components/Hero";
import ScrollExpandSection from "../components/ScrollExpandSection";
import VideoAccordionSection from "../components/VideoAccordionSection";
import MasonrySection from "../components/MasonrySection";
import LoveProposalSection from "../components/LoveProposalSection";

export default function HomePage() {
  return (
    <main className="bg-black text-cream overflow-x-clip">
      <VoicesShowcase />
      <ScrollExpandSection />
      <VideoAccordionSection />
      <MasonrySection />
      <LoveProposalSection />
      {/* <Hero /> */}
    </main>
  );
}


