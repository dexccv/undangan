import React from 'react';

export default function Story({ data }) {
  return (
    <section id="story" className="section">
    <div className="container">

      <h2 className="section-title reveal">Kisah Kami</h2>
      <span className="section-subtitle reveal">Our Love Story</span>
      <div className="divider reveal"><i className="fa-solid fa-heart" aria-hidden="true"></i></div>

      <div className="timeline" role="list">

        {/* Fase 1 — Awal Pertemuan */}
        <div className="timeline-item reveal" role="listitem">
          <div className="timeline-content">
            <span className="timeline-year">2020</span>
            <h3>Awal Pertemuan</h3>
            <p>Di sebuah acara yang tak terduga, kami berdua bertemu untuk pertama kalinya. Sebuah senyuman sederhana dan sapaan hangat menjadi awal dari perkenalan kami yang tak terlupakan.</p>
          </div>
          <div className="timeline-icon" aria-hidden="true"><i className="fa-solid fa-comments"></i></div>
          <div className="timeline-spacer"></div>
        </div>

        {/* Fase 2 — Lamaran */}
        <div className="timeline-item reveal" role="listitem">
          <div className="timeline-spacer"></div>
          <div className="timeline-icon" aria-hidden="true"><i className="fa-solid fa-ring"></i></div>
          <div className="timeline-content" style={{ background: 'var(--cream-dark)' }}>
            <span className="timeline-year">2025</span>
            <h3>Lamaran</h3>
            <p>Dengan restu kedua orang tua dan niat yang tulus, keluarga Agus datang untuk meminang Nadia. Hari itu menjadi momen sakral yang mengikat komitmen kami berdua untuk melangkah ke jenjang yang lebih serius.</p>
          </div>
        </div>

        {/* Fase 3 — Menikah */}
        <div className="timeline-item reveal" role="listitem">
          <div className="timeline-content">
            <span className="timeline-year">2026</span>
            <h3>Menikah</h3>
            <p>Hari yang paling dinantikan telah tiba, di mana kami akan mengucap janji suci di hadapan Allah SWT. Semoga ikatan ini membawa keberkahan dan kebahagiaan hingga ke jannah-Nya kelak.</p>
          </div>
          <div className="timeline-icon" aria-hidden="true"><i className="fa-solid fa-heart"></i></div>
          <div className="timeline-spacer"></div>
        </div>

      </div>
    </div>
  </section>
  );
}
