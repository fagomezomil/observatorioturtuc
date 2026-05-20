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
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[420px] overflow-hidden">
      {/* Capa de imágenes - ancho completo */}
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

      {/* Degradado completo para contraste de texto y controles */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/50 via-black/10 to-black/0"
      />

      <div className="absolute inset-0 z-20">
        <div className="mx-auto container h-full flex items-end justify-between p-8 md:p-12">
          {/* Texto - izquierda */}
          <div className="text-white">
            <h2 className="bg-[#006557] w-fit py-2 px-4 text-3xl md:text-4xl font-bold drop-shadow-sm">
              {slides[current].title}
            </h2>
            <p className="bg-amber-500 py-2 px-4 mt-0 text-lg text-white/90 drop-shadow-sm">
              {slides[current].text}
            </p>
          </div>

          {/* Indicadores - derecha */}
          <div className="flex gap-2 pb-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-[#006557]" : "w-2 bg-amber-500"
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