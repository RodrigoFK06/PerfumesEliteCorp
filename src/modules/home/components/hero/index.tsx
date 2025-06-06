"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@medusajs/ui"

const slides = [
  {
    title: "Fragancias de lujo al alcance de todos",
    subtitle: "Descubre nuestra exclusiva colección de perfumes que combinan elegancia, distinción y calidad excepcional.",
    image: "/hero-slide-1.png",
  },
  {
    title: "Inspirados en las mejores marcas",
    subtitle: "Perfumes de larga duración para quienes aman destacar en cada momento.",
    image: "/hero-slide-2.png",
  },
  {
    title: "Nuevos lanzamientos disponibles",
    subtitle: "Explora nuestras últimas creaciones y encuentra tu aroma perfecto.",
    image: "/hero-slide-3.png",
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
  <section className="relative w-full min-h-[520px] bg-[#FFF9EF] flex items-center justify-center overflow-hidden px-4 py-8 sm:py-10">
  <div className="w-full max-w-screen-xl flex flex-col md:flex-row items-center justify-between gap-8 mx-auto">
    {/* Texto */}
    <motion.div
      key={`text-${current}`}
      className="w-full md:w-1/2 text-center md:text-left px-2 sm:px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-xs sm:text-sm font-semibold bg-[#F8E3AF] text-[#5C3200] px-3 py-1 rounded-full mb-4 inline-block">
        SUPER LANZAMIENTO
      </span>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-4 leading-snug max-w-lg mx-auto md:mx-0">
        {slides[current].title}
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 max-w-lg mx-auto md:mx-0">
        {slides[current].subtitle}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
        <Button className="bg-[#8B3A15] hover:bg-[#6f2e11] w-full sm:w-auto">
          Comprar ahora
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto">
          Ver catálogo
        </Button>
      </div>
    </motion.div>

    {/* Imagen */}
    <motion.div
      key={`image-${current}`}
      className="w-full md:w-1/2 flex justify-center px-2 sm:px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <Image
        src={slides[current].image}
        alt="Hero Slide"
        width={350}
        height={300}
        className="rounded-xl object-contain max-h-[300px] w-auto"
        priority
      />
    </motion.div>
  </div>

  {/* Botones navegación */}
  <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20">
    <button
      onClick={handlePrev}
      className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
    >
      ◀
    </button>
  </div>
  <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20">
    <button
      onClick={handleNext}
      className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
    >
      ▶
    </button>
  </div>

  {/* Indicadores */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
    {slides.map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-all ${
          index === current ? "bg-[#8B3A15]" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</section>

  )
}
