import React, { useState, useEffect } from 'react';

export default function CountdownAndEvents({ data }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    // Target Date
    const targetDate = new Date('2026-06-07T10:00:00+07:00');

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        setIsOver(true);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <section id="countdown" className="section">
      <div className="container">

        <div className="doa-box reveal">
          <p>"Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami: <span>{data?.wanita_panggilan}</span> &amp; <span>{data?.pria_panggilan}</span>"</p>
        </div>

        <h2 className="section-title reveal">Menghitung Hari</h2>
        <span className="section-subtitle reveal" id="countdown-label">
          {isOver ? '🎉 Hari Bahagia Telah Tiba!' : 'Menuju Hari Bahagia'}
        </span>

        <div className="countdown-wrapper reveal" role="timer" aria-label="Hitung mundur menuju pernikahan">
          <div className="countdown-box">
            <span className="countdown-num" id="cd-days">{pad(timeLeft.days)}</span>
            <span className="countdown-label">Hari</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num" id="cd-hours">{pad(timeLeft.hours)}</span>
            <span className="countdown-label">Jam</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num" id="cd-minutes">{pad(timeLeft.minutes)}</span>
            <span className="countdown-label">Menit</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num" id="cd-seconds">{pad(timeLeft.seconds)}</span>
            <span className="countdown-label">Detik</span>
          </div>
        </div>

        <div className="divider reveal"><i className="fa-solid fa-ring" aria-hidden="true"></i></div>

        <div className="event-cards">
          {/* Akad Nikah */}
          <div className="event-card reveal-left">
            <div className="event-icon" aria-hidden="true"><i className="fa-solid fa-mosque"></i></div>
            <h3>Akad Nikah</h3>
            <p><strong><span>{data?.tanggal_lengkap}</span></strong></p>
            <p className="event-time"><i className="fa-regular fa-clock" aria-hidden="true"></i> <span>{data?.waktu_akad}</span></p>
            <p className="event-address">
              <strong><span>{data?.lokasi_akad}</span></strong><br />
              <span>{data?.alamat_baris1}</span><br />
              <span>{data?.alamat_baris2}</span>
            </p>
            <a className="btn-maps dyn-link-maps" href={data?.link_maps || '#'} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i> Google Maps
            </a>
          </div>

          {/* Resepsi */}
          <div className="event-card reveal-right">
            <div className="event-icon" aria-hidden="true"><i className="fa-solid fa-champagne-glasses"></i></div>
            <h3>Resepsi Pernikahan</h3>
            <p><strong><span>{data?.tanggal_lengkap}</span></strong></p>
            <p className="event-time"><i className="fa-regular fa-clock" aria-hidden="true"></i> <span>{data?.waktu_resepsi}</span></p>
            <p className="event-address">
              <strong><span>{data?.lokasi_resepsi}</span></strong><br />
              <span>{data?.alamat_baris1}</span><br />
              <span>{data?.alamat_baris2}</span>
            </p>
            <a className="btn-maps dyn-link-maps" href={data?.link_maps || '#'} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i> Google Maps
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
