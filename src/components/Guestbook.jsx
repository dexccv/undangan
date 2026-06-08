import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function Guestbook({ data, coupleId }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    if (!coupleId) return;
    const q = query(collection(db, `invitations/${coupleId}/guestbook`), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        let timeString = 'Baru saja';
        if (d.timestamp) {
           const date = d.timestamp.toDate();
           timeString = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        }
        wishesData.push({ id: doc.id, name: d.name, message: d.message, time: timeString });
      });
      setWishes(wishesData);
    });
    return () => unsubscribe();
  }, [coupleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    setLoading(true);
    try {
      await addDoc(collection(db, `invitations/${coupleId}/guestbook`), {
        name,
        message,
        timestamp: serverTimestamp()
      });
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.textContent = `Terima kasih, ${name}! Ucapan & doa Anda telah terkirim. 💐`;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 3000);
      }
      setName('');
      setMessage('');
    } catch (error) {
      console.error("Error adding wish: ", error);
      alert("Gagal mengirim ucapan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guestbook" className="section">
      <div className="container">
        <h2 className="section-title reveal">Buku Tamu</h2>
        <span className="section-subtitle reveal">Kirim Ucapan & Doa</span>
        <div className="divider reveal"><i className="fa-solid fa-comment-heart" aria-hidden="true"></i></div>

        <div className="form-card reveal" style={{ background: 'var(--cream-dark)', border: 'none' }}>
          <form id="guestbook-form" noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="guest-fullname">Nama <span aria-hidden="true">*</span></label>
              <input 
                type="text" 
                id="guest-fullname" 
                name="fullname" 
                placeholder="Nama Anda" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="guest-message">Ucapan & Doa <span aria-hidden="true">*</span></label>
              <textarea 
                id="guest-message" 
                name="message" 
                placeholder="Tulis ucapan dan doa terbaik Anda..." 
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </div>

        <h3 className="section-title reveal" style={{ fontSize: '1.4rem', marginTop: '40px', marginBottom: '24px' }}>Ucapan & Doa 💌</h3>
        <div id="wishes-list" className="wishes-list" aria-live="polite">
          {wishes.map((wish) => (
            <div key={wish.id} className="wish-card reveal visible">
              <div className="wish-header">
                <div className="wish-avatar">{wish.name.charAt(0).toUpperCase()}</div>
                <div className="wish-meta">
                  <h4>{wish.name}</h4>
                  <span>{wish.time}</span>
                </div>
              </div>
              <p>"{wish.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
