import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding K & S Beauty Centre data...");

  // Upsert Business Info
  await prisma.businessInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "K & S Beauty Centre",
      tagline: "Crafting Beauty, One Client at a Time",
      description:
        "At K & S Beauty Centre, we believe that beauty is an art form, and every client is our canvas. Founded with a passion for excellence, our sanctuary combines cutting-edge techniques with timeless elegance to deliver transformative experiences. Our team of certified professionals brings years of expertise in hair styling, skincare, and therapeutic treatments. We use only premium, cruelty-free products to ensure your beauty journey is as ethical as it is exquisite.",
      address: "123 Beauty Lane, Suite 100\nCity Centre, State 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@ksbeautycentre.com",
      hours:
        "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
      mission:
        "To provide exceptional beauty and wellness services that empower our clients to look and feel their absolute best.",
      vision:
        "To be the premier destination for beauty and relaxation, setting the standard for excellence in the industry.",
    },
  });
  console.log("  ✓ Business info seeded");

  // Seed Services
  const services = [
    {
      title: "Hair Styling",
      description:
        "From precision cuts to vibrant colour transformations, our expert stylists craft looks that reflect your unique personality and style.",
      iconName: "Scissors",
      imageUrl:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
      features: ["Cut & Style", "Colour & Highlights", "Treatments", "Bridal Hair"],
      displayOrder: 0,
    },
    {
      title: "Facials",
      description:
        "Rejuvenate your skin with our customized facial treatments. Using premium products, we help you achieve a radiant, youthful glow.",
      iconName: "Sparkles",
      imageUrl:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      features: ["Deep Cleansing", "Anti-Aging", "Hydration", "LED Therapy"],
      displayOrder: 1,
    },
    {
      title: "Massage",
      description:
        "Unwind and rejuvenate with our therapeutic massage services. From relaxation to deep tissue, find your perfect escape.",
      iconName: "HandHeart",
      imageUrl:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
      features: ["Swedish Massage", "Deep Tissue", "Aromatherapy", "Hot Stone"],
      displayOrder: 2,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: {},
      create: service,
    });
  }
  console.log("  ✓ Services seeded");

  // Seed Gallery Items
  const galleryItems = [
    {
      src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      alt: "Elegant salon interior",
      span: "md:row-span-2",
      displayOrder: 0,
    },
    {
      src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
      alt: "Hair styling session",
      span: "",
      displayOrder: 1,
    },
    {
      src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      alt: "Facial treatment room",
      span: "",
      displayOrder: 2,
    },
    {
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      alt: "Massage therapy room",
      span: "",
      displayOrder: 3,
    },
    {
      src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
      alt: "Hair colour treatment",
      span: "md:row-span-2",
      displayOrder: 4,
    },
    {
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
      alt: "Beauty products display",
      span: "",
      displayOrder: 5,
    },
    {
      src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
      alt: "Reception area",
      span: "",
      displayOrder: 6,
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      alt: "Relaxation lounge",
      span: "",
      displayOrder: 7,
    },
  ];

  for (const item of galleryItems) {
    const id = galleryItems.indexOf(item) + 1;
    await prisma.galleryItem.upsert({
      where: { id },
      update: {},
      create: { id, ...item },
    });
  }
  console.log("  ✓ Gallery items seeded");

  // Seed Reviews
  const reviews = [
    {
      name: "Sarah Mitchell",
      rating: 5,
      text: "The most relaxing facial I've ever had! My skin has never looked better. The team at K & S truly knows how to pamper their clients.",
      service: "Facial Treatment",
      displayOrder: 0,
    },
    {
      name: "Emily Carter",
      rating: 5,
      text: "I've been coming here for my hair for over a year now. Katherine always understands exactly what I want and delivers beyond my expectations.",
      service: "Hair Styling",
      displayOrder: 1,
    },
    {
      name: "Jessica Brown",
      rating: 5,
      text: "Maya's massage therapy is incredible. I left feeling completely renewed. This place is my sanctuary from the stress of daily life.",
      service: "Deep Tissue Massage",
      displayOrder: 2,
    },
    {
      name: "Amanda Lee",
      rating: 5,
      text: "Emma transformed my hair with the most beautiful balayage. I get compliments everywhere I go. Thank you, K & S Beauty Centre!",
      service: "Hair Colour",
      displayOrder: 3,
    },
  ];

  for (const review of reviews) {
    const id = reviews.indexOf(review) + 1;
    await prisma.review.upsert({
      where: { id },
      update: {},
      create: { id, ...review },
    });
  }
  console.log("  ✓ Reviews seeded");

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
