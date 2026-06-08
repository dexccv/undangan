import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

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

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupleId, setCoupleId] = useState('nadia-agus');

  useEffect(() => {
    // Scroll Reveal Logic
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

    // We need to observe after components mount, so we do it periodically or wait
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      elements.forEach(el => observer.observe(el));
    };

    let id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      const pathParts = window.location.pathname.split('/').filter(p => p && !p.includes('.html'));
      if (pathParts.length > 0) id = pathParts[pathParts.length - 1];
    }
    if (!id || id === 'project%20wedding' || id === 'project wedding') id = 'nadia-agus';
    setCoupleId(id);

    async function loadData() {
      try {
        const docRef = doc(db, 'couples', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cmsData = docSnap.data();
          setData(cmsData);
          document.title = `The Wedding of ${cmsData.wanita_panggilan} & ${cmsData.pria_panggilan}`;
          setTimeout(observeElements, 500); // Wait for render
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Guest name parsing logic
    const guestNameParam = new URLSearchParams(window.location.search).get('to');
    if (guestNameParam) {
      setTimeout(() => {
        const guestEl = document.getElementById('guest-name');
        if (guestEl) guestEl.innerText = guestNameParam;
      }, 500);
    }
    
    return () => observer.disconnect();
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Loading...</div>;
  if (!data) return <div style={{textAlign: 'center', padding: '100px'}}>Undangan Tidak Ditemukan</div>;

  return (
    <>
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
      
      {/* Toast Notification placeholder */}
      <div id="toast" role="status" aria-live="polite" aria-atomic="true" className="toast"></div>
    </>
  );
}
