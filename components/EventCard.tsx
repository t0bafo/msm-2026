/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Event } from '../types';
import { ArrowUpRight, Clock, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <motion.div
      className="group relative h-[450px] md:h-[600px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={event.image} 
          alt={event.name} 
          className="h-full w-full object-cover grayscale will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.5, filter: 'grayscale(100%)' },
            hover: { scale: 1.1, opacity: 0.8, filter: 'grayscale(0%)' }
          }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <div className="flex flex-col gap-2">
             <span className="text-[10px] font-mono border border-white/30 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest bg-black/20">
               {event.day}
             </span>
             <div className="flex items-center gap-2 text-[10px] font-mono text-white/70 uppercase tracking-widest">
               <Clock className="w-3 h-3" />
               {event.time}
             </div>
           </div>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black rounded-full p-3 will-change-transform"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.h3 
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-white leading-tight will-change-transform break-words whitespace-pre-line"
            variants={{
              rest: { y: 0 },
              hover: { y: -5 }
            }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {event.name}
          </motion.h3>
          
          <motion.p 
            className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#a8fbd3] will-change-transform max-w-full"
            variants={{
              rest: { opacity: 0, y: 20 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          >
            {event.tagline}
          </motion.p>
          
          <motion.div 
            className="flex items-center gap-2 mt-6 text-[10px] font-mono text-white/50 uppercase tracking-widest"
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Users className="w-3 h-3" />
            {event.attendees}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
