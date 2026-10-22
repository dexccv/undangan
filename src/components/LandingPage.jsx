import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import {
  Sparkle,
  Lightning,
  MusicNotes,
  BookOpen,
  CheckCircle,
  XCircle,
  List,
  X,
  ArrowRight,
  ArrowLeft,
  Eye,
  WhatsappLogo,
  FlowerLotus,
  Disc,
  ShieldCheck,
  Heart,
  Users,
  CalendarBlank,
  Phone,
  User,
  NotePencil,
  PaperPlaneTilt,
  Globe,
  InstagramLogo,
  MapPin,
  Quotes,
  UploadSimple,
  QrCode,
  Check
} from '@phosphor-icons/react';
import ThreeScene from './ThreeScene';
import './LandingPage.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePackageIndex, setActivePackageIndex] = useState(1);
  const pricingGridRef = React.useRef(null);

  // State Modal Pemesanan Paket (Formulir Lengkap Mempelai)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderPackage, setOrderPackage] = useState('Paket Gold Imperial');
  const [orderPrice, setOrderPrice] = useState('Rp 299.000');
  const [orderSlug, setOrderSlug] = useState('');
  const [isSlugUserEdited, setIsSlugUserEdited] = useState(false);
  const [orderPhone, setOrderPhone] = useState('');

  // Mempelai Wanita
  const [orderWanitaPanggilan, setOrderWanitaPanggilan] = useState('');
  const [orderWanitaLengkap, setOrderWanitaLengkap] = useState('');
  const [orderWanitaOrtu, setOrderWanitaOrtu] = useState('');
  const [orderWanitaIg, setOrderWanitaIg] = useState('');

  // Mempelai Pria
  const [orderPriaPanggilan, setOrderPriaPanggilan] = useState('');
  const [orderPriaLengkap, setOrderPriaLengkap] = useState('');
  const [orderPriaOrtu, setOrderPriaOrtu] = useState('');
  const [orderPriaIg, setOrderPriaIg] = useState('');

  // Musik & Lagu Latar
  const [orderSongTitle, setOrderSongTitle] = useState('');

  // Acara, Doa & Catatan
  const [orderEventDate, setOrderEventDate] = useState('');
  const [orderEventLocation, setOrderEventLocation] = useState('');
  const [orderKutipanDoa, setOrderKutipanDoa] = useState(
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)'
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Navigasi Langkah Modal & Pembayaran QRIS
  const [orderStep, setOrderStep] = useState('form'); // 'form' | 'payment'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const scrollToPackage = (idx, smooth = true) => {
    setActivePackageIndex(idx);
    const container = pricingGridRef.current;
    if (container) {
      const cards = container.children;
      if (cards && cards[idx]) {
        const card = cards[idx];
        const targetScrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }
  };

  const scrollToSection = (e, sectionId) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePricingScroll = () => {
    if (!pricingGridRef.current) return;
    const container = pricingGridRef.current;
    const cards = container.children;
    if (!cards || cards.length === 0) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== activePackageIndex) {
      setActivePackageIndex(closestIndex);
    }
  };

  React.useEffect(() => {
    // Bersihkan hash dari URL jika ada (seperti #pricing) dan pastikan scroll mulai dari atas saat reload
    if (window.location.hash) {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo(0, 0);
    }

    // Posisikan kartu rekomendasi (Gold Imperial, index 1) di tengah container horizontal
    // HANYA pada container scroll internal, tidak memicu scroll vertikal halaman (window)
    if (pricingGridRef.current) {
      const container = pricingGridRef.current;
      const cards = container.children;
      if (cards && cards[1]) {
        const card = cards[1];
        const targetScrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
        container.scrollLeft = Math.max(0, targetScrollLeft);
      }
    }
  }, []);

  // Kunci scroll body saat sidebar mobile terbuka & tutup via tombol Escape
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSelectPackage = (packageName, price, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOrderPackage(packageName);
    setOrderPrice(price || 'Rp 299.000');
    setOrderStep('form');
    setReceiptFile(null);
    setReceiptPreview(null);
    setIsOrderModalOpen(true);
  };

  const handleWanitaPanggilanChange = (val) => {
    setOrderWanitaPanggilan(val);
    if (!isSlugUserEdited) {
      const w = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const p = (orderPriaPanggilan || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (w && p) setOrderSlug(`${w}-${p}`);
      else if (w) setOrderSlug(w);
      else if (p) setOrderSlug(p);
    }
  };

  const handlePriaPanggilanChange = (val) => {
    setOrderPriaPanggilan(val);
    if (!isSlugUserEdited) {
      const w = (orderWanitaPanggilan || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const p = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (w && p) setOrderSlug(`${w}-${p}`);
      else if (p) setOrderSlug(p);
      else if (w) setOrderSlug(w);
    }
  };

  const handleSlugChange = (val) => {
    setIsSlugUserEdited(true);
    setOrderSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    const finalWanita = orderWanitaPanggilan.trim();
    const finalPria = orderPriaPanggilan.trim();
    const finalPhone = orderPhone.trim();
    const finalSlug = (orderSlug.trim() || `${finalWanita}-${finalPria}`).toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    if (!finalWanita || !finalPria) {
      Swal.fire({
        title: 'Lengkapi Nama Mempelai',
        text: 'Mohon masukkan nama panggilan mempelai wanita dan mempelai pria.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    if (!finalPhone) {
      Swal.fire({
        title: 'Nomor WhatsApp Diperlukan',
        text: 'Mohon masukkan nomor WhatsApp aktif Anda untuk konfirmasi pesanan.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    setIsSubmittingOrder(true);
    const orderId = 'ord-' + Date.now();
    setCreatedOrderId(orderId);

    const newOrder = {
      id: orderId,
      package_name: orderPackage,
      package_price: orderPrice,
      slug: finalSlug,
      couple_name: `${finalWanita} & ${finalPria}`,
      customer_phone: finalPhone,

      // Mempelai Wanita
      wanita_panggilan: finalWanita,
      wanita_lengkap: orderWanitaLengkap.trim(),
      wanita_ortu: orderWanitaOrtu.trim(),
      wanita_ig: orderWanitaIg.trim(),

      // Mempelai Pria
      pria_panggilan: finalPria,
      pria_lengkap: orderPriaLengkap.trim(),
      pria_ortu: orderPriaOrtu.trim(),
      pria_ig: orderPriaIg.trim(),

      // Musik / Lagu
      song_title: orderSongTitle.trim(),

      // Acara, Doa & Catatan
      event_date: orderEventDate || '',
      event_location: orderEventLocation.trim(),
      kutipan_doa: orderKutipanDoa.trim(),
      notes: orderNotes.trim(),

      status: 'menunggu_pembayaran',
      created_at: { seconds: Math.floor(Date.now() / 1000) }
    };

    // Selalu simpan ke localStorage agar tidak hilang meski Firebase offline/restricted
    try {
      const existing = JSON.parse(localStorage.getItem('digitalisasi_orders') || '[]');
      localStorage.setItem('digitalisasi_orders', JSON.stringify([newOrder, ...existing]));
    } catch (errLocal) {
      console.warn('Local storage save error:', errLocal);
    }

    try {
      await addDoc(collection(db, 'orders'), {
        ...newOrder,
        created_at: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore orders save warning (rules/offline):', err);
    }

    setIsSubmittingOrder(false);
    setOrderStep('payment');
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleFinalConfirmPayment = async () => {
    setIsUploadingReceipt(true);
    let receiptUrl = '';

    if (receiptFile) {
      try {
        const storageRef = ref(storage, `orders/receipts/${createdOrderId || Date.now()}_${receiptFile.name}`);
        const uploadRes = await uploadBytes(storageRef, receiptFile);
        receiptUrl = await getDownloadURL(uploadRes.ref);
      } catch (err) {
        console.warn('Storage receipt upload fallback:', err);
      }
    }

    // Update status di localStorage & memory
    try {
      const localOrders = JSON.parse(localStorage.getItem('digitalisasi_orders') || '[]');
      const updated = localOrders.map((o) => {
        if (o.id === createdOrderId) {
          return {
            ...o,
            status: 'pending',
            receipt_url: receiptUrl,
            receipt_name: receiptFile?.name || '',
            has_receipt: Boolean(receiptFile)
          };
        }
        return o;
      });
      localStorage.setItem('digitalisasi_orders', JSON.stringify(updated));
    } catch (e) {}

    const finalWanita = orderWanitaPanggilan.trim();
    const finalPria = orderPriaPanggilan.trim();
    const finalPhone = orderPhone.trim();
    const finalSlug = (orderSlug.trim() || `${finalWanita}-${finalPria}`).toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    // Format WhatsApp Message resmi ke developer: 081225589199
    const waLines = [
      `Halo Developer Digitalisasi.id (081225589199), saya telah melakukan pemesanan dan pembayaran via QRIS:`,
      ``,
      `*Paket:* ${orderPackage} (${orderPrice})`,
      `*Nama Tautan Undangan:* domainanda.com/?id=${finalSlug}`,
      `*Nomor WhatsApp:* ${finalPhone}`,
      ``,
      `*Mempelai Wanita:* ${finalWanita}${orderWanitaLengkap.trim() ? ` (${orderWanitaLengkap.trim()})` : ''}`,
      orderWanitaOrtu.trim() ? `*Orang Tua Wanita:* ${orderWanitaOrtu.trim()}` : null,
      orderWanitaIg.trim() ? `*Instagram Wanita:* ${orderWanitaIg.trim()}` : null,
      ``,
      `*Mempelai Pria:* ${finalPria}${orderPriaLengkap.trim() ? ` (${orderPriaLengkap.trim()})` : ''}`,
      orderPriaOrtu.trim() ? `*Orang Tua Pria:* ${orderPriaOrtu.trim()}` : null,
      orderPriaIg.trim() ? `*Instagram Pria:* ${orderPriaIg.trim()}` : null,
      ``,
      orderSongTitle.trim() ? `*Lagu Pilihan:* ${orderSongTitle.trim()}` : null,
      orderEventDate ? `*Tanggal Acara:* ${orderEventDate}` : null,
      orderEventLocation.trim() ? `*Lokasi Acara:* ${orderEventLocation.trim()}` : null,
      orderNotes.trim() ? `*Catatan Tambahan:* ${orderNotes.trim()}` : null,
      ``,
      `*Status Pembayaran:* Telah melakukan transfer via QRIS ${receiptFile ? `(Bukti transfer: ${receiptFile.name})` : '(Menyertakan bukti transfer)'}`,
      receiptUrl ? `*Link Bukti:* ${receiptUrl}` : null,
      ``,
      `Mohon segera diproses pembuatan undangan digital kami. Terima kasih!`
    ].filter((line) => line !== null).join('\n');

    const waUrl = `https://wa.me/6281225589199?text=${encodeURIComponent(waLines)}`;

    await Swal.fire({
      title: 'Pesanan & Pembayaran Dikonfirmasi!',
      text: 'Data Anda telah tersimpan dan sedang diteruskan ke WhatsApp Developer (081225589199).',
      icon: 'success',
      confirmButtonColor: '#B8860B',
      confirmButtonText: 'Buka WhatsApp Developer'
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsUploadingReceipt(false);
    setIsOrderModalOpen(false);
    setOrderStep('form');
  };

  return (
    <ThreeScene>
      <div className="lp-container">
        {/* Navigation */}
        <header className="lp-nav">
          <div className="lp-nav-inner">
            <a href="/" className="lp-logo">
              <FlowerLotus size={22} weight="fill" className="lp-logo-symbol" />
              <span>Digitalisasi.id</span>
            </a>

            {/* Desktop Links */}
            <nav className="lp-nav-links" aria-label="Menu Utama">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Fitur Lengkap</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pilihan Paket</a>
              <a href="/?id=demo" className="lp-link-demo">
                <Eye size={16} weight="bold" />
                <span>Lihat Contoh Undangan</span>
              </a>
              <a
                href="https://wa.me/6281225589199?text=Halo%20saya%20tertarik%20membuat%20undangan%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-outline"
              >
                Konsultasi WhatsApp
              </a>
            </nav>

            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              className="lp-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              <List size={26} weight="bold" />
            </button>
          </div>
        </header>

        {/* Mobile Backdrop Overlay (Smooth Fade) */}
        <div
          className={`lp-mobile-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden={!mobileMenuOpen}
        />

        {/* Mobile Sidebar (Smooth Slide-in from Right) */}
        <aside
          className={`lp-mobile-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Menu Navigasi Mobile"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="lp-sidebar-header">
            <div className="lp-sidebar-brand">
              <FlowerLotus size={22} weight="fill" className="lp-logo-symbol" />
              <span>Digitalisasi.id</span>
            </div>
            <button
              type="button"
              className="lp-sidebar-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu navigasi"
            >
              <X size={22} weight="bold" />
            </button>
          </div>

          <nav className="lp-sidebar-nav">
            <a
              href="#features"
              className="lp-sidebar-link"
              onClick={(e) => scrollToSection(e, 'features')}
            >
              <span>Fitur Lengkap</span>
            </a>
            <a
              href="#pricing"
              className="lp-sidebar-link"
              onClick={(e) => scrollToSection(e, 'pricing')}
            >
              <span>Pilihan Paket</span>
            </a>
            <a
              href="/?id=demo"
              className="lp-sidebar-link lp-sidebar-link-highlight"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Eye size={18} weight="bold" />
              <span>Lihat Contoh Undangan</span>
            </a>
          </nav>

          <div className="lp-sidebar-footer">
            <button
              type="button"
              className="lp-btn lp-btn-primary lp-full-width lp-btn-sidebar"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleSelectPackage('Paket Gold Imperial', 'Rp 99.000', e);
              }}
            >
              <span>Pesan Undangan Sekarang</span>
            </button>
            <p className="lp-sidebar-note">Konsultasi cepat via WhatsApp</p>
          </div>
        </aside>

        {/* Hero Section */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <h1 className="lp-title">Undangan Digital Premium, Elegan &amp; Bebas Ribet</h1>
            <p className="lp-subtitle">
              Hadirkan kesan pertama yang berkelas untuk seluruh tamu undangan. Lengkap dengan animasi pembuka tirai mewah, galeri foto prewedding sinematik, musik latar syahdu, serta pencatatan konfirmasi kehadiran tamu secara otomatis.
            </p>
            <div className="lp-hero-actions">
              <a href="#pricing" className="lp-btn lp-btn-primary" onClick={(e) => scrollToSection(e, 'pricing')}>
                <span>Pilih Paket Undangan</span>
                <ArrowRight size={18} weight="bold" />
              </a>
              <a href="/?id=demo" className="lp-btn lp-btn-secondary">
                <Eye size={18} weight="bold" />
                <span>Lihat Contoh Undangan</span>
              </a>
            </div>

            {/* Trust Badges Strip */}
            <div className="lp-trust-strip">
              <div className="lp-trust-item">
                <Users size={16} weight="fill" className="lp-trust-icon" />
                <span>1.500+ Pasangan Bahagia</span>
              </div>
              <span className="lp-trust-dot">•</span>
              <div className="lp-trust-item">
                <ShieldCheck size={16} weight="fill" className="lp-trust-icon" />
                <span>Animasi Tirai Eksklusif</span>
              </div>
              <span className="lp-trust-dot">•</span>
              <div className="lp-trust-item">
                <Heart size={16} weight="fill" className="lp-trust-icon" />
                <span>99.8% Kepuasan Tamu</span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Floating Titanium Smartphone Showcase */}
          <div className="lp-hero-showcase" aria-hidden="true">
            {/* Ambient Halo */}
            <div className="lp-mockup-halo"></div>

            {/* Smartphone Frame */}
            <div className="lp-phone-frame">
              <div className="lp-phone-notch"></div>
              <div className="lp-phone-screen">
                <div
                  className="lp-mock-wedding-cover"
                  style={{ backgroundImage: 'url(/assets/foto1.jpg)' }}
                >
                  <div className="lp-mock-overlay">
                    <span className="lp-mock-pill">THE WEDDING OF</span>
                    <h3 className="lp-mock-names">Nadia &amp; Agus</h3>
                    <span className="lp-mock-date">Minggu, 07 Juni 2026</span>
                    <div className="lp-mock-curtain-strip">
                      <Sparkle size={13} weight="fill" />
                      <span>Buka Undangan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Badge 1: Live Confirmation */}
            <div className="lp-floating-badge badge-attendance">
              <span className="badge-pulse-dot"></span>
              <div className="badge-text-group">
                <strong>320+ Tamu Konfirmasi</strong>
                <p>Pencatatan Kehadiran Otomatis</p>
              </div>
            </div>

            {/* Floating Glass Badge 2: Music Ready */}
            <div className="lp-floating-badge badge-music">
              <div className="badge-disc-icon">
                <Disc size={20} weight="duotone" className="spinning-disc" />
              </div>
              <div className="badge-text-group">
                <strong>Musik Latar Aktif</strong>
                <p>Instrumen Romantis Pilihan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="lp-features">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Mengapa Memilih Digitalisasi.id?</h2>
            <p className="lp-section-sub">Diciptakan dengan desain presisi tinggi agar setiap tamu undangan Anda merasa disambut dengan istimewa:</p>
          </div>

          <div className="lp-feature-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon-box">
                <Sparkle size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Animasi Tirai Saat Dibuka</h3>
              <p>Sensasi membuka tirai megah saat tamu pertama kali mengklik link, memberikan impresi pertama yang eksklusif.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon-box">
                <Lightning size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Cepat &amp; Nyaman Dibuka di HP</h3>
              <p>Telah disesuaikan khusus untuk seluruh ponsel Android &amp; iPhone tanpa kendala geser atau ukuran yang terpotong.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon-box">
                <MusicNotes size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Musik Latar &amp; Galeri Foto</h3>
              <p>Latar lagu romantis pilihan dengan tombol putar fleksibel serta susunan album foto prewedding yang memukau.</p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon-box">
                <BookOpen size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Konfirmasi Kehadiran &amp; Doa Tamu</h3>
              <p>Ketahui siapa saja tamu yang hadir dan kumpulkan doa restu hangat langsung terdata rapi di panel Anda.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="lp-pricing">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Investasi untuk Hari Bahagia Anda</h2>
            <p className="lp-section-sub">Pilih paket terbaik yang sesuai dengan konsep dan skala acara pernikahan Anda:</p>

            {/* Mobile Package Tab Selector */}
            <div className="lp-pricing-mobile-nav" role="tablist" aria-label="Pilihan Paket Undangan">
              <button
                type="button"
                role="tab"
                aria-selected={activePackageIndex === 0}
                className={`lp-pkg-tab ${activePackageIndex === 0 ? 'is-active' : ''}`}
                onClick={() => scrollToPackage(0)}
              >
                Silver
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activePackageIndex === 1}
                className={`lp-pkg-tab ${activePackageIndex === 1 ? 'is-active' : ''}`}
                onClick={() => scrollToPackage(1)}
              >
                Gold Imperial
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activePackageIndex === 2}
                className={`lp-pkg-tab ${activePackageIndex === 2 ? 'is-active' : ''}`}
                onClick={() => scrollToPackage(2)}
              >
                Platinum
              </button>
            </div>
          </div>

          <div
            className="lp-pricing-grid"
            ref={pricingGridRef}
            onScroll={handlePricingScroll}
          >
            {/* Paket Silver */}
            <div className="lp-price-card">
              <div className="lp-price-header">
                <h3>Paket Silver</h3>
                <div className="lp-price">Rp 49.000</div>
                <p className="lp-price-sub">Cocok untuk acara keluarga &amp; intimate</p>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Desain Ivory &amp; Gold Standard</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Rincian Waktu Akad &amp; Resepsi</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Petunjuk Lokasi Google Maps</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Galeri Foto (Maksimal 5 Foto)</li>
                <li className="lp-disabled"><XCircle size={18} weight="fill" className="cross-icon" /> Animasi Tirai Saat Dibuka</li>
                <li className="lp-disabled"><XCircle size={18} weight="fill" className="cross-icon" /> Formulir Konfirmasi Kehadiran</li>
              </ul>
              <button
                type="button"
                className="lp-btn lp-btn-outline lp-full-width"
                onClick={(e) => handleSelectPackage('Paket Silver', 'Rp 49.000', e)}
              >
                Pilih Paket Silver
              </button>
            </div>

            {/* Paket Gold (Paling Populer) */}
            <div className="lp-price-card lp-popular">
              <div className="lp-popular-badge">Paling Populer</div>
              <div className="lp-price-header">
                <h3>Paket Gold Imperial</h3>
                <div className="lp-price">Rp 99.000</div>
                <p className="lp-price-sub">Pilihan favorit calon pengantin</p>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> <strong>Animasi Tirai Eksklusif Saat Dibuka</strong></li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Tema Luxury Ivory &amp; Gold Lengkap</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Hitung Mundur &amp; Foto Lokasi Acara</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Galeri Foto Prewedding (Maksimal 15 Foto)</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Garis Waktu Perjalanan Kisah Cinta</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Pemutar Musik Latar Romantis</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Konfirmasi Kehadiran &amp; Buku Tamu</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Amplop Digital &amp; Tombol Salin Rekening</li>
              </ul>
              <button
                type="button"
                className="lp-btn lp-btn-primary lp-full-width"
                onClick={(e) => handleSelectPackage('Paket Gold Imperial', 'Rp 99.000', e)}
              >
                Pilih Paket Gold Imperial
              </button>
            </div>

            {/* Paket Royal Platinum */}
            <div className="lp-price-card">
              <div className="lp-price-header">
                <h3>Paket Royal Platinum</h3>
                <div className="lp-price">Rp 249.000</div>
                <p className="lp-price-sub">Fitur lengkap tanpa batasan</p>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Seluruh Fitur Paket Gold Imperial</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Domain Khusus Nama Pasangan (.com)</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Galeri Foto Prewedding Tanpa Batas</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Kustomisasi Musik &amp; Tipografi Nama</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Unduh Data Kehadiran &amp; Doa ke Excel</li>
                <li><CheckCircle size={18} weight="fill" className="check-icon" /> Bantuan Pembuatan Undangan 24 Jam</li>
              </ul>
              <button
                type="button"
                className="lp-btn lp-btn-outline lp-full-width"
                onClick={(e) => handleSelectPackage('Paket Royal Platinum', 'Rp 249.000', e)}
              >
                Pilih Paket Royal Platinum
              </button>
            </div>
          </div>

          {/* Mobile Pricing Dot Indicators */}
          <div className="lp-pricing-dots-mobile" aria-hidden="true">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                className={`lp-pricing-dot ${activePackageIndex === idx ? 'is-active' : ''}`}
                onClick={() => scrollToPackage(idx)}
                aria-label={`Lihat paket ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer id="contact" className="lp-footer">
          <div className="lp-footer-content">
            <h2>Wujudkan Undangan Pernikahan Impian Anda</h2>
            <p>Konsultasikan tanggal dan konsep undangan Anda bersama tim kami secara gratis melalui WhatsApp.</p>
            <div className="lp-footer-actions">
              <button
                type="button"
                className="lp-btn lp-btn-primary lp-btn-large"
                onClick={(e) => handleSelectPackage('Paket Gold Imperial', 'Rp 99.000', e)}
              >
                <WhatsappLogo size={22} weight="fill" />
                <span>Pesan Sekarang &amp; Konsultasi</span>
              </button>
            </div>
            <div className="lp-footer-bottom">
              <p>&copy; {new Date().getFullYear()} Digitalisasi.id. Seluruh hak cipta dilindungi undang-undang.</p>
            </div>
          </div>
        </footer>

        {/* Modal Pemesanan Paket (Quick Order Sheet) */}
        {isOrderModalOpen && (
          <div 
            className="lp-order-modal-backdrop" 
            onClick={() => setIsOrderModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
          >
            <div 
              className="lp-order-modal-card" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lp-order-modal-header">
                <div className="lp-order-modal-brand">
                  <FlowerLotus size={24} weight="fill" className="lp-logo-symbol" />
                  <div>
                    <h3 id="order-modal-title">
                      {orderStep === 'form' ? `Pemesanan ${orderPackage}` : 'Pembayaran Tagihan via QRIS'}
                    </h3>
                    <p className="lp-order-modal-sub">
                      {orderStep === 'form' 
                        ? `Biaya Paket: ${orderPrice} • Lengkapi data mempelai untuk pembuatan draf` 
                        : `Total Tagihan: ${orderPrice} • Scan QRIS di bawah dan unggah bukti transfer`}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="lp-order-modal-close" 
                  onClick={() => setIsOrderModalOpen(false)}
                  aria-label="Tutup formulir pemesanan"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* LANGKAH 1: FORMULIR DATA MEMPELAI */}
              {orderStep === 'form' && (
                <form onSubmit={handleProceedToPayment} className="lp-order-form">
                  {/* 1. Tautan Undangan */}
                  <div className="lp-order-form-group full-width">
                    <label htmlFor="order-slug">
                      <span>Nama Tautan Undangan (Wajib diisi, huruf kecil tanpa spasi) *</span>
                    </label>
                    <input
                      id="order-slug"
                      type="text"
                      required
                      placeholder="Contoh: dimas-anisa"
                      value={orderSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="lp-order-input"
                    />
                    <small className="lp-order-helper-text">
                      Tautan undangan Anda nantinya: domainanda.com/?id=<strong>{orderSlug || 'dimas-anisa'}</strong>
                    </small>
                  </div>

                  {/* 2. Data Mempelai Wanita */}
                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-wanita-panggilan">
                        <span>Nama Panggilan Mempelai Wanita *</span>
                      </label>
                      <input
                        id="order-wanita-panggilan"
                        type="text"
                        required
                        placeholder="Contoh: Dimas"
                        value={orderWanitaPanggilan}
                        onChange={(e) => handleWanitaPanggilanChange(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-wanita-lengkap">
                        <span>Nama Lengkap &amp; Gelar Mempelai Wanita</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-wanita-lengkap"
                        type="text"
                        placeholder="Contoh: Dimas Salsabila, S.Kom"
                        value={orderWanitaLengkap}
                        onChange={(e) => setOrderWanitaLengkap(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-wanita-ortu">
                        <span>Nama Orang Tua Mempelai Wanita</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-wanita-ortu"
                        type="text"
                        placeholder="Contoh: Bpk. Ahmad Fauzi & Ibu Siti Aminah"
                        value={orderWanitaOrtu}
                        onChange={(e) => setOrderWanitaOrtu(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-wanita-ig">
                        <span>Akun Instagram Mempelai Wanita</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-wanita-ig"
                        type="text"
                        placeholder="Contoh: @nadiasalsabila"
                        value={orderWanitaIg}
                        onChange={(e) => setOrderWanitaIg(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  {/* 3. Data Mempelai Pria */}
                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-pria-panggilan">
                        <span>Nama Panggilan Mempelai Pria *</span>
                      </label>
                      <input
                        id="order-pria-panggilan"
                        type="text"
                        required
                        placeholder="Contoh: Anisa"
                        value={orderPriaPanggilan}
                        onChange={(e) => handlePriaPanggilanChange(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-pria-lengkap">
                        <span>Nama Lengkap &amp; Gelar Mempelai Pria</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-pria-lengkap"
                        type="text"
                        placeholder="Contoh: Anisa Pratama, S.T"
                        value={orderPriaLengkap}
                        onChange={(e) => setOrderPriaLengkap(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-pria-ortu">
                        <span>Nama Orang Tua Mempelai Pria</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-pria-ortu"
                        type="text"
                        placeholder="Contoh: Bpk. Hendra Wijaya & Ibu Ratna Dewi"
                        value={orderPriaOrtu}
                        onChange={(e) => setOrderPriaOrtu(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-pria-ig">
                        <span>Akun Instagram Mempelai Pria</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-pria-ig"
                        type="text"
                        placeholder="Contoh: @aguspratama"
                        value={orderPriaIg}
                        onChange={(e) => setOrderPriaIg(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  {/* 4. Judul Lagu & Nama Penyanyi (Opsional) */}
                  <div className="lp-order-form-group full-width">
                    <label htmlFor="order-song-title">
                      <MusicNotes size={16} weight="bold" />
                      <span>Judul Lagu &amp; Nama Penyanyi (Musik Latar Undangan)</span>
                      <span className="lp-label-optional">(Opsional)</span>
                    </label>
                    <input
                      id="order-song-title"
                      type="text"
                      placeholder="Contoh: Payung Teduh - Akad / Ed Sheeran - Perfect"
                      value={orderSongTitle}
                      onChange={(e) => setOrderSongTitle(e.target.value)}
                      className="lp-order-input"
                    />
                    <small className="lp-order-helper-text">
                      Lagu ini akan diputar otomatis saat tamu membuka website undangan pernikahan Anda.
                    </small>
                  </div>

                  {/* 5. Kutipan Doa / Ayat Suci */}
                  <div className="lp-order-form-group full-width">
                    <label htmlFor="order-kutipan-doa">
                      <span>Kutipan Doa / Ayat Suci</span>
                      <span className="lp-label-optional">(Opsional)</span>
                    </label>
                    <textarea
                      id="order-kutipan-doa"
                      rows={3}
                      placeholder="Contoh: Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
                      value={orderKutipanDoa}
                      onChange={(e) => setOrderKutipanDoa(e.target.value)}
                      className="lp-order-textarea"
                    ></textarea>
                  </div>

                  {/* 6. Kontak Pemesan & Jadwal Acara */}
                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-phone">
                        <span>Nomor WhatsApp Pemesan *</span>
                      </label>
                      <input
                        id="order-phone"
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-event-date">
                        <span>Perkiraan Tanggal Acara</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-event-date"
                        type="date"
                        value={orderEventDate}
                        onChange={(e) => setOrderEventDate(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  <div className="lp-order-grid-2">
                    <div className="lp-order-form-group">
                      <label htmlFor="order-location">
                        <span>Tempat / Lokasi Acara</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-location"
                        type="text"
                        placeholder="Contoh: Masjid Agung Al-Barkah / Grand Ballroom"
                        value={orderEventLocation}
                        onChange={(e) => setOrderEventLocation(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>

                    <div className="lp-order-form-group">
                      <label htmlFor="order-notes">
                        <span>Catatan Tambahan / Konsep Acara</span>
                        <span className="lp-label-optional">(Opsional)</span>
                      </label>
                      <input
                        id="order-notes"
                        type="text"
                        placeholder="Contoh: Konsep sage green modern, nuansa adat..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  <div className="lp-order-modal-actions">
                    <button 
                      type="button" 
                      className="lp-btn lp-btn-secondary"
                      onClick={() => setIsOrderModalOpen(false)}
                      disabled={isSubmittingOrder}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="lp-btn lp-btn-primary lp-order-submit-btn"
                      disabled={isSubmittingOrder}
                    >
                      <span>{isSubmittingOrder ? 'Menyimpan...' : 'Lanjut ke Pembayaran QRIS'}</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </form>
              )}

              {/* LANGKAH 2: TAMPILAN PEMBAYARAN QRIS & UNGGAH BUKTI */}
              {orderStep === 'payment' && (
                <div className="lp-payment-step-card">
                  <div className="lp-qris-box-wrapper">
                    <div className="lp-qris-tag-badge">
                      <QrCode size={16} weight="bold" />
                      <span>PEMBAYARAN QRIS RESMI</span>
                    </div>

                    <div className="lp-qris-image-frame">
                      <img 
                        src="/qris.jpeg" 
                        alt="QRIS Digitalisasi.id" 
                        className="lp-qris-img" 
                      />
                    </div>

                    <div className="lp-qris-bill-amount">
                      <span className="lp-bill-label">Total Tagihan ({orderPackage}):</span>
                      <span className="lp-bill-value">{orderPrice}</span>
                    </div>

                    <p className="lp-qris-instruction">
                      Scan kode barcode QRIS di atas melalui aplikasi m-Banking (BCA, Mandiri, BRI, BNI, BSI) atau e-Wallet (GoPay, OVO, Dana, ShopeePay).
                    </p>

                    <a 
                      href="/qris.jpeg" 
                      download="QRIS-Digitalisasi-id.jpeg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="lp-btn-download-qris"
                    >
                      Unduh Gambar QRIS
                    </a>
                  </div>

                  {/* Bagian Unggah Bukti Pembayaran */}
                  <div className="lp-upload-receipt-section">
                    <label className="lp-upload-receipt-heading">
                      <span>Unggah Bukti Pembayaran / Transfer</span>
                      <span className="lp-label-optional">(Disarankan)</span>
                    </label>

                    <div className="lp-upload-receipt-area">
                      <label className="lp-upload-file-picker">
                        <UploadSimple size={22} weight="bold" />
                        <span>{receiptFile ? receiptFile.name : 'Pilih Foto Bukti Transfer / Screenshot Pembayaran'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptChange}
                          className="sr-only"
                        />
                      </label>
                      <small className="lp-upload-hint">Format file JPG, PNG, atau tangkapan layar (screenshot transfer bank / e-wallet).</small>
                    </div>

                    {receiptPreview && (
                      <div className="lp-receipt-preview-container">
                        <div className="lp-receipt-preview-header">
                          <span className="lp-preview-caption">Pratinjau Bukti Transfer:</span>
                          <button type="button" onClick={handleRemoveReceipt} className="lp-btn-remove-preview">
                            Hapus / Ganti
                          </button>
                        </div>
                        <div className="lp-receipt-preview-box">
                          <img src={receiptPreview} alt="Bukti Transfer" className="lp-receipt-preview-img" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tombol Aksi Final */}
                  <div className="lp-order-modal-actions">
                    <button 
                      type="button" 
                      className="lp-btn lp-btn-secondary"
                      onClick={() => setOrderStep('form')}
                      disabled={isUploadingReceipt}
                    >
                      <ArrowLeft size={16} weight="bold" />
                      <span>Ubah Data Formulir</span>
                    </button>
                    <button 
                      type="button" 
                      className="lp-btn lp-btn-primary lp-order-submit-btn"
                      onClick={handleFinalConfirmPayment}
                      disabled={isUploadingReceipt}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      <span>{isUploadingReceipt ? 'Mengunggah & Mengirim...' : 'Kirim Bukti ke WhatsApp (081225589199)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ThreeScene>
  );
}
