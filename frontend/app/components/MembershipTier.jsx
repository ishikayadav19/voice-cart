"use client"

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { Crown, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function MembershipTier() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Particle positions/durations are random — generate them only on the
  // client after mount so SSR and client output match (no hydration warning).
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 10 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      {/* Golden Glow Background & Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none"></div>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Black Card 3D Interactive Element */}
          <div className="lg:w-1/2 perspective-[2000px] w-full flex justify-center py-10">
            <motion.div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[500px] aspect-[1.58/1] rounded-3xl p-8 cursor-pointer group shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
            >
              {/* Card Physical Body - Background and Glare (Hidden Overflow) */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000] border border-[#D4AF37]/30 overflow-hidden shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]">
                
                {/* Holographic Glare Effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)",
                    left: glareX,
                    top: glareY,
                    transform: "translate(-50%, -50%)",
                    width: "200%",
                    height: "200%"
                  }}
                />
                
                {/* Diagonal Metal Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
              </div>

              {/* 3D Content (Outside of Overflow Hidden) */}
              <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Crown className="text-[#D4AF37] w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                    <span className="text-[#E5E0D8] font-serif tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">Voice Cart</span>
                  </div>
                  <Sparkles className="text-[#D4AF37] w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>

                {/* EMV Chip Mockup */}
                <div className="w-12 h-8 md:w-14 md:h-10 rounded-md bg-gradient-to-br from-[#FDFBF7] via-[#D4AF37] to-[#E6B9A6] border border-[#D4AF37]/40 shadow-inner flex items-center justify-center opacity-90" style={{ transform: "translateZ(40px)" }}>
                  <div className="w-full h-px bg-black/20 absolute"></div>
                  <div className="h-full w-px bg-black/20 absolute"></div>
                </div>

                <div className="flex justify-between items-end" style={{ transform: "translateZ(20px)" }}>
                  <div>
                    <p className="text-[#7A7571] text-[8px] md:text-[10px] tracking-widest uppercase mb-1 md:mb-2">Member Status</p>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FDFBF7] to-[#D4AF37] font-serif text-xl md:text-2xl tracking-[0.1em] md:tracking-[0.2em] drop-shadow-sm">NOIR ELITE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#7A7571] text-[7px] md:text-[8px] tracking-widest uppercase mb-1">Since</p>
                    <p className="text-[#E5E0D8] font-mono text-xs md:text-sm tracking-widest">2026</p>
                  </div>
                </div>
              </div>
              
              {/* 3D Glowing Drop Shadow underneath */}
              <div className="absolute -bottom-10 left-10 right-10 h-10 bg-[#1A1A1A]/10 blur-[40px] rounded-full" style={{ transform: "translateZ(-50px)" }}></div>
            </motion.div>
          </div>

          {/* Text Details */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-bold mb-4 block flex items-center"
              >
                <div className="w-8 h-px bg-[#D4AF37] mr-3"></div>
                By Invitation Only
              </motion.span>
              <ShinyText text="The Noir Elite Status" className="text-4xl md:text-6xl font-serif font-light mb-6 text-[#1A1A1A] leading-tight drop-shadow-sm" />
              <p className="text-[#5C5C5C] font-light leading-relaxed mb-8 max-w-lg text-lg">
                Unlock an unprecedented level of luxury. Noir Elite members enjoy priority voice concierge access, exclusive private sales, and complimentary white-glove delivery on all orders.
              </p>
            </div>

            <div className="space-y-8 relative">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/10 to-transparent"></div>
              {[
                { icon: Zap, title: "Priority AI Concierge", desc: "Skip the queue with our dedicated premium servers." },
                { icon: Crown, title: "Private Collections", desc: "Early access to limited edition drops." },
                { icon: ShieldCheck, title: "White-Glove Delivery", desc: "Insured, same-day delivery with premium packaging." }
              ].map((perk, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                  className="flex items-start space-x-6 relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center shrink-0 border border-[#D4AF37]/30 shadow-sm">
                    <perk.icon className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <h4 className="text-[#1A1A1A] font-medium text-lg mb-2 tracking-wide">{perk.title}</h4>
                    <p className="text-[#5C5C5C] font-light leading-relaxed">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(212,175,55,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 px-10 py-5 bg-gradient-to-r from-[#E6B9A6] via-[#D4AF37] to-[#E6B9A6] text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-sm rounded-full transition-all duration-300 flex items-center space-x-3 shadow-md"
            >
              <span>Request Invitation</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      </div>
    </section>
  );
}
