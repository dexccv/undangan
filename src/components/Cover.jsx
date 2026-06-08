import React from 'react';
import confetti from 'canvas-confetti';

export default function Cover({ data }) {
  const handleOpen = () => {
    // trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#CBD5C0', '#F7F9F5']
    });

    // scroll to quotes
    const target = document.getElementById('quotes');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Attempt to play audio
    const audio = document.getElementById('bgm');
    if (audio) {
      audio.play().catch(e => console.log('Audio autoplay prevented'));
      const btnPlay = document.getElementById('btn-play');
      if (btnPlay) {
        btnPlay.classList.add('playing');
        btnPlay.innerHTML = '<i class="fa-solid fa-compact-disc fa-spin"></i>';
      }
    }
  };

  return (
    <section id="cover">
      <span className="cover-ornament top-left" aria-hidden="true"><i className="fa-solid fa-leaf"></i></span>
      <span className="cover-ornament top-right" aria-hidden="true"><i className="fa-solid fa-leaf"></i></span>
      <span className="cover-ornament bot-left" aria-hidden="true"><i className="fa-solid fa-heart"></i></span>
      <span className="cover-ornament bot-right" aria-hidden="true"><i className="fa-solid fa-heart"></i></span>

      <div className="cover-content">
        <span className="cover-wedding-of reveal">The Wedding Of</span>
        <h1 className="cover-names reveal">
          <span>{data?.wanita_panggilan}</span> &amp; <span>{data?.pria_panggilan}</span>
        </h1>
        <p className="cover-date reveal"><span>{data?.tanggal_cover}</span></p>
        
        <button className="btn-open reveal" id="btn-open-invitation" onClick={handleOpen}>
          <i className="fa-solid fa-envelope-open-text" aria-hidden="true"></i> Buka Undangan
        </button>
      </div>

      <div className="cover-greeting-box">
        <p>Kepada, Yth :</p>
        <span id="guest-name">Tamu Undangan</span>
      </div>
    </section>
  );
}
