import VoicesShowcase from "../components/VoicesShowcase";
import Hero from "../components/Hero";
import ScrollExpandSection from "../components/ScrollExpandSection";
import VideoAccordionSection from "../components/VideoAccordionSection";
import MasonrySection from "../components/MasonrySection";

export default function HomePage() {
  return (
    <main className="bg-black text-cream overflow-x-clip">
      <VoicesShowcase />
      {/* <Hero /> */}
      <ScrollExpandSection />
      <VideoAccordionSection />
      <MasonrySection />
    </main>
  );
}


