import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Camera, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch gallery');
        }
        const data = await response.json();
        // Only show first 6 images for preview
        setImages(data.slice(0, 6));
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  if (loading || error || images.length === 0) {
    // Silent fail or simple loading for preview to not break landing page flow
    return null;
  }

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Social Proof</p>
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter uppercase">
              The <span className="italic font-light text-white/50">Vibe</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed md:text-right">
              A glimpse into the moments that define MSM. Raw, unfiltered, and strictly for the culture.
            </p>
            <Link 
              to="/gallery" 
              className="group flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-[#a8fbd3] hover:text-white transition-colors"
            >
              View Full Archive
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Simplified Bento Grid for Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          {images.map((image, index) => {
            const isWide = index === 0 || index === 5;
            const isTall = index === 2;

            return (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-sm bg-white/5 ${
                  isWide ? 'md:col-span-2' : 
                  isTall ? 'md:row-span-2' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={image.pathname}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-12 flex justify-center md:hidden">
          <Link 
            to="/gallery" 
            className="w-full py-4 border border-white/10 text-center text-[10px] font-bold tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all"
          >
            Enter Archive
          </Link>
        </div>
      </div>
    </section>
  );
}
