import { useState } from 'react';
import { Image as ImageIcon, ZoomIn, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '@/components/ImageLightbox';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  layout?: 'grid' | 'carousel';
}

export const ImageGallery = ({ images, className, layout = 'grid' }: ImageGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  if (layout === 'carousel') {
    return (
      <>
        <div className={cn("relative", className)}>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 w-72 h-48 rounded-xl overflow-hidden cursor-pointer snap-start transition-transform duration-300 hover:scale-105"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm">{image.title}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImageLightbox
          images={images}
          initialIndex={selectedImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </>
    );
  }

  // Grid layout (default)
  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl aspect-[4/3]"
              onClick={() => openLightbox(index)}
            >
              <div className="relative w-full h-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-in zoom-in-50 duration-300">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-white text-xs font-medium">לחץ להגדלה</p>
                  </div>
                  
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-medium text-sm line-clamp-2">{image.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* View All Button if more than 8 images */}
        {images.length > 8 && (
          <div
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-all duration-300 hover:scale-105 flex items-center justify-center"
            onClick={() => openLightbox(8)}
          >
            <div className="text-center">
              <Play className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">צפה בכל התמונות</p>
              <p className="text-xs text-muted-foreground">+{images.length - 8} תמונות נוספות</p>
            </div>
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
