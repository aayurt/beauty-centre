import AnimatedSection from "./AnimatedSection";
import Image from "next/image";
import { Mail, ExternalLink, Camera } from "lucide-react";

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
    <section id="team" className="py-24 md:py-32 bg-primary-pink-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white text-sage-green rounded-full text-sm font-medium mb-6">
            Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Meet the{" "}
            <span className="text-sage-green">Artists</span> Behind Your Beauty
          </h2>
          <p className="text-text-light text-base sm:text-lg leading-relaxed">
            Our talented team of certified professionals is dedicated to making
            you look and feel your absolute best.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <AnimatedSection
              key={member.name}
              direction="up"
              delay={index * 0.15}
            >
              <div className="team-card bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Enhanced overlay on hover */}
                  <div className="team-overlay">
                    <div className="team-overlay-content">
                      <div className="team-overlay-name">{member.name}</div>
                      <div className="team-overlay-role">{member.role}</div>
                      <div className="flex gap-2">
                        <a
                          href={member.social.email}
                          className="team-social-icon"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={member.social.instagram}
                          className="team-social-icon"
                          aria-label={`${member.name} on Instagram`}
                        >
                          <Camera className="w-4 h-4" />
                        </a>
                        <a
                          href={member.social.linkedin}
                          className="team-social-icon"
                          aria-label={`${member.name} on LinkedIn`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6 text-center">
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
