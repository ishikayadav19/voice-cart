"use client"

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { Sparkles, Compass, Fingerprint } from 'lucide-react';

export default function BrandPhilosophy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const pillars = [
    {
      icon: Fingerprint,
      title: "Uniquely Yours",
      desc: "Every interaction is tailored to your unique preferences, creating a bespoke shopping journey."
    },
    {
      icon: Sparkles,
      title: "Intelligent Curation",
      desc: "Our AI concierge sifts through global luxury collections to present only what resonates with your style."
    },
    {
      icon: Compass,
      title: "Frictionless Discovery",
      desc: "Speak your desires. We eliminate the noise, bringing the world's finest products directly to you."
    }
  ];

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden bg-white border-y border-[#E5E0D8]">
      {/* Background Textures */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-white to-white"></div>
      <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content - Typography */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <motion.div style={{ opacity }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-px w-12 bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold">Our Philosophy</span>
              </div>
              
              <ShinyText 
                text="The Art of Intelligent Luxury." 
                className="text-5xl md:text-7xl font-serif font-light mb-8 text-[#1A1A1A] leading-[1.1] drop-shadow-sm" 
              />
              
              <p className="text-[#5C5C5C] text-lg font-light leading-relaxed mb-12">
                Voice Cart was born from a singular vision: to merge the timeless elegance of white-glove service with the frontier of artificial intelligence. We believe true luxury is the absence of friction.
              </p>

              <div className="space-y-8">
                {pillars.map((pillar, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-start gap-5"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E5E0D8] flex items-center justify-center shrink-0 shadow-sm text-[#D4AF37]">
                      <pillar.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-[#1A1A1A] text-lg font-medium mb-2">{pillar.title}</h4>
                      <p className="text-[#7A7571] font-light leading-relaxed">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Visual Parallax */}
          <div className="lg:w-7/12 relative h-[700px] w-full hidden md:block">
            <motion.div 
              style={{ y: y1 }}
              className="absolute right-0 top-10 w-2/3 h-[500px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(212,175,55,0.15)] border border-[#E5E0D8] z-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop" 
                alt="Luxury Fashion" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent"></div>
            </motion.div>

            <motion.div 
              style={{ y: y2 }}
              className="absolute left-0 bottom-10 w-1/2 h-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-[#E5E0D8] z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=800&auto=format&fit=crop" 
                alt="Luxury Watch" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay"></div>
            </motion.div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-20 bottom-32 w-32 h-32 bg-white/80 backdrop-blur-xl rounded-full border border-[#D4AF37]/30 shadow-lg flex items-center justify-center z-30"
            >
              <div className="text-center">
                <span className="block text-[#D4AF37] font-serif text-3xl italic">Est.</span>
                <span className="block text-[#1A1A1A] font-bold text-sm tracking-widest uppercase">2026</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
