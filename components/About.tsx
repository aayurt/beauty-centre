import AnimatedSection from "./AnimatedSection";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <AnimatedSection direction="left" className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Beauty salon interior with elegant decor"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary-pink-light rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-sage-green rounded-2xl -z-10" />
          </AnimatedSection>

          {/* Text Side */}
          <AnimatedSection direction="right">
            <div className="max-w-lg">
              <span className="inline-block px-4 py-2 bg-primary-pink-light text-sage-green rounded-full text-sm font-medium mb-6">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6 leading-tight">
                Crafting Beauty,{" "}
                <span className="text-sage-green">One Client</span> at a Time
              </h2>
              <p className="text-text-light leading-relaxed mb-6 text-lg">
                At K & S Beauty Centre, we believe that beauty is an art form, and every client is our canvas. Founded with a passion for excellence, our sanctuary combines cutting-edge techniques with timeless elegance to deliver transformative experiences.
              </p>
              <p className="text-text-light leading-relaxed mb-8">
                Our team of certified professionals brings years of expertise in hair styling, skincare, and therapeutic treatments. We use only premium, cruelty-free products to ensure your beauty journey is as ethical as it is exquisite.
              </p>

              {/* Values */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">Expert Team</h4>
                    <p className="text-sm text-text-light">Certified professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">Premium Products</h4>
                    <p className="text-sm text-text-light">Cruelty-free & organic</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}