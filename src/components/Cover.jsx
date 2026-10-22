import React from 'react';
import { CaretDown, Heart, CalendarBlank, MapPin } from '@phosphor-icons/react';
import { motion } from 'motion/react';

export default function Cover({ data }) {
  const coverPhoto = data?.foto_cover || '/assets/foto1.jpg';

  const scrollToNext = () => {
    const target = document.getElementById('quotes');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header id="cover" className="hero-cover">
      <div 
        className="hero-backdrop" 
        style={{ backgroundImage: `url(${coverPhoto})` }}
        role="img"
        aria-label={`Foto pernikahan ${data?.wanita_panggilan || 'Mempelai Wanita'} dan ${data?.pria_panggilan || 'Mempelai Pria'}`}
      >
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-content">
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="hero-badge-line"></span>
          <span className="hero-badge-text">THE WEDDING OF</span>
          <span className="hero-badge-line"></span>
        </motion.div>

        <motion.h1 
          className="hero-names"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <span className="hero-name-wanita">{data?.wanita_panggilan || 'Nadia'}</span>
          <span className="hero-amp">&amp;</span>
          <span className="hero-name-pria">{data?.pria_panggilan || 'Agus'}</span>
        </motion.h1>

        <motion.div 
          className="hero-meta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {data?.tanggal_cover && (
            <div className="hero-meta-item">
              <CalendarBlank size={18} weight="duotone" className="hero-icon" />
              <span>{data.tanggal_cover}</span>
            </div>
          )}
          {data?.resepsi_lokasi && (
            <div className="hero-meta-item">
              <MapPin size={18} weight="duotone" className="hero-icon" />
              <span>{data.resepsi_lokasi}</span>
            </div>
          )}
        </motion.div>

        <motion.button 
          type="button"
          className="hero-scroll-btn" 
          onClick={scrollToNext}
          aria-label="Gulir ke konten undangan"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="scroll-btn-text">Buka Cerita Kami</span>
          <CaretDown size={20} weight="bold" className="scroll-arrow-icon" />
        </motion.button>
      </div>

      {/* Decorative floral or corner accents */}
      <div className="hero-corner hero-corner-tl" aria-hidden="true"></div>
      <div className="hero-corner hero-corner-tr" aria-hidden="true"></div>
    </header>
  );
}
