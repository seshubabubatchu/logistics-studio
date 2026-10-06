import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Loader />
      <div className="flex flex-col min-h-screen">
        <Nav />

        <main className="flex-grow">
          <Hero />

          <section id="edi-flow" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">EDI Flow Placeholder</h2>
          </section>

          <section id="legacy-to-cloud" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">Legacy to Cloud Placeholder</h2>
          </section>

          <section id="ai-map" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">AI Map Placeholder</h2>
          </section>

          <section id="control-tower" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">Control Tower Placeholder</h2>
          </section>

          <section id="services-rail" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">Services Rail Placeholder</h2>
          </section>

          <section id="finale" className="min-h-screen flex items-center justify-center border-b border-white/10">
            <h2 className="text-4xl font-bold">Finale Placeholder</h2>
          </section>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
