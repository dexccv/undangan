import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import { MusicProvider } from './context/MusicContext';
import { ToastProvider } from './context/ToastContext';

import Cover from './components/Cover';
import Quotes from './components/Quotes';
import Parents from './components/Parents';
import CountdownAndEvents from './components/CountdownAndEvents';
import Story from './components/Story';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Guestbook from './components/Guestbook';
import Gift from './components/Gift';
import Closing from './components/Closing';
import MusicPlayer from './components/MusicPlayer';
import CurtainReveal from './components/CurtainReveal';
import LandingPage from './components/LandingPage';
import DevDashboard from './components/DevDashboard';
import AppSkeleton from './components/ui/AppSkeleton';

function InvitationContent({ data, coupleId, guestName }) {
  const [curtainOpened, setCurtainOpened] = useState(false);

  return (
    <div className={`invitation-root ${curtainOpened ? 'curtain-has-opened' : 'curtain-closed'}`}>
      {!curtainOpened && (
        <CurtainReveal
          data={data}
          guestName={guestName}
          onOpen={() => setCurtainOpened(true)}
        />
      )}

      {/* Main invitation content */}
      <main className="invitation-main" style={{ opacity: curtainOpened ? 1 : 0.05 }}>
        <Cover data={data} />
        <Quotes data={data} />
        <Parents data={data} />
        <CountdownAndEvents data={data} />
        <Story data={data} />
        <Gallery data={data} />
        <RSVP data={data} coupleId={coupleId} />
        <Guestbook data={data} coupleId={coupleId} />
        <Gift data={data} />
        <Closing data={data} />
        <MusicPlayer />
      </main>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupleId, setCoupleId] = useState(null);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [isDevDashboard, setIsDevDashboard] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    const toParam = params.get('to');
    if (toParam) {
      setGuestName(decodeURIComponent(toParam));
    }

    if (!id) {
      const pathParts = window.location.pathname.split('/').filter((p) => p && !p.includes('.html'));
      if (pathParts.length > 0) id = pathParts[pathParts.length - 1];
    }

    if (id === 'dev') {
      setIsDevDashboard(true);
      setLoading(false);
      return;
    }

    if (!id || id === 'project%20wedding' || id === 'project wedding') {
      setIsLandingPage(true);
      setLoading(false);
      return;
    }

    setCoupleId(id);

    async function loadData() {
      try {
        const docRef = doc(db, 'couples', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cmsData = docSnap.data();
          setData(cmsData);
          document.title = `The Wedding of ${cmsData.wanita_panggilan || 'Nadia'} & ${cmsData.pria_panggilan || 'Agus'}`;
        } else if (id === 'demo') {
          const demoData = {
            id: 'demo',
            wanita_panggilan: 'Nadia',
            wanita_lengkap: 'Nadia Salsabila, S.Kom',
            wanita_ortu: 'Bpk. Ahmad Fauzi & Ibu Siti Aminah',
            wanita_ig: 'nadiasalsabila',
            rekening_wanita: '1234567890',
            bank_wanita: 'Bank BCA',
            an_wanita: 'Nadia Salsabila',
            pria_panggilan: 'Agus',
            pria_lengkap: 'Agus Pratama, S.T',
            pria_ortu: 'Bpk. Hendra Wijaya & Ibu Ratna Dewi',
            pria_ig: 'aguspratama',
            rekening_pria: '0987654321',
            bank_pria: 'Bank BCA',
            an_pria: 'Agus Pratama',
            tanggal_cover: 'Minggu, 07 Juni 2026',
            tanggal_akad: '2026-06-07T08:00:00',
            tanggal_lengkap: 'Minggu, 07 Juni 2026',
            waktu_akad: '08.00 - 10.00 WIB',
            lokasi_akad: 'Masjid Agung Al-Barkah',
            tanggal_resepsi: '2026-06-07T11:00:00',
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
            alamat_kado: 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
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
          setData(demoData);
          document.title = 'The Wedding of Nadia & Agus';
        } else {
          console.warn(`No couple data found for id: ${id}`);
        }
      } catch (err) {
        console.error('Error fetching couple data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <MusicProvider>
      <ToastProvider>
        {loading ? (
          <AppSkeleton />
        ) : isDevDashboard ? (
          <DevDashboard />
        ) : isLandingPage ? (
          <LandingPage />
        ) : !data ? (
          <div className="not-found-state">
            <div className="not-found-card">
              <h2>Undangan Tidak Ditemukan</h2>
              <p>Mohon periksa kembali tautan undangan yang Anda terima.</p>
              <a href="/" className="btn-primary-gold">Kembali ke Beranda</a>
            </div>
          </div>
        ) : (
          <InvitationContent data={data} coupleId={coupleId} guestName={guestName} />
        )}
      </ToastProvider>
    </MusicProvider>
  );
}
