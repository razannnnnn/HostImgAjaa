"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Analytics />
      <Navbar />
      <Hero />
      <Footer />

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
