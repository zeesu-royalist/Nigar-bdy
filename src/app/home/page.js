import VoicesShowcase from "../../components/VoicesShowcase";
import Hero from "../../components/Hero";
import ScrollExpandSection from "../../components/ScrollExpandSection";
import MasonrySection from "../../components/MasonrySection";

export default function HomeRoutePage() {
  return (
    <main className="bg-black text-cream overflow-x-clip">
      <VoicesShowcase />
      {/* <Hero /> */}
      <ScrollExpandSection />
      <MasonrySection />
    </main>
  );
}


