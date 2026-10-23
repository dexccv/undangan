import React from 'react';
import { Heart, InstagramLogo } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function Parents({ data }) {
  const bridePhoto = data?.foto_mempelai_wanita || '/assets/foto3.jpg';
  const groomPhoto = data?.foto_mempelai_pria || '/assets/foto4.jpg';

  return (
    <section id="parents" className="section-padding parents-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <h2 className="section-title">Mempelai yang Berbahagia</h2>
            <p className="section-description">
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. 
              Dengan rasa syukur, kami memperkenalkan kedua insan yang dipersatukan:
            </p>
          </div>
        </ScrollReveal>

        <div className="couple-cards-grid">
          {/* Mempelai Wanita */}
          <ScrollReveal direction="left" delay={0.15}>
            <article className="couple-card bride-card">
              <div className="couple-avatar-wrapper">
                <img 
                  src={bridePhoto} 
                  alt={data?.wanita_lengkap || 'Mempelai Wanita'} 
                  className="couple-avatar-img"
                  loading="lazy" 
                />
                <span className="couple-role-badge">Mempelai Wanita</span>
              </div>
              <div className="couple-info">
                <h3 className="couple-full-name">{data?.wanita_lengkap || 'Nadia Salsabila, S.Kom'}</h3>
                <p className="couple-family-info">
                  Putri tercinta dari pasangan:
                  <strong className="parent-names">{data?.wanita_ortu || 'Bpk. Ahmad Fauzi & Ibu Siti Aminah'}</strong>
                </p>
                {data?.wanita_ig && (
                  <a 
                    href={`https://instagram.com/${data.wanita_ig.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="couple-social-link"
                    aria-label={`Instagram ${data.wanita_lengkap}`}
                  >
                    <InstagramLogo size={18} weight="bold" />
                    <span>@{data.wanita_ig.replace('@', '')}</span>
                  </a>
                )}
              </div>
            </article>
          </ScrollReveal>

          {/* Center Heart Seam */}
          <div className="couple-heart-junction" aria-hidden="true">
            <div className="junction-line"></div>
            <div className="junction-icon-circle">
              <Heart size={24} weight="fill" className="junction-heart" />
            </div>
            <div className="junction-line"></div>
          </div>

          {/* Mempelai Pria */}
          <ScrollReveal direction="right" delay={0.25}>
            <article className="couple-card groom-card">
              <div className="couple-avatar-wrapper">
                <img 
                  src={groomPhoto} 
                  alt={data?.pria_lengkap || 'Mempelai Pria'} 
                  className="couple-avatar-img"
                  loading="lazy" 
                />
                <span className="couple-role-badge">Mempelai Pria</span>
              </div>
              <div className="couple-info">
                <h3 className="couple-full-name">{data?.pria_lengkap || 'Agus Pratama, S.T'}</h3>
                <p className="couple-family-info">
                  Putra tercinta dari pasangan:
                  <strong className="parent-names">{data?.pria_ortu || 'Bpk. Hendra Wijaya & Ibu Ratna Dewi'}</strong>
                </p>
                {data?.pria_ig && (
                  <a 
                    href={`https://instagram.com/${data.pria_ig.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="couple-social-link"
                    aria-label={`Instagram ${data.pria_lengkap}`}
                  >
                    <InstagramLogo size={18} weight="bold" />
                    <span>@{data.pria_ig.replace('@', '')}</span>
                  </a>
                )}
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
