import React from 'react';
import { Quotes as QuotesIcon } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function Quotes({ data }) {
  const quoteText = data?.quote_text || 
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const quoteSource = data?.quote_source || "(QS. Ar-Rum: 21)";
  const accentPhoto = data?.foto_prewedding_1 || data?.foto_cover || '/assets/foto2.jpg';

  return (
    <section id="quotes" className="section-padding quotes-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="quotes-card">
            {/* Visual accent photo inset */}
            <div className="quotes-visual-frame">
              <img 
                src={accentPhoto} 
                alt="Momen Bahagia Mempelai" 
                className="quotes-photo" 
                loading="lazy"
              />
              <div className="quotes-photo-overlay"></div>
            </div>

            <div className="quotes-content">
              <div className="quotes-icon-wrapper">
                <QuotesIcon size={36} weight="fill" className="quotes-icon" />
              </div>

              <blockquote className="quotes-arabic-translation">
                "{quoteText}"
              </blockquote>

              <cite className="quotes-cite">— {quoteSource}</cite>

              {data?.quote_sekunder && (
                <div className="quotes-secondary">
                  <p className="quotes-secondary-text">"{data.quote_sekunder}"</p>
                  {data?.quote_sekunder_source && (
                    <cite className="quotes-secondary-cite">— {data.quote_sekunder_source}</cite>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
