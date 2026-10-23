import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PaperPlaneTilt, CheckCircle, XCircle, Users, Heart } from '@phosphor-icons/react';
import { useToast } from '../context/ToastContext';
import ScrollReveal from './ui/ScrollReveal';

export default function RSVP({ data, coupleId }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [hadir, setHadir] = useState('hadir');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Mohon masukkan nama lengkap Anda.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (coupleId) {
        await addDoc(collection(db, `invitations/${coupleId}/rsvp`), {
          name: name.trim(),
          hadir,
          guest_count: hadir === 'hadir' ? parseInt(count, 10) || 1 : 0,
          timestamp: serverTimestamp()
        });
      }
      showToast(`Terima kasih, ${name}! Konfirmasi kehadiran Anda telah tersimpan.`);
      setName('');
      setHadir('hadir');
      setCount(1);
    } catch (error) {
      console.error('Error adding RSVP: ', error);
      showToast('Gagal mengirim konfirmasi. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sidePhoto = data?.foto_prewedding_2 || data?.foto_cover || '/assets/foto3.jpg';

  return (
    <section id="rsvp" className="section-padding rsvp-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <h2 className="section-title">Konfirmasi Kehadiran</h2>
            <p className="section-description">
              Kehadiran dan doa restu Anda merupakan kehormatan serta kebahagiaan terbesar bagi kami:
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="rsvp-card-wrapper">
            {/* Visual side photo column */}
            <div className="rsvp-visual-column">
              <img 
                src={sidePhoto} 
                alt="Pasangan Bahagia" 
                className="rsvp-visual-img"
                loading="lazy" 
              />
              <div className="rsvp-visual-overlay">
                <Heart size={32} weight="fill" className="rsvp-visual-heart" />
                <h4 className="rsvp-visual-title">{data?.wanita_panggilan} &amp; {data?.pria_panggilan}</h4>
                <p className="rsvp-visual-sub">Kami Menanti Kehadiran Anda</p>
              </div>
            </div>

            {/* Form column */}
            <div className="rsvp-form-column">
              <form id="rsvp-form" noValidate onSubmit={handleSubmit} className="rsvp-form">
                <div className="form-group">
                  <label htmlFor="rsvp-fullname" className="form-label">
                    Nama Lengkap <span className="text-gold" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="rsvp-fullname"
                    name="fullname"
                    placeholder="Contoh: Bpk. Bambang & Keluarga"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Konfirmasi Kehadiran</label>
                  <div className="rsvp-options-grid" role="radiogroup">
                    <label 
                      className={`rsvp-option-btn ${hadir === 'hadir' ? 'is-selected' : ''}`}
                      htmlFor="rsvp-hadir"
                    >
                      <input
                        type="radio"
                        id="rsvp-hadir"
                        name="hadir"
                        value="hadir"
                        checked={hadir === 'hadir'}
                        onChange={(e) => setHadir(e.target.value)}
                        className="sr-only"
                      />
                      <CheckCircle size={22} weight={hadir === 'hadir' ? 'fill' : 'regular'} />
                      <span>Ya, Saya Hadir</span>
                    </label>

                    <label 
                      className={`rsvp-option-btn ${hadir === 'tidak' ? 'is-selected' : ''}`}
                      htmlFor="rsvp-tidak"
                    >
                      <input
                        type="radio"
                        id="rsvp-tidak"
                        name="hadir"
                        value="tidak"
                        checked={hadir === 'tidak'}
                        onChange={(e) => setHadir(e.target.value)}
                        className="sr-only"
                      />
                      <XCircle size={22} weight={hadir === 'tidak' ? 'fill' : 'regular'} />
                      <span>Maaf, Berhalangan</span>
                    </label>
                  </div>
                </div>

                {hadir === 'hadir' && (
                  <div className="form-group">
                    <label htmlFor="guest-count" className="form-label">
                      <Users size={18} weight="duotone" className="form-inline-icon" />
                      Jumlah Tamu
                    </label>
                    <div className="guest-counter-input">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setCount((prev) => Math.max(1, Number(prev) - 1))}
                        aria-label="Kurangi tamu"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="guest-count"
                        name="guest_count"
                        min="1"
                        max="10"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="counter-number-field"
                      />
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setCount((prev) => Math.min(10, Number(prev) + 1))}
                        aria-label="Tambah tamu"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary-gold btn-block"
                  id="btn-submit-rsvp"
                  disabled={loading}
                >
                  <PaperPlaneTilt size={20} weight="fill" />
                  <span>{loading ? 'Mengirim Konfirmasi...' : 'Kirim Konfirmasi Kehadiran'}</span>
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
