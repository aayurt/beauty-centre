import PublicSiteShell from "@/components/layout/PublicSiteShell";
import Hero from "@/components/Hero";
import ScrollVideoFrames from "@/components/ScrollVideoFrames";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import LocationHours from "@/components/LocationHours";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import BookingInquiry from "@/components/BookingInquiry";
import Contact from "@/components/Contact";
import InstagramFeed from "@/components/InstagramFeed";

export default function Home() {
  return (
    <PublicSiteShell>
      <Hero />
      <ScrollVideoFrames totalFrames={80} />
      <About />
      <Services />
      <Gallery />
      <LocationHours />
      <Team />
      <Testimonials />
      <BookingInquiry />
      <Contact />
      <InstagramFeed />
    </PublicSiteShell>
  );
}
