import React, { useState } from 'react';
import { X, ArrowsOutSimple } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function Gallery({ data }) {
  const [activePhoto, setActivePhoto] = useState(null);

  const defaultPhotos = [
    { src: '/assets/foto1.jpg', alt: 'Cincin Pernikahan', caption: 'Simbol Ikatan Abadi' },
    { src: '/assets/foto2.jpg', alt: 'Momen Bahagia Bersama', caption: 'Tawa dan Langkah Bersama' },
    { src: '/assets/foto3.jpg', alt: 'Buket Bunga Pengantin', caption: 'Keindahan Hari Spesial' },
    { src: '/assets/foto4.jpg', alt: 'Dekorasi Venue Pernikahan', caption: 'Suasana Syahdu Penuh Doa' }
  ];

  const galleryList = (data?.foto_galeri && Array.isArray(data.foto_galeri) && data.foto_galeri.length > 0)
    ? data.foto_galeri.map((item, idx) => {
        if (typeof item === 'string') {
          return { src: item, alt: `Galeri ${idx + 1}`, caption: `Momen Indah #${idx + 1}` };
        }
        return {
          src: item.url || item.src,
          alt: item.alt || `Galeri ${idx + 1}`,
          caption: item.caption || `Momen Indah #${idx + 1}`
        };
      })
    : defaultPhotos;

  return (
    <section id="gallery" className="section-padding gallery-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <h2 className="section-title">Potret Kebahagiaan</h2>
            <p className="section-description">
              Momen-momen berharga yang kami abadikan dalam lembaran kenangan indah:
            </p>
          </div>
        </ScrollReveal>

        {/* Gallery Bento Grid */}
        <div className="gallery-bento-grid">
          {galleryList.map((photo, idx) => {
            // Give specific items visual variance
            const isFeatured = idx === 0 || idx === 3;
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={0.08 * (idx + 1)}
                className={`gallery-bento-item ${isFeatured ? 'bento-featured' : ''}`}
              >
                <div 
                  className="gallery-card"
                  onClick={() => setActivePhoto(photo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActivePhoto(photo); }}
                  aria-label={`Lihat foto ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="gallery-img"
                    loading="lazy"
                  />
                  <div className="gallery-card-overlay">
                    <div className="gallery-card-meta">
                      <span className="gallery-caption">{photo.caption}</span>
                      <div className="gallery-zoom-badge">
                        <ArrowsOutSimple size={18} weight="bold" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* React Lightbox Modal */}
      {activePhoto && (
        <div 
          className="gallery-lightbox-overlay"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto"
        >
          <div className="gallery-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-lightbox-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Tutup foto"
            >
              <X size={24} weight="bold" />
            </button>
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="gallery-lightbox-image"
            />
            {activePhoto.caption && (
              <p className="gallery-lightbox-caption">{activePhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
