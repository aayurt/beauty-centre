import PublicSiteShell from "@/components/layout/PublicSiteShell";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import LocationHours from "@/components/LocationHours";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import InstagramFeed from "@/components/InstagramFeed";
import Products from "@/components/Products";

export default function Home() {
  return (
    <PublicSiteShell>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <LocationHours />
      <Team />
      <Testimonials />
      <Contact />
      <InstagramFeed />
      <Products />
    </PublicSiteShell>
  );
}
