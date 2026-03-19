import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch gallery');
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#a8fbd3]/20 border-t-[#a8fbd3] rounded-full animate-spin" />
          <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Accessing Archive...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="space-y-6">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-white/50 hover:text-[#a8fbd3] transition-colors mb-8"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div>
              <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Archive 001</p>
              <h1 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter uppercase leading-[0.85]">
                The Full <span className="italic font-light text-white/50">Proof</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-white/40 text-sm max-w-sm font-light leading-relaxed md:text-right">
              A complete visual record of the MSM experience. Every moment, every vibe, strictly for the archive.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
              <span>{images.length} Assets</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>Dallas 2026</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="max-w-4xl mx-auto border border-red-500/20 bg-red-500/5 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
            <AlertCircle className="text-red-500" size={40} />
            <h3 className="text-xl font-heading font-bold text-white">Gallery Connection Issue</h3>
            <p className="text-white/60 text-sm max-w-md">
              {error.includes('BLOB_READ_WRITE_TOKEN') 
                ? "Your Vercel Blob token is missing. Please add BLOB_READ_WRITE_TOKEN to the Secrets menu (⚙️ gear icon) to enable the gallery."
                : error}
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="max-w-4xl mx-auto border border-white/10 bg-white/5 p-12 rounded-2xl flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Camera className="text-white/40" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">No Proof Found</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto">
                Your Vercel Blob store is connected, but no images were found. Upload your festival photos to start showcasing the vibe.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
            {images.map((image, index) => {
              const isLarge = index % 7 === 0;
              const isTall = index % 7 === 2;
              const isWide = index % 7 === 5;

              return (
                <motion.div
                  key={image.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedImage(image)}
                  className={`group relative overflow-hidden cursor-pointer rounded-sm bg-white/5 ${
                    isLarge ? 'col-span-2 row-span-2' : 
                    isTall ? 'row-span-2' : 
                    isWide ? 'col-span-2' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.pathname}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.pathname}
                className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="mt-8 text-center">
                <p className="text-white font-heading text-xl uppercase tracking-widest mb-2">
                  {selectedImage.pathname.split('/').pop()?.split('.')[0] || 'Festival Moment'}
                </p>
                <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.3em]">
                  Captured: {new Date(selectedImage.uploadedAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
