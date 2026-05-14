"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SERVICE_OPTIONS = [
  "Hair Styling",
  "Facials",
  "Massage",
  "Nails",
  "Makeup",
  "Waxing",
  "Other",
];

interface FormData {
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;
type FormStatus = "idle" | "loading" | "success" | "error";

const TOTAL_STEPS = 3;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

const fieldDefinitions = [
  {
    step: 0,
    fields: [
      { name: "name" as const, label: "Your Name", type: "input", inputType: "text", placeholder: "Jane Doe" },
      { name: "phone" as const, label: "Phone Number", type: "input", inputType: "tel", placeholder: "+1 (555) 123-4567" },
    ],
  },
  {
    step: 1,
    fields: [
      { name: "service" as const, label: "Service Interested In", type: "select", options: SERVICE_OPTIONS },
      { name: "preferredDate" as const, label: "Preferred Date", type: "input", inputType: "date" },
      { name: "preferredTime" as const, label: "Preferred Time", type: "input", inputType: "time" },
    ],
  },
  {
    step: 2,
    fields: [
      { name: "message" as const, label: "Additional Notes (optional)", type: "textarea", placeholder: "Any specific requests or information..." },
    ],
  },
];

const stepLabels = ["Personal Info", "Service Details", "Confirmation"];

export default function BookingInquiry() {
  const [formData, setFormData] = useState<FormData>({
    name: "", phone: "", service: "", preferredDate: "", preferredTime: "", message: "",
  });
  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shakeFields, setShakeFields] = useState<Set<string>>(new Set());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (name: string) => setFocused((prev) => ({ ...prev, [name]: true }));
  const handleBlur = (name: string) => setFocused((prev) => ({ ...prev, [name]: false }));

  const isFloating = (name: keyof FormData) =>
    focused[name] || formData[name].length > 0;

  const borderColor = (name: keyof FormData) =>
    errors[name]
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
      : "border-gray-200 focus:border-sage-green focus:ring-2 focus:ring-sage-green/20";

  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: FieldErrors = {};

    if (stepIndex === 0) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\d\s\-+()]{7,}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (stepIndex === 1) {
      if (!formData.service) newErrors.service = "Please select a service";
      if (!formData.preferredDate) newErrors.preferredDate = "Please select a date";
      if (!formData.preferredTime) newErrors.preferredTime = "Please select a time";
    }

    setErrors(newErrors);
    const errorFields = Object.keys(newErrors);
    if (errorFields.length > 0) {
      setShakeFields(new Set(errorFields));
      setTimeout(() => setShakeFields(new Set()), 500);
    }
    return errorFields.length === 0;
  }, [formData]);

  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setStatus("loading");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "", phone: "", service: "", preferredDate: "", preferredTime: "", message: "",
        });
        setTimeout(() => {
          setStatus("idle");
          setStep(0);
        }, 6000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const renderField = (field: {
    name: keyof FormData;
    label: string;
    type: string;
    inputType?: string;
    placeholder?: string;
    options?: string[];
  }) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.name !== "message",
      value: formData[field.name],
      onChange: handleChange,
      onFocus: () => handleFocus(field.name),
      onBlur: () => handleBlur(field.name),
      className: `w-full px-4 pt-6 pb-2 rounded-lg border outline-none transition-all bg-white ${borderColor(field.name)} ${shakeFields.has(field.name) ? "animate-shake" : ""}`,
      placeholder: " ",
    };

    return (
      <div key={field.name}>
        <div className="relative">
          {field.type === "textarea" ? (
            <textarea rows={4} {...commonProps} placeholder={field.placeholder || " "} className={`${commonProps.className} resize-none`} />
          ) : field.type === "select" ? (
            <select {...commonProps} className={`${commonProps.className} appearance-none`}>
              <option value="" disabled hidden />
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input type={field.inputType || "text"} {...commonProps} />
          )}
          <label
            htmlFor={field.name}
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              isFloating(field.name)
                ? "top-2 text-xs text-sage-green font-medium"
                : "top-1/2 -translate-y-1/2 text-gray-400 text-base"
            }`}
          >
            {field.label}
          </label>
          {field.type === "select" && (
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
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
    );
  };

  const renderStepContent = (stepIndex: number) => {
    if (stepIndex === 2) {
      const summaryItems = [
        { label: "Name", value: formData.name },
        { label: "Phone", value: formData.phone },
        { label: "Service", value: formData.service },
        { label: "Date", value: formData.preferredDate },
        { label: "Time", value: formData.preferredTime },
      ];

      return (
        <div className="space-y-5">
          <div className="bg-primary-pink-light rounded-xl p-5 space-y-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-text-light text-sm">{item.label}</span>
                <span className="text-text-dark font-medium text-sm">{item.value}</span>
              </div>
            ))}
          </div>
          {renderField(fieldDefinitions[2].fields[0])}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {fieldDefinitions[stepIndex].fields.map(renderField)}
      </div>
    );
  };

  return (
    <section id="booking" className="py-24 md:py-32 bg-primary-pink-light">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-sage-green rounded-full text-sm font-medium mb-6">
            Book an Appointment
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Request a{" "}
            <span className="text-sage-green">Booking</span>
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Fill in your details below and we&apos;ll get back to you to confirm your appointment.
          </p>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto">
          <AnimatedSection direction="up">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
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
                          stroke="#9caf88"
                          strokeWidth="2"
                        />
                        <path
                          className="checkmark-check"
                          fill="none"
                          stroke="#9caf88"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 27l7 7 16-16"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-text-dark mb-2">
                      Booking Request Sent!
                    </h3>
                    <p className="text-text-light text-center">
                      We&apos;ve received your request and will contact you within 24 hours to confirm your appointment.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step-${step}`}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {/* Step Indicator */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        {stepLabels.map((label, i) => (
                          <div key={label} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                                  i < step
                                    ? "bg-sage-green text-white"
                                    : i === step
                                    ? "bg-sage-green text-white step-dot-active"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {i < step ? (
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <span
                                className={`text-xs mt-2 font-medium hidden sm:block ${
                                  i <= step ? "text-text-dark" : "text-gray-400"
                                }`}
                              >
                                {label}
                              </span>
                            </div>
                            {i < TOTAL_STEPS - 1 && (
                              <div className="flex-1 h-0.5 mx-3 relative mt-[-1.25rem]">
                                <div className="absolute inset-0 bg-gray-200 rounded" />
                                <div
                                  className={`absolute inset-0 bg-sage-green rounded transition-all duration-500 ${
                                    i < step ? "w-full" : "w-0"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                      {renderStepContent(step)}

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                        {step > 0 ? (
                          <button
                            type="button"
                            onClick={goBack}
                            disabled={status === "loading"}
                            className="flex items-center gap-2 px-5 py-3 text-text-dark font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < TOTAL_STEPS - 1 ? (
                          <button
                            type="button"
                            onClick={goNext}
                            className="flex items-center gap-2 px-6 py-3 bg-sage-green text-white rounded-lg font-medium hover:bg-sage-green-dark transition-colors"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="flex items-center gap-2 px-6 py-3 bg-sage-green text-white rounded-lg font-medium hover:bg-sage-green-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
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
                                Submitting...
                              </>
                            ) : status === "error" ? (
                              "Try Again"
                            ) : (
                              <>
                                Submit Booking
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>

                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                      >
                        Something went wrong. Please try again or contact us directly.
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
