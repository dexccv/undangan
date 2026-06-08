import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMKj34dJ3jt8Q_uW3rQ6Pn3kypiLiS3OA",
  authDomain: "undangan-5cf2f.firebaseapp.com",
  projectId: "undangan-5cf2f",
  storageBucket: "undangan-5cf2f.firebasestorage.app",
  messagingSenderId: "156698309976",
  appId: "1:156698309976:web:26aea66e4ba22cdfe2212d",
  measurementId: "G-889VC8X9K4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
let coupleId = new URLSearchParams(window.location.search).get('id');
if (!coupleId) {
    const pathParts = window.location.pathname.split('/').filter(p => p && !p.includes('.html'));
    if (pathParts.length > 0) {
        coupleId = pathParts[pathParts.length - 1];
    }
}
if (!coupleId || coupleId === 'project%20wedding' || coupleId === 'project wedding') coupleId = 'nadia-agus'; // Fallback for local testing

async function loadCMSData() {
    try {
        const docRef = doc(db, "couples", coupleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Populate DOM
            const setDom = (id, val) => {
                const els = document.querySelectorAll('#' + id);
                els.forEach(el => {
                    if (el.tagName === 'INPUT') el.value = val;
                    else if (el.hasAttribute('data-copy')) el.setAttribute('data-copy', val);
                    else el.innerHTML = val;
                });
            }

            setDom('dyn-title-wanita', data.wanita_panggilan);
            setDom('dyn-title-pria', data.pria_panggilan);
            setDom('dyn-meta-wanita', data.wanita_panggilan);
            setDom('dyn-meta-pria', data.pria_panggilan);
            setDom('dyn-cover-wanita', data.wanita_panggilan);
            setDom('dyn-cover-pria', data.pria_panggilan);
            setDom('dyn-footer-wanita', data.wanita_panggilan);
            setDom('dyn-footer-pria', data.pria_panggilan);
            
            setDom('dyn-cover-name-wanita', data.wanita_panggilan);
            setDom('dyn-cover-name-pria', data.pria_panggilan);
            
            setDom('dyn-wanita-lengkap', data.wanita_lengkap);
            setDom('dyn-wanita-ortu', data.wanita_ortu);
            setDom('dyn-pria-lengkap', data.pria_lengkap);
            setDom('dyn-pria-ortu', data.pria_ortu);
            
            setDom('dyn-tanggal-cover', data.tanggal_cover);
            setDom('dyn-tanggal-lengkap', data.tanggal_lengkap);
            setDom('dyn-waktu-akad', data.waktu_akad);
            setDom('dyn-waktu-resepsi', data.waktu_resepsi);
            
            setDom('dyn-lokasi-akad', data.lokasi_akad);
            setDom('dyn-lokasi-resepsi', data.lokasi_resepsi);
            setDom('dyn-alamat-baris1', data.alamat_baris1);
            setDom('dyn-alamat-baris2', data.alamat_baris2);
            
            setDom('dyn-rek-nama-wanita', data.wanita_lengkap);
            setDom('dyn-rek-nama-pria', data.pria_lengkap);
            setDom('dyn-rekening-wanita', data.rekening_wanita);
            setDom('dyn-rekening-pria', data.rekening_pria);
            setDom('dyn-copy-wanita', data.rekening_wanita);
            setDom('dyn-copy-pria', data.rekening_pria);
            
            document.querySelectorAll('.dyn-link-maps').forEach(el => el.href = data.link_maps);
            
            // Set dynamic border
            if (data.url_border) {
                document.documentElement.style.setProperty('--dyn-border-url', "url('" + data.url_border + "')");
            }
            
            document.title = "The Wedding of " + data.wanita_panggilan + " & " + data.pria_panggilan;
            if (document.getElementById('page-title')) document.getElementById('page-title').innerText = document.title;
            if (document.getElementById('meta-desc')) document.getElementById('meta-desc').content = "Undangan Pernikahan " + data.wanita_panggilan + " & " + data.pria_panggilan;
            if (document.getElementById('meta-og-title')) document.getElementById('meta-og-title').content = document.title;
            
            // Re-init features that depend on data
            initCountdown(data.target_countdown);
            
            document.body.style.display = 'block'; // Show content after loaded
        } else {
            document.body.innerHTML = '<h1 style="text-align:center; padding:100px;">Undangan Tidak Ditemukan</h1>';
            document.body.style.display = 'block';
        }
    } catch (e) {
        console.error("Error fetching couple data:", e);
        document.body.innerHTML = '<h1 style="text-align:center; padding:100px;">Terjadi Kesalahan Server</h1>';
        document.body.style.display = 'block';
    }
}
// =========================================================
//  WEDDING INVITATION - SCRIPT.JS
//  Features: Countdown, Scroll Reveal, Lightbox, RSVP, Guestbook
//            Clipboard Copy, Music Toggle, Confetti
// =========================================================

// =========================================================
// 1. PARAMETER URL — Personalisasi Nama Tamu
// =========================================================
(function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  let guestName = params.get('to') || 'Tamu Undangan';
  guestName = guestName.replace(/[<>"'&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
  }[c]));
  guestName = guestName.substring(0, 60);

  const guestEl = document.getElementById('guest-name');
  if (guestEl) guestEl.textContent = guestName;
})();


// =========================================================
// 2. COUNTDOWN TIMER
// =========================================================
function initCountdown() {
  // Target: 7 Juni 2026, pukul 10:00 WIB
  const targetDate = new Date('2026-06-07T10:00:00+07:00');

  function updateCountdown() {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
        const el = document.getElementById('cd-' + id);
        if (el) el.textContent = '00';
      });
      const label = document.getElementById('countdown-label');
      if (label) label.textContent = '🎉 Hari Bahagia Telah Tiba!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    document.getElementById('cd-days').textContent    = pad(days);
    document.getElementById('cd-hours').textContent   = pad(hours);
    document.getElementById('cd-minutes').textContent = pad(minutes);
    document.getElementById('cd-seconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}


// =========================================================
// 3. SCROLL REVEAL ANIMATION
// =========================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}


// =========================================================
// 4. LIGHTBOX (Galeri Foto)
// =========================================================
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');

  if (!lightbox) return;

  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightboxImg.alt = item.dataset.alt || 'Foto Pernikahan';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


// =========================================================
// 5. RSVP & BUKU TAMU TERPISAH
// =========================================================
function initForms() {
  const rsvpForm      = document.getElementById('rsvp-form');
  const guestbookForm = document.getElementById('guestbook-form');
  const wishesList    = document.getElementById('wishes-list');
  const toastEl       = document.getElementById('toast');

  // Handle jumlah tamu input show/hide based on kehadiran
  const rsvpRadios = document.querySelectorAll('input[name="hadir"]');
  const countGroup = document.getElementById('guest-count-group');
  
  rsvpRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'hadir') {
        if(countGroup) countGroup.style.display = 'block';
      } else {
        if(countGroup) countGroup.style.display = 'none';
      }
    });
  });

  function escapeHtml(str) {
    return String(str).replace(/[<>"'&]/g, c => ({
      '<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'
    }[c]));
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  function createWishCard(data) {
    const div = document.createElement('div');
    div.className = 'wish-card reveal visible';
    const initial = data.name.charAt(0).toUpperCase();
    div.innerHTML = `
      <div class="wish-header">
        <div class="wish-avatar">${initial}</div>
        <div class="wish-meta">
          <h4>${escapeHtml(data.name)}</h4>
          <span>${data.time || 'Baru saja'}</span>
        </div>
      </div>
      <p>"${escapeHtml(data.message)}"</p>
    `;
    return div;
  }

    // RSVP Submit
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = rsvpForm.querySelector('#rsvp-fullname').value.trim();
      const hadir = rsvpForm.querySelector('input[name="hadir"]:checked')?.value;
      const count = rsvpForm.querySelector('#guest-count')?.value || "1";
      
      if (!name || !hadir) return;
      
      const btn = rsvpForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Mengirim...';

      try {
        await addDoc(collection(db, "invitations/" + coupleId + "/rsvp"), {
          name: name,
          hadir: hadir,
          guest_count: hadir === 'hadir' ? parseInt(count) : 0,
          timestamp: serverTimestamp()
        });
        showToast("Terima kasih, " + name + "! Konfirmasi kehadiran Anda telah tersimpan.");
        rsvpForm.reset();
        if(countGroup) countGroup.style.display = 'block';
      } catch (error) {
        console.error("Error adding RSVP: ", error);
        showToast("Gagal mengirim konfirmasi. Silakan coba lagi.");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  // Guestbook Submit
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = guestbookForm.querySelector('#guest-fullname').value.trim();
      const message = guestbookForm.querySelector('#guest-message').value.trim();

      if (!name || !message) return;

      const btn = guestbookForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Mengirim...';

      try {
        await addDoc(collection(db, "invitations/" + coupleId + "/guestbook"), {
          name: name,
          message: message,
          timestamp: serverTimestamp()
        });
        showToast("Terima kasih, " + name + "! Ucapan & doa Anda telah terkirim. 💐");
        guestbookForm.reset();
      } catch (error) {
        console.error("Error adding wish: ", error);
        showToast("Gagal mengirim ucapan. Silakan coba lagi.");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  // Real-time Guestbook Listener
  if (wishesList) {
    const q = query(collection(db, "invitations/" + coupleId + "/guestbook"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      wishesList.innerHTML = '';
      snapshot.forEach((doc) => {
        const data = doc.data();
        let timeString = 'Baru saja';
        if (data.timestamp) {
           const date = data.timestamp.toDate();
           timeString = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        }
        const wishData = { name: data.name, message: data.message, time: timeString };
        const card = createWishCard(wishData);
        wishesList.appendChild(card);
      });
    });
  }}


// =========================================================
// 6. SALIN NOMOR REKENING (Copy to Clipboard)
// =========================================================
function initCopyButtons() {
  document.querySelectorAll('.btn-copy[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch(e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = original;
      }, 2000);
    });
  });
}


// =========================================================
// 7. MUSIK LATAR (Play/Pause)
// =========================================================
function initMusicPlayer() {
  const musicBtn   = document.getElementById('music-btn');
  const musicAudio = document.getElementById('music-audio');
  if (!musicBtn || !musicAudio) return;
  
  let isPlaying  = false;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      musicAudio.pause();
      musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
      musicBtn.classList.remove('playing');
      musicBtn.title = 'Play Musik';
    } else {
      musicAudio.play().catch(() => {});
      musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      musicBtn.classList.add('playing');
      musicBtn.title = 'Pause Musik';
    }
    isPlaying = !isPlaying;
  });
}


// =========================================================
// 8. KONFETTI & SMOOTH SCROLL
// =========================================================
function triggerConfetti() {
  if (typeof confetti === 'undefined') return;
  const colors = ['#D4AF37', '#CBD5C0', '#F7F9F5', '#8A9A7D', '#E8EFE5'];

  confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: colors });
  setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.4, x: 0.2 }, colors: colors }), 300);
  setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.4, x: 0.8 }, colors: colors }), 500);
}

function initOpenButton() {
  const btn = document.getElementById('btn-open-invitation');
  if (!btn) return;

  btn.addEventListener('click', () => {
    triggerConfetti();
    const target = document.getElementById('quotes');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}


// =========================================================
// 9. INIT SEMUA
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.display = 'none'; // Hide until CMS data loaded
  
  initScrollReveal();
  initLightbox();
  initForms();
  initCopyButtons();
  initMusicPlayer();
  initOpenButton();

  // Load CMS Data
  loadCMSData();

  // Konfetti ringan
  setTimeout(() => {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#CBD5C0', '#F7F9F5', '#8A9A7D']
      });
    }
  }, 1200);
});
    }
  }, 1200);
});


