import React, { useState } from 'react';
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
  Users
} from '@phosphor-icons/react';
import ThreeScene from './ThreeScene';
import './LandingPage.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePackageIndex, setActivePackageIndex] = useState(1);
  const pricingGridRef = React.useRef(null);

  const scrollToPackage = (idx) => {
    setActivePackageIndex(idx);
    if (pricingGridRef.current) {
      const cards = pricingGridRef.current.children;
      if (cards && cards[idx]) {
        cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
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
    if (window.innerWidth <= 768 && pricingGridRef.current) {
      const timer = setTimeout(() => {
        scrollToPackage(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

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
              <a href="#features">Fitur Lengkap</a>
              <a href="#pricing">Pilihan Paket</a>
              <a href="/?id=demo" className="lp-link-demo">
                <Eye size={16} weight="bold" />
                <span>Lihat Contoh Undangan</span>
              </a>
              <a 
                href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20membuat%20undangan%20digital"
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lp-mobile-drawer">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Fitur Lengkap</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pilihan Paket</a>
              <a href="/?id=demo" onClick={() => setMobileMenuOpen(false)}>Lihat Contoh Undangan</a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="lp-btn lp-btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pesan Undangan Sekarang
              </a>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <div className="lp-badge">
              <Sparkle size={15} weight="fill" />
              <span>STANDAR BARU UNDANGAN DIGITAL MODERN</span>
            </div>
            <h1 className="lp-title">Undangan Digital Premium, Elegan &amp; Bebas Ribet</h1>
            <p className="lp-subtitle">
              Hadirkan kesan pertama yang berkelas untuk seluruh tamu undangan. Lengkap dengan animasi pembuka tirai mewah, galeri foto prewedding sinematik, musik latar syahdu, serta pencatatan konfirmasi kehadiran tamu secara otomatis.
            </p>
            <div className="lp-hero-actions">
              <a href="#pricing" className="lp-btn lp-btn-primary">
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
            <span className="lp-section-pill">KEUNGGULAN UTAMA</span>
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
            <span className="lp-section-pill">PILIHAN PAKET</span>
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
              <a 
                href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Silver" 
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-outline lp-full-width"
              >
                Pilih Paket Silver
              </a>
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
              <a 
                href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Gold%20Imperial" 
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-primary lp-full-width"
              >
                Pilih Paket Gold Imperial
              </a>
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
              <a 
                href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Royal%20Platinum" 
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-outline lp-full-width"
              >
                Pilih Paket Royal Platinum
              </a>
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
              <a 
                href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20konsultasi%20undangan%20pernikahan" 
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-primary lp-btn-large"
              >
                <WhatsappLogo size={22} weight="fill" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
            <div className="lp-footer-bottom">
              <p>&copy; {new Date().getFullYear()} Digitalisasi.id. Seluruh hak cipta dilindungi undang-undang.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThreeScene>
  );
}
