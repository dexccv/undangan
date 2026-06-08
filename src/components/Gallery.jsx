import React from 'react';

export default function Gallery({ data }) {
  return (
    <section id="gallery" className="section">
    <div className="container">
      <h2 className="section-title reveal">Galeri Momen</h2>
      <span className="section-subtitle reveal">Captured Memories</span>
      <div className="divider reveal"><i className="fa-solid fa-camera-retro" aria-hidden="true"></i></div>

      <div className="gallery-grid">
        <div className="gallery-item reveal" data-src="assets/foto1.jpg" data-alt="Cincin pernikahan" role="button" tabindex="0"><img src="assets/foto1.jpg" alt="Cincin pernikahan" loading="lazy" /></div>
        <div className="gallery-item reveal" data-src="assets/foto2.jpg" data-alt="Momen bersama" role="button" tabindex="0"><img src="assets/foto2.jpg" alt="Momen bersama" loading="lazy" /></div>
        <div className="gallery-item reveal" data-src="assets/foto3.jpg" data-alt="Buket bunga pengantin" role="button" tabindex="0"><img src="assets/foto3.jpg" alt="Buket bunga pengantin" loading="lazy" /></div>
        <div className="gallery-item reveal" data-src="assets/foto4.jpg" data-alt="Dekorasi venue" role="button" tabindex="0"><img src="assets/foto4.jpg" alt="Dekorasi venue pernikahan" loading="lazy" /></div>
      </div>
    </div>

    {/* Lightbox */}
    <div id="lightbox" role="dialog" aria-modal="true" aria-label="Lightbox foto">
      <button id="lightbox-close" aria-label="Tutup lightbox"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <img id="lightbox-img" src="" alt="" />
    </div>
  </section>
  );
}
