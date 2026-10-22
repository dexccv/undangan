import React from 'react';
import { Heart, ArrowUp, Sparkle } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function Closing({ data }) {
  const closingPhoto = data?.foto_closing || data?.foto_cover || '/assets/foto1.jpg';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="closing" className="closing-section">
      <div 
        className="closing-backdrop"
        style={{ backgroundImage: `url(${closingPhoto})` }}
        role="img"
        aria-label="Foto penutup kedua mempelai"
      >
        <div className="closing-overlay"></div>
      </div>

      <div className="section-container closing-content">
        <ScrollReveal direction="up">
          <div className="closing-card">
            <span className="closing-pill">
              <Sparkle size={14} weight="fill" />
              <span>TERIMA KASIH</span>
            </span>

            <h3 className="closing-salam">Wassalamu'alaikum Warahmatullahi Wabarakatuh</h3>

            <p className="closing-text">
              Ungkapan terima kasih yang tulus dari lubuk hati kami yang terdalam atas kehadiran, doa, serta restu Bapak/Ibu/Saudara/i sekalian. Semoga Allah SWT senantiasa melimpahkan berkah dan rahmat-Nya kepada kita semua.
            </p>

            <div className="closing-divider" aria-hidden="true">
              <span className="divider-line"></span>
              <Heart size={20} weight="fill" className="divider-heart" />
              <span className="divider-line"></span>
            </div>

            <p className="closing-sub">Kami yang berbahagia,</p>
            <h2 className="closing-couple-names">
              {data?.wanita_panggilan || 'Nadia'} &amp; {data?.pria_panggilan || 'Agus'}
            </h2>
            <p className="closing-families">Beserta Keluarga Besar Kedua Mempelai</p>

            <button
              type="button"
              className="btn-scroll-top"
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
            >
              <ArrowUp size={18} weight="bold" />
              <span>Kembali ke Atas</span>
            </button>
          </div>
        </ScrollReveal>

        <div className="closing-branding">
          <p>© {new Date().getFullYear()} Digital Wedding Invitation. Crafted with dedication.</p>
        </div>
      </div>
    </footer>
  );
}
