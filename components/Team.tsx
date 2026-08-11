"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "./animations/AnimatedSection";
import Image from "next/image";
import { Mail, Camera } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80";

export default function Team() {
  const [members, setMembers] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetch("/api/staff?activeOnly=true")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setMembers(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="team" className="py-24 md:py-32 bg-rose-light dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white dark:bg-neutral-800 text-amber-primary rounded-full text-sm font-medium mb-6">
            Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Meet the{" "}
            <span className="text-amber-primary">Artists</span> Behind Your Beauty
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Our talented team of certified professionals is dedicated to making
            you look and feel your absolute best.
          </p>
        </AnimatedSection>

        {members.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Loading team…
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {members.map((member, index) => (
              <AnimatedSection key={member.id} direction="up" delay={index * 0.15}>
                <div className="team-card bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                    <Image
                      src={member.imageUrl || FALLBACK_IMAGE}
                      alt={member.name}
                      fill
                      unoptimized={member.imageUrl?.startsWith("/uploads/")}
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="team-overlay">
                      <div className="team-overlay-content">
                        <div className="team-overlay-name">{member.name}</div>
                        <div className="team-overlay-role">{member.role}</div>
                        <div className="flex gap-2">
                          <span className="team-social-icon">
                            <Mail className="w-4 h-4" />
                          </span>
                          <span className="team-social-icon">
                            <Camera className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 text-center">
                    <h3 className="text-xl font-serif font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-amber-primary font-medium text-sm mb-4">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
