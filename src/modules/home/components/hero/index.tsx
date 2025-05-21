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
    <section className="relative w-full h-[550px] overflow-hidden bg-[#FFF9EF] flex items-center justify-center">
      <AnimatePresence>
        <motion.div
    key={current}
    className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-10 px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
  >
    <div className="max-w-screen-lg w-full flex flex-col md:flex-row items-center justify-between mx-auto gap-10 text-center md:text-left">
      {/* Texto */}
      <div className="md:w-1/2 z-10 px-4">
        <span className="text-sm font-semibold bg-[#F8E3AF] text-[#5C3200] px-3 py-1 rounded-full mb-4 inline-block">
          SUPER LANZAMIENTO
        </span>
        <h1 className="text-4xl font-bold text-[#1F1F1F] mb-4 leading-snug">
          {slides[current].title}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{slides[current].subtitle}</p>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
          <Button variant="primary" className="bg-[#8B3A15] hover:bg-[#6f2e11]">
            Comprar ahora
          </Button>
          <Button variant="secondary">Ver catálogo</Button>
        </div>
      </div>

      {/* Imagen */}
      <div className="md:w-1/2 flex justify-center px-4">
        <Image
          src={slides[current].image}
          alt="Hero Slide"
          width={450}
          height={350}
          className="rounded-xl object-contain max-h-[350px] w-auto"
        />
      </div>
    </div>
      </motion.div>
      </AnimatePresence>

      {/* Botones de navegación */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20">
        <button onClick={handlePrev} className="bg-white p-2 rounded-full shadow hover:bg-gray-200">◀</button>
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20">
        <button onClick={handleNext} className="bg-white p-2 rounded-full shadow hover:bg-gray-200">▶</button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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
