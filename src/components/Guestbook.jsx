import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { PaperPlaneTilt, Heart } from '@phosphor-icons/react';
import { useToast } from '../context/ToastContext';
import ScrollReveal from './ui/ScrollReveal';

export default function Guestbook({ data, coupleId }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    if (!coupleId) return;
    const q = query(
      collection(db, `invitations/${coupleId}/guestbook`),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let timeString = 'Baru saja';
        if (d.timestamp) {
          try {
            const date = d.timestamp.toDate();
            timeString = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) + ' • ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          } catch {
            timeString = 'Baru saja';
          }
        }
        wishesData.push({ id: docSnap.id, name: d.name, message: d.message, time: timeString });
      });
      setWishes(wishesData);
    }, (error) => {
      console.warn('Guestbook snapshot error:', error);
    });

    return () => unsubscribe();
  }, [coupleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Mohon lengkapi nama dan ucapan Anda.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (coupleId) {
        await addDoc(collection(db, `invitations/${coupleId}/guestbook`), {
          name: name.trim(),
          message: message.trim(),
          timestamp: serverTimestamp()
        });
      }
      showToast(`Terima kasih, ${name}! Ucapan & doa Anda telah terkirim.`);
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error adding wish: ', error);
      showToast('Gagal mengirim ucapan. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guestbook" className="section-padding guestbook-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <h2 className="section-title">Untaian Doa &amp; Harapan</h2>
            <p className="section-description">
              Tuliskan pesan manis dan doa restu Anda untuk mengiringi langkah baru kami:
            </p>
          </div>
        </ScrollReveal>

        <div className="guestbook-layout">
          {/* Form Card */}
          <ScrollReveal direction="up" delay={0.1} className="guestbook-form-card">
            <form id="guestbook-form" noValidate onSubmit={handleSubmit} className="guestbook-form">
              <div className="form-group">
                <label htmlFor="guest-fullname" className="form-label">
                  Nama Anda <span className="text-gold" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="guest-fullname"
                  name="fullname"
                  placeholder="Masukkan nama Anda"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="guest-message" className="form-label">
                  Ucapan &amp; Doa <span className="text-gold" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="guest-message"
                  name="message"
                  rows={4}
                  placeholder="Tuliskan doa terbaik untuk kedua mempelai..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input form-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary-gold btn-block"
                disabled={loading}
              >
                <PaperPlaneTilt size={20} weight="fill" />
                <span>{loading ? 'Mengirim Doa...' : 'Kirim Ucapan & Doa'}</span>
              </button>
            </form>
          </ScrollReveal>

          {/* Wishes List */}
          <ScrollReveal direction="up" delay={0.2} className="guestbook-wishes-column">
            <div className="wishes-header-bar">
              <h3 className="wishes-header-title">
                Doa Tamu Undangan
                <span className="wishes-count-pill">{wishes.length}</span>
              </h3>
            </div>

            <div className="wishes-scroll-box" aria-live="polite">
              {wishes.length === 0 ? (
                <div className="wishes-empty-state">
                  <Heart size={36} weight="duotone" className="wishes-empty-icon" />
                  <p>Belum ada ucapan. Jadilah yang pertama memberikan doa restu untuk kedua mempelai!</p>
                </div>
              ) : (
                wishes.map((wish) => (
                  <article key={wish.id} className="wish-card">
                    <div className="wish-card-header">
                      <div className="wish-avatar">
                        {wish.name ? wish.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div className="wish-meta">
                        <h4 className="wish-author">{wish.name}</h4>
                        <time className="wish-time">{wish.time}</time>
                      </div>
                    </div>
                    <p className="wish-body-text">"{wish.message}"</p>
                  </article>
                ))
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
