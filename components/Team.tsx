import AnimatedSection from "./AnimatedSection";
import Image from "next/image";
import { Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Katherine Smith",
    role: "Founder & Lead Stylist",
    bio: "With over 15 years of experience, Katherine brings her artistic vision and technical expertise to every style she creates.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    social: { instagram: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Sophia Anderson",
    role: "Senior Esthetician",
    bio: "Sophia specializes in advanced skincare treatments and helps clients achieve their dream complexion with personalized care.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    social: { instagram: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Maya Johnson",
    role: "Massage Therapist",
    bio: "Maya's intuitive touch and expertise in various massage techniques provide deep relaxation and healing for body and mind.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    social: { instagram: "#", linkedin: "#", email: "#" },
  },
  {
    name: "Emma Williams",
    role: "Colour Specialist",
    bio: "Emma is a master of colour transformations, from subtle highlights to bold, vibrant hues that turn heads.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
    social: { instagram: "#", linkedin: "#", email: "#" },
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 md:py-32 bg-primary-pink-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-sage-green rounded-full text-sm font-medium mb-6">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Meet the{" "}
            <span className="text-sage-green">Artists</span> Behind Your Beauty
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Our talented team of certified professionals is dedicated to making you look and feel your absolute best.
          </p>
        </AnimatedSection>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <AnimatedSection
              key={member.name}
              direction="up"
              delay={index * 0.15}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Social overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={member.social.email}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary-pink transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-5 h-5 text-text-dark" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-text-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sage-green font-medium text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-text-light text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}