import React, { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  UserList,
  CalendarCheck,
  Camera,
  Heart,
  ImagesSquare,
  CreditCard,
  Eye,
  ChartLineUp,
  PaperPlaneRight,
  PencilSimple,
  SignOut,
  SignIn,
  ShoppingBag,
  FlowerLotus,
  MusicNotes,
  List,
  X,
  Lightning
} from '@phosphor-icons/react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { getYouTubeId, fetchYouTubeMetadata } from '../context/MusicContext';
import './DevDashboard.css';

// Modular Sub-components
import DevOrdersView from './dev/DevOrdersView';
import DevCouplesList from './dev/DevCouplesList';
import DevEditorView from './dev/DevEditorView';
import DevBlastView from './dev/DevBlastView';
import DevSmartParserModal from './dev/DevSmartParserModal';

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [couples, setCouples] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active view: 'orders', 'list', 'edit', 'blast'
  const [currentView, setCurrentView] = useState('orders');
  const [activeEditorTab, setActiveEditorTab] = useState('profile');

  // Orders State (Pesanan Masuk dari Landing Page)
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [isSmartParserOpen, setIsSmartParserOpen] = useState(false);
  const [rawChatText, setRawChatText] = useState('');

  // Form State
  const [formData, setFormData] = useState(getInitialFormData());
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  const [isFetchingYtMeta, setIsFetchingYtMeta] = useState(false);
  const testAudioRef = useRef(null);

  const PRESET_SONGS = [
    {
      title: 'Payung Teduh - Akad',
      artist: 'Payung Teduh',
      url: '/assets/wedding_song.mp3',
      type: 'preset',
      badge: 'File Audio Bawaan'
    },
    {
      title: 'Kahitna - Menikahimu',
      artist: 'Kahitna',
      url: 'https://www.youtube.com/watch?v=F_487nC4XvI',
      type: 'youtube',
      badge: 'YouTube'
    },
    {
      title: 'Yovie & Nuno - Janji Suci',
      artist: 'Yovie & Nuno',
      url: 'https://www.youtube.com/watch?v=R9_uQx3v1xY',
      type: 'youtube',
      badge: 'YouTube'
    },
    {
      title: 'Tulus - Teman Hidup',
      artist: 'Tulus',
      url: 'https://www.youtube.com/watch?v=2T8uO2QvBFE',
      type: 'youtube',
      badge: 'YouTube'
    },
    {
      title: 'Shane Filan - Beautiful In White',
      artist: 'Shane Filan',
      url: 'https://www.youtube.com/watch?v=XRh0yP2u_eY',
      type: 'youtube',
      badge: 'YouTube'
    }
  ];

  // Link Generator State
  const [selectedCoupleForLinks, setSelectedCoupleForLinks] = useState(null);
  const [rawGuestList, setRawGuestList] = useState('');
  const [waTemplate, setWaTemplate] = useState(
    'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\n{link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.'
  );
  const [generatedLinks, setGeneratedLinks] = useState([]);

  // Kehadiran (RSVP) & Buku Tamu State
  const [rsvpList, setRsvpList] = useState([]);
  const [guestbookList, setGuestbookList] = useState([]);
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [searchRsvp, setSearchRsvp] = useState('');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [testGuestName, setTestGuestName] = useState('Sahabat Tercinta');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRulesRestricted, setIsRulesRestricted] = useState(false);
  const monitorUnsubRef = useRef({ rsvp: null, guestbook: null });

  // Helper kompresi gambar lokal (Spark Plan friendly - bebas Firebase Storage)
  const compressDevImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              if (width > maxWidth || height > maxWidth) {
                if (width > height) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                } else {
                  width = Math.round((width * maxWidth) / height);
                  height = maxWidth;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', quality));
            } catch (canvasErr) {
              resolve(e.target.result || '');
            }
          };
          img.onerror = () => resolve(e.target.result || '');
          img.src = e.target.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      } catch (err) {
        resolve('');
      }
    });
  };

  // Dialog panduan dan salin rules Firestore
  const showRulesGuide = () => {
    Swal.fire({
      title: 'Perbaiki Aturan Firestore (Spark Plan)',
      html: `
        <div style="text-align: left; font-size: 0.88rem; line-height: 1.6; color: #333;">
          <p style="margin-bottom: 0.5rem;">
            Karena Anda menggunakan <strong>Firebase Spark Plan (Gratis)</strong>, aplikasi ini telah disesuaikan agar <strong>TIDAK membutuhkan Cloud Storage sama sekali</strong>. Bukti transfer dan foto langsung disimpan di database Firestore secara instan.
          </p>
          <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; color: #92400E; font-size: 0.82rem;">
            <strong>Langkah Cepat (1 Menit):</strong>
            <ol style="margin: 0.3rem 0 0 1.2rem; padding: 0;">
              <li>Buka <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style="color: #B45309; font-weight: bold; text-decoration: underline;">Firebase Console</a> &gt; Project <strong>undangan-5cf2f</strong></li>
              <li>Buka menu <strong>Firestore Database</strong> &gt; Tab <strong>Rules</strong></li>
              <li>Ganti aturannya dengan kode di bawah, lalu klik <strong>Publish</strong></li>
            </ol>
          </div>
          <pre style="background: #1E293B; color: #E2E8F0; padding: 0.85rem; border-radius: 8px; font-size: 0.78rem; overflow-x: auto; white-space: pre;">rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}</pre>
        </div>
      `,
      width: '640px',
      showCancelButton: true,
      confirmButtonText: 'Salin Rules Firestore',
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#B8860B'
    }).then((r) => {
      if (r.isConfirmed) {
        navigator.clipboard.writeText(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Aturan Berhasil Disalin!',
          text: 'Tinggal paste di tab Rules Firestore lalu klik Publish.',
          showConfirmButton: false,
          timer: 4000
        });
      }
    });
  };

  // Web Audio chime notifikasi pesanan masuk realtime
  const playNewOrderNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12); // A5
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {}
  };

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  // Sinkronisasi data realtime: Firestore onSnapshot, BroadcastChannel, dan LocalStorage
  useEffect(() => {
    // 1. Bersihkan data dummy order 'ord-sample-01' dari localStorage
    try {
      const raw = localStorage.getItem('digitalisasi_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        const filtered = parsed.filter(
          (o) => o.id !== 'ord-sample-01' && o.id !== 'sample'
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem('digitalisasi_orders', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    // 2. Realtime listener Firestore Orders
    let unsubscribeOrders = null;
    try {
      unsubscribeOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const firestoreOrders = [];
          snapshot.forEach((docSnap) => {
            firestoreOrders.push({ id: docSnap.id, ...docSnap.data() });
          });

          let localOrders = [];
          try {
            localOrders = JSON.parse(
              localStorage.getItem('digitalisasi_orders') || '[]'
            ).filter((o) => o.id !== 'ord-sample-01' && o.id !== 'sample');
          } catch (e) {}

          const orderMap = new Map();
          localOrders.forEach((o) => {
            if (o && o.id && o.id !== 'ord-sample-01' && o.id !== 'sample') {
              orderMap.set(o.id, o);
            }
          });

          firestoreOrders.forEach((o) => {
            if (o && o.id && o.id !== 'ord-sample-01' && o.id !== 'sample') {
              const existing = orderMap.get(o.id);
              orderMap.set(o.id, {
                ...o,
                receipt_preview: o.receipt_preview || existing?.receipt_preview || '',
                receipt_url: o.receipt_url || existing?.receipt_url || '',
                receipt_name: o.receipt_name || existing?.receipt_name || ''
              });
            }
          });

          const combined = Array.from(orderMap.values());
          combined.sort((a, b) => {
            const tA = a.created_at?.seconds || (typeof a.created_at === 'number' ? a.created_at : 0);
            const tB = b.created_at?.seconds || (typeof b.created_at === 'number' ? b.created_at : 0);
            return tB - tA;
          });

          setOrders(combined);
          setLoadingOrders(false);
        },
        (err) => {
          console.warn('Realtime orders snapshot notice (offline/rules):', err);
          if (err.code === 'permission-denied' || err.message?.includes('permission')) {
            setIsRulesRestricted(true);
          }
          fetchOrders();
        }
      );
    } catch (err) {
      console.warn('Orders onSnapshot setup error:', err);
      fetchOrders();
    }

    // 3. Realtime listener Firestore Couples
    let unsubscribeCouples = null;
    try {
      unsubscribeCouples = onSnapshot(
        collection(db, 'couples'),
        (snapshot) => {
          const data = [];
          snapshot.forEach((docSnap) => {
            data.push({ id: docSnap.id, ...docSnap.data() });
          });
          setCouples(data);
          setLoadingData(false);
        },
        (error) => {
          console.warn('Realtime couples error:', error);
          fetchCouples();
        }
      );
    } catch (err) {
      console.warn('Couples onSnapshot setup error:', err);
      fetchCouples();
    }

    // 4. Cross-tab BroadcastChannel & CustomEvent
    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('digitalisasi_orders_channel');
        channel.onmessage = (event) => {
          const { type, order, orderId } = event.data || {};
          if (type === 'ORDER_CREATED' && order && order.id !== 'ord-sample-01') {
            setOrders((prev) => {
              const map = new Map(prev.map((item) => [item.id, item]));
              map.set(order.id, { ...(map.get(order.id) || {}), ...order });
              const updated = Array.from(map.values()).sort((a, b) => {
                const tA = a.created_at?.seconds || (typeof a.created_at === 'number' ? a.created_at : 0);
                const tB = b.created_at?.seconds || (typeof b.created_at === 'number' ? b.created_at : 0);
                return tB - tA;
              });
              return updated;
            });

            playNewOrderNotificationSound();
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'info',
              title: 'Pesanan Baru Masuk!',
              text: `${order.couple_name || 'Pelanggan'} (${order.package_name || 'Paket'})`,
              showConfirmButton: false,
              timer: 4500
            });
          } else if (type === 'ORDER_UPDATED' && order) {
            setOrders((prev) =>
              prev.map((o) => (o.id === order.id ? { ...o, ...order } : o))
            );
          } else if (type === 'ORDER_DELETED' && orderId) {
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
          }
        };
      }
    } catch (e) {}

    const handleCustomOrder = (event) => {
      const order = event.detail;
      if (order && order.id !== 'ord-sample-01' && order.id !== 'sample') {
        setOrders((prev) => {
          const map = new Map(prev.map((item) => [item.id, item]));
          map.set(order.id, { ...(map.get(order.id) || {}), ...order });
          const updated = Array.from(map.values()).sort((a, b) => {
            const tA = a.created_at?.seconds || (typeof a.created_at === 'number' ? a.created_at : 0);
            const tB = b.created_at?.seconds || (typeof b.created_at === 'number' ? b.created_at : 0);
            return tB - tA;
          });
          return updated;
        });
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'digitalisasi_orders') {
        try {
          const fresh = JSON.parse(e.newValue || '[]').filter(
            (o) => o.id !== 'ord-sample-01' && o.id !== 'sample'
          );
          setOrders((prev) => {
            const map = new Map(prev.map((item) => [item.id, item]));
            fresh.forEach((f) => {
              map.set(f.id, { ...(map.get(f.id) || {}), ...f });
            });
            const updated = Array.from(map.values()).sort((a, b) => {
              const tA = a.created_at?.seconds || (typeof a.created_at === 'number' ? a.created_at : 0);
              const tB = b.created_at?.seconds || (typeof b.created_at === 'number' ? b.created_at : 0);
              return tB - tA;
            });
            return updated;
          });
        } catch (err) {}
      }
    };

    window.addEventListener('digitalisasi_order_created', handleCustomOrder);
    window.addEventListener('storage', handleStorageChange);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCouples();
        fetchOrders();
      } else {
        setLoadingData(false);
        setLoadingOrders(false);
      }
    });

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeCouples) unsubscribeCouples();
      if (channel) channel.close();
      window.removeEventListener('digitalisasi_order_created', handleCustomOrder);
      window.removeEventListener('storage', handleStorageChange);
      unsubscribeAuth();
    };
  }, []);

  function getInitialFormData() {
    return {
      id: '',
      wanita_panggilan: 'Nadia',
      wanita_lengkap: 'Nadia Salsabila, S.Kom',
      wanita_ortu: 'Bpk. Ahmad Fauzi & Ibu Siti Aminah',
      wanita_ig: '@nadiasalsabila',
      rekening_wanita: '1234567890',
      bank_wanita: 'Bank BCA',
      an_wanita: 'Nadia Salsabila',

      pria_panggilan: 'Agus',
      pria_lengkap: 'Agus Pratama, S.T',
      pria_ortu: 'Bpk. Hendra Wijaya & Ibu Ratna Dewi',
      pria_ig: '@aguspratama',
      rekening_pria: '0987654321',
      bank_pria: 'Bank BCA',
      an_pria: 'Agus Pratama',

      quote_text:
        'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
      quote_teks:
        'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
      quote_source: 'QS. Ar-Rum: 21',
      quote_sekunder: '',
      quote_sekunder_source: '',

      tanggal_cover: 'Minggu, 07 Juni 2026',
      tanggal_akad: '2026-06-07T08:00:00',
      tanggal_lengkap_akad: 'Minggu, 07 Juni 2026',
      waktu_akad: '08.00 - 10.00 WIB',
      lokasi_akad: 'Masjid Agung Al-Barkah',

      tanggal_resepsi: '2026-06-07T11:00:00',
      tanggal_lengkap_resepsi: 'Minggu, 07 Juni 2026',
      waktu_resepsi: '11.00 - 14.00 WIB',
      lokasi_resepsi: 'Grand Ballroom Grand City',

      alamat_baris1: 'Jl. Pemuda No. 45',
      alamat_baris2: 'Jakarta Selatan',
      link_maps: 'https://maps.google.com',

      foto_cover: '/assets/foto1.jpg',
      foto_prewedding_1: '/assets/foto2.jpg',
      foto_mempelai_wanita: '/assets/foto3.jpg',
      foto_mempelai_pria: '/assets/foto4.jpg',
      foto_venue_akad: '/assets/foto1.jpg',
      foto_venue_resepsi: '/assets/foto2.jpg',
      foto_closing: '/assets/foto1.jpg',

      alamat_kado:
        'Jl. Melati No. 12, RT 03/RW 04, Kebayoran Baru, Jakarta Selatan',
      penerima_kado: 'Nadia Salsabila (081234567890)',

      love_story: [
        {
          year: '2020',
          title: 'Awal Pertemuan',
          desc: 'Di sebuah kesempatan yang tak disengaja, takdir mempertemukan kami berdua.',
          foto: '/assets/foto1.jpg'
        },
        {
          year: '2024',
          title: 'Menjalin Komitmen',
          desc: 'Suka dan duka kami lalui bersama untuk melangkah ke masa depan.',
          foto: '/assets/foto2.jpg'
        },
        {
          year: '2025',
          title: 'Hari Pertunangan',
          desc: 'Dengan restu keluarga, ikatan komitmen resmi kami ikrarkan.',
          foto: '/assets/foto3.jpg'
        },
        {
          year: '2026',
          title: 'Ikrar Suci Pernikahan',
          desc: 'Hari bahagia yang dinantikan, mengucap janji suci di hadapan Allah SWT.',
          foto: '/assets/foto4.jpg'
        }
      ],

      foto_galeri: [
        { src: '/assets/foto1.jpg', caption: 'Simbol Ikatan Abadi' },
        { src: '/assets/foto2.jpg', caption: 'Langkah Bersama' },
        { src: '/assets/foto3.jpg', caption: 'Keindahan Hari Spesial' },
        { src: '/assets/foto4.jpg', caption: 'Momen Penuh Doa' }
      ],

      fitur_musik: true,
      musik_tipe: 'preset',
      musik_url: '/assets/wedding_song.mp3',
      judul_lagu: 'Payung Teduh - Akad',
      penyanyi_lagu: 'Payung Teduh'
    };
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        title: 'Masuk Berhasil',
        text: 'Selamat datang di Panel Pengelola Undangan.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (error) {
      Swal.fire({
        title: 'Gagal Masuk',
        text: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
        icon: 'error',
        confirmButtonColor: '#B8860B'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDevBypassLogin = () => {
    setUser({ email: 'developer@digitalisasi.id', uid: 'dev-local-user' });
    fetchCouples();
    fetchOrders();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const fetchCouples = async () => {
    setLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'couples'));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCouples(data);
    } catch (error) {
      console.error('Error fetching couples:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    let firestoreOrders = [];
    try {
      const q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        firestoreOrders.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (err) {
      console.warn('Fallback query orders without index:', err);
      try {
        const snap = await getDocs(collection(db, 'orders'));
        snap.forEach((docSnap) => {
          firestoreOrders.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (e2) {
        console.warn('Firestore orders read error:', e2);
        if (e2.code === 'permission-denied' || e2.message?.includes('permission')) {
          setIsRulesRestricted(true);
        }
      }
    }

    // Gabungkan dengan localStorage agar pesanan offline/lokal langsung tampil
    let localOrders = [];
    try {
      localOrders = JSON.parse(
        localStorage.getItem('digitalisasi_orders') || '[]'
      ).filter((o) => o.id !== 'ord-sample-01' && o.id !== 'sample');
    } catch (e) {
      console.warn('Failed to parse local orders:', e);
    }

    const orderMap = new Map();
    localOrders.forEach((o) => {
      if (o && o.id && o.id !== 'ord-sample-01' && o.id !== 'sample') {
        orderMap.set(o.id, o);
      }
    });

    firestoreOrders.forEach((o) => {
      if (o && o.id && o.id !== 'ord-sample-01' && o.id !== 'sample') {
        const existing = orderMap.get(o.id);
        orderMap.set(o.id, {
          ...o,
          receipt_preview: o.receipt_preview || existing?.receipt_preview || '',
          receipt_url: o.receipt_url || existing?.receipt_url || '',
          receipt_name: o.receipt_name || existing?.receipt_name || ''
        });
      }
    });

    const combined = Array.from(orderMap.values());
    combined.sort((a, b) => {
      const tA = a.created_at?.seconds || (typeof a.created_at === 'number' ? a.created_at : 0);
      const tB = b.created_at?.seconds || (typeof b.created_at === 'number' ? b.created_at : 0);
      return tB - tA;
    });

    setOrders(combined);
    setLoadingOrders(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      try {
        localStorage.setItem(
          'digitalisasi_orders',
          JSON.stringify(updated.filter((o) => o.id !== 'ord-sample-01'))
        );
      } catch (e) {}
      return updated;
    });

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('digitalisasi_orders_channel');
        bc.postMessage({ type: 'ORDER_UPDATED', order: { id: orderId, status: newStatus } });
        bc.close();
      }
    } catch (e) {}

    try {
      await setDoc(
        doc(db, 'orders', orderId),
        { status: newStatus },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore update status notice:', err);
    }

    Swal.fire({
      title: 'Status Diperbarui',
      text: `Status pesanan diubah menjadi: ${newStatus}`,
      icon: 'success',
      timer: 1400,
      showConfirmButton: false
    });
  };

  const handleViewReceipt = (ord) => {
    const imageUrl = ord.receipt_url || ord.receipt_preview;
    if (imageUrl) {
      Swal.fire({
        title: 'Bukti Pembayaran QRIS',
        html: `
          <div style="text-align: left; margin-bottom: 0.85rem; font-size: 0.84rem; color: #4A443C; line-height: 1.5;">
            <div><strong>Mempelai:</strong> ${ord.couple_name || 'Mempelai'}</div>
            <div><strong>Paket:</strong> ${ord.package_name || '-'} (${ord.package_price || '-'})</div>
            <div><strong>Nama Berkas:</strong> ${ord.receipt_name || 'bukti-transfer.jpg'}</div>
          </div>
          <div style="max-height: 420px; overflow: auto; border-radius: 12px; border: 1.5px solid #E6E2D8; background: #FAF9F6; box-shadow: inset 0 2px 6px rgba(0,0,0,0.04);">
            <img src="${imageUrl}" alt="Bukti Transfer" style="width: 100%; height: auto; display: block; object-fit: contain; border-radius: 10px;" />
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#B8860B',
        cancelButtonColor: '#161412',
        confirmButtonText: 'Buka Ukuran Penuh',
        cancelButtonText: 'Tutup',
        showDenyButton: true,
        denyButtonText: 'Ganti / Unggah Foto',
        denyButtonColor: '#4A443C'
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(imageUrl, '_blank');
        } else if (result.isDenied) {
          triggerReceiptUploadForOrder(ord.id);
        }
      });
    } else {
      Swal.fire({
        title: 'Foto Bukti Transfer QRIS',
        html: `
          <div style="text-align: left; font-size: 0.88rem; line-height: 1.5; color: #333;">
            <p style="margin-bottom: 0.5rem;">Nama Berkas: <strong>${ord.receipt_name || 'Bukti Transfer'}</strong></p>
            <p style="color: #666; font-size: 0.82rem; margin-bottom: 0.85rem;">
              Foto bukti transfer ini dilampirkan oleh pemesan (<strong>${ord.couple_name}</strong>) saat konfirmasi pesanan melalui WhatsApp.
            </p>
            <div style="padding: 0.85rem; background: #F8F7F4; border-radius: 10px; border: 1px solid #E6E2D8; font-size: 0.82rem; color: #555;">
              <p style="margin: 0;">
                Anda dapat melihat foto bukti langsung di pesan WhatsApp pemesan, atau mengunggah fotonya sekarang ke kartu pesanan ini agar tersimpan dan dapat dibuka kapan saja.
              </p>
            </div>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#25D366',
        confirmButtonText: 'Chat Pemesan di WA',
        denyButtonColor: '#B8860B',
        denyButtonText: 'Unggah Foto Bukti Sekarang',
        cancelButtonText: 'Tutup',
        cancelButtonColor: '#161412'
      }).then((result) => {
        if (result.isConfirmed) {
          const phone = (ord.customer_phone || '').replace(/\D/g, '');
          if (phone) {
            window.open(
              `https://wa.me/${phone}?text=${encodeURIComponent(
                `Halo ${ord.couple_name}, saya admin Digitalisasi.id ingin menanyakan foto bukti transfer ${
                  ord.receipt_name || 'pembayaran'
                }.`
              )}`,
              '_blank'
            );
          } else {
            Swal.fire('Info', 'Nomor telepon pemesan tidak tersedia.', 'info');
          }
        } else if (result.isDenied) {
          triggerReceiptUploadForOrder(ord.id);
        }
      });
    }
  };

  const triggerReceiptUploadForOrder = (orderId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      Swal.fire({
        title: 'Mengunggah Foto Bukti...',
        text: 'Sedang menyimpan bukti transfer ke sistem...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const previewDataUrl = await compressDevImage(file, 640, 0.65);
        const downloadUrl = previewDataUrl || '';

        await setDoc(
          doc(db, 'orders', orderId),
          {
            receipt_url: downloadUrl,
            receipt_preview: previewDataUrl,
            receipt_name: file.name,
            has_receipt: true
          },
          { merge: true }
        );

        setOrders((prev) => {
          const updated = prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  receipt_url: downloadUrl,
                  receipt_preview: previewDataUrl,
                  receipt_name: file.name,
                  has_receipt: true
                }
              : o
          );
          try {
            localStorage.setItem('digitalisasi_orders', JSON.stringify(updated));
          } catch (err) {}
          return updated;
        });

        Swal.fire({
          title: 'Berhasil Disimpan!',
          text: 'Foto bukti transfer berhasil disimpan ke sistem.',
          icon: 'success',
          confirmButtonColor: '#B8860B'
        });
      } catch (err) {
        console.error('Gagal mengunggah:', err);
        Swal.fire(
          'Gagal Mengunggah',
          'Terjadi kesalahan saat mengunggah foto. Silakan coba lagi.',
          'error'
        );
      }
    };
    input.click();
  };

  const handleDeleteOrder = async (orderId) => {
    const res = await Swal.fire({
      title: 'Hapus Pesanan?',
      text: 'Data pesanan ini akan dihapus dari antrean pengelola.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (res.isConfirmed) {
      setOrders((prev) => {
        const filtered = prev.filter((o) => o.id !== orderId);
        try {
          localStorage.setItem(
            'digitalisasi_orders',
            JSON.stringify(filtered.filter((o) => o.id !== 'ord-sample-01'))
          );
        } catch (e) {}
        return filtered;
      });

      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('digitalisasi_orders_channel');
          bc.postMessage({ type: 'ORDER_DELETED', orderId });
          bc.close();
        }
      } catch (bcErr) {}

      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (err) {
        console.warn('Firestore delete notice:', err);
      }

      Swal.fire({
        title: 'Dihapus',
        text: 'Pesanan telah dihapus dari antrean.',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });
    }
  };

  const handleConvertOrderToInvitation = (order) => {
    let bride = order.wanita_panggilan || '';
    let groom = order.pria_panggilan || '';
    if (!bride && !groom && order.couple_name) {
      const parts = order.couple_name.split(/&|dan|\+/i);
      if (parts.length >= 2) {
        bride = parts[0].trim();
        groom = parts[1].trim();
      } else {
        bride = order.couple_name.trim();
        groom = 'Pasangan';
      }
    }
    bride = bride || 'Mempelai Wanita';
    groom = groom || 'Mempelai Pria';

    const baseSlug = (order.slug || `${bride}-${groom}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = baseSlug || `wedding-${Date.now().toString().slice(-4)}`;

    let formattedDate = '';
    if (order.event_date) {
      try {
        const d = new Date(order.event_date);
        formattedDate = d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        formattedDate = order.event_date;
      }
    }

    const initial = getInitialFormData();
    const newInvitationData = {
      ...initial,
      id: slug,
      wanita_panggilan: bride,
      wanita_lengkap: order.wanita_lengkap || bride,
      wanita_ortu: order.wanita_ortu || '',
      wanita_ig: order.wanita_ig || '',

      pria_panggilan: groom,
      pria_lengkap: order.pria_lengkap || groom,
      pria_ortu: order.pria_ortu || '',
      pria_ig: order.pria_ig || '',

      quote_text: order.kutipan_doa || initial.quote_text || '',
      quote_teks:
        order.kutipan_doa || initial.quote_teks || initial.quote_text || '',
      lokasi_akad: order.event_location || initial.lokasi_akad || '',
      lokasi_resepsi: order.event_location || initial.lokasi_resepsi || '',
      judul_lagu: order.song_title || initial.judul_lagu || 'Payung Teduh - Akad',
      penyanyi_lagu: order.song_artist || initial.penyanyi_lagu || 'Payung Teduh',
      musik_url:
        order.song_url || initial.musik_url || '/assets/wedding_song.mp3',
      musik_tipe: order.song_url
        ? getYouTubeId(order.song_url)
          ? 'youtube'
          : 'upload'
        : initial.musik_tipe || 'preset',

      tanggal_cover: formattedDate || initial.tanggal_cover || '',
      tanggal_akad: order.event_date
        ? `${order.event_date}T08:00:00`
        : initial.tanggal_akad,
      tanggal_lengkap_akad: formattedDate || initial.tanggal_lengkap_akad || '',
      tanggal_resepsi: order.event_date
        ? `${order.event_date}T11:00:00`
        : initial.tanggal_resepsi,
      tanggal_lengkap_resepsi:
        formattedDate || initial.tanggal_lengkap_resepsi || '',
      penerima_kado: `${bride} (${order.customer_phone || ''})`,
      paket_pesanan: order.package_name || 'Paket Gold Imperial'
    };

    if (order.package_name?.includes('Silver')) {
      newInvitationData.fitur_tirai = false;
      newInvitationData.fitur_rsvp = false;
      newInvitationData.fitur_musik = false;
    } else if (
      order.package_name?.includes('Royal') ||
      order.package_name?.includes('Platinum')
    ) {
      newInvitationData.fitur_tirai = true;
      newInvitationData.fitur_rsvp = true;
      newInvitationData.fitur_musik = true;
      newInvitationData.fitur_custom_domain = true;
    } else {
      newInvitationData.fitur_tirai = true;
      newInvitationData.fitur_rsvp = true;
      newInvitationData.fitur_musik = true;
    }

    setFormData(newInvitationData);
    setCurrentView('edit');
    setActiveEditorTab('profile');

    if (order.id && (order.status === 'pending' || !order.status)) {
      handleUpdateOrderStatus(order.id, 'processing');
    }

    Swal.fire({
      title: 'Draf Undangan Siap!',
      text: `Data pesanan ${bride} & ${groom} (${order.package_name}) telah diterapkan ke formulir. Silakan tinjau dan klik Simpan.`,
      icon: 'success',
      confirmButtonColor: '#B8860B'
    });
  };

  const handleApplyPackagePreset = (presetType) => {
    if (presetType === 'Silver') {
      setFormData((prev) => ({
        ...prev,
        paket_pesanan: 'Paket Silver',
        fitur_tirai: false,
        fitur_rsvp: false,
        fitur_musik: false,
        fitur_love_story: false
      }));
      Swal.fire({
        title: 'Preset Silver Diterapkan',
        text: 'Pengaturan disesuaikan dengan Paket Silver (tanpa tirai & RSVP).',
        icon: 'info',
        timer: 1400,
        showConfirmButton: false
      });
    } else if (presetType === 'Gold') {
      setFormData((prev) => ({
        ...prev,
        paket_pesanan: 'Paket Gold Imperial',
        fitur_tirai: true,
        fitur_rsvp: true,
        fitur_musik: true,
        fitur_love_story: true
      }));
      Swal.fire({
        title: 'Preset Gold Imperial Diterapkan',
        text: 'Seluruh modul unggulan (Tirai, RSVP, Musik, Kisah Cinta) aktif.',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });
    } else if (presetType === 'Platinum') {
      setFormData((prev) => ({
        ...prev,
        paket_pesanan: 'Paket Royal Platinum',
        fitur_tirai: true,
        fitur_rsvp: true,
        fitur_musik: true,
        fitur_love_story: true,
        fitur_custom_domain: true
      }));
      Swal.fire({
        title: 'Preset Royal Platinum Diterapkan',
        text: 'Seluruh fitur tanpa batasan & prioritas kustomisasi aktif.',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });
    }
  };

  const handleSmartChatParse = () => {
    if (!rawChatText.trim()) return;

    const text = rawChatText;
    let bride = '';
    let groom = '';
    let brideParents = '';
    let groomParents = '';
    let dateStr = '';
    let venueStr = '';
    let bankAcc = '';

    const brideMatch = text.match(
      /(?:mempelai wanita|wanita|bride|nama wanita)\s*[:=-]\s*([^\n\r]+)/i
    );
    const groomMatch = text.match(
      /(?:mempelai pria|pria|groom|nama pria)\s*[:=-]\s*([^\n\r]+)/i
    );
    const brideParentsMatch = text.match(
      /(?:orang tua wanita|ortu wanita|keluarga wanita)\s*[:=-]\s*([^\n\r]+)/i
    );
    const groomParentsMatch = text.match(
      /(?:orang tua pria|ortu pria|keluarga pria)\s*[:=-]\s*([^\n\r]+)/i
    );
    const dateMatch = text.match(
      /(?:tanggal|tgl|hari|waktu acara)\s*[:=-]\s*([^\n\r]+)/i
    );
    const venueMatch = text.match(
      /(?:lokasi|tempat|venue|gedung|alamat)\s*[:=-]\s*([^\n\r]+)/i
    );
    const bankMatch = text.match(
      /(?:rekening|norek|no rek|bank)\s*[:=-]\s*([^\n\r]+)/i
    );

    if (brideMatch) bride = brideMatch[1].trim();
    if (groomMatch) groom = groomMatch[1].trim();
    if (brideParentsMatch) brideParents = brideParentsMatch[1].trim();
    if (groomParentsMatch) groomParents = groomParentsMatch[1].trim();
    if (dateMatch) dateStr = dateMatch[1].trim();
    if (venueMatch) venueStr = venueMatch[1].trim();
    if (bankMatch) bankAcc = bankMatch[1].trim();

    const updates = {};
    if (bride) {
      updates.wanita_lengkap = bride;
      updates.wanita_panggilan = bride.split(' ')[0];
    }
    if (groom) {
      updates.pria_lengkap = groom;
      updates.pria_panggilan = groom.split(' ')[0];
    }
    if (bride && groom && (!formData.id || formData.id === 'baru')) {
      updates.id = `${updates.wanita_panggilan || bride}-${
        updates.pria_panggilan || groom
      }`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
    }
    if (brideParents) updates.wanita_ortu = brideParents;
    if (groomParents) updates.pria_ortu = groomParents;
    if (dateStr) {
      updates.tanggal_cover = dateStr;
      updates.tanggal_lengkap_akad = dateStr;
      updates.tanggal_lengkap_resepsi = dateStr;
    }
    if (venueStr) {
      updates.lokasi_akad = venueStr;
      updates.lokasi_resepsi = venueStr;
      updates.alamat_baris1 = venueStr;
    }
    if (bankAcc) {
      updates.rekening_wanita = bankAcc;
    }

    setFormData((prev) => ({ ...prev, ...updates }));
    setIsSmartParserOpen(false);
    setRawChatText('');

    Swal.fire({
      title: 'Data Berhasil Diekstrak!',
      text: 'Teks dari chat WhatsApp berhasil dipetakan ke kolom formulir.',
      icon: 'success',
      confirmButtonColor: '#B8860B'
    });
  };

  const loadCoupleMonitorData = (coupleId) => {
    if (monitorUnsubRef.current.rsvp) monitorUnsubRef.current.rsvp();
    if (monitorUnsubRef.current.guestbook) monitorUnsubRef.current.guestbook();

    try {
      const rsvpQuery = query(
        collection(db, `invitations/${coupleId}/rsvp`),
        orderBy('timestamp', 'desc')
      );
      monitorUnsubRef.current.rsvp = onSnapshot(
        rsvpQuery,
        (snapshot) => {
          const rsvps = [];
          snapshot.forEach((d) => rsvps.push({ id: d.id, ...d.data() }));
          setRsvpList(rsvps);
        },
        (err) => {
          console.warn('Realtime RSVP notice:', err);
        }
      );
    } catch (err) {
      console.warn('Error loading RSVP monitor:', err);
    }

    try {
      const gbQuery = query(
        collection(db, `invitations/${coupleId}/guestbook`),
        orderBy('timestamp', 'desc')
      );
      monitorUnsubRef.current.guestbook = onSnapshot(
        gbQuery,
        (snapshot) => {
          const gbs = [];
          snapshot.forEach((d) => gbs.push({ id: d.id, ...d.data() }));
          setGuestbookList(gbs);
        },
        (err) => {
          console.warn('Realtime Guestbook notice:', err);
        }
      );
    } catch (err) {
      console.warn('Error loading Guestbook monitor:', err);
    }
  };

  const handleCreateNew = () => {
    setFormData(getInitialFormData());
    setCurrentView('edit');
    setActiveEditorTab('profile');
  };

  const handleEdit = (couple) => {
    const initial = getInitialFormData();
    const quoteVal =
      couple.quote_text || couple.quote_teks || initial.quote_text || '';
    setFormData({
      ...initial,
      ...couple,
      quote_text: quoteVal,
      quote_teks: quoteVal
    });
    setCurrentView('edit');
    setActiveEditorTab('profile');
    loadCoupleMonitorData(couple.id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Undangan?',
      text: `Undangan dengan nama tautan "${id}" akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#5A5248',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'couples', id));
        Swal.fire({
          title: 'Berhasil Dihapus',
          text: 'Data undangan telah dihapus dari sistem.',
          icon: 'success',
          confirmButtonColor: '#B8860B'
        });
        fetchCouples();
      } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalVal,
      ...(name === 'quote_text' ? { quote_teks: finalVal } : {}),
      ...(name === 'quote_teks' ? { quote_text: finalVal } : {})
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const compressed = await compressDevImage(file, 900, 0.72);
      setFormData((prev) => ({ ...prev, [fieldName]: compressed }));
      Swal.fire({
        title: 'Foto Berhasil Disimpan',
        text: 'File foto berhasil diproses dan disimpan ke draf undangan.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (err) {
      console.warn('File read fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField('custom_audio');
    try {
      const storageRef = ref(
        storage,
        `couples/${formData.id || 'general'}/audio_${Date.now()}_${file.name}`
      );
      const uploadRes = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadRes.ref);

      const inferredTitle = file.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        musik_url: downloadUrl,
        musik_tipe: 'upload',
        judul_lagu: prev.judul_lagu || inferredTitle
      }));

      Swal.fire({
        title: 'Berkas Lagu Berhasil Diunggah',
        text: `Audio "${file.name}" berhasil disimpan untuk undangan ini.`,
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (err) {
      console.warn('Audio storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        const inferredTitle = file.name.replace(/\.[^/.]+$/, '');
        setFormData((prev) => ({
          ...prev,
          musik_url: reader.result,
          musik_tipe: 'upload',
          judul_lagu: prev.judul_lagu || inferredTitle
        }));
        Swal.fire({
          title: 'Audio Tersimpan Sementara',
          text: 'Berkas audio dimuat secara lokal (Base64).',
          icon: 'info',
          confirmButtonColor: '#B8860B'
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSelectPresetSong = (preset) => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      setTestAudioPlaying(false);
    }
    setFormData((prev) => ({
      ...prev,
      musik_url: preset.url,
      musik_tipe: preset.type,
      judul_lagu: preset.title,
      penyanyi_lagu: preset.artist
    }));
    Swal.fire({
      title: 'Lagu Diterapkan',
      text: `Lagu "${preset.title}" siap digunakan.`,
      icon: 'success',
      timer: 1300,
      showConfirmButton: false
    });
  };

  const handleToggleTestAudio = () => {
    if (testAudioPlaying) {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      setTestAudioPlaying(false);
    } else {
      const ytId = getYouTubeId(formData.musik_url);
      if (ytId) {
        setTestAudioPlaying(true);
      } else {
        const audioSrc = formData.musik_url || '/assets/wedding_song.mp3';
        if (!testAudioRef.current) {
          testAudioRef.current = new Audio(audioSrc);
          testAudioRef.current.onended = () => setTestAudioPlaying(false);
          testAudioRef.current.onerror = () => {
            setTestAudioPlaying(false);
            Swal.fire(
              'Gagal Memutar Audio',
              'Berkas audio tidak dapat diakses atau format tidak didukung browser.',
              'error'
            );
          };
        } else {
          testAudioRef.current.src = audioSrc;
        }
        testAudioRef.current
          .play()
          .then(() => setTestAudioPlaying(true))
          .catch((err) => {
            console.warn('Audio play error:', err);
            setTestAudioPlaying(false);
          });
      }
    }
  };

  const fetchAndUpdateYouTubeInfo = async (url) => {
    const ytId = getYouTubeId(url);
    if (!ytId) return;

    setIsFetchingYtMeta(true);
    try {
      const meta = await fetchYouTubeMetadata(url);
      if (meta && meta.displayTitle) {
        setFormData((prev) => ({
          ...prev,
          judul_lagu: meta.displayTitle,
          penyanyi_lagu: meta.artist || prev.penyanyi_lagu || ''
        }));

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Info Lagu Otomatis Diperbarui!',
          text: `${meta.displayTitle}`,
          showConfirmButton: false,
          timer: 2400
        });
      }
    } catch (err) {
      console.warn('Error fetching YouTube info:', err);
    } finally {
      setIsFetchingYtMeta(false);
    }
  };

  const handleYouTubeUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, musik_url: url }));

    const ytId = getYouTubeId(url);
    if (ytId) {
      fetchAndUpdateYouTubeInfo(url);
    }
  };

  const handleYouTubeUrlPaste = (e) => {
    const pasted = e.clipboardData?.getData('text') || '';
    if (getYouTubeId(pasted)) {
      setTimeout(() => {
        fetchAndUpdateYouTubeInfo(pasted);
      }, 100);
    }
  };

  const handleStoryFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `story_${index}`;
    setUploadingField(uploadKey);
    try {
      const storageRef = ref(
        storage,
        `couples/${formData.id || 'temp'}/story_${index}_${Date.now()}_${file.name}`
      );
      const uploadRes = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadRes.ref);
      handleUpdateStory(index, 'foto', downloadUrl);
      Swal.fire({
        title: 'Foto Fase Cerita Berhasil Diunggah',
        text: 'File gambar telah tersimpan dengan aman.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (err) {
      console.warn('Firebase Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        handleUpdateStory(index, 'foto', reader.result);
        Swal.fire({
          title: 'Foto Tersimpan Sementara',
          text: 'Gambar ditampilkan sebagai pratinjau data lokal.',
          icon: 'info',
          confirmButtonColor: '#B8860B'
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  const handleGalleryFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `gallery_${index}`;
    setUploadingField(uploadKey);
    try {
      const storageRef = ref(
        storage,
        `couples/${formData.id || 'temp'}/gallery_${index}_${Date.now()}_${file.name}`
      );
      const uploadRes = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadRes.ref);
      handleUpdateGalleryPhoto(index, 'src', downloadUrl);
      Swal.fire({
        title: 'Foto Galeri Berhasil Diunggah',
        text: 'File gambar telah tersimpan dengan aman ke Firebase Storage.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (err) {
      console.warn('Firebase Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        handleUpdateGalleryPhoto(index, 'src', reader.result);
        Swal.fire({
          title: 'Foto Tersimpan Sementara',
          text: 'Gambar ditampilkan sebagai pratinjau data lokal.',
          icon: 'info',
          confirmButtonColor: '#B8860B'
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.id.trim()) {
      Swal.fire({
        title: 'Nama Tautan Diperlukan',
        text: 'Harap masukkan nama tautan undangan (contoh: nadia-agus).',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    setIsSaving(true);
    try {
      const coupleRef = doc(db, 'couples', formData.id.trim().toLowerCase());

      const sanitizeFirestoreData = (val) => {
        if (val === undefined || val === null) return '';
        if (Array.isArray(val)) {
          return val
            .filter((item) => item !== undefined && item !== null)
            .map((item) =>
              typeof item === 'object' && !(item instanceof Date)
                ? sanitizeFirestoreData(item)
                : item
            );
        }
        if (val instanceof Date) return val;
        if (typeof val === 'object') {
          const cleanObj = {};
          for (const [k, v] of Object.entries(val)) {
            if (v !== undefined && v !== null) {
              cleanObj[k] = sanitizeFirestoreData(v);
            } else {
              cleanObj[k] = '';
            }
          }
          return cleanObj;
        }
        return val;
      };

      const quoteVal = formData.quote_text || formData.quote_teks || '';
      const payload = sanitizeFirestoreData({
        ...formData,
        quote_text: quoteVal,
        quote_teks: quoteVal,
        id: formData.id.trim().toLowerCase(),
        updated_at: new Date()
      });

      await setDoc(coupleRef, payload, { merge: true });

      Swal.fire({
        title: 'Perubahan Tersimpan',
        text: 'Seluruh data undangan telah berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
      fetchCouples();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal Menyimpan', err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStory = () => {
    setFormData((prev) => ({
      ...prev,
      love_story: [
        ...(prev.love_story || []),
        {
          year: '2026',
          title: 'Momen Baru',
          desc: 'Deskripsi singkat fase perjalanan cinta.',
          foto: '/assets/foto1.jpg'
        }
      ]
    }));
  };

  const handleUpdateStory = (idx, key, val) => {
    setFormData((prev) => {
      const list = [...(prev.love_story || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...prev, love_story: list };
    });
  };

  const handleRemoveStory = (idx) => {
    setFormData((prev) => ({
      ...prev,
      love_story: (prev.love_story || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddGalleryPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      foto_galeri: [
        ...(prev.foto_galeri || []),
        { src: '/assets/foto1.jpg', caption: 'Momen Indah' }
      ]
    }));
  };

  const handleUpdateGalleryPhoto = (idx, key, val) => {
    setFormData((prev) => {
      const list = [...(prev.foto_galeri || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...prev, foto_galeri: list };
    });
  };

  const handleRemoveGalleryPhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      foto_galeri: (prev.foto_galeri || []).filter((_, i) => i !== idx)
    }));
  };

  const exportRsvpToExcel = () => {
    const wsData = rsvpList.map((item, idx) => ({
      No: idx + 1,
      'Nama Tamu': item.name || '',
      'Status Kehadiran': item.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir',
      'Jumlah Orang': item.guest_count || (item.hadir === 'hadir' ? 1 : 0),
      'Waktu Pengisian': item.timestamp
        ? new Date(item.timestamp.toDate()).toLocaleString('id-ID')
        : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Kehadiran');
    XLSX.writeFile(wb, `Data_Kehadiran_${formData.id || 'undangan'}.xlsx`);
  };

  const exportGuestbookToExcel = () => {
    const wsData = guestbookList.map((item, idx) => ({
      No: idx + 1,
      'Nama Pengirim': item.name || '',
      'Untaian Doa & Pesan': item.message || '',
      'Waktu Pengiriman': item.timestamp
        ? new Date(item.timestamp.toDate()).toLocaleString('id-ID')
        : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Buku Tamu');
    XLSX.writeFile(wb, `Data_Doa_Tamu_${formData.id || 'undangan'}.xlsx`);
  };

  const handleGenerateLinks = () => {
    if (!rawGuestList.trim()) return;
    const lines = rawGuestList.split('\n').filter((l) => l.trim().length > 0);
    const origin = window.location.origin;
    const coupleId = selectedCoupleForLinks?.id || formData.id || 'demo';

    const links = lines.map((line) => {
      const parts = line.split(',');
      const name = parts[0].trim();
      const phone = parts[1] ? parts[1].trim().replace(/\D/g, '') : '';
      const encodedName = encodeURIComponent(name);
      const inviteUrl = `${origin}/?id=${coupleId}&to=${encodedName}`;

      let waMessage = waTemplate
        .replace(/{nama_tamu}/g, name)
        .replace(/{link}/g, inviteUrl);

      const encodedMessage = encodeURIComponent(waMessage);
      const waUrl = phone
        ? `https://wa.me/${phone}?text=${encodedMessage}`
        : `https://wa.me/?text=${encodedMessage}`;

      return { name, phone, inviteUrl, waUrl };
    });

    setGeneratedLinks(links);
  };

  const totalRsvp = rsvpList.length;
  const totalHadir = rsvpList.filter((r) => r.hadir === 'hadir').length;
  const totalTidakHadir = rsvpList.filter((r) => r.hadir === 'tidak').length;
  const totalPax = rsvpList
    .filter((r) => r.hadir === 'hadir')
    .reduce((acc, curr) => acc + (parseInt(curr.guest_count, 10) || 1), 0);

  const pendingOrdersCount = orders.filter(
    (o) =>
      o.status === 'pending' ||
      o.status === 'menunggu_pembayaran' ||
      o.status === 'menunggu' ||
      !o.status
  ).length;

  // Login Screen
  if (!user) {
    return (
      <div className="dev-login-container">
        <div className="dev-login-card">
          <div className="dev-login-header">
            <h2>Masuk ke Panel Pengelola</h2>
            <p>Kelola data mempelai, jadwal acara, dan pantau konfirmasi tamu undangan.</p>
          </div>

          <form onSubmit={handleLogin} className="dev-login-form">
            <div className="dev-input-group">
              <label>Alamat Email Pengelola</label>
              <input
                type="email"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Kata Sandi</label>
              <input
                type="password"
                placeholder="Masukkan kata sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="dev-field"
              />
            </div>

            <button
              type="submit"
              className="dev-btn-primary dev-btn-block"
              disabled={isLoggingIn}
            >
              <SignIn size={18} weight="bold" />
              <span>{isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Panel'}</span>
            </button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '1rem 0'
                }}
              >
                <span
                  style={{ flex: 1, height: '1px', background: 'var(--dev-border)' }}
                ></span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--dev-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Mode Pengembang
                </span>
                <span
                  style={{ flex: 1, height: '1px', background: 'var(--dev-border)' }}
                ></span>
              </div>
              <button
                type="button"
                onClick={handleDevBypassLogin}
                className="dev-btn-secondary dev-btn-block"
                style={{ justifyContent: 'center' }}
              >
                <Lightning
                  size={16}
                  weight="fill"
                  style={{ color: 'var(--dev-gold)' }}
                />
                <span>Masuk Cepat Pengembang (Dev Mode)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-layout">
      {/* Mobile Top Header (Clean single bar) */}
      <header className="dev-mobile-header">
        <div className="dev-mobile-header-brand">
          <div className="dev-brand-icon-box sm">
            <FlowerLotus size={18} weight="fill" />
          </div>
          <div className="dev-mobile-header-text">
            <h3>Digitalisasi.id</h3>
            <span className="dev-mobile-role-tag">Panel Dev</span>
          </div>
        </div>

        <div className="dev-mobile-header-actions">
          {pendingOrdersCount > 0 && (
            <button
              type="button"
              className="dev-mobile-badge-btn"
              onClick={() => {
                setCurrentView('orders');
                fetchOrders();
              }}
              title="Pesanan Baru Menunggu"
            >
              <ShoppingBag size={18} weight="bold" />
              <span className="dev-badge-count">{pendingOrdersCount}</span>
            </button>
          )}

          <button
            type="button"
            className="dev-mobile-hamburger-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Buka menu panel"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`dev-mobile-backdrop ${mobileSidebarOpen ? 'is-open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden={!mobileSidebarOpen}
      />

      {/* Sidebar (Desktop Fixed & Mobile Slide Drawer) */}
      <aside className={`dev-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        <div className="dev-sidebar-brand">
          <div className="dev-brand-icon-box">
            <FlowerLotus size={22} weight="fill" />
          </div>
          <div className="dev-brand-text">
            <h3>Digitalisasi.id</h3>
            <span>Panel Pengelola</span>
          </div>
          <button
            type="button"
            className="dev-sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup menu navigasi"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <nav className="dev-sidebar-nav" aria-label="Menu Utama">
          <button
            type="button"
            className={`dev-nav-item ${
              currentView === 'orders' ? 'is-active' : ''
            }`}
            onClick={() => {
              setCurrentView('orders');
              fetchOrders();
              setMobileSidebarOpen(false);
            }}
          >
            <ShoppingBag size={19} weight="duotone" />
            <span>Pesanan Masuk</span>
            {pendingOrdersCount > 0 && (
              <span className="dev-orders-badge-pill">{pendingOrdersCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`dev-nav-item ${
              currentView === 'list' ? 'is-active' : ''
            }`}
            onClick={() => {
              setCurrentView('list');
              setMobileSidebarOpen(false);
            }}
          >
            <ImagesSquare size={19} weight="duotone" />
            <span>Daftar Undangan</span>
            <span className="dev-sidebar-count-badge">({couples.length})</span>
          </button>

          <button
            type="button"
            className={`dev-nav-item ${
              currentView === 'blast' ? 'is-active' : ''
            }`}
            onClick={() => {
              setCurrentView('blast');
              setSelectedCoupleForLinks(couples[0] || null);
              setMobileSidebarOpen(false);
            }}
          >
            <PaperPlaneRight size={19} weight="duotone" />
            <span>Kirim WhatsApp Massal</span>
          </button>
        </nav>

        {/* Sidebar Quick Sub-Steps when in Editor View */}
        {currentView === 'edit' && (
          <div className="dev-sidebar-editor-tabs">
            <span className="editor-tabs-label">
              BAGIAN PENGATURAN ({formData.id || 'BARU'})
            </span>
            {[
              { id: 'profile', label: 'Profil Mempelai', icon: UserList },
              { id: 'events', label: 'Jadwal Acara', icon: CalendarCheck },
              { id: 'photos', label: 'Foto & Media', icon: Camera },
              { id: 'music', label: 'Musik Latar', icon: MusicNotes },
              { id: 'story', label: 'Kisah Cinta', icon: Heart },
              { id: 'gallery', label: 'Galeri', icon: ImagesSquare },
              { id: 'accounts', label: 'Rekening & Hadiah', icon: CreditCard },
              { id: 'preview', label: 'Pratinjau Layar', icon: Eye },
              { id: 'monitor', label: 'Kehadiran & Doa Tamu', icon: ChartLineUp }
            ].map((subTab) => {
              const SubIcon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  type="button"
                  className={`editor-tab-btn ${
                    activeEditorTab === subTab.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveEditorTab(subTab.id);
                    setMobileSidebarOpen(false);
                  }}
                >
                  <SubIcon size={17} weight="duotone" />
                  <span>{subTab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="dev-sidebar-footer">
          <div className="dev-user-info">
            <span className="dev-user-email">{user.email}</span>
            <span className="dev-user-role">Administrator</span>
          </div>
          <button
            type="button"
            className="dev-btn-logout"
            onClick={handleLogout}
            title="Keluar dari panel"
          >
            <SignOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="dev-main">
        {/* Executive Status Topbar */}
        <div className="dev-topbar">
          <div className="dev-topbar-left">
            <span className="dev-status-pill">
              <span className="status-dot"></span>
              Sistem Aktif &amp; Terhubung
            </span>
            <span className="dev-topbar-divider">/</span>
            <span className="dev-topbar-stat">
              {couples.length} Pasangan Terdaftar
            </span>
            {pendingOrdersCount > 0 && (
              <>
                <span className="dev-topbar-divider">/</span>
                <span className="dev-topbar-stat text-gold">
                  {pendingOrdersCount} Pesanan Baru
                </span>
              </>
            )}
          </div>
          <div className="dev-topbar-right">
            <a
              href="/?id=demo"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-btn-preview-link"
            >
              <Eye size={16} />
              <span>Lihat Contoh Undangan Demo</span>
            </a>
          </div>
        </div>

        {/* View 1: Antrean Pesanan Masuk */}
        {currentView === 'orders' && (
          <DevOrdersView
            orders={orders}
            loadingOrders={loadingOrders}
            fetchOrders={fetchOrders}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleViewReceipt={handleViewReceipt}
            handleConvertOrderToInvitation={handleConvertOrderToInvitation}
            handleDeleteOrder={handleDeleteOrder}
            isRulesRestricted={isRulesRestricted}
            showRulesGuide={showRulesGuide}
          />
        )}

        {/* View 2: Daftar Undangan Pasangan */}
        {currentView === 'list' && (
          <DevCouplesList
            couples={couples}
            loadingData={loadingData}
            handleCreateNew={handleCreateNew}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* View 3: Editor Pengaturan Undangan (9 Sub-tabs) */}
        {currentView === 'edit' && (
          <DevEditorView
            formData={formData}
            handleFormChange={handleFormChange}
            handleSave={handleSave}
            isSaving={isSaving}
            activeEditorTab={activeEditorTab}
            setActiveEditorTab={setActiveEditorTab}
            setCurrentView={setCurrentView}
            handleApplyPackagePreset={handleApplyPackagePreset}
            setIsSmartParserOpen={setIsSmartParserOpen}
            handleFileUpload={handleFileUpload}
            uploadingField={uploadingField}
            PRESET_SONGS={PRESET_SONGS}
            handleSelectPresetSong={handleSelectPresetSong}
            handleToggleTestAudio={handleToggleTestAudio}
            testAudioPlaying={testAudioPlaying}
            isFetchingYtMeta={isFetchingYtMeta}
            handleYouTubeUrlChange={handleYouTubeUrlChange}
            handleYouTubeUrlPaste={handleYouTubeUrlPaste}
            handleAudioUpload={handleAudioUpload}
            handleAddStory={handleAddStory}
            handleUpdateStory={handleUpdateStory}
            handleRemoveStory={handleRemoveStory}
            handleStoryFileUpload={handleStoryFileUpload}
            handleAddGalleryPhoto={handleAddGalleryPhoto}
            handleUpdateGalleryPhoto={handleUpdateGalleryPhoto}
            handleRemoveGalleryPhoto={handleRemoveGalleryPhoto}
            handleGalleryFileUpload={handleGalleryFileUpload}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
            testGuestName={testGuestName}
            setTestGuestName={setTestGuestName}
            rsvpList={rsvpList}
            guestbookList={guestbookList}
            rsvpFilter={rsvpFilter}
            setRsvpFilter={setRsvpFilter}
            searchRsvp={searchRsvp}
            setSearchRsvp={setSearchRsvp}
            exportRsvpToExcel={exportRsvpToExcel}
            exportGuestbookToExcel={exportGuestbookToExcel}
            totalRsvp={totalRsvp}
            totalHadir={totalHadir}
            totalTidakHadir={totalTidakHadir}
            totalPax={totalPax}
          />
        )}

        {/* View 4: WhatsApp Blast & Generator Link */}
        {currentView === 'blast' && (
          <DevBlastView
            couples={couples}
            selectedCoupleForLinks={selectedCoupleForLinks}
            setSelectedCoupleForLinks={setSelectedCoupleForLinks}
            rawGuestList={rawGuestList}
            setRawGuestList={setRawGuestList}
            waTemplate={waTemplate}
            setWaTemplate={setWaTemplate}
            generatedLinks={generatedLinks}
            handleGenerateLinks={handleGenerateLinks}
          />
        )}

        {/* Modal Smart Chat Parser */}
        <DevSmartParserModal
          isOpen={isSmartParserOpen}
          onClose={() => setIsSmartParserOpen(false)}
          rawChatText={rawChatText}
          setRawChatText={setRawChatText}
          onParse={handleSmartChatParse}
        />
      </main>

      {/* Mobile Fixed Ergonomic Bottom Navigation Bar */}
      <nav className="dev-mobile-bottom-nav" aria-label="Navigasi Bawah">
        <button
          type="button"
          className={`dev-bottom-nav-item ${
            currentView === 'orders' ? 'is-active' : ''
          }`}
          onClick={() => {
            setCurrentView('orders');
            fetchOrders();
          }}
        >
          <div className="dev-bottom-nav-icon-wrap">
            <ShoppingBag
              size={20}
              weight={currentView === 'orders' ? 'fill' : 'duotone'}
            />
            {pendingOrdersCount > 0 && (
              <span className="dev-bottom-nav-badge">{pendingOrdersCount}</span>
            )}
          </div>
          <span>Pesanan</span>
        </button>

        <button
          type="button"
          className={`dev-bottom-nav-item ${
            currentView === 'list' ? 'is-active' : ''
          }`}
          onClick={() => setCurrentView('list')}
        >
          <ImagesSquare
            size={20}
            weight={currentView === 'list' ? 'fill' : 'duotone'}
          />
          <span>Undangan</span>
        </button>

        <button
          type="button"
          className={`dev-bottom-nav-item ${
            currentView === 'edit' ? 'is-active' : ''
          }`}
          onClick={() => setCurrentView('edit')}
        >
          <PencilSimple
            size={20}
            weight={currentView === 'edit' ? 'fill' : 'duotone'}
          />
          <span>Editor</span>
        </button>

        <button
          type="button"
          className={`dev-bottom-nav-item ${
            currentView === 'blast' ? 'is-active' : ''
          }`}
          onClick={() => {
            setCurrentView('blast');
            setSelectedCoupleForLinks(couples[0] || null);
          }}
        >
          <PaperPlaneRight
            size={20}
            weight={currentView === 'blast' ? 'fill' : 'duotone'}
          />
          <span>Blast WA</span>
        </button>
      </nav>
    </div>
  );
}
