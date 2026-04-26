"use client"

import { motion } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { ArrowRight } from 'lucide-react';

export default function CuratedDepartments() {
  const departments = [
    { 
      name: "Smart Electronics", 
      slug: "electronics", 
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80",
      desc: "Latest tech & wearables"
    },
    { 
      name: "Haute Couture", 
      slug: "fashion", 
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80",
      desc: "Designer apparel & accessories"
    },
    { 
      name: "Luxury Living", 
      slug: "home", 
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
      desc: "Premium home decor"
    },
    { 
      name: "Fine Watches", 
      slug: "watches", 
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80",
      desc: "Timeless horology pieces"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#FDFBF7]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <ShinyText text="Exquisite Departments" className="text-4xl md:text-5xl font-serif font-light mb-4 text-[#1A1A1A] drop-shadow-sm" />
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-4 mb-6"></div>
          <p className="text-[#5C5C5C] font-light tracking-wide max-w-2xl mx-auto">
            Explore our meticulously curated selections across the most desired categories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -10 }}
              className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${dept.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-serif text-white mb-2">{dept.name}</h3>
                  <p className="text-gray-300 font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{dept.desc}</p>
                </div>
                
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="text-white w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
