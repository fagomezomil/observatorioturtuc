"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/images/slide/slide1.avif",
    title: "Observatorio Turístico",
    text: "Datos confiables sobre el sector turístico de Tucumán.",
  },
  {
    src: "/images/slide/slide2.avif",
    title: "Impacto Económico",
    text: "Análisis del gasto y la inversión turística en la provincia.",
  },
  {
    src: "/images/slide/slide3.avif",
    title: "Ocupación Hotelera",
    text: "Seguimiento mensual de la ocupación y el movimiento de turistas.",
  },
  {
    src: "/images/slide/slide4.avif",
    title: "Perfil del Turista",
    text: "Conocé quién nos visita, de dónde viene y qué busca.",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[480px] overflow-hidden">
      {/* Images */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#006e66]/80 via-[#006e66]/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-12 md:pb-16">
          <h2 className="bg-brand w-fit px-4 py-1 text-3xl md:text-4xl font-bold text-white drop-shadow-sm rounded-md">
            {slides[current].title}
          </h2>
          <p className="text-[15px] bg-[#EA7220] px-4 py-1 mt-1 w-fit text-white rounded-md">
            {slides[current].text}
          </p>

          {/* Indicators */}
          <div className="flex gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-brand" : "w-1.5 bg-[#EA7220]"
                }`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}