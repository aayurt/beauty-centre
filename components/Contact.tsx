"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { MapPin, Phone, Clock, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-primary-pink-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-sage-green rounded-full text-sm font-medium mb-6">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Book Your{" "}
            <span className="text-sage-green">Appointment</span> Today
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Ready to experience the K & S difference? Reach out to us and let's create your perfect beauty moment.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <AnimatedSection direction="left">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage-green focus:ring-2 focus:ring-sage-green/20 outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage-green focus:ring-2 focus:ring-sage-green/20 outline-none transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage-green focus:ring-2 focus:ring-sage-green/20 outline-none transition-all resize-none"
                    placeholder="Tell us about the service you're interested in..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-sage-green text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-sage-green-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Message sent successfully! We'll be in touch soon.</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
              </div>
            </form>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection direction="right" className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-text-dark mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-sage-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-1">Address</h4>
                    <p className="text-text-light">
                      123 Beauty Lane, Suite 100<br />
                      City Centre, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-sage-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-1">Phone</h4>
                    <p className="text-text-light">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-sage-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-1">Email</h4>
                    <p className="text-text-light">hello@ksbeautycentre.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-sage-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-1">Opening Hours</h4>
                    <p className="text-text-light">
                      Monday - Friday: 9:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl h-64">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}