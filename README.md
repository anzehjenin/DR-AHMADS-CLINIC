# 🩺 Sehha Plus (Dr. Ahmad's Clinic) — Premium Patient Portal

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-teal?style=for-the-badge&logo=vercel)](https://drahmad.vercel.app/patient)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/anzehjenin/DR-AHMADS-CLINIC)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-Supabase%20Postgres-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)

Welcome to **Sehha Plus**, a state-of-the-art, high-fidelity patient appointment portal and clinic dashboard. Designed with an ultra-premium visual aesthetic, smooth transitions, and a flawless user experience, this system makes booking, rescheduling, and managing medical appointments completely seamless for patients.

* **Live Patient Portal**: [https://drahmad.vercel.app/patient](https://drahmad.vercel.app/patient)
* **Live Main Portal**: [https://drahmad.vercel.app/](https://drahmad.vercel.app/)

---

## 🌟 Key Features

* **🔑 Passwordless Secure OTP Flow**: Demo login using any phone number with default verification code `1234`. New patients are auto-registered dynamically!
* **📊 Elegant Patient Dashboard**: Overview of upcoming, completed, and cancelled appointments with beautiful progress rings and analytical metrics.
* **📅 Dynamic Real-Time Booking**: Interactive calendar, clinic selection (Olaya, Malqa, Rawdah, Nakheel), specialty filters, and real-time slot checking.
* **🔁 Instant Rescheduling & Cancellation**: Intuitive rescheduling flow with instant status transitions and automatic calendar updates.
* **🎛️ Hybrid Database Adapter**: Full serverless-optimized connection pooling with Supabase cloud database, falling back gracefully to local JSON or in-memory systems.
* **🎨 Ultra-Premium Design**: Handcrafted HSL color palette, soft glassmorphism, responsive mobile-first layouts, and modern typography.

---

## 🛠️ Tech Stack & Architecture

```
                    ┌────────────────────────┐
                    │      Next.js Front     │
                    │   (React Serverless)   │
                    └───────────┬────────────┘
                                │
                        ┌───────▼───────┐
                        │  Next.js API  │
                        │    Routes     │
                        └───────┬───────┘
                                │ (Hybrid DB Interface)
            ┌───────────────────┴───────────────────┐
            ▼ (Postgres Active)                     ▼ (Postgres Off / Fallback)
┌───────────────────────┐               ┌───────────────────────┐
│     Supabase Cloud    │               │  Local JSON Database  │
│  PostgreSQL Instance  │               │   (data/db.json) OR   │
└───────────────────────┘               │   In-Memory Fallback  │
                                        └───────────────────────┘
```

* **Frontend Framework**: Next.js 15 (App Router, Serverless architecture)
* **Styling**: Modern CSS variables & HSL-tailored premium custom designs
* **Icons**: Lucide React
* **Database**: PostgreSQL hosted on Supabase (using standard serverless pooled connections)
* **Persistence Layer**: Custom `db.ts` file acts as an smart Object-Relational Adapter which routes queries to Cloud PostgreSQL or fallback files to ensure 100% application uptime.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/anzehjenin/DR-AHMADS-CLINIC.git
cd DR-AHMADS-CLINIC
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```env
DATABASE_URL="your-supabase-postgres-connection-string"
```

*Note: The app will run beautifully even without a database string! If no string is provided, it operates in **high-performance local fallback mode** using a local database store.*

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to interact with the application.

---

## 💡 How to Present the Project (Pitch Outline)

Use this outline to deliver a world-class demonstration to clients, stakeholders, or examiners:

1. **The Hook (The Problem)**: Traditional clinical portals are slow, rely on outdated passwords patients forget, and have poor mobile experiences.
2. **The Solution (Sehha Plus)**: A highly interactive, premium patient portal that replaces password headaches with a fast passwordless phone flow, providing instant access to healthcare booking.
3. **The Live Demo (Show, Don't Tell)**:
   * Go to `https://drahmad.vercel.app/`
   * Enter a phone number (e.g. `50 123 4567`) and sign in using the code `1234`.
   * Highlight the **Dynamic Metrics Panel** (Analytics, counts of upcoming/completed visits).
   * Showcase **Booking a New Appointment**: Select a clinic, filter by specialty, choose a doctor, click a date/time, add medical notes, and submit.
   * Demonstrate **Rescheduling & Cancellation**: Reschedule a visit from the upcoming list in seconds with real-time feedback.
4. **The Engineering Edge (Under the Hood)**:
   * Explain the **Hybrid Database Adapter** which bridges Enterprise PostgreSQL and local storage, ensuring zero downtime even under extreme circumstances or database outages.
   * Detail the **Secure Cookie Middleware** that keeps patient data encrypted and protected at the server edge.
   * Detail the responsive, premium user interface designed from scratch to maximize conversion rate and user comfort.

---

## 📄 License

Licensed under the MIT License. Developed with care for next-generation clinical software.
