"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How accurate is the Voice Concierge?",
    answer: "Our AI is trained on advanced natural language processing tailored specifically for luxury fashion and electronics. It boasts a 99% accuracy rate, understanding complex queries like 'Show me rose gold chronographs under 50k'."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, Voice Cart provides insured, expedited shipping globally. Noir Elite members enjoy complimentary shipping regardless of destination."
  },
  {
    question: "How do I return an item?",
    answer: "Simply speak 'Return my last order' to the Voice Concierge, or initiate a return from your dashboard. We provide complimentary pickup from your location within 24 hours."
  },
  {
    question: "Are the products authenticated?",
    answer: "Every item on Voice Cart goes through a rigorous multi-point physical and digital authentication process by our in-house experts before being listed."
  }
];

export default function LuxuryFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <ShinyText text="Frequently Asked Questions" className="text-3xl md:text-5xl font-serif font-light mb-6 text-[#1A1A1A] drop-shadow-sm" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-[#E5E0D8] rounded-2xl bg-white overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-[#FAF9F6] transition-colors"
              >
                <h3 className="text-lg font-medium text-[#1A1A1A] pr-8">{faq.question}</h3>
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#FDFBF7] flex items-center justify-center border border-[#E5E0D8]">
                  {openIndex === index ? <Minus size={16} className="text-[#E6B9A6]" /> : <Plus size={16} className="text-[#D4AF37]" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-[#5C5C5C] font-light leading-relaxed border-t border-[#E5E0D8]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
