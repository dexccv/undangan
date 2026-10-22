import React, { useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { EnvelopeOpen, Heart, Sparkle } from '@phosphor-icons/react';
import { useMusic } from '../context/MusicContext';

export default function CurtainReveal({ data, guestName, onOpen }) {
  const { play } = useMusic();
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const centerContentRef = useRef(null);
  const buttonRef = useRef(null);

  const handleOpenInvitation = () => {
    // Disable button to prevent double trigger
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    // Play music via context
    try {
      play();
    } catch (e) {
      console.warn('Audio play error:', e);
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B8860B', '#F4EAD4', '#6B7B5E', '#FFFFFF']
    });

    const isMobile = window.innerWidth <= 640;
    const tl = gsap.timeline({
      onComplete: () => {
        if (onOpen) onOpen();
      }
    });

    // Animate center content out
    tl.to(centerContentRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.45,
      ease: 'power2.in'
    });

    // Slide curtains open
    if (isMobile) {
      // Split top & bottom for dramatic mobile curtain reveal
      tl.to(leftPanelRef.current, {
        yPercent: -100,
        duration: 1.25,
        ease: 'power4.inOut'
      }, '-=0.2')
      .to(rightPanelRef.current, {
        yPercent: 100,
        duration: 1.25,
        ease: 'power4.inOut'
      }, '<');
    } else {
      // Split left & right for theatrical desktop curtain
      tl.to(leftPanelRef.current, {
        xPercent: -100,
        duration: 1.35,
        ease: 'power4.inOut'
      }, '-=0.2')
      .to(rightPanelRef.current, {
        xPercent: 100,
        duration: 1.35,
        ease: 'power4.inOut'
      }, '<');
    }

    // Fade out outer overlay
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power1.out'
    }, '-=0.35');
  };

  const coverPhoto = data?.foto_cover || '/assets/foto1.jpg';

  return (
    <div className="curtain-overlay" ref={containerRef} aria-modal="true" role="dialog">
      {/* Left / Top Curtain Panel */}
      <div className="curtain-panel curtain-panel-left" ref={leftPanelRef}>
        <div className="curtain-bg-layer" style={{ backgroundImage: `url(${coverPhoto})` }}></div>
        <div className="curtain-shimmer"></div>
        <div className="curtain-edge-border"></div>
      </div>

      {/* Right / Bottom Curtain Panel */}
      <div className="curtain-panel curtain-panel-right" ref={rightPanelRef}>
        <div className="curtain-bg-layer" style={{ backgroundImage: `url(${coverPhoto})` }}></div>
        <div className="curtain-shimmer"></div>
        <div className="curtain-edge-border"></div>
      </div>

      {/* Center Royal Card Content */}
      <div className="curtain-center-content" ref={centerContentRef}>
        <div className="curtain-badge">
          <Sparkle size={18} weight="fill" className="curtain-sparkle" />
          <span>WALIMATUL 'URS</span>
          <Sparkle size={18} weight="fill" className="curtain-sparkle" />
        </div>

        <p className="curtain-greeting-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
        <div className="curtain-guest-badge">
          <h2 className="curtain-guest-name">{guestName || 'Tamu Undangan'}</h2>
        </div>
        <p className="curtain-presence-note">Kami Mengundang Anda ke Pernikahan Kami</p>

        <div className="curtain-divider">
          <span className="curtain-divider-line"></span>
          <Heart size={16} weight="fill" className="curtain-divider-icon" />
          <span className="curtain-divider-line"></span>
        </div>

        <h1 className="curtain-couple-names">
          <span className="curtain-name">{data?.wanita_panggilan || 'Wanita'}</span>
          <span className="curtain-amp">&amp;</span>
          <span className="curtain-name">{data?.pria_panggilan || 'Pria'}</span>
        </h1>

        <p className="curtain-date">
          {data?.tanggal_cover || data?.tanggal_akad ? (
            <span>{data?.tanggal_cover || data?.tanggal_akad}</span>
          ) : (
            <span>Menuju Hari Bahagia</span>
          )}
        </p>

        <button
          ref={buttonRef}
          type="button"
          className="curtain-btn-open"
          onClick={handleOpenInvitation}
          aria-label="Buka undangan pernikahan"
        >
          <EnvelopeOpen size={20} weight="fill" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </div>
  );
}
