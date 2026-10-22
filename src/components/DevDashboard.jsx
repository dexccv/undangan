import React, { useState, useEffect } from 'react';
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
  orderBy
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
  Trash,
  PencilSimple,
  Plus,
  Export,
  Copy,
  Check,
  SignOut,
  SignIn,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  ArrowLeft,
  CheckCircle,
  XCircle,
  LinkSimple,
  ShoppingBag,
  Sparkle,
  WhatsappLogo,
  CalendarBlank,
  ChatCircleText,
  FileArrowDown,
  Lightning,
  Funnel,
  Clock,
  ArrowRight,
  X,
  FileText,
  ChatTeardropText,
  FlowerLotus,
  MusicNotes,
  List
} from '@phosphor-icons/react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import './DevDashboard.css';

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [couples, setCouples] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active view: 'list', 'edit', 'blast', 'orders'
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCouples();
        fetchOrders();
      } else {
        setLoadingData(false);
        setLoadingOrders(false);
      }
    });
    return () => unsubscribe();
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

      quote_text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
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

      alamat_kado: 'Jl. Melati No. 12, RT 03/RW 04, Kebayoran Baru, Jakarta Selatan',
      penerima_kado: 'Nadia Salsabila (081234567890)',

      love_story: [
        { year: '2020', title: 'Awal Pertemuan', desc: 'Di sebuah kesempatan yang tak disengaja, takdir mempertemukan kami berdua.', foto: '/assets/foto1.jpg' },
        { year: '2024', title: 'Menjalin Komitmen', desc: 'Suka dan duka kami lalui bersama untuk melangkah ke masa depan.', foto: '/assets/foto2.jpg' },
        { year: '2025', title: 'Hari Pertunangan', desc: 'Dengan restu keluarga, ikatan komitmen resmi kami ikrarkan.', foto: '/assets/foto3.jpg' },
        { year: '2026', title: 'Ikrar Suci Pernikahan', desc: 'Hari bahagia yang dinantikan, mengucap janji suci di hadapan Allah SWT.', foto: '/assets/foto4.jpg' }
      ],

      foto_galeri: [
        { src: '/assets/foto1.jpg', caption: 'Simbol Ikatan Abadi' },
        { src: '/assets/foto2.jpg', caption: 'Langkah Bersama' },
        { src: '/assets/foto3.jpg', caption: 'Keindahan Hari Spesial' },
        { src: '/assets/foto4.jpg', caption: 'Momen Penuh Doa' }
      ]
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
      }
    }

    // Gabungkan dengan localStorage agar pesanan offline/lokal langsung tampil
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('digitalisasi_orders') || '[]');
    } catch (e) {
      console.warn('Failed to parse local orders:', e);
    }

    // Merge tanpa duplikasi
    const combined = [...firestoreOrders];
    for (const loc of localOrders) {
      if (!combined.some((item) => item.id === loc.id || (item.couple_name === loc.couple_name && item.customer_phone === loc.customer_phone))) {
        combined.push(loc);
      }
    }

    // Jika antrean masih kosong, sediakan draf pesanan awal agar developer bisa langsung mencoba fitur
    if (combined.length === 0) {
      const sample = {
        id: 'ord-sample-01',
        package_name: 'Paket Gold Imperial',
        package_price: 'Rp 299.000',
        slug: 'dimas-anisa',
        wanita_panggilan: 'Dimas',
        wanita_lengkap: 'Dimas Salsabila',
        wanita_ortu: 'Bpk. Ahmad Fauzi & Ibu Siti Aminah',
        wanita_ig: '@nadiasalsabila',
        pria_panggilan: 'Anisa',
        pria_lengkap: 'Anisa Pratama',
        pria_ortu: 'Bpk. Hendra Wijaya & Ibu Ratna Dewi',
        pria_ig: '@aguspratama',
        couple_name: 'Dimas & Anisa',
        customer_phone: '081234567890',
        event_date: '2026-11-20',
        event_location: 'Masjid Agung Al-Barkah',
        kutipan_doa: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
        notes: 'Tema modern sage green, minta diprioritaskan bagian galeri foto.',
        status: 'pending',
        created_at: { seconds: Math.floor(Date.now() / 1000) }
      };
      combined.push(sample);
      try {
        localStorage.setItem('digitalisasi_orders', JSON.stringify([sample]));
      } catch (e) {}
    }

    // Sort in memory by created_at desc
    combined.sort((a, b) => {
      const timeA = a.created_at?.seconds || 0;
      const timeB = b.created_at?.seconds || 0;
      return timeB - timeA;
    });

    setOrders(combined);
    setLoadingOrders(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // Update local state & localStorage
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('digitalisasi_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
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
      // Update local state & localStorage
      setOrders((prev) => {
        const filtered = prev.filter((o) => o.id !== orderId);
        try {
          localStorage.setItem('digitalisasi_orders', JSON.stringify(filtered));
        } catch (e) {}
        return filtered;
      });

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

  // Konversi 1-Klik Pesanan ke Draf Undangan
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
    bride = bride || 'Dimas';
    groom = groom || 'Anisa';

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
      wanita_lengkap: order.wanita_lengkap || `${bride} Salsabila`,
      wanita_ortu: order.wanita_ortu || initial.wanita_ortu,
      wanita_ig: order.wanita_ig || initial.wanita_ig,

      pria_panggilan: groom,
      pria_lengkap: order.pria_lengkap || `${groom} Pratama`,
      pria_ortu: order.pria_ortu || initial.pria_ortu,
      pria_ig: order.pria_ig || initial.pria_ig,

      quote_teks: order.kutipan_doa || initial.quote_teks,
      lokasi_akad: order.event_location || initial.lokasi_akad,
      lokasi_resepsi: order.event_location || initial.lokasi_resepsi,
      judul_lagu: order.song_title || initial.judul_lagu || 'Payung Teduh - Akad',

      tanggal_cover: formattedDate || initial.tanggal_cover,
      tanggal_akad: order.event_date ? `${order.event_date}T08:00:00` : initial.tanggal_akad,
      tanggal_lengkap_akad: formattedDate || initial.tanggal_lengkap_akad,
      tanggal_resepsi: order.event_date ? `${order.event_date}T11:00:00` : initial.tanggal_resepsi,
      tanggal_lengkap_resepsi: formattedDate || initial.tanggal_lengkap_resepsi,
      penerima_kado: `${bride} (${order.customer_phone || ''})`,
      paket_pesanan: order.package_name || 'Paket Gold Imperial'
    };

    if (order.package_name?.includes('Silver')) {
      newInvitationData.fitur_tirai = false;
      newInvitationData.fitur_rsvp = false;
      newInvitationData.fitur_musik = false;
    } else if (order.package_name?.includes('Royal') || order.package_name?.includes('Platinum')) {
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

  // 1-Klik Terapkan Preset Paket
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

  // Smart Chat Parser (Ekstrak format teks dari WhatsApp)
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

    const brideMatch = text.match(/(?:mempelai wanita|wanita|bride|nama wanita)\s*[:=-]\s*([^\n\r]+)/i);
    const groomMatch = text.match(/(?:mempelai pria|pria|groom|nama pria)\s*[:=-]\s*([^\n\r]+)/i);
    const brideParentsMatch = text.match(/(?:orang tua wanita|ortu wanita|keluarga wanita)\s*[:=-]\s*([^\n\r]+)/i);
    const groomParentsMatch = text.match(/(?:orang tua pria|ortu pria|keluarga pria)\s*[:=-]\s*([^\n\r]+)/i);
    const dateMatch = text.match(/(?:tanggal|tgl|hari|waktu acara)\s*[:=-]\s*([^\n\r]+)/i);
    const venueMatch = text.match(/(?:lokasi|tempat|venue|gedung|alamat)\s*[:=-]\s*([^\n\r]+)/i);
    const bankMatch = text.match(/(?:rekening|norek|no rek|bank)\s*[:=-]\s*([^\n\r]+)/i);

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
      updates.id = `${updates.wanita_panggilan || bride}-${updates.pria_panggilan || groom}`
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

  const loadCoupleMonitorData = async (coupleId) => {
    try {
      const rsvpSnap = await getDocs(query(collection(db, `invitations/${coupleId}/rsvp`), orderBy('timestamp', 'desc')));
      const rsvps = [];
      rsvpSnap.forEach((d) => rsvps.push({ id: d.id, ...d.data() }));
      setRsvpList(rsvps);

      const gbSnap = await getDocs(query(collection(db, `invitations/${coupleId}/guestbook`), orderBy('timestamp', 'desc')));
      const gbs = [];
      gbSnap.forEach((d) => gbs.push({ id: d.id, ...d.data() }));
      setGuestbookList(gbs);
    } catch (err) {
      console.warn('Error loading monitor data:', err);
    }
  };

  const handleCreateNew = () => {
    setFormData(getInitialFormData());
    setCurrentView('edit');
    setActiveEditorTab('profile');
  };

  const handleEdit = (couple) => {
    setFormData({
      ...getInitialFormData(),
      ...couple
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image file upload handler
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const storageRef = ref(storage, `couples/${formData.id || 'temp'}/${fieldName}_${Date.now()}_${file.name}`);
      const uploadRes = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadRes.ref);
      setFormData((prev) => ({ ...prev, [fieldName]: downloadUrl }));
      Swal.fire({
        title: 'Foto Berhasil Diunggah',
        text: 'File gambar telah tersimpan dengan aman.',
        icon: 'success',
        confirmButtonColor: '#B8860B'
      });
    } catch (err) {
      console.warn('Firebase Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
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

  // Handler upload foto khusus untuk Kisah Cinta (Love Story)
  const handleStoryFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `story_${index}`;
    setUploadingField(uploadKey);
    try {
      const storageRef = ref(storage, `couples/${formData.id || 'temp'}/story_${index}_${Date.now()}_${file.name}`);
      const uploadRes = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadRes.ref);
      handleUpdateStory(index, 'foto', downloadUrl);
      Swal.fire({
        title: 'Foto Momen Berhasil Diunggah',
        text: 'File gambar telah tersimpan dengan aman ke Firebase Storage.',
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

  // Handler upload foto khusus untuk Galeri Prewedding
  const handleGalleryFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `gallery_${index}`;
    setUploadingField(uploadKey);
    try {
      const storageRef = ref(storage, `couples/${formData.id || 'temp'}/gallery_${index}_${Date.now()}_${file.name}`);
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
    e.preventDefault();
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
      await setDoc(coupleRef, {
        ...formData,
        id: formData.id.trim().toLowerCase(),
        updated_at: new Date()
      }, { merge: true });

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

  // Story Milestones Handler
  const handleAddStory = () => {
    setFormData((prev) => ({
      ...prev,
      love_story: [
        ...(prev.love_story || []),
        { year: '2026', title: 'Momen Baru', desc: 'Deskripsi singkat fase perjalanan cinta.', foto: '/assets/foto1.jpg' }
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

  // Gallery Photos Handler
  const handleAddGalleryPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      foto_galeri: [
        ...(prev.foto_galeri || []),
        { src: '/assets/foto1.jpg', caption: 'Momen Indah Prewedding' }
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

  // Export to Excel (Kehadiran)
  const exportRsvpToExcel = () => {
    const wsData = rsvpList.map((item, idx) => ({
      No: idx + 1,
      'Nama Tamu': item.name || '',
      'Status Kehadiran': item.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir',
      'Jumlah Orang': item.guest_count || (item.hadir === 'hadir' ? 1 : 0),
      'Waktu Pengisian': item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString('id-ID') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Kehadiran');
    XLSX.writeFile(wb, `Data_Kehadiran_${formData.id || 'undangan'}.xlsx`);
  };

  // Export to Excel (Buku Tamu & Doa)
  const exportGuestbookToExcel = () => {
    const wsData = guestbookList.map((item, idx) => ({
      No: idx + 1,
      'Nama Pengirim': item.name || '',
      'Untaian Doa & Pesan': item.message || '',
      'Waktu Pengiriman': item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString('id-ID') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Buku Tamu');
    XLSX.writeFile(wb, `Data_Doa_Tamu_${formData.id || 'undangan'}.xlsx`);
  };

  // WhatsApp Link Generator
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
      const waUrl = phone ? `https://wa.me/${phone}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;

      return { name, phone, inviteUrl, waUrl };
    });

    setGeneratedLinks(links);
  };

  // Calculated Stats
  const totalRsvp = rsvpList.length;
  const totalHadir = rsvpList.filter((r) => r.hadir === 'hadir').length;
  const totalTidakHadir = rsvpList.filter((r) => r.hadir === 'tidak').length;
  const totalPax = rsvpList
    .filter((r) => r.hadir === 'hadir')
    .reduce((acc, curr) => acc + (parseInt(curr.guest_count, 10) || 1), 0);

  // Orders Calculations & Filtering
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || !o.status).length;
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return o.status === 'pending' || !o.status;
    return o.status === orderFilter;
  });

  // Login Screen
  if (!user) {
    return (
      <div className="dev-login-container">
        <div className="dev-login-card">
          <div className="dev-login-header">
            <div className="dev-login-pill">
              <FlowerLotus size={16} weight="fill" />
              <span>PANEL PENGELOLA</span>
            </div>
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

            <button type="submit" className="dev-btn-primary dev-btn-block" disabled={isLoggingIn}>
              <SignIn size={18} weight="bold" />
              <span>{isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Panel'}</span>
            </button>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                <span style={{ flex: 1, height: '1px', background: 'var(--dev-border)' }}></span>
                <span style={{ fontSize: '0.72rem', color: 'var(--dev-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode Pengembang</span>
                <span style={{ flex: 1, height: '1px', background: 'var(--dev-border)' }}></span>
              </div>
              <button
                type="button"
                onClick={handleDevBypassLogin}
                className="dev-btn-secondary dev-btn-block"
                style={{ justifyContent: 'center' }}
              >
                <Lightning size={16} weight="fill" style={{ color: 'var(--dev-gold)' }} />
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
      {/* Mobile Sticky Top Header */}
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
            className={`dev-nav-item ${currentView === 'orders' ? 'is-active' : ''}`}
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
            className={`dev-nav-item ${currentView === 'list' ? 'is-active' : ''}`}
            onClick={() => {
              setCurrentView('list');
              setMobileSidebarOpen(false);
            }}
          >
            <ImagesSquare size={19} weight="duotone" />
            <span>Daftar Undangan</span>
          </button>

          <button
            type="button"
            className={`dev-nav-item ${currentView === 'blast' ? 'is-active' : ''}`}
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

        {currentView === 'edit' && (
          <div className="dev-sidebar-editor-tabs">
            <span className="editor-tabs-label">BAGIAN PENGATURAN ({formData.id || 'BARU'})</span>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('profile');
                setMobileSidebarOpen(false);
              }}
            >
              <UserList size={18} weight="duotone" />
              <span>Profil Mempelai</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'events' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('events');
                setMobileSidebarOpen(false);
              }}
            >
              <CalendarCheck size={18} weight="duotone" />
              <span>Jadwal Acara</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'photos' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('photos');
                setMobileSidebarOpen(false);
              }}
            >
              <Camera size={18} weight="duotone" />
              <span>Foto &amp; Media</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'story' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('story');
                setMobileSidebarOpen(false);
              }}
            >
              <Heart size={18} weight="duotone" />
              <span>Perjalanan Cinta</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'gallery' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('gallery');
                setMobileSidebarOpen(false);
              }}
            >
              <ImagesSquare size={18} weight="duotone" />
              <span>Galeri Prewedding</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'accounts' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('accounts');
                setMobileSidebarOpen(false);
              }}
            >
              <CreditCard size={18} weight="duotone" />
              <span>Rekening &amp; Hadiah</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'preview' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('preview');
                setMobileSidebarOpen(false);
              }}
            >
              <Eye size={18} weight="duotone" />
              <span>Pratinjau Layar</span>
            </button>
            <button
              type="button"
              className={`editor-tab-btn ${activeEditorTab === 'monitor' ? 'active' : ''}`}
              onClick={() => {
                setActiveEditorTab('monitor');
                setMobileSidebarOpen(false);
              }}
            >
              <ChartLineUp size={18} weight="duotone" />
              <span>Kehadiran &amp; Doa Tamu</span>
            </button>
          </div>
        )}

        <div className="dev-sidebar-footer">
          <div className="dev-user-info">
            <span className="dev-user-email">{user.email}</span>
            <span className="dev-user-role">Administrator</span>
          </div>
          <button type="button" className="dev-btn-logout" onClick={handleLogout} title="Keluar">
            <SignOut size={18} weight="bold" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dev-main">
        {/* Fast-Switch Segmented Tabs Bar (Mobile Only) */}
        <nav className="dev-mobile-nav-pills" role="tablist" aria-label="Navigasi Cepat Halaman">
          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'orders'}
            className={`dev-pill-tab ${currentView === 'orders' ? 'is-active' : ''}`}
            onClick={() => {
              setCurrentView('orders');
              fetchOrders();
            }}
          >
            <ShoppingBag size={16} weight="duotone" />
            <span>Pesanan</span>
            {pendingOrdersCount > 0 && <span className="dev-pill-counter">{pendingOrdersCount}</span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'list'}
            className={`dev-pill-tab ${currentView === 'list' ? 'is-active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <ImagesSquare size={16} weight="duotone" />
            <span>Undangan ({couples.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={currentView === 'blast'}
            className={`dev-pill-tab ${currentView === 'blast' ? 'is-active' : ''}`}
            onClick={() => {
              setCurrentView('blast');
              setSelectedCoupleForLinks(couples[0] || null);
            }}
          >
            <PaperPlaneRight size={16} weight="duotone" />
            <span>Blast WA</span>
          </button>
        </nav>

        {/* Editor Sub-Tabs Horizontal Scrollable Strip (Mobile Only, when in Edit View) */}
        {currentView === 'edit' && (
          <div className="dev-mobile-editor-chips" role="tablist" aria-label="Bagian Formulir Undangan">
            {[
              { id: 'profile', label: 'Profil Mempelai', icon: UserList },
              { id: 'events', label: 'Jadwal Acara', icon: CalendarCheck },
              { id: 'photos', label: 'Foto & Media', icon: Camera },
              { id: 'story', label: 'Kisah Cinta', icon: Heart },
              { id: 'gallery', label: 'Galeri', icon: ImagesSquare },
              { id: 'accounts', label: 'Rekening', icon: CreditCard },
              { id: 'preview', label: 'Pratinjau', icon: Eye },
              { id: 'monitor', label: 'Tamu RSVP', icon: ChartLineUp }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeEditorTab === tab.id}
                  className={`dev-chip-tab ${activeEditorTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActiveEditorTab(tab.id)}
                >
                  <TabIcon size={14} weight="duotone" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Executive Status Header Bar */}
        <div className="dev-topbar">
          <div className="dev-topbar-left">
            <span className="dev-status-pill">
              <span className="status-dot"></span>
              Sistem Aktif &amp; Terhubung
            </span>
            <span className="dev-topbar-divider">/</span>
            <span className="dev-topbar-stat">{couples.length} Pasangan Terdaftar</span>
            {pendingOrdersCount > 0 && (
              <>
                <span className="dev-topbar-divider">/</span>
                <span className="dev-topbar-stat dev-text-warning">{pendingOrdersCount} Pesanan Baru</span>
              </>
            )}
          </div>
          <div className="dev-topbar-right">
            <a href="/?id=demo" target="_blank" rel="noopener noreferrer" className="dev-topbar-link">
              <Eye size={16} weight="bold" />
              <span>Lihat Contoh Undangan Demo</span>
            </a>
          </div>
        </div>

        {/* VIEW 1: DAFTAR UNDANGAN */}
        {currentView === 'list' && (
          <div className="dev-view-container">
            <div className="dev-view-header">
              <div>
                <h2>Daftar Undangan Pernikahan</h2>
                <p>Kelola seluruh tautan undangan pasangan yang telah dibuat:</p>
              </div>
              <button type="button" className="dev-btn-primary" onClick={handleCreateNew}>
                <Plus size={18} weight="bold" />
                <span>Buat Undangan Baru</span>
              </button>
            </div>

            {loadingData ? (
              <div className="dev-loading-state">Memuat data pasangan...</div>
            ) : couples.length === 0 ? (
              <div className="dev-empty-box">
                <p>Belum ada undangan yang dibuat. Klik tombol "Buat Undangan Baru" untuk memulai.</p>
              </div>
            ) : (
              <div className="dev-table-card">
                <table className="dev-table">
                  <thead>
                    <tr>
                      <th>Nama Tautan (Link)</th>
                      <th>Pasangan Mempelai</th>
                      <th>Tanggal Acara</th>
                      <th>Tempat Acara</th>
                      <th>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couples.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="dev-slug-badge">/?id={c.id}</span>
                        </td>
                        <td>
                          <strong>{c.wanita_panggilan} &amp; {c.pria_panggilan}</strong>
                          <span className="dev-sub-meta">{c.wanita_lengkap} &amp; {c.pria_lengkap}</span>
                        </td>
                        <td>{c.tanggal_cover || c.tanggal_akad || '-'}</td>
                        <td>{c.lokasi_resepsi || c.lokasi_akad || '-'}</td>
                        <td>
                          <div className="dev-table-actions">
                            <a
                              href={`/?id=${c.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dev-action-btn"
                              title="Buka Halaman Undangan"
                            >
                              <Eye size={17} />
                            </a>
                            <button
                              type="button"
                              className="dev-action-btn edit"
                              onClick={() => handleEdit(c)}
                              title="Edit Data Undangan"
                            >
                              <PencilSimple size={17} />
                            </button>
                            <button
                              type="button"
                              className="dev-action-btn delete"
                              onClick={() => handleDelete(c.id)}
                              title="Hapus Undangan"
                            >
                              <Trash size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: EDITOR PENGATURAN */}
        {currentView === 'edit' && (
          <div className="dev-view-container">
            <div className="dev-view-header dev-editor-header-flex">
              <div className="dev-header-with-back">
                <button type="button" className="dev-btn-back" onClick={() => setCurrentView('list')}>
                  <ArrowLeft size={16} weight="bold" />
                  <span>Kembali ke Daftar Undangan</span>
                </button>
                <h2>Pengaturan Undangan: <span className="text-gold">{formData.wanita_panggilan} &amp; {formData.pria_panggilan}</span></h2>
              </div>

              <div className="dev-editor-actions-top">
                <div className="dev-presets-group">
                  <span className="dev-presets-label">Preset Paket:</span>
                  <button 
                    type="button" 
                    className={`dev-preset-btn ${formData.paket_pesanan === 'Paket Silver' ? 'active' : ''}`}
                    onClick={() => handleApplyPackagePreset('Silver')}
                    title="Terapkan konfigurasi Paket Silver"
                  >
                    Silver
                  </button>
                  <button 
                    type="button" 
                    className={`dev-preset-btn ${formData.paket_pesanan === 'Paket Gold Imperial' ? 'active' : ''}`}
                    onClick={() => handleApplyPackagePreset('Gold')}
                    title="Terapkan konfigurasi Paket Gold Imperial"
                  >
                    Gold Imperial
                  </button>
                  <button 
                    type="button" 
                    className={`dev-preset-btn ${formData.paket_pesanan === 'Paket Royal Platinum' ? 'active' : ''}`}
                    onClick={() => handleApplyPackagePreset('Platinum')}
                    title="Terapkan konfigurasi Paket Royal Platinum"
                  >
                    Platinum
                  </button>
                </div>

                <button 
                  type="button" 
                  className="dev-btn-secondary" 
                  onClick={() => setIsSmartParserOpen(true)}
                  title="Ekstrak data dari format chat WhatsApp"
                >
                  <ChatTeardropText size={18} weight="bold" />
                  <span>Impor Teks WhatsApp</span>
                </button>

                <button type="button" className="dev-btn-primary" onClick={handleSave} disabled={isSaving}>
                  <Check size={18} weight="bold" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua'}</span>
                </button>
              </div>
            </div>

            <div className="dev-editor-card">
              {/* TAB 1: PROFIL */}
              {activeEditorTab === 'profile' && (
                <div className="editor-tab-content">
                  <div className="tab-title-area">
                    <UserList size={22} weight="duotone" className="tab-title-icon" />
                    <h3 className="editor-tab-heading">1. Profil &amp; Keluarga Mempelai</h3>
                  </div>

                  <div className="editor-form-grid">
                    <div className="dev-input-group full-width">
                      <label>Nama Tautan Undangan (Wajib diisi, huruf kecil tanpa spasi)</label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleFormChange}
                        placeholder="Contoh: nadia-agus"
                        className="dev-field"
                      />
                      <small className="dev-helper-text">Tautan undangan Anda nantinya: domainanda.com/?id=<strong>{formData.id || 'nama-tautan'}</strong></small>
                    </div>

                    <div className="dev-input-group">
                      <label>Nama Panggilan Mempelai Wanita</label>
                      <input
                        type="text"
                        name="wanita_panggilan"
                        value={formData.wanita_panggilan}
                        onChange={handleFormChange}
                        placeholder="Contoh: Nadia"
                        className="dev-field"
                      />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Lengkap &amp; Gelar Mempelai Wanita</label>
                      <input
                        type="text"
                        name="wanita_lengkap"
                        value={formData.wanita_lengkap}
                        onChange={handleFormChange}
                        placeholder="Contoh: Nadia Salsabila, S.Kom"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Nama Orang Tua Mempelai Wanita</label>
                      <input
                        type="text"
                        name="wanita_ortu"
                        value={formData.wanita_ortu}
                        onChange={handleFormChange}
                        placeholder="Contoh: Bpk. Ahmad Fauzi & Ibu Siti Aminah"
                        className="dev-field"
                      />
                    </div>
                    <div className="dev-input-group">
                      <label>Akun Instagram Mempelai Wanita</label>
                      <input
                        type="text"
                        name="wanita_ig"
                        value={formData.wanita_ig}
                        onChange={handleFormChange}
                        placeholder="Contoh: @nadiasalsabila"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Nama Panggilan Mempelai Pria</label>
                      <input
                        type="text"
                        name="pria_panggilan"
                        value={formData.pria_panggilan}
                        onChange={handleFormChange}
                        placeholder="Contoh: Agus"
                        className="dev-field"
                      />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Lengkap &amp; Gelar Mempelai Pria</label>
                      <input
                        type="text"
                        name="pria_lengkap"
                        value={formData.pria_lengkap}
                        onChange={handleFormChange}
                        placeholder="Contoh: Agus Pratama, S.T"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Nama Orang Tua Mempelai Pria</label>
                      <input
                        type="text"
                        name="pria_ortu"
                        value={formData.pria_ortu}
                        onChange={handleFormChange}
                        placeholder="Contoh: Bpk. Hendra Wijaya & Ibu Ratna Dewi"
                        className="dev-field"
                      />
                    </div>
                    <div className="dev-input-group">
                      <label>Akun Instagram Mempelai Pria</label>
                      <input
                        type="text"
                        name="pria_ig"
                        value={formData.pria_ig}
                        onChange={handleFormChange}
                        placeholder="Contoh: @aguspratama"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Kutipan Doa / Ayat Suci</label>
                      <textarea
                        name="quote_text"
                        rows={3}
                        value={formData.quote_text}
                        onChange={handleFormChange}
                        placeholder="Tuliskan ayat atau kutipan mutiara pernikahan..."
                        className="dev-field"
                      ></textarea>
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Sumber Kutipan</label>
                      <input
                        type="text"
                        name="quote_source"
                        value={formData.quote_source}
                        onChange={handleFormChange}
                        placeholder="Contoh: QS. Ar-Rum: 21"
                        className="dev-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: JADWAL ACARA */}
              {activeEditorTab === 'events' && (
                <div className="editor-tab-content">
                  <div className="tab-title-area">
                    <CalendarCheck size={22} weight="duotone" className="tab-title-icon" />
                    <h3 className="editor-tab-heading">2. Jadwal Acara (Akad &amp; Resepsi)</h3>
                  </div>

                  <div className="editor-form-grid">
                    <div className="dev-input-group full-width">
                      <label>Tanggal yang Tampil di Halaman Awal (Cover)</label>
                      <input
                        type="text"
                        name="tanggal_cover"
                        value={formData.tanggal_cover}
                        onChange={handleFormChange}
                        placeholder="Contoh: Minggu, 07 Juni 2026"
                        className="dev-field"
                      />
                    </div>

                    {/* Akad */}
                    <div className="dev-section-divider-box full-width">
                      <h4>Rangkaian Acara Akad Nikah</h4>
                    </div>

                    <div className="dev-input-group">
                      <label>Pilih Tanggal &amp; Waktu Akad (Untuk Hitung Mundur)</label>
                      <input
                        type="datetime-local"
                        name="tanggal_akad"
                        value={formData.tanggal_akad ? formData.tanggal_akad.substring(0, 16) : ''}
                        onChange={handleFormChange}
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Waktu Akad yang Ditampilkan</label>
                      <input
                        type="text"
                        name="waktu_akad"
                        value={formData.waktu_akad}
                        onChange={handleFormChange}
                        placeholder="Contoh: 08.00 - 10.00 WIB"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Nama Tempat / Masjid Akad</label>
                      <input
                        type="text"
                        name="lokasi_akad"
                        value={formData.lokasi_akad}
                        onChange={handleFormChange}
                        placeholder="Contoh: Masjid Agung Al-Barkah"
                        className="dev-field"
                      />
                    </div>

                    {/* Resepsi */}
                    <div className="dev-section-divider-box full-width">
                      <h4>Rangkaian Acara Resepsi Pernikahan</h4>
                    </div>

                    <div className="dev-input-group">
                      <label>Pilih Tanggal &amp; Waktu Resepsi</label>
                      <input
                        type="datetime-local"
                        name="tanggal_resepsi"
                        value={formData.tanggal_resepsi ? formData.tanggal_resepsi.substring(0, 16) : ''}
                        onChange={handleFormChange}
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Waktu Resepsi yang Ditampilkan</label>
                      <input
                        type="text"
                        name="waktu_resepsi"
                        value={formData.waktu_resepsi}
                        onChange={handleFormChange}
                        placeholder="Contoh: 11.00 - 14.00 WIB"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Nama Gedung / Tempat Resepsi</label>
                      <input
                        type="text"
                        name="lokasi_resepsi"
                        value={formData.lokasi_resepsi}
                        onChange={handleFormChange}
                        placeholder="Contoh: Grand Ballroom Hotel Mulia"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Alamat Baris 1 (Nama Jalan / Nomor)</label>
                      <input
                        type="text"
                        name="alamat_baris1"
                        value={formData.alamat_baris1}
                        onChange={handleFormChange}
                        placeholder="Contoh: Jl. Pemuda No. 45"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group">
                      <label>Alamat Baris 2 (Kota &amp; Provinsi)</label>
                      <input
                        type="text"
                        name="alamat_baris2"
                        value={formData.alamat_baris2}
                        onChange={handleFormChange}
                        placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Tautan Petunjuk Arah (Google Maps)</label>
                      <input
                        type="url"
                        name="link_maps"
                        value={formData.link_maps}
                        onChange={handleFormChange}
                        placeholder="https://maps.app.goo.gl/..."
                        className="dev-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ASSET FOTO */}
              {activeEditorTab === 'photos' && (
                <div className="editor-tab-content">
                  <div className="tab-title-area">
                    <Camera size={22} weight="duotone" className="tab-title-icon" />
                    <h3 className="editor-tab-heading">3. Foto &amp; Media Utama</h3>
                  </div>

                  <div className="dev-photos-grid">
                    {[
                      { key: 'foto_cover', label: 'Foto Halaman Awal & Tirai' },
                      { key: 'foto_prewedding_1', label: 'Foto Kutipan & Latar' },
                      { key: 'foto_mempelai_wanita', label: 'Foto Mempelai Wanita' },
                      { key: 'foto_mempelai_pria', label: 'Foto Mempelai Pria' },
                      { key: 'foto_venue_akad', label: 'Foto Tempat Akad' },
                      { key: 'foto_venue_resepsi', label: 'Foto Tempat Resepsi' },
                      { key: 'foto_closing', label: 'Foto Halaman Penutup' }
                    ].map((slot) => (
                      <div key={slot.key} className="dev-photo-slot-card">
                        <h4>{slot.label}</h4>
                        <div className="dev-photo-slot-preview">
                          <img
                            src={formData[slot.key] || '/assets/foto1.jpg'}
                            alt={slot.label}
                            className="slot-preview-img"
                          />
                        </div>

                        <div className="dev-slot-actions">
                          <label className="dev-upload-btn-label">
                            <UploadSimple size={16} weight="bold" />
                            <span>{uploadingField === slot.key ? 'Mengunggah...' : 'Pilih File Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, slot.key)}
                              className="sr-only"
                              disabled={uploadingField === slot.key}
                            />
                          </label>
                          <input
                            type="text"
                            name={slot.key}
                            value={formData[slot.key] || ''}
                            onChange={handleFormChange}
                            placeholder="Atau tempel link tautan foto..."
                            className="dev-field dev-field-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: KISAH CINTA */}
              {activeEditorTab === 'story' && (
                <div className="editor-tab-content">
                  <div className="tab-header-flex">
                    <div className="tab-title-area">
                      <Heart size={22} weight="duotone" className="tab-title-icon" />
                      <h3 className="editor-tab-heading">4. Perjalanan Kisah Cinta</h3>
                    </div>
                    <button type="button" className="dev-btn-secondary" onClick={handleAddStory}>
                      <Plus size={16} weight="bold" />
                      <span>Tambah Cerita Momen</span>
                    </button>
                  </div>

                  <div className="dev-milestones-editor">
                    {(formData.love_story || []).map((milestone, idx) => (
                      <div key={idx} className="dev-milestone-editor-card">
                        <div className="milestone-card-top">
                          <span className="milestone-idx-pill">Fase Perjalanan #{idx + 1}</span>
                          <button
                            type="button"
                            className="dev-btn-remove-icon"
                            onClick={() => handleRemoveStory(idx)}
                            title="Hapus Momen"
                          >
                            <Trash size={16} />
                          </button>
                        </div>

                        <div className="milestone-fields-grid">
                          <div className="dev-input-group">
                            <label>Tahun / Waktu Kejadian</label>
                            <input
                              type="text"
                              value={milestone.year || ''}
                              onChange={(e) => handleUpdateStory(idx, 'year', e.target.value)}
                              placeholder="Contoh: 2024"
                              className="dev-field"
                            />
                          </div>

                          <div className="dev-input-group">
                            <label>Judul Momen</label>
                            <input
                              type="text"
                              value={milestone.title || ''}
                              onChange={(e) => handleUpdateStory(idx, 'title', e.target.value)}
                              placeholder="Contoh: Hari Pertama Bertemu"
                              className="dev-field"
                            />
                          </div>

                          <div className="dev-input-group full-width">
                            <label>Uraian Cerita Singkat</label>
                            <textarea
                              rows={2}
                              value={milestone.desc || ''}
                              onChange={(e) => handleUpdateStory(idx, 'desc', e.target.value)}
                              placeholder="Tuliskan kisah berkesan pada fase ini..."
                              className="dev-field"
                            ></textarea>
                          </div>

                          <div className="dev-input-group full-width">
                            <label>Pengaturan Foto Momen</label>
                            <div className="milestone-photo-manager">
                              {/* Pratinjau Foto Momen */}
                              <div className="milestone-photo-preview-box">
                                <img
                                  src={milestone.foto || '/assets/foto1.jpg'}
                                  alt={milestone.title || `Fase ${idx + 1}`}
                                  className="milestone-preview-img"
                                  onError={(e) => { e.target.src = '/assets/foto1.jpg'; }}
                                />
                              </div>

                              <div className="milestone-photo-controls">
                                {/* Tombol Unggah File */}
                                <label className="dev-upload-btn-label">
                                  <UploadSimple size={16} weight="bold" />
                                  <span>{uploadingField === `story_${idx}` ? 'Mengunggah Foto...' : 'Pilih File Foto dari HP / Komputer'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleStoryFileUpload(e, idx)}
                                    className="sr-only"
                                    disabled={uploadingField === `story_${idx}`}
                                  />
                                </label>

                                {/* Pilihan Cepat Preset Aset Lokal */}
                                <div className="preset-chips-group">
                                  <span className="preset-chips-label">Pilihan Cepat Foto Bawaan:</span>
                                  <div className="preset-chips">
                                    {[
                                      { label: 'Foto 1', path: '/assets/foto1.jpg' },
                                      { label: 'Foto 2', path: '/assets/foto2.jpg' },
                                      { label: 'Foto 3', path: '/assets/foto3.jpg' },
                                      { label: 'Foto 4', path: '/assets/foto4.jpg' }
                                    ].map((preset) => (
                                      <button
                                        key={preset.path}
                                        type="button"
                                        className={`dev-preset-chip ${milestone.foto === preset.path ? 'is-active' : ''}`}
                                        onClick={() => handleUpdateStory(idx, 'foto', preset.path)}
                                      >
                                        {preset.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Input Manual Tautan URL */}
                                <div className="milestone-url-input-wrap">
                                  <input
                                    type="text"
                                    value={milestone.foto || ''}
                                    onChange={(e) => handleUpdateStory(idx, 'foto', e.target.value)}
                                    placeholder="Atau tempel link tautan foto di sini..."
                                    className="dev-field dev-field-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GALERI PREWEDDING */}
              {activeEditorTab === 'gallery' && (
                <div className="editor-tab-content">
                  <div className="tab-header-flex">
                    <div>
                      <div className="tab-title-area">
                        <ImagesSquare size={22} weight="duotone" className="tab-title-icon" />
                        <h3 className="editor-tab-heading">5. Galeri Foto Prewedding</h3>
                      </div>
                      <p className="tab-sub-caption">
                        Jumlah Foto Tersedia: <strong>{(formData.foto_galeri || []).length} Foto</strong>
                      </p>
                    </div>
                    <button type="button" className="dev-btn-secondary" onClick={handleAddGalleryPhoto}>
                      <Plus size={16} weight="bold" />
                      <span>Tambah Foto Baru</span>
                    </button>
                  </div>

                  <div className="dev-gallery-editor-grid">
                    {(formData.foto_galeri || []).map((photo, idx) => (
                      <div key={idx} className="dev-gallery-editor-card">
                        <img
                          src={photo.src || photo.url || '/assets/foto1.jpg'}
                          alt={`Galeri ${idx + 1}`}
                          className="gallery-editor-preview"
                        />
                        <div className="gallery-editor-inputs">
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => handleUpdateGalleryPhoto(idx, 'caption', e.target.value)}
                            placeholder="Keterangan foto"
                            className="dev-field dev-field-sm"
                          />
                          <label className="dev-upload-btn-label dev-upload-btn-sm">
                            <UploadSimple size={15} weight="bold" />
                            <span>{uploadingField === `gallery_${idx}` ? 'Mengunggah...' : 'Pilih File Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleGalleryFileUpload(e, idx)}
                              className="sr-only"
                              disabled={uploadingField === `gallery_${idx}`}
                            />
                          </label>
                          <input
                            type="text"
                            value={photo.src || photo.url || ''}
                            onChange={(e) => handleUpdateGalleryPhoto(idx, 'src', e.target.value)}
                            placeholder="Atau tempel tautan URL foto..."
                            className="dev-field dev-field-sm"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-delete-gallery-item"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          title="Hapus Foto"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: REKENING & HADIAH */}
              {activeEditorTab === 'accounts' && (
                <div className="editor-tab-content">
                  <div className="tab-title-area">
                    <CreditCard size={22} weight="duotone" className="tab-title-icon" />
                    <h3 className="editor-tab-heading">6. Amplop Digital &amp; Pengiriman Hadiah</h3>
                  </div>

                  <div className="editor-form-grid">
                    {/* Rekening Wanita */}
                    <div className="dev-section-divider-box full-width">
                      <h4>Rekening Mempelai Wanita</h4>
                    </div>

                    <div className="dev-input-group">
                      <label>Pilihan Bank / Dompet Digital</label>
                      <select
                        name="bank_wanita"
                        value={formData.bank_wanita || 'Bank BCA'}
                        onChange={handleFormChange}
                        className="dev-field"
                      >
                        {['Bank BCA', 'Bank Mandiri', 'Bank BNI', 'Bank BRI', 'Bank BSI', 'Gopay', 'OVO', 'Dana', 'ShopeePay'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="dev-input-group">
                      <label>Nomor Rekening / Nomor Telepon</label>
                      <input
                        type="text"
                        name="rekening_wanita"
                        value={formData.rekening_wanita || ''}
                        onChange={handleFormChange}
                        placeholder="Contoh: 1234567890"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Atas Nama Pemilik Rekening</label>
                      <input
                        type="text"
                        name="an_wanita"
                        value={formData.an_wanita || ''}
                        onChange={handleFormChange}
                        placeholder="Contoh: Nadia Salsabila"
                        className="dev-field"
                      />
                    </div>

                    {/* Rekening Pria */}
                    <div className="dev-section-divider-box full-width">
                      <h4>Rekening Mempelai Pria</h4>
                    </div>

                    <div className="dev-input-group">
                      <label>Pilihan Bank / Dompet Digital</label>
                      <select
                        name="bank_pria"
                        value={formData.bank_pria || 'Bank BCA'}
                        onChange={handleFormChange}
                        className="dev-field"
                      >
                        {['Bank BCA', 'Bank Mandiri', 'Bank BNI', 'Bank BRI', 'Bank BSI', 'Gopay', 'OVO', 'Dana', 'ShopeePay'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="dev-input-group">
                      <label>Nomor Rekening / Nomor Telepon</label>
                      <input
                        type="text"
                        name="rekening_pria"
                        value={formData.rekening_pria || ''}
                        onChange={handleFormChange}
                        placeholder="Contoh: 0987654321"
                        className="dev-field"
                      />
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Atas Nama Pemilik Rekening</label>
                      <input
                        type="text"
                        name="an_pria"
                        value={formData.an_pria || ''}
                        onChange={handleFormChange}
                        placeholder="Contoh: Agus Pratama"
                        className="dev-field"
                      />
                    </div>

                    {/* Alamat Pengiriman Hadiah */}
                    <div className="dev-section-divider-box full-width">
                      <h4>Alamat Pengiriman Kado Fisik</h4>
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Alamat Lengkap Pengiriman Kado</label>
                      <textarea
                        rows={2}
                        name="alamat_kado"
                        value={formData.alamat_kado || ''}
                        onChange={handleFormChange}
                        placeholder="Masukkan alamat rumah tempat menerima kado fisik..."
                        className="dev-field"
                      ></textarea>
                    </div>

                    <div className="dev-input-group full-width">
                      <label>Nama &amp; Nomor Kontak Penerima Kado</label>
                      <input
                        type="text"
                        name="penerima_kado"
                        value={formData.penerima_kado || ''}
                        onChange={handleFormChange}
                        placeholder="Contoh: Nadia Salsabila (0812-3456-7890)"
                        className="dev-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PRATINJAU LAYAR */}
              {activeEditorTab === 'preview' && (
                <div className="editor-tab-content">
                  <div className="preview-top-toolbar">
                    <div className="preview-device-switch">
                      <button
                        type="button"
                        className={`device-btn ${previewDevice === 'mobile' ? 'is-active' : ''}`}
                        onClick={() => setPreviewDevice('mobile')}
                        title="Tampilan Layar HP (390px)"
                      >
                        <DeviceMobile size={17} weight="duotone" />
                        <span>Layar HP</span>
                      </button>
                      <button
                        type="button"
                        className={`device-btn ${previewDevice === 'tablet' ? 'is-active' : ''}`}
                        onClick={() => setPreviewDevice('tablet')}
                        title="Tampilan Layar Tablet (768px)"
                      >
                        <DeviceTablet size={17} weight="duotone" />
                        <span>Tablet</span>
                      </button>
                      <button
                        type="button"
                        className={`device-btn ${previewDevice === 'desktop' ? 'is-active' : ''}`}
                        onClick={() => setPreviewDevice('desktop')}
                        title="Tampilan Layar Komputer (100%)"
                      >
                        <Desktop size={17} weight="duotone" />
                        <span>Komputer</span>
                      </button>
                    </div>

                    <div className="preview-guest-tester">
                      <label>Uji Coba Nama Tamu:</label>
                      <input
                        type="text"
                        value={testGuestName}
                        onChange={(e) => setTestGuestName(e.target.value)}
                        className="dev-field dev-field-sm"
                        style={{ width: '180px' }}
                      />
                      <a
                        href={`/?id=${formData.id || 'demo'}&to=${encodeURIComponent(testGuestName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dev-btn-secondary"
                      >
                        <Eye size={16} weight="bold" />
                        <span>Buka Tab Baru</span>
                      </a>
                    </div>
                  </div>

                  <div className="preview-viewport-wrapper">
                    <div className={`preview-frame-container frame-${previewDevice}`}>
                      <iframe
                        src={`/?id=${formData.id || 'demo'}&to=${encodeURIComponent(testGuestName)}`}
                        title="Pratinjau Undangan"
                        className="preview-iframe"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: KEHADIRAN & DOA */}
              {activeEditorTab === 'monitor' && (
                <div className="editor-tab-content">
                  <div className="tab-header-flex">
                    <div className="tab-title-area">
                      <ChartLineUp size={22} weight="duotone" className="tab-title-icon" />
                      <h3 className="editor-tab-heading">8. Data Konfirmasi Kehadiran &amp; Doa Tamu</h3>
                    </div>
                    <div className="export-actions">
                      <button type="button" className="dev-btn-secondary" onClick={exportRsvpToExcel}>
                        <Export size={16} weight="bold" />
                        <span>Unduh Excel Kehadiran</span>
                      </button>
                      <button type="button" className="dev-btn-secondary" onClick={exportGuestbookToExcel}>
                        <Export size={16} weight="bold" />
                        <span>Unduh Excel Doa Tamu</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="dev-stats-grid">
                    <div className="dev-stat-card">
                      <span className="stat-label">Total Konfirmasi Masuk</span>
                      <strong className="stat-val">{totalRsvp} Tamu</strong>
                    </div>
                    <div className="dev-stat-card">
                      <span className="stat-label">Pasti Hadir</span>
                      <strong className="stat-val text-green">{totalHadir}</strong>
                    </div>
                    <div className="dev-stat-card">
                      <span className="stat-label">Berhalangan Hadir</span>
                      <strong className="stat-val text-red">{totalTidakHadir}</strong>
                    </div>
                    <div className="dev-stat-card">
                      <span className="stat-label">Total Jumlah Tamu Hadir</span>
                      <strong className="stat-val text-gold">{totalPax} Orang</strong>
                    </div>
                  </div>

                  {/* Kehadiran Table */}
                  <div className="dev-monitor-table-box">
                    <div className="table-filter-bar">
                      <h4>Daftar Tamu yang Mengisi Kehadiran ({rsvpList.length})</h4>
                      <div className="filter-controls">
                        <select
                          value={rsvpFilter}
                          onChange={(e) => setRsvpFilter(e.target.value)}
                          className="dev-field dev-field-sm"
                        >
                          <option value="all">Semua Status</option>
                          <option value="hadir">Hadir</option>
                          <option value="tidak">Tidak Hadir</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Cari nama tamu..."
                          value={searchRsvp}
                          onChange={(e) => setSearchRsvp(e.target.value)}
                          className="dev-field dev-field-sm"
                        />
                      </div>
                    </div>

                    <table className="dev-table">
                      <thead>
                        <tr>
                          <th>Nama Tamu</th>
                          <th>Status Kehadiran</th>
                          <th>Jumlah Orang</th>
                          <th>Waktu Mengisi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvpList
                          .filter((item) => {
                            if (rsvpFilter !== 'all' && item.hadir !== rsvpFilter) return false;
                            if (searchRsvp && !item.name?.toLowerCase().includes(searchRsvp.toLowerCase())) return false;
                            return true;
                          })
                          .map((item) => (
                            <tr key={item.id}>
                              <td><strong>{item.name}</strong></td>
                              <td>
                                <span className={`status-pill ${item.hadir === 'hadir' ? 'hadir' : 'tidak'}`}>
                                  {item.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                </span>
                              </td>
                              <td>{item.hadir === 'hadir' ? `${item.guest_count || 1} Orang` : '-'}</td>
                              <td>
                                {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString('id-ID') : '-'}
                              </td>
                            </tr>
                          ))}
                        {rsvpList.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-4">Belum ada tamu yang mengisi konfirmasi kehadiran.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Buku Tamu List */}
                  <div className="dev-monitor-wishes-box">
                    <h4>Pesan Doa &amp; Ucapan Tamu Undangan ({guestbookList.length})</h4>
                    <div className="dev-wishes-admin-list">
                      {guestbookList.map((wish) => (
                        <div key={wish.id} className="dev-wish-admin-item">
                          <div className="wish-admin-header">
                            <strong>{wish.name}</strong>
                            <span className="wish-admin-time">
                              {wish.timestamp ? new Date(wish.timestamp.toDate()).toLocaleString('id-ID') : '-'}
                            </span>
                          </div>
                          <p className="wish-admin-text">"{wish.message}"</p>
                        </div>
                      ))}
                      {guestbookList.length === 0 && (
                        <p className="text-muted">Belum ada ucapan doa yang dikirimkan tamu.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: KIRIM WHATSAPP MASSAL */}
        {currentView === 'blast' && (
          <div className="dev-view-container">
            <div className="dev-view-header">
              <div>
                <h2>Kirim Undangan WhatsApp Massal</h2>
                <p>Buat tautan personal secara otomatis untuk dikirimkan langsung ke kontak WhatsApp tamu:</p>
              </div>
            </div>

            <div className="dev-blast-card">
              <div className="blast-inputs-grid">
                <div className="dev-input-group full-width">
                  <label>Pilih Undangan Pasangan</label>
                  <select
                    value={selectedCoupleForLinks?.id || ''}
                    onChange={(e) => {
                      const c = couples.find((cp) => cp.id === e.target.value);
                      setSelectedCoupleForLinks(c);
                    }}
                    className="dev-field"
                  >
                    {couples.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.wanita_panggilan} &amp; {c.pria_panggilan} (/?id={c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dev-input-group full-width">
                  <label>Daftar Nama Tamu (Format: "Nama Tamu, Nomor WhatsApp" atau cukup "Nama Tamu" per baris)</label>
                  <textarea
                    rows={6}
                    value={rawGuestList}
                    onChange={(e) => setRawGuestList(e.target.value)}
                    placeholder="Bpk. Hendra Wijaya, 6281225589199&#10;Ibu Siti Aminah, 6289876543210&#10;Dimas Anggara"
                    className="dev-field"
                  ></textarea>
                </div>

                <div className="dev-input-group full-width">
                  <label>Kalimat Pengantar Pesan WhatsApp ({'{nama_tamu}'} &amp; {'{link}'})</label>
                  <textarea
                    rows={6}
                    value={waTemplate}
                    onChange={(e) => setWaTemplate(e.target.value)}
                    className="dev-field"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="dev-btn-primary dev-btn-block"
                  onClick={handleGenerateLinks}
                >
                  <PaperPlaneRight size={18} weight="bold" />
                  <span>Buat Daftar Tautan Undangan</span>
                </button>
              </div>

              {generatedLinks.length > 0 && (
                <div className="blast-results-section">
                  <h3>Tautan Siap Dikirim ({generatedLinks.length} Tamu)</h3>
                  <div className="blast-links-table-wrapper">
                    <table className="dev-table">
                      <thead>
                        <tr>
                          <th>Nama Tamu</th>
                          <th>Tautan Personal</th>
                          <th>Tindakan Kirim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedLinks.map((item, idx) => (
                          <tr key={idx}>
                            <td><strong>{item.name}</strong></td>
                            <td>
                              <a href={item.inviteUrl} target="_blank" rel="noopener noreferrer" className="dev-link-preview">
                                {item.inviteUrl}
                              </a>
                            </td>
                            <td>
                              <div className="dev-blast-actions">
                                <button
                                  type="button"
                                  className="dev-action-btn"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.inviteUrl);
                                    Swal.fire({
                                      title: 'Tersalin',
                                      text: 'Tautan undangan tamu telah disalin.',
                                      icon: 'success',
                                      confirmButtonColor: '#B8860B'
                                    });
                                  }}
                                  title="Salin Tautan"
                                >
                                  <Copy size={16} />
                                </button>
                                <a
                                  href={item.waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="dev-btn-wa-send"
                                >
                                  <PaperPlaneRight size={15} weight="fill" />
                                  <span>Buka WhatsApp</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 0: PESANAN MASUK (ORDERS QUEUE) */}
        {currentView === 'orders' && (
          <div className="dev-view-container">
            <div className="dev-view-header">
              <div>
                <h2>Antrean Pesanan Pelanggan</h2>
                <p>Pesanan yang masuk dari pilihan paket di landing page. Klik tombol untuk langsung membuat undangan:</p>
              </div>

              <div className="dev-orders-header-actions">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={fetchOrders}
                  disabled={loadingOrders}
                >
                  <Clock size={16} weight="bold" />
                  <span>{loadingOrders ? 'Menyegarkan...' : 'Segarkan Pesanan'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Bento Cards */}
            <div className="dev-orders-metrics-grid">
              <div className="dev-stat-card">
                <div className="dev-stat-icon-wrapper" style={{ color: '#1F6C9F', background: '#E1F3FE' }}>
                  <ShoppingBag size={22} weight="duotone" />
                </div>
                <div>
                  <span className="dev-stat-label">Total Pesanan</span>
                  <h4 className="dev-stat-value">{orders.length}</h4>
                  <small className="dev-stat-note">Semua paket masuk</small>
                </div>
              </div>

              <div className="dev-stat-card">
                <div className="dev-stat-icon-wrapper" style={{ color: '#956400', background: '#FBF3DB' }}>
                  <Clock size={22} weight="duotone" />
                </div>
                <div>
                  <span className="dev-stat-label">Perlu Diproses</span>
                  <h4 className="dev-stat-value">{pendingOrdersCount}</h4>
                  <small className="dev-stat-note">Status menunggu</small>
                </div>
              </div>

              <div className="dev-stat-card">
                <div className="dev-stat-icon-wrapper" style={{ color: '#346538', background: '#EDF3EC' }}>
                  <CheckCircle size={22} weight="duotone" />
                </div>
                <div>
                  <span className="dev-stat-label">Pesanan Selesai</span>
                  <h4 className="dev-stat-value">{orders.filter(o => o.status === 'completed').length}</h4>
                  <small className="dev-stat-note">Undangan aktif</small>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="dev-orders-filter-bar">
              <div className="dev-orders-tabs">
                <button
                  type="button"
                  className={`dev-orders-tab ${orderFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('all')}
                >
                  Semua ({orders.length})
                </button>
                <button
                  type="button"
                  className={`dev-orders-tab ${orderFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('pending')}
                >
                  Menunggu ({pendingOrdersCount})
                </button>
                <button
                  type="button"
                  className={`dev-orders-tab ${orderFilter === 'processing' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('processing')}
                >
                  Diproses ({orders.filter(o => o.status === 'processing').length})
                </button>
                <button
                  type="button"
                  className={`dev-orders-tab ${orderFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('completed')}
                >
                  Selesai ({orders.filter(o => o.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Orders List / Table */}
            {loadingOrders ? (
              <div className="dev-loading-state">Memuat data pesanan masuk...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="dev-empty-box">
                <p>Tidak ada pesanan pada kategori ini.</p>
              </div>
            ) : (
              <div className="dev-orders-list-grid">
                {filteredOrders.map((ord) => {
                  const isSilver = ord.package_name?.includes('Silver');
                  const isPlatinum = ord.package_name?.includes('Platinum') || ord.package_name?.includes('Royal');
                  const packageClass = isSilver ? 'pkg-silver' : isPlatinum ? 'pkg-platinum' : 'pkg-gold';

                  return (
                    <div key={ord.id} className="dev-order-card">
                      <div className="dev-order-card-header">
                        <div className="dev-order-card-pkg-info">
                          <span className={`dev-pkg-pill ${packageClass}`}>
                            {ord.package_name || 'Paket Gold Imperial'}
                          </span>
                          <span className="dev-order-price">{ord.package_price || 'Rp 99.000'}</span>
                        </div>

                        <div className="dev-order-status-wrap">
                          <select
                            className={`dev-status-select status-${ord.status || 'pending'}`}
                            value={ord.status || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            aria-label="Ubah status pesanan"
                          >
                            <option value="pending">Menunggu</option>
                            <option value="processing">Sedang Diproses</option>
                            <option value="completed">Selesai</option>
                          </select>
                        </div>
                      </div>

                      <div className="dev-order-card-body">
                        <div className="dev-order-couple-title">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <h4>{ord.couple_name || 'Calon Pengantin'}</h4>
                            {ord.slug && (
                              <span className="dev-slug-badge">/?id={ord.slug}</span>
                            )}
                          </div>
                          <span className="dev-order-date-meta">
                            <CalendarBlank size={14} weight="bold" />
                            <span>Acara: {ord.event_date || 'Belum ditentukan'}</span>
                          </span>
                        </div>

                        {ord.song_title && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--dev-gold)', marginTop: '0.2rem' }}>
                            <MusicNotes size={14} weight="bold" />
                            <span>Lagu: <strong>{ord.song_title}</strong></span>
                          </div>
                        )}

                        {(ord.receipt_url || ord.receipt_name || ord.has_receipt) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#346538', marginTop: '0.2rem', fontWeight: 600 }}>
                            <CheckCircle size={14} weight="bold" />
                            <span>Bukti QRIS: {ord.receipt_url ? (
                              <a href={ord.receipt_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                Lihat Foto
                              </a>
                            ) : (ord.receipt_name || 'Sudah dilampirkan via WA')}</span>
                          </div>
                        )}

                        {ord.notes && (
                          <div className="dev-order-notes-box">
                            <ChatCircleText size={14} weight="bold" />
                            <span>{ord.notes}</span>
                          </div>
                        )}

                        <div className="dev-order-contact-row">
                          <a
                            href={`https://wa.me/${(ord.customer_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${ord.couple_name}, terima kasih telah memesan ${ord.package_name} di Digitalisasi.id. Kami siap memproses undangan Anda!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dev-btn-wa-pill"
                          >
                            <WhatsappLogo size={16} weight="fill" />
                            <span>{ord.customer_phone || '-'}</span>
                          </a>
                        </div>
                      </div>

                      <div className="dev-order-card-footer">
                        <button
                          type="button"
                          className="dev-btn-convert"
                          onClick={() => handleConvertOrderToInvitation(ord)}
                          title="Generate draf undangan otomatis dari pesanan ini"
                        >
                          <Lightning size={16} weight="fill" />
                          <span>Buat Undangan dari Pesanan Ini</span>
                        </button>

                        <button
                          type="button"
                          className="dev-action-btn delete"
                          onClick={() => handleDeleteOrder(ord.id)}
                          title="Hapus Pesanan"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL SMART CHAT PARSER */}
        {isSmartParserOpen && (
          <div className="dev-modal-backdrop" onClick={() => setIsSmartParserOpen(false)}>
            <div className="dev-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="dev-modal-header">
                <div>
                  <h3>Impor Teks Format dari WhatsApp</h3>
                  <p>Tempelkan (paste) teks bio/data yang dikirim calon pengantin dari chat WA:</p>
                </div>
                <button
                  type="button"
                  className="dev-modal-close"
                  onClick={() => setIsSmartParserOpen(false)}
                  aria-label="Tutup jendela impor teks"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="dev-modal-body">
                <textarea
                  rows={9}
                  className="dev-field dev-parser-textarea"
                  placeholder={`Contoh format pesan dari calon pengantin:
Nama Wanita: Nadia Salsabila
Orang Tua Wanita: Bpk. Ahmad Fauzi & Ibu Siti Aminah
Nama Pria: Agus Pratama
Orang Tua Pria: Bpk. Hendra Wijaya & Ibu Ratna Dewi
Tanggal Acara: Minggu, 07 Juni 2026
Lokasi: Masjid Agung Al-Barkah
Rekening: BCA 1234567890 a.n Nadia Salsabila`}
                  value={rawChatText}
                  onChange={(e) => setRawChatText(e.target.value)}
                ></textarea>

                <small className="dev-helper-text">
                  Algoritma kami otomatis mengekstrak nama mempelai, orang tua, tanggal, lokasi, dan nomor rekening tanpa perlu Anda ketik satu per satu.
                </small>
              </div>

              <div className="dev-modal-footer">
                <button
                  type="button"
                  className="dev-btn-secondary"
                  onClick={() => setIsSmartParserOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="dev-btn-primary"
                  onClick={handleSmartChatParse}
                  disabled={!rawChatText.trim()}
                >
                  <Lightning size={16} weight="fill" />
                  <span>Ekstrak &amp; Terapkan ke Formulir</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
