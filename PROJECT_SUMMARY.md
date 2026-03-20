# Project Summary: MID-SUMMER MADNESS 2026

## Overview
**MID-SUMMER MADNESS (MSM) 2026** is the flagship three-day festival produced by **Apollo Wrldx**. Based in Dallas, TX, the festival serves as a cultural convergence for diaspora communities, bridging the gap between music, fashion, and design. The 2026 edition marks the fourth year of the festival, expecting over 1,100 attendees across three distinct event formats.

## Vision & Brand
- **Mission:** To create a living experience where discovery, creativity, and connection happen at every turn.
- **Aesthetic:** High-energy, immersive, and discovery-driven. The digital presence uses fluid backgrounds, glitch typography, and a custom interactive cursor to mirror the festival's "cosmic" and "dream-like" energy.
- **Target Audience:** Culturally engaged diaspora consumers (ages 22-35).

## Technical Architecture
The application is a full-stack web platform built for high performance and visual impact.

### Core Tech Stack
- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS (Utility-first CSS).
- **Animations:** Framer Motion (Fluid transitions, scroll-linked animations, and entrance effects).
- **Icons:** Lucide React.
- **Backend:** 
  - **Local Development:** Express.js server (`server.ts`) integrated with Vite middleware.
  - **Production:** Vercel Serverless Functions (`/api/gallery.ts`).
- **Storage:** Vercel Blob Storage (Used for hosting festival photography and brand assets).

### Key Components & Features
1. **Hero Section:** Dynamic entrance with glitch text and scroll-triggered parallax effects.
2. **Event Management:** A curated "Weekend" section featuring:
   - **STARGAZING (Friday):** Rooftop kickoff with Pan-diaspora sounds.
   - **ON THE MOOD BOARD (Saturday):** Daytime fashion and discovery activation.
   - **AM I DREAMING? (Sunday):** Immersive finale with a 40-foot LED production.
3. **Dynamic Gallery:** A real-time photo gallery that fetches assets directly from Vercel Blob. It includes a custom sorting algorithm to prioritize "featured" historical photos (based on specific IDs like `6990`, `6982`, etc.).
4. **Partnership Portal:** A dedicated section for sponsors to download the festival brief and schedule inquiries.
5. **Fluid UI:** Custom cursor tracking, fluid background shaders, and a responsive mobile-first navigation system.

## Data Flow
- **Image Retrieval:** The frontend `Gallery` component calls `/api/gallery`.
- **Server Logic:** The API (Serverless or Express) lists blobs from Vercel Blob storage using the `BLOB_READ_WRITE_TOKEN`.
- **Response Format:** Returns a JSON object: `{ images: Array<{url, pathname, size, uploadedAt}>, logoUrl: string }`.

## Development & Deployment
- **Environment Variables:** Requires `BLOB_READ_WRITE_TOKEN` for asset management.
- **Build System:** Vite-based build pipeline producing a static `dist` folder served by the backend in production.
- **Hosting:** Optimized for Vercel deployment with serverless function support.

---
*This document serves as a comprehensive source for understanding the technical and creative scope of the MSM 2026 project.*
