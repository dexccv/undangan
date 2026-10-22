import React, { useState, useEffect } from 'react';
import { Clock, MapPin, NavigationArrow, Sparkle, CalendarPlus } from '@phosphor-icons/react';
import ScrollReveal from './ui/ScrollReveal';

export default function CountdownAndEvents({ data }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    // Dynamic target date from Firestore data
    let targetDateStr = data?.tanggal_akad_iso || data?.tanggal_akad;
    let targetDate = targetDateStr ? new Date(targetDateStr) : null;

    if (!targetDate || isNaN(targetDate.getTime())) {
      // Fallback target: 30 days from now if not specified or invalid
      targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsOver(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [data?.tanggal_akad_iso, data?.tanggal_akad]);

  const pad = (n) => String(n).padStart(2, '0');

  // Venue photos with fallbacks
  const venueAkadPhoto = data?.foto_venue_akad || '/assets/foto1.jpg';
  const venueResepsiPhoto = data?.foto_venue_resepsi || '/assets/foto2.jpg';

  const generateGoogleCalendarUrl = (title, location, details, dateStr) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date();
      const startTime = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endTime = new Date(d.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } catch {
      return '#';
    }
  };

  return (
    <section id="countdown" className="section-padding events-section">
      <div className="section-container">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <span className="section-pill">
              <Sparkle size={14} weight="fill" />
              <span>SAVE THE DATE</span>
            </span>
            <h2 className="section-title">Hari Bahagia Kami</h2>
            <p className="section-description">
              {isOver ? 'Alhamdulillah, hari pernikahan telah terlaksana.' : 'Menghitung waktu menuju momen ikrar suci:'}
            </p>
          </div>
        </ScrollReveal>

        {/* Countdown Timer */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="countdown-grid" role="timer" aria-label="Hitung mundur pernikahan">
            <div className="countdown-card">
              <span className="countdown-number">{pad(timeLeft.days)}</span>
              <span className="countdown-unit">Hari</span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{pad(timeLeft.hours)}</span>
              <span className="countdown-unit">Jam</span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{pad(timeLeft.minutes)}</span>
              <span className="countdown-unit">Menit</span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{pad(timeLeft.seconds)}</span>
              <span className="countdown-unit">Detik</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Events Cards */}
        <div className="events-grid">
          {/* Card Akad Nikah */}
          <ScrollReveal direction="left" delay={0.2}>
            <article className="event-card">
              <div className="event-card-media">
                <img 
                  src={venueAkadPhoto} 
                  alt="Lokasi Akad Nikah" 
                  className="event-card-img"
                  loading="lazy" 
                />
                <span className="event-type-badge">Akad Nikah</span>
              </div>

              <div className="event-card-body">
                <h3 className="event-card-title">Akad Nikah</h3>
                <div className="event-detail-item">
                  <CalendarPlus size={20} weight="duotone" className="event-detail-icon" />
                  <span>{data?.tanggal_lengkap_akad || data?.tanggal_lengkap || 'Minggu, 07 Juni 2026'}</span>
                </div>
                <div className="event-detail-item">
                  <Clock size={20} weight="duotone" className="event-detail-icon" />
                  <span>{data?.waktu_akad || '08.00 - 10.00 WIB'}</span>
                </div>
                <div className="event-detail-item location-item">
                  <MapPin size={20} weight="duotone" className="event-detail-icon" />
                  <div>
                    <strong>{data?.lokasi_akad || 'Masjid Agung Al-Barkah'}</strong>
                    <p className="event-sub-address">{data?.alamat_baris1 || 'Jl. Veteran No. 1'}</p>
                    {data?.alamat_baris2 && <p className="event-sub-address">{data.alamat_baris2}</p>}
                  </div>
                </div>

                <div className="event-card-actions">
                  <a 
                    className="btn-event-action btn-maps-action" 
                    href={data?.link_maps || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <NavigationArrow size={18} weight="bold" />
                    <span>Petunjuk Arah</span>
                  </a>
                  <a 
                    className="btn-event-action btn-calendar-action" 
                    href={generateGoogleCalendarUrl(
                      `Akad Nikah ${data?.wanita_panggilan || ''} & ${data?.pria_panggilan || ''}`,
                      data?.lokasi_akad || '',
                      'Akad Nikah Pernikahan',
                      data?.tanggal_akad_iso || data?.tanggal_akad
                    )}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <CalendarPlus size={18} weight="bold" />
                    <span>Kalender</span>
                  </a>
                </div>
              </div>
            </article>
          </ScrollReveal>

          {/* Card Resepsi */}
          <ScrollReveal direction="right" delay={0.3}>
            <article className="event-card">
              <div className="event-card-media">
                <img 
                  src={venueResepsiPhoto} 
                  alt="Lokasi Resepsi Pernikahan" 
                  className="event-card-img"
                  loading="lazy" 
                />
                <span className="event-type-badge">Resepsi</span>
              </div>

              <div className="event-card-body">
                <h3 className="event-card-title">Resepsi Pernikahan</h3>
                <div className="event-detail-item">
                  <CalendarPlus size={20} weight="duotone" className="event-detail-icon" />
                  <span>{data?.tanggal_lengkap_resepsi || data?.tanggal_lengkap || 'Minggu, 07 Juni 2026'}</span>
                </div>
                <div className="event-detail-item">
                  <Clock size={20} weight="duotone" className="event-detail-icon" />
                  <span>{data?.waktu_resepsi || '11.00 - 14.00 WIB'}</span>
                </div>
                <div className="event-detail-item location-item">
                  <MapPin size={20} weight="duotone" className="event-detail-icon" />
                  <div>
                    <strong>{data?.lokasi_resepsi || 'Grand Ballroom Grand City'}</strong>
                    <p className="event-sub-address">{data?.alamat_baris1 || 'Jl. Pemuda No. 45'}</p>
                    {data?.alamat_baris2 && <p className="event-sub-address">{data.alamat_baris2}</p>}
                  </div>
                </div>

                <div className="event-card-actions">
                  <a 
                    className="btn-event-action btn-maps-action" 
                    href={data?.link_maps || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <NavigationArrow size={18} weight="bold" />
                    <span>Petunjuk Arah</span>
                  </a>
                  <a 
                    className="btn-event-action btn-calendar-action" 
                    href={generateGoogleCalendarUrl(
                      `Resepsi Pernikahan ${data?.wanita_panggilan || ''} & ${data?.pria_panggilan || ''}`,
                      data?.lokasi_resepsi || '',
                      'Resepsi Pernikahan',
                      data?.tanggal_resepsi_iso || data?.tanggal_resepsi || data?.tanggal_akad
                    )}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <CalendarPlus size={18} weight="bold" />
                    <span>Kalender</span>
                  </a>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
