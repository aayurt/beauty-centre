import Navbar from "@/components/Navbar";
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
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
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
      <Footer />
    </main>
  );
}
