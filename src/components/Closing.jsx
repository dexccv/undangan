import React from 'react';

export default function Closing({ data }) {
  return (
    <section id="closing">
    <div className="container">
      <span className="section-subtitle reveal" style={{ fontSize: '2rem', marginBottom: '24px' }}>Wassalamu'alaikum Warahmatullahi Wabarakatuh</span>
      <div className="divider reveal"><i className="fa-solid fa-heart" aria-hidden="true"></i></div>
      <div className="reveal">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: '8px' }}>Merupakan suatu kehormatan bagi kami,</p>
        <p className="closing-couple">{data?.wanita_panggilan} &amp; {data?.pria_panggilan}</p>
      </div>
    </div>
  </section>
  );
}
