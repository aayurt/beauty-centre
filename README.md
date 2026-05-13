# K & S Beauty Centre Website

A modern, elegant single-page website for **K & S Beauty Centre** built with Next.js 14, TypeScript, and Tailwind CSS. Features smooth scroll animations powered by Framer Motion.

![K & S Beauty Centre](https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80)

## ✨ Features

- **Modern Design** - Pastel pink and sage green color palette with Playfair Display typography
- **Scroll Animations** - Smooth, engaging animations using Framer Motion
- **Scroll Video Frames** - 80 video frames extracted with ffmpeg, displayed based on scroll position
- **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **Contact Form** - Integrated with Neon Postgres database
- **Image Gallery** - Lightbox-enabled gallery with Unsplash images
- **SEO Optimized** - Meta tags and semantic HTML structure
- **TypeScript** - Full type safety throughout the codebase

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- (Optional) Neon Postgres database for contact form

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd beauty-centre
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Neon database (optional):
   - Create a Neon database at [console.neon.tech](https://console.neon.tech)
   - Copy your connection string to `.env.local`
   - Run the SQL in `schema.sql` to create the contacts table

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
beauty-centre/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API endpoint
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Home page
├── components/
│   ├── About.tsx                 # About section
│   ├── AnimatedSection.tsx       # Reusable scroll animation wrapper
│   ├── Contact.tsx               # Contact form section
│   ├── Footer.tsx                # Footer component
│   ├── Gallery.tsx               # Image gallery with lightbox
│   ├── Hero.tsx                  # Hero section with parallax
│   ├── Navbar.tsx                # Navigation bar
│   ├── Services.tsx              # Services cards
│   ├── Team.tsx                  # Team member profiles
│   └── Testimonials.tsx          # Client testimonials carousel
├── lib/
│   └── db.ts                     # Database connection utilities
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── .env.local.example            # Example environment file
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── schema.sql                    # Database schema
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Pastel Pink | `#F2C4CE` | Primary accent, buttons |
| Sage Green | `#9CAF88` | Secondary accent, links |
| Light Pink BG | `#FDF2F5` | Section backgrounds |
| Dark Text | `#2D2D2D` | Body text |

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Neon Postgres (optional)
- **Images**: Next.js Image optimization with Unsplash

## 📧 Contact Form Setup

The contact form uses a Neon Postgres database. To set it up:

1. Create a Neon account at [console.neon.tech](https://console.neon.tech)
2. Create a new project and copy the connection string
3. Add the connection string to `.env.local`:
   ```
   DATABASE_URL=postgres://...
   ```
4. Run the SQL in `schema.sql` in your Neon console

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add the `DATABASE_URL` environment variable in Vercel
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Docker

## 📱 Sections

1. **Hero** - Full-screen with parallax background and animated text
2. **Scroll Video Frames** - 80 video frames displayed based on scroll position (ffmpeg extracted)
3. **About** - Brand story with decorative elements
4. **Services** - Hair, Facials, and Massage service cards
5. **Gallery** - Image grid with lightbox functionality
6. **Team** - Staff profiles with hover effects
7. **Testimonials** - Carousel with client reviews
8. **Contact** - Form with validation + contact information
9. **Footer** - Links, social media, and business info

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Google Fonts](https://fonts.google.com)