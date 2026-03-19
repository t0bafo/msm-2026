/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Music, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Clock, Users, ArrowUpRight, Instagram, Mail } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import EventCard from './components/EventCard';
import Gallery from './components/Gallery';
import { Event, Section } from './types';

// MSM 2026 Event Data
const WEEKEND_EVENTS: Event[] = [
  { 
    id: 'stargazing', 
    name: 'STAR\nGAZING', 
    tagline: 'The official kickoff. Rooftop energy under open sky.',
    day: 'Friday, July 17', 
    time: '10 PM – 2 AM',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    description: 'Pan-diaspora sounds converge on the rooftop. Four DJs spinning Afro House, Afrobeats, Amapiano, Caribbean rhythms, and Latin heat. Cosmic theming, city views, elevated opening night energy. This is where the weekend begins.',
    attendees: '400-500 attendees'
  },
  { 
    id: 'moodboard', 
    name: 'ON THE\nMOOD BOARD', 
    tagline: 'A curated daytime experience. Fashion meets discovery.',
    day: 'Saturday, July 18', 
    time: '2 PM – 6 PM',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop',
    description: 'Intimate activation in a conceptual retail space. Emerging designers showcase their work through installations and vignettes. Brand activations, ambient soundscapes, photo-worthy moments. Discovery-driven, high-touch, exclusive.',
    attendees: '70-100 attendees'
  },
  { 
    id: 'dreaming', 
    name: 'AM I\nDREAMING?', 
    tagline: 'The festival finale. Closing night with a headliner.',
    day: 'Sunday, July 19', 
    time: '5 PM – 12 AM',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    description: 'Immersive production meets peak energy. 40-foot LED screen, full lighting systems, five DJs plus a special closing set. Golden hour arrival, headliner performance, unforgettable close. This is the night everyone remembers.',
    attendees: '400-500 attendees'
  },
];

const App: React.FC = () => {
  console.log("APP.TSX RENDERING");
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Fetch logo from gallery API
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      })
      .catch(err => console.error('Error fetching logo:', err));
  }, []);
  
  // Handle keyboard navigation for event modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEvent) return;
      if (e.key === 'ArrowLeft') navigateEvent('prev');
      if (e.key === 'ArrowRight') navigateEvent('next');
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateEvent = (direction: 'next' | 'prev') => {
    if (!selectedEvent) return;
    const currentIndex = WEEKEND_EVENTS.findIndex(e => e.id === selectedEvent.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % WEEKEND_EVENTS.length;
    } else {
      nextIndex = (currentIndex - 1 + WEEKEND_EVENTS.length) % WEEKEND_EVENTS.length;
    }
    setSelectedEvent(WEEKEND_EVENTS[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-pointer z-50 bg-transparent border-none p-0 flex items-center gap-3"
          data-hover="true"
        >
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="MSM 2026" 
              className="h-8 md:h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            "MSM 2026"
          )}
        </button>
        
        {/* Desktop Menu - Hidden to prioritize Date/City Box */}
        <div className="hidden">
          {['About', 'Weekend', 'Gallery', 'Success', 'Partnership'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#a8fbd3] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => scrollToSection('partnership')}
            className="border border-white/30 px-8 py-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent backdrop-blur-sm"
            data-hover="true"
          >
            Inquiry
          </button>
          <button 
            className="text-white z-50 relative w-10 h-10 flex items-center justify-center hover:text-[#a8fbd3] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Toggle (Always visible now) */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile/Global Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[#31326f]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            <button 
              className="absolute top-6 right-6 md:right-12 text-white w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            {['About', 'Weekend', 'Gallery', 'Success', 'Partnership'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-3xl md:text-5xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none tracking-widest"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('partnership')}
              className="mt-8 border border-white px-10 py-4 text-xs md:text-sm font-bold tracking-widest uppercase bg-white text-black hover:bg-[#a8fbd3] transition-colors"
            >
              Partnership Inquiry
            </button>
            
            <div className="absolute bottom-10 flex gap-6">
               <a href="https://apollowrldx.com" className="text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest">apollowrldx.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative min-h-[700px] md:h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20 md:pt-24 pb-32 md:pb-40">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl"
        >
           {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-mono text-[#a8fbd3] tracking-[0.3em] uppercase mb-6 md:mb-8 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10"
          >
            <span>Dallas, TX</span>
            <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>July 17–19, 2026</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center px-4">
            <GradientText 
              text="MID-SUMMER MADNESS" 
              as="h1" 
              className="text-[10vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-center uppercase break-words" 
            />
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4 md:mt-6 mb-4 md:mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-lg font-light max-w-2xl mx-auto text-white/80 leading-relaxed drop-shadow-lg px-4"
          >
            Three days. Three distinct experiences. One cultural moment. MSM brings together 1,100 attendees for a weekend where music, fashion, and design converge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 mt-6"
          >
            <button 
              onClick={() => scrollToSection('partnership')}
              className="bg-white text-black px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#a8fbd3] transition-colors duration-300"
            >
              Partnership Inquiry
            </button>
            <a 
              href="https://drive.google.com/uc?export=download&id=1NFKqsA9XgoV8zPsngttlg3NcFmYSGspx"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm flex items-center justify-center"
            >
              Download Brief
            </a>
          </motion.div>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-0 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-t-4 border-black">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-2xl md:text-5xl font-heading font-black px-8 flex items-center gap-4">
                    MSM 2026 <span className="text-black/20 text-xl md:text-3xl">/</span> 
                    DALLAS TEXAS <span className="text-black/20 text-xl md:text-3xl">/</span> 
                    APOLLO WRLDX <span className="text-black/20 text-xl md:text-3xl">/</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      <Gallery />

      {/* WHAT IS MSM? SECTION */}
      <section id="about" className="relative z-10 py-24 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-[10px] font-mono text-[#a8fbd3] tracking-[0.4em] uppercase mb-6">What is MSM?</h2>
              <h3 className="text-3xl sm:text-4xl md:text-7xl font-heading font-bold mb-8 leading-[0.9] uppercase break-words">
                A Cultural <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Convergence</span>
              </h3>
              <p className="text-base md:text-xl text-white/70 font-light leading-relaxed mb-12 max-w-xl">
                Mid-Summer Madness is Apollo Wrldx's flagship three-day festival—a cultural convergence built for diaspora communities. Born in Dallas, now in its fourth year, MSM transforms a weekend into a living experience where discovery, creativity, and connection happen at every turn. This isn't just a festival. It's a cultural moment designed to bridge the gap between music, fashion, and design.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { label: 'Attendees', value: '1,100', sub: 'Across 3 days' },
                  { label: 'Events', value: '3', sub: 'Distinct Formats' },
                  { label: 'Year', value: '4', sub: 'Since 2023' },
                ].map((stat, i) => (
                  <div key={i} className="border-l border-white/10 pl-6">
                    <div className="text-2xl md:text-4xl font-heading font-bold mb-1">{stat.value}</div>
                    <div className="text-[8px] font-mono text-[#a8fbd3] uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-[8px] text-white/40 uppercase tracking-widest">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                alt="MSM Culture" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">Dallas, TX</div>
                <div className="text-xl font-heading font-bold uppercase">The Flagship Festival</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE WEEKEND SECTION */}
      <section id="weekend" className="relative z-10 py-24 md:py-40 bg-black/40 backdrop-blur-md border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
             <div className="max-w-2xl md:max-w-none w-full">
               <h2 className="text-[10px] font-mono text-[#a8fbd3] tracking-[0.4em] uppercase mb-6">The Weekend</h2>
               <h3 className="text-4xl sm:text-5xl md:text-[6vw] lg:text-[7vw] font-heading font-bold uppercase leading-[0.9] mb-8 tracking-tighter md:whitespace-nowrap">
                 Three Days. <br className="md:hidden" />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3] md:ml-4">Three Experiences.</span>
               </h3>
               <p className="text-white/50 text-sm md:text-lg uppercase tracking-widest">One Journey.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
            {WEEKEND_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
        </div>
      </section>

      {/* PAST SUCCESS SECTION */}
      <section id="success" className="relative z-10 py-24 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-12 mb-16 text-center">
              <h2 className="text-[10px] font-mono text-[#a8fbd3] tracking-[0.4em] uppercase mb-6">Proven Success</h2>
              <h3 className="text-3xl sm:text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] break-words">
                MSM 2023-2025: <br/> <span className="text-white/20">Growing Impact</span>
              </h3>
            </div>
            
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-24">
              {[
                { label: 'Attendees', value: '2,500+', sub: 'Across 3 years' },
                { label: 'Sell-through', value: '90%', sub: 'Average' },
                { label: 'Satisfaction', value: '92%', sub: 'Attendee' },
                { label: 'Social Views', value: '45K+', sub: '2025' },
                { label: 'UGC Posts', value: '320+', sub: '2025' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center"
                >
                  <div className="text-2xl md:text-3xl font-heading font-bold mb-2">{stat.value}</div>
                  <div className="text-[8px] font-mono text-[#a8fbd3] uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-[8px] text-white/30 uppercase tracking-widest">{stat.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-6">
              <div className="relative p-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
                <div className="text-4xl md:text-6xl font-serif italic text-white/20 absolute top-6 left-8">"</div>
                <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed mb-8 relative z-10 italic">
                  MSM felt like a living mood board—discovery everywhere, and the programming actually flowed.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-[#a8fbd3]" />
                  <div className="text-[10px] font-mono text-[#a8fbd3] uppercase tracking-[0.3em]">MSM 2025 Attendee</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                MSM has become Dallas' anchor weekend for diaspora communities. Year after year, we've refined the format, deepened the experience, and built trust with attendees and partners. 2026 is our most ambitious year yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP SECTION */}
      <section id="partnership" className="relative z-10 py-24 md:py-40 px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-[10px] font-mono text-[#a8fbd3] tracking-[0.4em] uppercase mb-6">Partner With MSM 2026</h2>
              <h3 className="text-3xl sm:text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] mb-8 break-words">
                Connect With <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">The Culture</span>
              </h3>
              <p className="text-base md:text-xl text-white/70 font-light leading-relaxed mb-10">
                MSM offers multi-day brand visibility and audience access across three distinct cultural formats. This is your opportunity to authentically connect with 1,100+ engaged diaspora consumers in a trusted environment.
              </p>
              
              <div className="space-y-4 mb-12">
                {[
                  'Multi-day visibility across rooftop, retail, and indoor venues',
                  'Brand activations with direct audience engagement',
                  'Professional photo and video content featuring sponsor integration',
                  'Social media amplification across Apollo\'s network',
                  'Access to culturally engaged consumers (ages 22-35)',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm md:text-base text-white/80">
                    <div className="w-1.5 h-1.5 bg-[#a8fbd3] rounded-full" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <a 
                  href="tel:8178810335"
                  className="bg-white text-black px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#a8fbd3] transition-colors duration-300 flex items-center justify-center"
                >
                  Schedule a Call
                </a>
                <a 
                  href="https://drive.google.com/uc?export=download&id=1NFKqsA9XgoV8zPsngttlg3NcFmYSGspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/30 text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
                >
                  Download Brief
                </a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-12 rounded-3xl flex flex-col justify-center">
              <h4 className="text-xl font-heading font-bold uppercase mb-6">Partnership Tiers</h4>
              <p className="text-white/50 text-sm mb-10 leading-relaxed">
                Title, Presenting, and Supporting sponsor tiers available. We specialize in building custom integrations that feel organic to the festival experience.
              </p>
              
              <div className="space-y-6">
                {['Title Sponsor', 'Presenting Partner', 'Supporting Sponsor'].map((tier, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-sm uppercase tracking-widest font-bold">{tier}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#a8fbd3]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT APOLLO WRLDX SECTION */}
      <section className="relative z-10 py-24 md:py-40 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[10px] font-mono text-[#a8fbd3] tracking-[0.4em] uppercase mb-6">About Apollo Wrldx</h2>
          <p className="text-xl md:text-3xl font-light text-white/90 leading-relaxed mb-12">
            Apollo Wrldx is a creative agency and experiential production partner building cultural infrastructure for diaspora communities. We've produced 30+ events across NYC, Dallas, and Atlanta, reaching 8,000+ attendees. Our work focuses on the intersection of music, fashion, and design, creating spaces where creativity thrives.
          </p>
          <a 
            href="https://apollowrldx.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#a8fbd3] hover:text-white transition-colors"
          >
            Learn more at apollowrldx.com
          </a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-20 md:py-32 bg-black/80 backdrop-blur-xl px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
            <div>
              <h3 className="text-2xl font-heading font-bold uppercase mb-6">Partner With Us</h3>
              <p className="text-white/50 text-lg font-light mb-8 max-w-md">
                Interested in sponsoring MSM 2026 or working with Apollo on your next campaign? Let's talk.
              </p>
              <a 
                href="mailto:tobi@apollowrldx.com"
                className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase border-b border-[#a8fbd3] pb-2 text-[#a8fbd3] hover:text-white hover:border-white transition-all"
              >
                Get in Touch
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-6">Contact</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a8fbd3]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Email</span>
                      <a href="mailto:tobi@apollowrldx.com" className="text-sm hover:text-[#a8fbd3] transition-colors">tobi@apollowrldx.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a8fbd3]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Direct</span>
                      <p className="text-sm">Tobi Afolayan</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-6">Social</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a8fbd3]">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Instagram</span>
                      <a href="https://www.instagram.com/apollowrldx/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#a8fbd3] transition-colors">@apollowrldx</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a8fbd3]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Website</span>
                      <a href="https://apollowrldx.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#a8fbd3] transition-colors">apollowrldx.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-heading text-xl font-bold tracking-tighter text-white hover:text-[#a8fbd3] transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              MSM 2026
            </button>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              © 2026 Apollo Wrldx. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#1a1b3b] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#4fb7b3]/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateEvent('prev'); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm hidden md:block"
                data-hover="true"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateEvent('next'); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm hidden md:block"
                data-hover="true"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedEvent.id}
                    src={selectedEvent.image} 
                    alt={selectedEvent.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-3 text-[#a8fbd3]">
                       <Calendar className="w-4 h-4" />
                       <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{selectedEvent.day}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/50">
                       <Clock className="w-4 h-4" />
                       <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{selectedEvent.time}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-tight mb-4 text-white whitespace-pre-line">
                    {selectedEvent.name}
                  </h3>
                  
                  <p className="text-sm md:text-lg text-[#a8fbd3] font-medium tracking-widest uppercase mb-8 max-w-md">
                    {selectedEvent.tagline}
                  </p>
                  
                  <div className="h-px w-20 bg-white/20 mb-8" />
                  
                  <p className="text-white/70 leading-relaxed text-base md:text-lg font-light mb-10">
                    {selectedEvent.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <Users className="w-4 h-4" />
                    {selectedEvent.attendees}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;