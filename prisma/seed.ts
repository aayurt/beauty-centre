import { PrismaClient, ReviewSource } from "@prisma/client";
import { hashPassword } from "../lib/password";

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

  // Seed Company Profile
  await prisma.companyProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "K & S Beauty Centre",
      tagline: "Crafting Beauty, One Client at a Time",
      description:
        "At K & S Beauty Centre, we believe that beauty is an art form, and every client is our canvas. Our sanctuary combines cutting-edge techniques with timeless elegance to deliver transformative experiences.",
      address: "123 Beauty Lane, Suite 100\nCity Centre, State 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@ksbeautycentre.com",
      hours:
        "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
      instagram: "@ksbeautycentre",
      facebook: "KSBeautyCentre",
      x: "@ksbeauty",
      socialEnabled: true,
      instagramEnabled: true,
      facebookEnabled: true,
      xEnabled: true,
    },
  });
  console.log("  ✓ Company profile seeded");

  // Seed Default Admin User
  await prisma.adminUser.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: "admin",
      passwordHash: hashPassword("admin123"),
    },
  });
  console.log("  ✓ Default admin user seeded (admin / admin123)");

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
      create: { ...service, id: services.indexOf(service) + 1 },
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

  // Seed Client Reviews
  const clientReviews = [
    {
      source: ReviewSource.GOOGLE,
      rating: 5,
      text: "The most relaxing facial I've ever had! My skin has never looked better. The team at K & S truly knows how to pamper their clients.",
      author: "Sarah Mitchell",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      service: "Facial Treatment",
      displayOrder: 0,
    },
    {
      source: ReviewSource.MANUAL,
      rating: 5,
      text: "I've been coming here for my hair for over a year now. Katherine always understands exactly what I want.",
      author: "Emily Carter",
      photo: null,
      service: "Hair Styling",
      displayOrder: 1,
    },
    {
      source: ReviewSource.GOOGLE,
      rating: 5,
      text: "Maya's massage therapy is incredible. I left feeling completely renewed. This place is my sanctuary.",
      author: "Jessica Brown",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      service: "Deep Tissue Massage",
      displayOrder: 2,
    },
    {
      source: ReviewSource.MANUAL,
      rating: 5,
      text: "Emma transformed my hair with the most beautiful balayage. I get compliments everywhere I go.",
      author: "Amanda Lee",
      photo: null,
      service: "Hair Colour",
      displayOrder: 3,
    },
  ];

  for (const review of clientReviews) {
    const id = clientReviews.indexOf(review) + 1;
    await prisma.clientReview.upsert({
      where: { id },
      update: {},
      create: { id, ...review },
    });
  }
  console.log("  ✓ Client reviews seeded");

  // Seed Staff
  const staffMembers = [
    {
      name: "Katherine Smith",
      role: "Founder & Senior Stylist",
      bio: "With over 15 years of experience, Katherine founded K & S Beauty Centre with a vision to create a sanctuary where beauty meets wellness. She specializes in precision cuts and creative colour techniques.",
      imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
      displayOrder: 0,
    },
    {
      name: "Sarah Johnson",
      role: "Lead Esthetician",
      bio: "Sarah is a licensed esthetician with expertise in advanced facial treatments and skincare. She is passionate about helping clients achieve radiant, healthy skin.",
      imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
      displayOrder: 1,
    },
    {
      name: "Maya Rodriguez",
      role: "Massage Therapist",
      bio: "Maya is a certified massage therapist trained in multiple modalities including Swedish, deep tissue, and hot stone therapy. She believes in the healing power of touch.",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      displayOrder: 2,
    },
    {
      name: "Emma Chen",
      role: "Colour Specialist",
      bio: "Emma is an award-winning colourist known for her balayage and creative colour transformations. She stays at the forefront of trending techniques and products.",
      imageUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
      displayOrder: 3,
    },
  ];

  for (const staff of staffMembers) {
    const id = staffMembers.indexOf(staff) + 1;
    await prisma.staff.upsert({
      where: { id },
      update: {},
      create: { id, ...staff },
    });
  }
  console.log("  ✓ Staff seeded");

  // Seed Events
  const now = new Date();
  const events = [
    {
      title: "Summer Glow Workshop",
      description: "Join us for an exclusive workshop on achieving that perfect summer glow. Learn about our signature facial treatments and get a complimentary skin consultation.",
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15),
      time: "10:00 AM - 2:00 PM",
      location: "K & S Beauty Centre, 123 Beauty Lane",
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
    },
    {
      title: "Bridal Beauty Preview",
      description: "Planning your wedding? Come to our bridal beauty preview and explore our full range of bridal packages. Enjoy refreshments and exclusive discounts.",
      date: new Date(now.getFullYear(), now.getMonth() + 2, 1),
      time: "11:00 AM - 4:00 PM",
      location: "K & S Beauty Centre, 123 Beauty Lane",
      imageUrl: "https://images.unsplash.com/photo-1464692389072-362e65f64c5b?w=800&q=80",
    },
  ];

  for (const event of events) {
    const id = events.indexOf(event) + 1;
    await prisma.event.upsert({
      where: { id },
      update: {},
      create: event,
    });
  }
  console.log("  ✓ Events seeded");

  // Seed Media (linked to events)
  const mediaItems = [
    {
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
      alt: "Summer Glow Workshop banner",
      caption: "Join our Summer Glow Workshop",
      eventId: 1,
      displayOrder: 0,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464692389072-362e65f64c5b?w=800&q=80",
      alt: "Bridal beauty showcase",
      caption: "Bridal Beauty Preview event",
      eventId: 2,
      displayOrder: 0,
    },
  ];

  for (const media of mediaItems) {
    const id = mediaItems.indexOf(media) + 1;
    await prisma.media.upsert({
      where: { id },
      update: {},
      create: { id, ...media },
    });
  }
  console.log("  ✓ Media seeded");

  // Seed Privacy Policy
  await prisma.privacyPolicy.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      body: "<h1>Privacy Policy</h1><p>At K & S Beauty Centre, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p><h2>Information We Collect</h2><p>We collect information you provide when booking appointments, including your name, email address, phone number, and service preferences.</p><h2>How We Use Your Information</h2><p>We use your information to schedule appointments, send appointment reminders, and improve our services. We do not sell or share your information with third parties.</p><h2>Data Protection</h2><p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p><h2>Contact Us</h2><p>If you have questions about this policy, please contact us at hello@ksbeautycentre.com.</p>",
      version: 1,
      isLatest: true,
      publishedAt: new Date(),
    },
  });
  console.log("  ✓ Privacy policy seeded");

  // Seed Terms of Service
  await prisma.termsOfService.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      body: "<h1>Terms of Service</h1><p>By booking an appointment with K & S Beauty Centre, you agree to the following terms and conditions.</p><h2>Appointments</h2><p>We require at least 24 hours notice for cancellations. Late cancellations may be subject to a fee.</p><h2>Services</h2><p>We strive to provide the highest quality services. If you are not satisfied, please let us know within 48 hours.</p><h2>Pricing</h2><p>Prices are subject to change without notice. We will confirm pricing at the time of booking.</p><h2>Liability</h2><p>K & S Beauty Centre is not liable for allergic reactions to products used during treatments. Please inform us of any allergies prior to your appointment.</p>",
      version: 1,
      isLatest: true,
      publishedAt: new Date(),
    },
  });
  console.log("  ✓ Terms of service seeded");

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
