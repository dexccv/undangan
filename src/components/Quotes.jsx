import React from 'react';

export default function Quotes({ data }) {
  return (
    <section id="quotes">
    <div className="container">
      
      {/* Kutipan Pertama */}
      <div className="quote-box reveal">
        <p className="quote-text">"What counts in making a happy marriage is not so much how compatible you are, but how you deal with incompatibility."</p>
        <p className="quote-source">— Leo Tolstoy</p>
      </div>

      <div className="divider reveal" style={{ margin: '40px auto' }}><i className="fa-solid fa-seedling" aria-hidden="true"></i></div>

      {/* Kutipan Kedua */}
      <div className="quote-box reveal">
        <p className="quote-text" style={{ fontSize: '1.2rem' }}>"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."</p>
        <p className="quote-source">(QS. Ar-Rum: 21)</p>
      </div>

    </div>
  </section>
  );
}
