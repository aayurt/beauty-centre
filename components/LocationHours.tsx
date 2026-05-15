"use client";

import AnimatedSection from "./AnimatedSection";
import { MapPin, Phone, Clock } from "lucide-react";
import { useCompany } from "@/lib/company-context";

export default function LocationHours() {
  const company = useCompany();
  return (
    <section id="location" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary-pink-light text-sage-green rounded-full text-sm font-medium mb-6">
            Visit Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Find Our{" "}
            <span className="text-sage-green">Beauty Sanctuary</span>
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            We&apos;re conveniently located. Come experience the {company.name.split(" ")[0]} difference.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Map */}
          <AnimatedSection direction="left" className="h-full">
            <div className="rounded-2xl overflow-hidden shadow-xl h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1905d7e7c5d5%3A0x0!2sJamal%2C+Kathmandu%2C+Nepal!5e0!3m2!1sen!2snp!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="K & S Beauty Centre Location"
                className="w-full h-full min-h-[400px]"
              />
            </div>
          </AnimatedSection>

          {/* Info Cards */}
          <AnimatedSection direction="right" className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-primary-pink-light rounded-2xl p-8 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="w-6 h-6 text-sage-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-text-dark mb-2">Our Address</h3>
                    <p className="text-text-light">
                      {company.address.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < company.address.split("\n").length - 1 && <br />}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-pink-light rounded-2xl p-8 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-6 h-6 text-sage-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-text-dark mb-2">Opening Hours</h3>
                    <div className="space-y-1 text-text-light">
                      {(company.hours || "Mon - Fri: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM").split("\n").map((line, i) => {
                        const parts = line.split(/:\s*/);
                        return (
                          <div key={i} className="flex justify-between gap-8">
                            <span>{parts[0]}</span>
                            <span className="font-medium text-text-dark">{parts.slice(1).join(": ")}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-pink-light rounded-2xl p-8 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-sage-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-text-dark mb-2">Call Us</h3>
                    <a
                      href={`tel:${company.phone || "+977144XXXXX"}`}
                      className="text-text-light hover:text-sage-green transition-colors text-lg"
                    >
                      {company.phone || "+977-1-4XXXXXX"}
                    </a>
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
