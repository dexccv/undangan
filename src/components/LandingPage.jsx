import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  PaperPlaneTilt
} from '@phosphor-icons/react';
import ThreeScene from './ThreeScene';
import './LandingPage.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePackageIndex, setActivePackageIndex] = useState(1);
  const pricingGridRef = React.useRef(null);

  // State Modal Pemesanan Paket
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderPackage, setOrderPackage] = useState('Paket Gold Imperial');
  const [orderPrice, setOrderPrice] = useState('Rp 99.000');
  const [orderCoupleName, setOrderCoupleName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderEventDate, setOrderEventDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

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
    setOrderPrice(price || 'Rp 99.000');
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderCoupleName.trim() || !orderPhone.trim()) {
      Swal.fire({
        title: 'Lengkapi Data',
        text: 'Mohon masukkan nama pasangan dan nomor WhatsApp aktif.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    setIsSubmittingOrder(true);
    const newOrder = {
      id: 'ord-' + Date.now(),
      package_name: orderPackage,
      package_price: orderPrice,
      couple_name: orderCoupleName.trim(),
      customer_phone: orderPhone.trim(),
      event_date: orderEventDate || '',
      notes: orderNotes.trim() || '',
      status: 'pending',
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

    const waMsg = `Halo Admin Digitalisasi.id, saya ingin memesan:\n\n*Paket:* ${orderPackage} (${orderPrice})\n*Nama Pasangan:* ${orderCoupleName.trim()}\n*Nomor WhatsApp:* ${orderPhone.trim()}\n*Perkiraan Tanggal:* ${orderEventDate || '-'}\n*Catatan:* ${orderNotes.trim() || '-'}\n\nMohon informasi langkah selanjutnya. Terima kasih!`;
    const waUrl = `https://wa.me/6281225589199?text=${encodeURIComponent(waMsg)}`;

    await Swal.fire({
      title: 'Pesanan Berhasil Dicatat!',
      text: 'Data Anda telah tersimpan di sistem. Klik tombol di bawah untuk melanjutkan ke WhatsApp kami.',
      icon: 'success',
      confirmButtonColor: '#B8860B',
      confirmButtonText: 'Lanjut ke WhatsApp'
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOrderModalOpen(false);
    setOrderCoupleName('');
    setOrderPhone('');
    setOrderEventDate('');
    setOrderNotes('');
    setIsSubmittingOrder(false);
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
                    <h3 id="order-modal-title">Formulir Pemesanan Undangan</h3>
                    <p className="lp-order-modal-sub">Data akan langsung masuk ke panel developer</p>
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

              <div className="lp-order-package-banner">
                <div className="lp-order-package-info">
                  <span className="lp-order-package-badge">{orderPackage}</span>
                  <span className="lp-order-package-price">{orderPrice}</span>
                </div>
                <p className="lp-order-package-desc">
                  Setelah mengirim formulir, data otomatis tercatat di dashboard developer dan Anda diarahkan ke WhatsApp untuk konfirmasi detail foto &amp; acara.
                </p>
              </div>

              <form onSubmit={handleOrderSubmit} className="lp-order-form">
                <div className="lp-order-form-group">
                  <label htmlFor="order-couple-name">
                    <User size={16} weight="bold" />
                    <span>Nama Pasangan (Panggilan) *</span>
                  </label>
                  <input
                    id="order-couple-name"
                    type="text"
                    required
                    placeholder="Contoh: Nadia & Agus"
                    value={orderCoupleName}
                    onChange={(e) => setOrderCoupleName(e.target.value)}
                    className="lp-order-input"
                  />
                </div>

                <div className="lp-order-form-group">
                  <label htmlFor="order-phone">
                    <Phone size={16} weight="bold" />
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
                    <CalendarBlank size={16} weight="bold" />
                    <span>Perkiraan Tanggal Acara (Opsional)</span>
                  </label>
                  <input
                    id="order-event-date"
                    type="date"
                    value={orderEventDate}
                    onChange={(e) => setOrderEventDate(e.target.value)}
                    className="lp-order-input"
                  />
                </div>

                <div className="lp-order-form-group">
                  <label htmlFor="order-notes">
                    <NotePencil size={16} weight="bold" />
                    <span>Catatan Tambahan / Konsep Acara (Opsional)</span>
                  </label>
                  <textarea
                    id="order-notes"
                    rows={3}
                    placeholder="Contoh: Konsep modern adat Jawa, lagu latar khusus..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="lp-order-textarea"
                  ></textarea>
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
                    <PaperPlaneTilt size={18} weight="bold" />
                    <span>{isSubmittingOrder ? 'Menyimpan...' : 'Kirim Pesanan & Lanjut ke WA'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ThreeScene>
  );
}
