import { useState, useEffect } from 'react';
import Header from "@/components/home/navbar/Header";
import { motion } from 'framer-motion';

const BUILDER_IMAGE = "/Navya cs.jpeg";

export default function AboutUs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const storySections = [
    {
      title: "The Motivation",
      content: "All of us love travelling — exploring new places, trying new food items, and experiencing different cultures. Travelling gives us memories, stories, and adventures that stay with us for a lifetime. But while travelling is exciting, planning a trip can be confusing and stressful. I built OffWeGo to make travel planning simple, flexible, and enjoyable — a platform designed especially for people who love travelling and exploring."
    },
    {
      title: "Understanding Your Needs",
      items: [
        {
          heading: "Freedom & Simplicity",
          desc: "Travel planning should be straightforward without sacrificing your personal preferences. You deserve a platform that guides you while giving you complete control over every decision."
        },
        {
          heading: "True Customization",
          desc: "Your trip should reflect your unique budget, style, and interests. OffWeGo ensures you can tailor every aspect — from transportation to accommodation — to create your perfect journey."
        }
      ]
    },
    {
      title: "The OffWeGo Solution",
      content: "In OffWeGo, package providers post structured travel packages, and users are given full customization options. You can customize the mode of travel, change flight classes, choose different hotels, and adjust parts of the package based on your budget and preference. It's flexibility meets convenience."
    },
    {
      title: "Building Trust through Community",
      content: "How can we trust a place? Through real experiences. OffWeGo includes a vibrant travel community and blog platform where users share authentic experiences and photos. Discover these stories, find inspiration, and add destinations to your bucket list. Explore local culture, uncover hidden spots, and gather genuine travel insights from fellow explorers."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Libre+Baskerville:wght@400;700&display=swap');
      `}</style>

      <Header forceSolid />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6 text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              The Story Behind OffWeGo
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-3xl mb-4 text-amber-800"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            Crafting Memories, Not Just Bookings
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Making travel planning simple, flexible, and enjoyable for every explorer.
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Builder Section */}
      <section className="py-20 px-6 bg-white border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl transform rotate-3"></div>
                <img
                  src={BUILDER_IMAGE}
                  alt="Navya CS"
                  className="relative rounded-2xl shadow-2xl w-full object-cover"
                  style={{ aspectRatio: '4/5' }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <p className="text-sm tracking-widest text-amber-700 mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                  Established
                </p>
                <p className="text-5xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  2026
                </p>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mt-8"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                The Visionary
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                Meet Navya CS, the builder behind OffWeGo. Inspired by a passion for exploring the world
                and a desire to solve the frustrations of modern travel planning, she created a platform
                that puts the traveler back in control.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-4xl mx-auto space-y-20">
          {storySections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 
                                flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {section.title}
                  </h3>

                  {section.content && (
                    <p className="text-lg text-gray-700 leading-relaxed"
                      style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <div className="space-y-6 mt-6">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 
                                   hover:shadow-xl transition-shadow duration-300"
                        >
                          <h4 className="text-xl font-bold text-amber-800 mb-3"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {item.heading}
                          </h4>
                          <p className="text-gray-700 leading-relaxed"
                            style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-100 to-orange-100">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative">
            <div className="text-9xl text-amber-300 absolute -top-8 left-0 opacity-30"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              "
            </div>
            <p className="text-3xl md:text-4xl text-gray-900 leading-relaxed relative z-10 px-8"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontStyle: 'italic' }}>
              So with OffWeGo, travel planning becomes more than just booking a trip —
              it becomes the beginning of an experience.
            </p>
            <div className="text-9xl text-amber-300 absolute -bottom-16 right-0 opacity-30 rotate-180"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              "
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}