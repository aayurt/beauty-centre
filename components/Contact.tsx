"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useCompany } from "@/lib/company-context";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

const fieldMeta = [
  { name: "name" as const, label: "Your Name", type: "input", inputType: "text" },
  { name: "email" as const, label: "Email Address", type: "input", inputType: "email" },
  { name: "message" as const, label: "Message", type: "textarea" },
];

export default function Contact() {
  const company = useCompany();
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [shakeFields, setShakeFields] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (name: string) => setFocused((prev) => ({ ...prev, [name]: true }));
  const handleBlur = (name: string) => setFocused((prev) => ({ ...prev, [name]: false }));

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    const errorFields = Object.keys(newErrors);
    if (errorFields.length > 0) {
      setShakeFields(new Set(errorFields));
      setTimeout(() => setShakeFields(new Set()), 500);
    }
    return errorFields.length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isFloating = (name: string) =>
    focused[name] || formData[name as keyof FormData].length > 0;

  const borderColor = (name: string) =>
    errors[name as keyof FieldErrors]
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
      : "border-gray-200 dark:border-neutral-600 dark:focus:border-crimson-primary focus:border-crimson-primary focus:ring-2 focus:ring-crimson-primary/20";

  return (
    <section id="contact" className="py-24 md:py-32 bg-blush-light dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white dark:bg-neutral-800 text-crimson-primary rounded-full text-sm font-medium mb-6">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Book Your{" "}
            <span className="text-crimson-primary">Appointment</span> Today
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Ready to experience the {company.name.split(" ")[0]} difference? Reach out to us and let&apos;s create your perfect beauty moment.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl"
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="success-checkmark-container mb-6">
                      <svg className="w-20 h-20" viewBox="0 0 52 52">
                        <circle
                          className="checkmark-circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                          stroke="#c63f7a"
                          strokeWidth="2"
                        />
                        <path
                          className="checkmark-check"
                          fill="none"
                          stroke="#c63f7a"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 27l7 7 16-16"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {fieldMeta.map((field) => (
                      <div key={field.name}>
                        <div className="relative">
                          {field.type === "textarea" ? (
                            <textarea
                              id={field.name}
                              name={field.name}
                              required
                              rows={5}
                              value={formData[field.name]}
                              onChange={handleChange}
                              onFocus={() => handleFocus(field.name)}
                              onBlur={() => handleBlur(field.name)}
                              className={`w-full px-4 pt-6 pb-2 rounded-lg border outline-none transition-all resize-none bg-white dark:bg-neutral-800 dark:text-foreground ${borderColor(field.name)} ${shakeFields.has(field.name) ? "animate-shake" : ""}`}
                              placeholder=" "
                            />
                          ) : (
                            <input
                              type={field.inputType}
                              id={field.name}
                              name={field.name}
                              required
                              value={formData[field.name]}
                              onChange={handleChange}
                              onFocus={() => handleFocus(field.name)}
                              onBlur={() => handleBlur(field.name)}
                              className={`w-full px-4 pt-6 pb-2 rounded-lg border outline-none transition-all bg-white dark:bg-neutral-800 dark:text-foreground ${borderColor(field.name)} ${shakeFields.has(field.name) ? "animate-shake" : ""}`}
                              placeholder=" "
                            />
                          )}
                          <label
                            htmlFor={field.name}
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              isFloating(field.name)
                                ? "top-2 text-xs text-crimson-primary font-medium"
                                : "top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 text-base"
                            }`}
                          >
                            {field.label}
                          </label>
                        </div>
                        {errors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1.5 flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-4 bg-crimson-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-crimson-dark active:bg-crimson-dark/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    >
                      {status === "loading" ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : status === "error" ? (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                          Try Again
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2z" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </AnimatedSection>

          <AnimatedSection direction="right" className="space-y-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4 sm:mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Address", children: company.address.split("\n").map((line, i) => <span key={i}>{line}{i < company.address.split("\n").length - 1 && <br />}</span>) },
                  { icon: Phone, title: "Phone", children: company.phone || "+977-1-4XXXXXX" },
                  { icon: Mail, title: "Email", children: company.email },
                  { icon: Clock, title: "Opening Hours", children: company.hours ? company.hours.split("\n").map((line, i) => <span key={i}>{line}{i < company.hours!.split("\n").length - 1 && <br />}</span>) : <>Monday - Friday: 9:00 AM - 8:00 PM<br />Saturday: 9:00 AM - 6:00 PM<br />Sunday: 10:00 AM - 4:00 PM</> },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blush-secondary dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-crimson-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.children}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl h-56 sm:h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1905d7e7c5d5%3A0x0!2sJamal%2C+Kathmandu%2C+Nepal!5e0!3m2!1sen!2snp!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="K & S Beauty Centre Location"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
