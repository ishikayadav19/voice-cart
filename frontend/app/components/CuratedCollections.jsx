"use client"

import { motion } from 'framer-motion';
import { BlurText } from './AnimatedText';
import Link from 'next/link';

const collections = [
  {
    id: 1,
    title: "Executive Lounge",
    subtitle: "Power & Prestige",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    link: "/category/fashion"
  },
  {
    id: 2,
    title: "Midnight Studio",
    subtitle: "Creative & Bold",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    link: "/category/electronics"
  },
  {
    id: 3,
    title: "Zen Retreat",
    subtitle: "Calm & Focused",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
    link: "/category/home"
  }
];

export default function CuratedCollections() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#030014]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <BlurText text="Shop by Mood" className="text-4xl md:text-5xl font-serif font-light mb-4" />
          <p className="text-gray-400 font-light tracking-wide max-w-xl mb-6">Discover curated collections designed for every aspect of your luxurious lifestyle.</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link href={item.link}>
                <motion.div 
                  whileHover={{ scale: 0.98 }}
                  className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {/* Luxury Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 group-hover:to-black/70 transition-colors duration-500"></div>
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="text-rose-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      {item.subtitle}
                    </p>
                    <h3 className="text-3xl font-serif font-light text-white transform group-hover:-translate-y-2 transition-transform duration-500">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
