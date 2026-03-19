import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Instagram, Mail, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import EventCard from './components/EventCard';
import GalleryPreview from './components/GalleryPreview';
import { Event } from './types';

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

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
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
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">MSM 2026</div>
        
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

        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

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
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative min-h-[700px] md:h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20 md:pt-24 pb-80 md:pb-96">
        <motion.div style={{ y, opacity }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl">
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

          <div className="relative w-full flex justify-center items-center px-4 mt-96 md:mt-[120px]">
            <GradientText 
              text="MID-SUMMER MADNESS" 
              as="h1" 
              className="text-[10vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-center uppercase break-words" 
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-12 md:mt-16 mb-12 md:mb-16"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-lg font-light max-w-2xl mx-auto text-white/80 leading-relaxed drop-shadow-lg px-4 mt-80 md:mt-96"
          >
            Three days. Three distinct experiences. One cultural moment. MSM brings together 1,100 attendees for a weekend where music, fashion, and design converge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col md:flex-row gap-4 mt-[120px] md:mt-[160px]"
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

      <GalleryPreview />

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
              <h3 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8 tracking-tighter uppercase leading-tight">
                A <span className="italic font-light text-white/50">Convergence</span> of Diaspora Culture.
              </h3>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                Mid-Summer Madness is more than a festival—it's a conceptual weekend designed to bridge the gap between music, fashion, and community. We curate spaces where the pan-African diaspora can connect, celebrate, and discover.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-3xl font-heading font-bold text-white mb-1">1,100+</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Attendees</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-bold text-white mb-1">3 Days</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Distinct Vibe</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 border border-white/10 rounded-2xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                alt="MSM Vibe" 
                className="w-full h-full object-cover rounded-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="weekend" className="py-24 md:py-40 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <p className="text-black/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-4">The Schedule</p>
            <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter uppercase">The <span className="italic font-light text-black/30">Weekend</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WEEKEND_EVENTS.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => setSelectedEvent(event)} 
              />
            ))}
          </div>
        </div>
      </section>

      <section id="success" className="py-24 md:py-40 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Track Record</p>
              <h2 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter uppercase leading-[0.9]">
                Proven <span className="italic font-light text-white/50">Impact</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed">
              Our previous activations have set the standard for cultural engagement in Dallas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group border border-white/10 p-10 rounded-2xl hover:bg-white/5 transition-colors">
              <h3 className="text-2xl font-heading font-bold text-white mb-4 uppercase">MSM 2024</h3>
              <p className="text-white/50 font-light mb-8">The inaugural weekend that proved the demand for high-concept diaspora events in the region.</p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-heading font-bold text-[#a8fbd3]">450+</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Attendees</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-[#a8fbd3]">100%</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Sold Out</p>
                </div>
              </div>
            </div>
            <div className="group border border-white/10 p-10 rounded-2xl hover:bg-white/5 transition-colors">
              <h3 className="text-2xl font-heading font-bold text-white mb-4 uppercase">Apollo 2025</h3>
              <p className="text-white/50 font-light mb-8">A single-day activation that scaled our production value and reached a wider demographic.</p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-heading font-bold text-[#a8fbd3]">600+</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Attendees</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-[#a8fbd3]">40ft</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">LED Production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partnership" className="py-24 md:py-40 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <p className="text-black/40 font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Get Involved</p>
              <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter uppercase mb-8 leading-[0.85]">
                Let's <span className="italic font-light text-black/30">Build</span> Together
              </h2>
              <p className="text-black/60 text-lg font-light leading-relaxed mb-12">
                We are looking for partners who share our vision for elevated cultural experiences. Whether you're a brand, designer, or creator, let's discuss how you can be part of MSM 2026.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">Email</p>
                    <p className="text-lg font-bold">assist@tobiafo.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">Instagram</p>
                    <p className="text-lg font-bold">@apollowrldx</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black p-10 md:p-16 rounded-3xl text-white">
              <h3 className="text-2xl font-heading font-bold mb-8 uppercase tracking-tight">Inquiry Form</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a8fbd3] outline-none transition-colors" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Email</label>
                  <input type="email" className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a8fbd3] outline-none transition-colors" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Interest</label>
                  <select className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a8fbd3] outline-none transition-colors appearance-none">
                    <option className="bg-black">Brand Partnership</option>
                    <option className="bg-black">Designer Showcase</option>
                    <option className="bg-black">Media / Press</option>
                    <option className="bg-black">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Message</label>
                  <textarea className="w-full bg-transparent border-b border-white/20 py-3 focus:border-[#a8fbd3] outline-none transition-colors resize-none h-32" placeholder="Tell us about your vision"></textarea>
                </div>
                <button className="w-full py-5 bg-[#a8fbd3] text-black font-bold tracking-widest uppercase hover:bg-white transition-colors mt-8">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 MSM Festival / Apollo Wrldx</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-[10px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-6xl w-full bg-[#111] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md"
                onClick={() => setSelectedEvent(null)}
              >
                <X size={24} />
              </button>
              
              <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-[#a8fbd3] text-black text-[10px] font-bold tracking-widest uppercase rounded-full">
                    {selectedEvent.day}
                  </span>
                  <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                    {selectedEvent.time}
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
                  {selectedEvent.name.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br />
                    </React.Fragment>
                  ))}
                </h2>
                
                <p className="text-[#a8fbd3] font-mono text-xs uppercase tracking-[0.2em] mb-8">
                  {selectedEvent.tagline}
                </p>
                
                <p className="text-white/60 font-light leading-relaxed mb-10 text-lg">
                  {selectedEvent.description}
                </p>
                
                <div className="flex items-center gap-4 border-t border-white/10 pt-8">
                  <Users className="text-[#a8fbd3]" size={20} />
                  <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                    Expected: {selectedEvent.attendees}
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-8 right-8 hidden md:flex gap-4">
                <button 
                  onClick={() => navigateEvent('prev')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => navigateEvent('next')}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
