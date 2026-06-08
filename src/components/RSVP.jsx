import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RSVP({ data, coupleId }) {
  const [name, setName] = useState('');
  const [hadir, setHadir] = useState('hadir');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !hadir) return;

    setLoading(true);
    try {
      await addDoc(collection(db, `invitations/${coupleId}/rsvp`), {
        name,
        hadir,
        guest_count: hadir === 'hadir' ? parseInt(count) : 0,
        timestamp: serverTimestamp()
      });
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.textContent = `Terima kasih, ${name}! Konfirmasi kehadiran Anda telah tersimpan.`;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 3000);
      }
      setName('');
      setHadir('hadir');
      setCount(1);
    } catch (error) {
      console.error("Error adding RSVP: ", error);
      alert("Gagal mengirim konfirmasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="section" style={{ background: 'var(--cream)' }}>
      <div className="container">
        <h2 className="section-title reveal">Konfirmasi Kehadiran</h2>
        <span className="section-subtitle reveal">RSVP Form</span>
        <div className="divider reveal"><i className="fa-solid fa-envelope-circle-check" aria-hidden="true"></i></div>

        <div className="form-card reveal">
          <form id="rsvp-form" noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rsvp-fullname">Nama Lengkap <span aria-hidden="true">*</span></label>
              <input 
                type="text" 
                id="rsvp-fullname" 
                name="fullname" 
                placeholder="Masukkan nama Anda" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Apakah Anda akan hadir?</label>
              <div className="rsvp-options" role="radiogroup">
                <div className="rsvp-option">
                  <input 
                    type="radio" 
                    id="rsvp-hadir" 
                    name="hadir" 
                    value="hadir" 
                    checked={hadir === 'hadir'} 
                    onChange={e => setHadir(e.target.value)}
                  />
                  <label htmlFor="rsvp-hadir"><i className="fa-solid fa-circle-check" aria-hidden="true"></i> Ya, Hadir</label>
                </div>
                <div className="rsvp-option">
                  <input 
                    type="radio" 
                    id="rsvp-tidak" 
                    name="hadir" 
                    value="tidak" 
                    checked={hadir === 'tidak'}
                    onChange={e => setHadir(e.target.value)}
                  />
                  <label htmlFor="rsvp-tidak"><i className="fa-solid fa-circle-xmark" aria-hidden="true"></i> Tidak Hadir</label>
                </div>
              </div>
            </div>

            {hadir === 'hadir' && (
              <div className="form-group" id="guest-count-group">
                <label htmlFor="guest-count">Jumlah Tamu yang Ikut</label>
                <input 
                  type="number" 
                  id="guest-count" 
                  name="guest_count" 
                  min="1" 
                  max="10" 
                  value={count}
                  onChange={e => setCount(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn-submit" id="btn-submit-rsvp" disabled={loading}>
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i> {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
