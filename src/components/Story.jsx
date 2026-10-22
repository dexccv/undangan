import React from 'react';
import { Heart, Sparkle, ChatCircleDots, Handshake, Church } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function Story({ data }) {
  const brideName = data?.wanita_panggilan || 'Nadia';
  const groomName = data?.pria_panggilan || 'Agus';

  const defaultStories = [
    {
      year: '2020',
      title: 'Awal Pertemuan',
      desc: `Di sebuah kesempatan yang tak disengaja, takdir mempertemukan ${groomName} dan ${brideName}. Berawal dari percakapan santai yang ternyata menumbuhkan rasa nyaman dan kecocokan di antara kami berdua.`,
      foto: data?.foto_story_1 || '/assets/foto1.jpg',
      icon: 'chat'
    },
    {
      year: '2024',
      title: 'Menjalin Komitmen',
      desc: 'Melalui perjalanan waktu, suka dan duka kami lalui bersama. Dengan saling mendukung impian masing-masing, kami meyakini bahwa kami ingin melangkah bersama menatap masa depan.',
      foto: data?.foto_story_2 || '/assets/foto2.jpg',
      icon: 'handshake'
    },
    {
      year: '2025',
      title: 'Hari Pertunangan',
      desc: `Dengan restu dari kedua keluarga besar, ${groomName} secara resmi mengutarakan niat suci meminang ${brideName}. Sebuah momen sakral yang meneguhkan niat ibadah kami berdua.`,
      foto: data?.foto_story_3 || '/assets/foto3.jpg',
      icon: 'heart'
    },
    {
      year: '2026',
      title: 'Menuju Ikrar Suci',
      desc: 'InsyaAllah, hari yang kami nantikan tiba saat ikrar suci pernikahan diucapkan di hadapan Allah SWT. Awal dari babak baru perjalanan hidup kami sebagai pasangan suami istri.',
      foto: data?.foto_story_4 || '/assets/foto4.jpg',
      icon: 'sparkle'
    }
  ];

  const stories = (data?.love_story && Array.isArray(data.love_story) && data.love_story.length > 0)
    ? data.love_story
    : defaultStories;

  const renderIcon = (iconName, idx) => {
    switch (iconName) {
      case 'chat': return <ChatCircleDots size={20} weight="fill" />;
      case 'handshake': return <Handshake size={20} weight="fill" />;
      case 'heart': return <Heart size={20} weight="fill" />;
      case 'sparkle': return <Sparkle size={20} weight="fill" />;
      default: return idx % 2 === 0 ? <Heart size={20} weight="fill" /> : <Sparkle size={20} weight="fill" />;
    }
  };

  return (
    <section id="story" className="section-padding story-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <span className="section-pill">
              <Heart size={14} weight="fill" />
              <span>OUR JOURNEY</span>
            </span>
            <h2 className="section-title">Kisah Cinta Kami</h2>
            <p className="section-description">
              Setiap kisah memiliki babak yang berharga. Inilah bagaimana takdir merajut langkah kami berdua:
            </p>
          </div>
        </ScrollReveal>

        <div className="story-timeline" role="list">
          {stories.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const photoSrc = item.foto || defaultStories[idx % defaultStories.length]?.foto || '/assets/foto1.jpg';

            return (
              <div 
                key={idx} 
                className={`timeline-milestone ${isEven ? 'milestone-left' : 'milestone-right'}`}
                role="listitem"
              >
                <ScrollReveal 
                  direction={isEven ? 'left' : 'right'} 
                  delay={0.1 * (idx + 1)}
                  className="milestone-card"
                >
                  {/* Photo at the top of the milestone */}
                  <div className="milestone-photo-wrap">
                    <img 
                      src={photoSrc} 
                      alt={item.title || 'Momen Kisah'} 
                      className="milestone-img"
                      loading="lazy" 
                    />
                    <span className="milestone-year-badge">{item.year || '2026'}</span>
                  </div>

                  <div className="milestone-body">
                    <h3 className="milestone-title">{item.title}</h3>
                    <p className="milestone-desc">{item.desc}</p>
                  </div>
                </ScrollReveal>

                {/* Center Spine Node */}
                <div className="milestone-node" aria-hidden="true">
                  <div className="milestone-node-circle">
                    {renderIcon(item.icon, idx)}
                  </div>
                </div>

                {/* Spacer for 2-column alignment */}
                <div className="milestone-spacer" aria-hidden="true"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
