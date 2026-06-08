import React from 'react';

export default function Parents({ data }) {
  return (
    <section id="parents">
    <div className="container">
      <h2 className="section-title reveal">Keluarga Mempelai</h2>
      <span className="section-subtitle reveal">Bismillahirrahmanirrahim</span>

      <div className="parent-grid">
        {/* Mempelai Wanita */}
        <div className="parent-card reveal-left">
          <i className="fa-solid fa-child-reaching parent-icon"></i>
          <h3>{data?.wanita_lengkap}</h3>
          <p>Putri Pertama dari<br /><strong>{data?.wanita_ortu}</strong></p>
        </div>

        {/* Mempelai Pria */}
        <div className="parent-card reveal-right">
          <i className="fa-solid fa-user-tie parent-icon"></i>
          <h3>{data?.pria_lengkap}</h3>
          <p>Putra Pertama dari<br /><strong>{data?.pria_ortu}</strong></p>
        </div>
      </div>

    </div>
  </section>
  );
}
