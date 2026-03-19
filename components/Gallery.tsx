import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera, AlertCircle } from 'lucide-react';

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
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    if (showArchive || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showArchive, selectedImage]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery');
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            throw new Error(data.error || `Server error: ${response.status}`);
          } else {
            const text = await response.text();
            console.error('Non-JSON error response:', text);
            throw new Error(`API returned non-JSON response (${response.status}). The server might not be running correctly.`);
          }
        }

        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Expected JSON, got:', text);
          throw new Error('API returned non-JSON response. Please check if the server is running server.ts.');
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

  const previewImages = images.slice(0, 6);

  if (loading) {
    return (
      <section id="gallery" className="py-24 bg-[#0a0a0a] flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#a8fbd3]/20 border-t-[#a8fbd3] rounded-full animate-spin" />
          <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Loading Proof...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-24 bg-[#0a0a0a] px-6">
        <div className="max-w-4xl mx-auto border border-red-500/20 bg-red-500/5 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
          <AlertCircle className="text-red-500" size={40} />
          <h3 className="text-xl font-heading font-bold text-white">Gallery Connection Issue</h3>
          <p className="text-white/60 text-sm max-w-md">
            {error.includes('BLOB_READ_WRITE_TOKEN') 
              ? "Your Vercel Blob token is missing. Please add BLOB_READ_WRITE_TOKEN to the Secrets menu (⚙️ gear icon) to enable the gallery."
              : error}
          </p>
          <div className="mt-4 p-4 bg-black/40 rounded-lg text-left w-full">
            <p className="text-[10px] font-mono text-[#a8fbd3] uppercase tracking-widest mb-2">Setup Instructions:</p>
            <ol className="text-xs text-white/40 space-y-2 list-decimal list-inside">
              <li>Open <b>Settings</b> (⚙️ gear icon)</li>
              <li>Go to <b>Secrets</b></li>
              <li>Add <code>BLOB_READ_WRITE_TOKEN</code> with your Vercel Blob token</li>
              <li>Upload images to your Vercel Blob store</li>
            </ol>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section id="gallery" className="py-24 bg-[#0a0a0a] px-6">
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
          <a 
            href="https://vercel.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white text-black text-[10px] font-bold tracking-widest uppercase hover:bg-[#a8fbd3] transition-colors"
          >
            Go to Vercel Dashboard
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.4em] mb-4">Social Proof</p>
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter uppercase">
              The <span className="italic font-light text-white/50">Vibe</span> Check
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed">
              A curated look into the moments that define MSM. Raw, unfiltered, and strictly for the culture.
            </p>
            {images.length > 6 && (
              <button 
                onClick={() => setShowArchive(true)}
                className="w-fit text-[10px] font-bold tracking-[0.3em] uppercase text-[#a8fbd3] border-b border-[#a8fbd3] pb-1 hover:text-white hover:border-white transition-all"
              >
                Enter Full Archive
              </button>
            )}
          </div>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {previewImages.map((image, index) => {
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

        {images.length > 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 flex flex-col items-center text-center"
          >
            <div className="w-px h-20 bg-gradient-to-b from-[#a8fbd3] to-transparent mb-8" />
            <button 
              onClick={() => setShowArchive(true)}
              className="group relative px-12 py-5 border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#a8fbd3] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-[10px] font-bold tracking-[0.5em] uppercase group-hover:text-black transition-colors duration-500">
                Explore Full Archive
              </span>
            </button>
            <p className="mt-6 text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">
              {images.length - 6} more moments waiting
            </p>
          </motion.div>
        )}
      </div>

      {/* Full Archive Takeover Modal */}
      <AnimatePresence>
        {showArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black overflow-y-auto"
          >
            <div className="min-h-screen p-6 md:p-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <p className="text-[#a8fbd3] font-mono text-[10px] uppercase tracking-[0.4em] mb-4">The Complete Collection</p>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter uppercase">The Archive</h2>
                  </div>
                  <button 
                    onClick={() => setShowArchive(false)}
                    className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase hidden md:block">Close Archive</span>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                      <X size={20} />
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                  {images.map((image, index) => {
                    const isLarge = index % 7 === 0;
                    const isTall = index % 7 === 2;
                    const isWide = index % 7 === 5;

                    return (
                      <motion.div
                        key={`archive-${image.url}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
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

                <div className="mt-24 pb-12 flex flex-col items-center text-center">
                  <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] mb-8">End of Archive</p>
                  <button 
                    onClick={() => setShowArchive(false)}
                    className="px-8 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white transition-all text-[10px] font-bold tracking-widest uppercase"
                  >
                    Back to Main Site
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
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
