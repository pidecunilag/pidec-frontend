"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Curated engineering/student-focused Unsplash images
const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop", // Electronics/Robotics
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop", // Diverse students working together
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop", // Team collaboration
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop", // Tech workspace
];

export default function PublicAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Left Column - Form Area */}
      <div className="flex w-full flex-col lg:w-1/2 relative">
        {/* Navigation - Top Bar */}
        <div className="p-6 md:p-8 flex items-center justify-between z-10">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          {/* Logo representation - wait for designer assets later, using text for now */}
          <div className="font-bold text-xl tracking-tight text-foreground">
            PIDEC <span className="text-brand">1.0</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-12">
          {children}
        </div>
      </div>

      {/* Right Column - Slideshow Area (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-muted">
        {SLIDESHOW_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="Engineering students at work"
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay gradient for better text readability if we add text over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Subtle branding overlay on images */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Proving Innovation, Design, and Engineering Competence
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Join the University of Lagos Engineering Society's premier design competition. Build, innovate, and represent your department.
          </p>
        </div>
      </div>
    </div>
  );
}
