import React, { useEffect } from 'react';
import { Sparkles, Zap, Music, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import ThreeScene from './ThreeScene';
import './LandingPage.css';

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lp-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.lp-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <ThreeScene>
      <div className="lp-container">
        {/* Navigation */}
        <nav className="lp-nav">
          <div className="lp-logo">Digitalisasi.id</div>
          <div className="lp-nav-links">
            <a href="#features">Fitur</a>
            <a href="#pricing">Harga</a>
            <a href="#contact" className="lp-btn lp-btn-outline">Hubungi Kami</a>
          </div>
        </nav>

        {/* Space for Portal (Page 1) */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className="lp-title" style={{ textAlign: 'center', opacity: 0.8 }}>Scroll to Enter</h1>
        </div>

        {/* Hero Section (Page 2) */}
        <section className="lp-hero" style={{ height: '100vh' }}>
          <div className="lp-hero-content">
            <h1 className="lp-title">Undangan Digital Premium & Elegan</h1>
            <p className="lp-subtitle">
              Buat momen pernikahan Anda tak terlupakan dengan undangan digital interaktif, mewah, dan mudah dibagikan.
            </p>
            <div className="lp-hero-actions">
              <a href="#pricing" className="lp-btn lp-btn-primary">Lihat Paket Harga</a>
              <a href="#features" className="lp-btn lp-btn-secondary">Jelajahi Fitur</a>
            </div>
          </div>
        </section>

        {/* Space for Tunnel (Page 3) */}
        <div style={{ height: '50vh' }}></div>

        {/* Features Section (Page 4) */}
        <section id="features" className="lp-features" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="lp-section-title lp-reveal">Mengapa Memilih Kami?</h2>
          <div className="lp-feature-grid">
            <div className="lp-feature-card lp-reveal" style={{ transitionDelay: '100ms' }}>
              <div className="lp-feature-icon"><Sparkles size={40} color="var(--lp-primary)" /></div>
              <h3>Desain Eksklusif</h3>
              <p>Pilihan tema premium dengan animasi halus (micro-animations) yang memukau tamu undangan Anda.</p>
            </div>
            <div className="lp-feature-icon-card lp-feature-card lp-reveal" style={{ transitionDelay: '200ms' }}>
              <div className="lp-feature-icon"><Zap size={40} color="var(--lp-primary)" /></div>
              <h3>Cepat & Mudah</h3>
              <p>Undangan langsung jadi tanpa proses rumit. Anda bisa langsung membagikannya dalam hitungan menit.</p>
            </div>
            <div className="lp-feature-card lp-reveal" style={{ transitionDelay: '300ms' }}>
              <div className="lp-feature-icon"><Music size={40} color="var(--lp-primary)" /></div>
              <h3>Musik & Galeri</h3>
              <p>Dilengkapi fitur musik latar belakang dan galeri foto romantis untuk membangun suasana.</p>
            </div>
            <div className="lp-feature-card lp-reveal" style={{ transitionDelay: '400ms' }}>
              <div className="lp-feature-icon"><BookOpen size={40} color="var(--lp-primary)" /></div>
              <h3>RSVP & Buku Tamu</h3>
              <p>Kelola konfirmasi kehadiran dan dapatkan ucapan hangat langsung di dalam satu platform.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section (Page 5) */}
        <section id="pricing" className="lp-pricing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="lp-section-title lp-reveal">Pilih Paket Undangan Anda</h2>
          <div className="lp-pricing-grid">
            <div className="lp-price-card lp-reveal" style={{ transitionDelay: '100ms' }}>
              <div className="lp-price-header">
                <h3>Basic</h3>
                <div className="lp-price">Rp 49.000</div>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle2 size={18} color="#10b981" /> Tema Standard</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Informasi Acara</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Navigasi Lokasi (Google Maps)</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Galeri (Max 5 Foto)</li>
                <li className="lp-disabled"><XCircle size={18} color="#94a3b8" /> Musik Latar</li>
                <li className="lp-disabled"><XCircle size={18} color="#94a3b8" /> RSVP & Buku Tamu</li>
              </ul>
              <a href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Basic" className="lp-btn lp-btn-outline lp-full-width">Pilih Basic</a>
            </div>

            <div className="lp-price-card lp-popular lp-reveal" style={{ transitionDelay: '200ms' }}>
              <div className="lp-popular-badge">Terpopuler</div>
              <div className="lp-price-header">
                <h3>Premium</h3>
                <div className="lp-price">Rp 99.000</div>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle2 size={18} color="#10b981" /> Tema Premium (Animasi Eksklusif)</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Informasi Acara & Hitung Mundur</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Navigasi Lokasi (Google Maps)</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Galeri (Max 15 Foto)</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Musik Latar Pilihan</li>
                <li><CheckCircle2 size={18} color="#10b981" /> RSVP & Buku Tamu</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Kisah Cinta (Love Story)</li>
              </ul>
              <a href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Premium" className="lp-btn lp-btn-primary lp-full-width">Pilih Premium</a>
            </div>

            <div className="lp-price-card lp-reveal" style={{ transitionDelay: '300ms' }}>
              <div className="lp-price-header">
                <h3>Custom</h3>
                <div className="lp-price">Rp 249.000</div>
              </div>
              <ul className="lp-price-features">
                <li><CheckCircle2 size={18} color="#10b981" /> Semua Fitur Premium</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Custom Desain Tema</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Custom Domain (.com)</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Galeri Tanpa Batas</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Filter Instagram Khusus</li>
                <li><CheckCircle2 size={18} color="#10b981" /> Prioritas Support 24/7</li>
              </ul>
              <a href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Paket%20Custom" className="lp-btn lp-btn-outline lp-full-width">Hubungi Kami</a>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer id="contact" className="lp-footer" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="lp-reveal">Siap membagikan hari bahagia Anda?</h2>
          <p className="lp-reveal" style={{ transitionDelay: '100ms' }}>Hubungi tim kami sekarang dan dapatkan penawaran spesial!</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="https://wa.me/6281234567890" className="lp-btn lp-btn-primary lp-btn-large lp-reveal" style={{ transitionDelay: '200ms' }}>Hubungi via WhatsApp</a>
          </div>
          <div className="lp-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Digitalisasi.id. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ThreeScene>
  );
}
