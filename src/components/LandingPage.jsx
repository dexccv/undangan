import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
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
  Check,
  MagnifyingGlass,
  SpinnerGap
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

  // Rekomendasi Lokasi & Integrasi Peta Google Maps / OpenStreetMap
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingLocationSuggestions, setIsLoadingLocationSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [orderLocationCoords, setOrderLocationCoords] = useState(null); // { lat, lon }
  const [orderLocationMapsUrl, setOrderLocationMapsUrl] = useState('');

  // Modal Peta Interaktif
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapPickedAddress, setMapPickedAddress] = useState('');
  const [mapPickedCoords, setMapPickedCoords] = useState({ lat: -6.2088, lon: 106.8456 }); // Default Jabodetabek
  const [isResolvingMapAddress, setIsResolvingMapAddress] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const mapContainerRef = React.useRef(null);
  const leafletMapInstanceRef = React.useRef(null);
  const leafletMarkerRef = React.useRef(null);
  const locationTimerRef = React.useRef(null);

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

  const pricingScrollTimeoutRef = React.useRef(null);
  const handlePricingScroll = () => {
    if (!pricingGridRef.current) return;
    if (pricingScrollTimeoutRef.current) clearTimeout(pricingScrollTimeoutRef.current);

    pricingScrollTimeoutRef.current = setTimeout(() => {
      const container = pricingGridRef.current;
      if (!container) return;
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
    }, 60);
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

  // Kunci scroll halaman belakang saat formulir pemesanan, modal peta, atau menu mobile terbuka
  React.useEffect(() => {
    const isAnyModalOpen = mobileMenuOpen || isOrderModalOpen || isMapModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isMapModalOpen) {
          setIsMapModalOpen(false);
        } else if (isOrderModalOpen) {
          setIsOrderModalOpen(false);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, isOrderModalOpen, isMapModalOpen]);

  // Smooth Scroll Reveal via IntersectionObserver
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    const elements = document.querySelectorAll('.lp-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  // ==========================================
  // LOGIKA PENCARIAN LOKASI (KHUSUS NEGARA INDONESIA)
  // ==========================================
  const isLocationInIndonesia = (lat, lon) => {
    // Batas koordinat geografis wilayah kepulauan Indonesia (Sabang sampai Merauke)
    return lat >= -11.5 && lat <= 6.5 && lon >= 94.5 && lon <= 141.5;
  };

  const handleLocationInputChange = (val) => {
    setOrderEventLocation(val);
    setShowLocationSuggestions(true);

    if (locationTimerRef.current) clearTimeout(locationTimerRef.current);

    if (val.trim().length < 3) {
      setLocationSuggestions([]);
      setIsLoadingLocationSuggestions(false);
      return;
    }

    setIsLoadingLocationSuggestions(true);
    locationTimerRef.current = setTimeout(async () => {
      try {
        let results = [];
        // Coba Photon Komoot dengan Bounding Box & Filter Khusus Indonesia
        try {
          const photonRes = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&bbox=95.0,-11.0,141.0,6.0&limit=10&lang=id`
          );
          const photonData = await photonRes.json();
          if (photonData?.features?.length > 0) {
            results = photonData.features
              .filter((feat) => {
                const p = feat.properties;
                const [lon, lat] = feat.geometry.coordinates;
                const isIdCountry = p.countrycode?.toUpperCase() === 'ID' || p.country?.toLowerCase() === 'indonesia';
                return isIdCountry && isLocationInIndonesia(lat, lon);
              })
              .slice(0, 6)
              .map((feat) => {
                const p = feat.properties;
                const [lon, lat] = feat.geometry.coordinates;
                const addrParts = [p.name, p.street, p.district, p.city, p.state].filter(Boolean);
                return {
                  id: `${lat}_${lon}`,
                  name: p.name || addrParts[0] || 'Tempat Acara',
                  address: addrParts.slice(1).join(', ') || p.city || 'Indonesia',
                  fullAddress: addrParts.join(', '),
                  lat,
                  lon
                };
              });
          }
        } catch (errP) {
          console.warn('Photon error, trying Nominatim fallback:', errP);
        }

        // Fallback OpenStreetMap Nominatim dengan parameter resmi countrycodes=id
        if (results.length === 0) {
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=id&limit=6&addressdetails=1`
          );
          const osmData = await osmRes.json();
          if (Array.isArray(osmData) && osmData.length > 0) {
            results = osmData
              .filter((item) => {
                const lat = parseFloat(item.lat);
                const lon = parseFloat(item.lon);
                return isLocationInIndonesia(lat, lon);
              })
              .map((item) => ({
                id: item.place_id,
                name: item.name || item.display_name.split(',')[0],
                address: item.display_name,
                fullAddress: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
              }));
          }
        }

        setLocationSuggestions(results);
      } catch (err) {
        console.warn('Location suggestion search error:', err);
      } finally {
        setIsLoadingLocationSuggestions(false);
      }
    }, 320);
  };

  const handleSelectLocation = (item) => {
    const pickedLoc = item.fullAddress || item.address || item.name;
    setOrderEventLocation(pickedLoc);
    setOrderLocationCoords({ lat: item.lat, lon: item.lon });
    setOrderLocationMapsUrl(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  // ==========================================
  // LOGIKA MODAL PETA INTERAKTIF (LEAFLET DIBATASI WILAYAH INDONESIA)
  // ==========================================
  const loadLeafletAssets = () => {
    return new Promise((resolve) => {
      if (window.L) {
        resolve(window.L);
        return;
      }
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve(window.L);
        document.body.appendChild(script);
      } else {
        const poll = setInterval(() => {
          if (window.L) {
            clearInterval(poll);
            resolve(window.L);
          }
        }, 50);
      }
    });
  };

  const reverseGeocodeCoords = async (lat, lon) => {
    if (!isLocationInIndonesia(lat, lon)) {
      setMapPickedAddress('Peringatan: Titik lokasi berada di luar wilayah Indonesia. Silakan pilih titik lokasi di Indonesia.');
      return;
    }

    setIsResolvingMapAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data?.address?.country_code && data.address.country_code !== 'id') {
        setMapPickedAddress('Peringatan: Titik lokasi berada di luar wilayah Indonesia. Silakan pilih titik di Indonesia.');
        return;
      }
      if (data?.display_name) {
        setMapPickedAddress(data.display_name);
      } else {
        setMapPickedAddress(`Titik Lokasi: ${lat.toFixed(5)}, ${lon.toFixed(5)} (Indonesia)`);
      }
    } catch (e) {
      setMapPickedAddress(`Titik Lokasi: ${lat.toFixed(5)}, ${lon.toFixed(5)} (Indonesia)`);
    } finally {
      setIsResolvingMapAddress(false);
    }
  };

  const handleOpenMapModal = async () => {
    setIsMapModalOpen(true);
    const initialQuery = orderEventLocation || '';
    setMapSearchQuery(initialQuery);
    setMapPickedAddress(initialQuery);

    const coords = orderLocationCoords || { lat: -6.2088, lon: 106.8456 }; // Default Jakarta, Indonesia
    setMapPickedCoords(coords);

    const L = await loadLeafletAssets();
    setTimeout(() => {
      if (!mapContainerRef.current) return;
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }

      // Kunci navigasi peta secara ketat di batas negara Indonesia
      const indonesiaBounds = [
        [-11.5, 94.5], // Barat Daya (Samudera Hindia dekat Jawa/NTT)
        [6.5, 141.5]   // Timur Laut (Papua & Laut Sulawesi)
      ];

      const map = L.map(mapContainerRef.current, {
        maxBounds: indonesiaBounds,
        maxBoundsViscosity: 0.9,
        minZoom: 4
      }).setView([coords.lat, coords.lon], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lon], { draggable: true }).addTo(map);
      leafletMapInstanceRef.current = map;
      leafletMarkerRef.current = marker;

      map.invalidateSize();

      if (!orderEventLocation) {
        reverseGeocodeCoords(coords.lat, coords.lon);
      }

      map.on('click', (e) => {
        if (!isLocationInIndonesia(e.latlng.lat, e.latlng.lng)) {
          Swal.fire({
            title: 'Lokasi di Luar Indonesia',
            text: 'Pilihan lokasi dibatasi hanya di dalam wilayah negara Indonesia.',
            icon: 'warning',
            confirmButtonColor: '#B8860B'
          });
          return;
        }
        marker.setLatLng(e.latlng);
        setMapPickedCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
        reverseGeocodeCoords(e.latlng.lat, e.latlng.lng);
      });

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (!isLocationInIndonesia(pos.lat, pos.lng)) {
          Swal.fire({
            title: 'Lokasi di Luar Indonesia',
            text: 'Pilihan lokasi dibatasi hanya di dalam wilayah negara Indonesia.',
            icon: 'warning',
            confirmButtonColor: '#B8860B'
          });
          return;
        }
        setMapPickedCoords({ lat: pos.lat, lon: pos.lng });
        reverseGeocodeCoords(pos.lat, pos.lng);
      });
    }, 150);
  };

  const handleSearchOnMap = async (queryText) => {
    const query = queryText ? queryText.trim() : '';
    if (!query) {
      Swal.fire({
        title: 'Ketik Lokasi',
        text: 'Silakan ketik nama gedung, masjid, hotel, jalan, atau daerah di Indonesia.',
        icon: 'info',
        confirmButtonColor: '#B8860B',
        timer: 2500
      });
      return;
    }

    setIsSearchingMap(true);
    setIsResolvingMapAddress(true);
    try {
      let foundLat = null;
      let foundLon = null;
      let foundName = '';

      // 1. Coba Photon Komoot (dengan bbox wilayah Indonesia)
      try {
        const pRes = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=95.0,-11.0,141.0,6.0&limit=5&lang=id`
        );
        const pData = await pRes.json();
        const validFeature = pData?.features?.find((feat) => {
          const [lon, lat] = feat.geometry.coordinates;
          return isLocationInIndonesia(lat, lon);
        });

        if (validFeature) {
          [foundLon, foundLat] = validFeature.geometry.coordinates;
          foundName = [
            validFeature.properties.name,
            validFeature.properties.street,
            validFeature.properties.city,
            validFeature.properties.state
          ].filter(Boolean).join(', ');
        }
      } catch (err) {
        console.warn('Photon map search error:', err);
      }

      // 2. Fallback Nominatim OpenStreetMap (countrycodes=id)
      if (!foundLat) {
        try {
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5&addressdetails=1`
          );
          const osmData = await osmRes.json();
          if (Array.isArray(osmData) && osmData.length > 0) {
            const validOsm = osmData.find((item) => isLocationInIndonesia(parseFloat(item.lat), parseFloat(item.lon)));
            if (validOsm) {
              foundLat = parseFloat(validOsm.lat);
              foundLon = parseFloat(validOsm.lon);
              foundName = validOsm.display_name;
            }
          }
        } catch (err) {
          console.warn('Nominatim map search error:', err);
        }
      }

      // 3. Fallback kedua: Tambahkan "Indonesia" pada query jika belum ketemu
      if (!foundLat && !query.toLowerCase().includes('indonesia')) {
        try {
          const osmRes2 = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Indonesia')}&countrycodes=id&limit=5&addressdetails=1`
          );
          const osmData2 = await osmRes2.json();
          if (Array.isArray(osmData2) && osmData2.length > 0) {
            const validOsm2 = osmData2.find((item) => isLocationInIndonesia(parseFloat(item.lat), parseFloat(item.lon)));
            if (validOsm2) {
              foundLat = parseFloat(validOsm2.lat);
              foundLon = parseFloat(validOsm2.lon);
              foundName = validOsm2.display_name;
            }
          }
        } catch (err) {
          console.warn('Nominatim fallback error:', err);
        }
      }

      if (foundLat && foundLon) {
        setMapPickedCoords({ lat: foundLat, lon: foundLon });
        setMapPickedAddress(foundName || 'Titik Terpilih');
        if (leafletMapInstanceRef.current) {
          leafletMapInstanceRef.current.invalidateSize();
          leafletMapInstanceRef.current.setView([foundLat, foundLon], 16, { animate: true });
        }
        if (leafletMarkerRef.current) {
          leafletMarkerRef.current.setLatLng([foundLat, foundLon]);
        }
      } else {
        Swal.fire({
          title: 'Lokasi Tidak Ditemukan di Indonesia',
          text: 'Pencarian dibatasi khusus wilayah Indonesia. Coba gunakan nama gedung, jalan, atau daerah yang lebih spesifik.',
          icon: 'info',
          confirmButtonColor: '#B8860B'
        });
      }
    } catch (e) {
      console.warn('Map search error:', e);
    } finally {
      setIsSearchingMap(false);
      setIsResolvingMapAddress(false);
    }
  };

  const handleConfirmPickedMapLocation = () => {
    if (!isLocationInIndonesia(mapPickedCoords.lat, mapPickedCoords.lon)) {
      Swal.fire({
        title: 'Lokasi di Luar Indonesia',
        text: 'Mohon tentukan titik lokasi acara yang berada di dalam wilayah Indonesia.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }
    const chosenAddress = mapPickedAddress.trim() || `Titik Lokasi (${mapPickedCoords.lat.toFixed(5)}, ${mapPickedCoords.lon.toFixed(5)})`;
    setOrderEventLocation(chosenAddress);
    setOrderLocationCoords(mapPickedCoords);
    setOrderLocationMapsUrl(`https://www.google.com/maps/search/?api=1&query=${mapPickedCoords.lat},${mapPickedCoords.lon}`);
    setIsMapModalOpen(false);
    setShowLocationSuggestions(false);
  };

  // ==========================================
  // SUBMIT FORMULIR PEMESANAN (VALIDASI KETAT WAJIB)
  // ==========================================
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    const finalWanita = orderWanitaPanggilan.trim();
    const finalPria = orderPriaPanggilan.trim();
    const finalWanitaLengkap = orderWanitaLengkap.trim();
    const finalPriaLengkap = orderPriaLengkap.trim();
    const finalPhone = orderPhone.trim();
    const finalDate = orderEventDate;
    const finalLocation = orderEventLocation.trim();
    const finalSlug = (orderSlug.trim() || `${finalWanita}-${finalPria}`).toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    // 1. Validasi Nama Panggilan (WAJIB)
    if (!finalWanita || !finalPria) {
      Swal.fire({
        title: 'Nama Panggilan Diperlukan',
        text: 'Mohon masukkan nama panggilan untuk mempelai wanita dan mempelai pria.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    // 2. Validasi Nama Lengkap & Gelar (WAJIB - Tidak Boleh Kosong)
    if (!finalWanitaLengkap) {
      Swal.fire({
        title: 'Nama Lengkap Wanita Diperlukan',
        text: 'Mohon masukkan nama lengkap dan gelar mempelai wanita.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    if (!finalPriaLengkap) {
      Swal.fire({
        title: 'Nama Lengkap Pria Diperlukan',
        text: 'Mohon masukkan nama lengkap dan gelar mempelai pria.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    // 3. Validasi Nomor WhatsApp (WAJIB)
    if (!finalPhone) {
      Swal.fire({
        title: 'Nomor WhatsApp Diperlukan',
        text: 'Mohon masukkan nomor WhatsApp aktif Anda untuk konfirmasi pesanan.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    // 4. Validasi Tanggal Acara (WAJIB - Tidak Boleh Kosong)
    if (!finalDate) {
      Swal.fire({
        title: 'Tanggal Acara Diperlukan',
        text: 'Mohon tentukan tanggal acara pernikahan agar hitung mundur dan jadwal undangan dapat ditampilkan.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    // 5. Validasi Lokasi Acara (WAJIB - Tidak Boleh Kosong)
    if (!finalLocation) {
      Swal.fire({
        title: 'Lokasi Acara Diperlukan',
        text: 'Tempat / lokasi acara pernikahan wajib diisi atau dipilih melalui peta.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }

    setIsSubmittingOrder(true);
    const orderId = 'ord-' + Date.now();
    setCreatedOrderId(orderId);

    const generatedMapsUrl = orderLocationMapsUrl || (orderLocationCoords 
      ? `https://www.google.com/maps/search/?api=1&query=${orderLocationCoords.lat},${orderLocationCoords.lon}` 
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalLocation)}`);

    const newOrder = {
      id: orderId,
      package_name: orderPackage,
      package_price: orderPrice,
      slug: finalSlug,
      couple_name: `${finalWanita} & ${finalPria}`,
      customer_phone: finalPhone,

      // Mempelai Wanita
      wanita_panggilan: finalWanita,
      wanita_lengkap: finalWanitaLengkap,
      wanita_ortu: orderWanitaOrtu.trim(),
      wanita_ig: orderWanitaIg.trim(),

      // Mempelai Pria
      pria_panggilan: finalPria,
      pria_lengkap: finalPriaLengkap,
      pria_ortu: orderPriaOrtu.trim(),
      pria_ig: orderPriaIg.trim(),

      // Musik / Lagu
      song_title: orderSongTitle.trim(),

      // Acara, Doa & Catatan
      event_date: finalDate,
      event_location: finalLocation,
      event_location_maps_url: generatedMapsUrl,
      location_coords: orderLocationCoords || null,
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

  const compressReceiptImage = (file, maxWidth = 800, quality = 0.7) => {
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
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
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

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      Swal.fire({
        title: 'Ukuran Terlalu Besar',
        text: 'Maksimal ukuran berkas bukti transfer adalah 15 MB.',
        icon: 'warning',
        confirmButtonColor: '#B8860B'
      });
      return;
    }
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
    // 1. Validasi WAJIB: Cegah lanjut jika bukti transfer belum diunggah
    if (!receiptFile) {
      Swal.fire({
        title: 'Bukti Pembayaran Diperlukan',
        text: 'Silakan pilih dan lampirkan foto/screenshot bukti transfer terlebih dahulu sebelum melanjutkan.',
        icon: 'warning',
        confirmButtonColor: '#B8860B',
        confirmButtonText: 'Pilih Bukti Transfer'
      });
      return;
    }

    setIsUploadingReceipt(true);
    let receiptUrl = '';
    let receiptThumb = '';

    // Siapkan thumbnail terkompresi untuk penyimpanan lokal instan
    try {
      receiptThumb = await compressReceiptImage(receiptFile, 800, 0.7);
    } catch (e) {
      receiptThumb = receiptPreview || '';
    }

    // 2. Unggah ke Firebase Storage dengan timeout 2.5 detik (mencegah hang/CORS retry freeze pada browser)
    try {
      const safeName = (receiptFile.name || 'bukti.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `orders/receipts/${createdOrderId || Date.now()}_${safeName}`);
      
      const uploadPromise = (async () => {
        const uploadRes = await uploadBytes(storageRef, receiptFile);
        return await getDownloadURL(uploadRes.ref);
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage timeout/CORS')), 2500)
      );

      receiptUrl = await Promise.race([uploadPromise, timeoutPromise]);
    } catch (err) {
      console.warn('Firebase Storage upload fallback (CORS / network):', err);
      receiptUrl = '';
    }

    // 3. Update status & bukti di localStorage agar tersimpan di antrean DevDashboard
    try {
      const localOrders = JSON.parse(localStorage.getItem('digitalisasi_orders') || '[]');
      const updated = localOrders.map((o) => {
        if (o.id === createdOrderId) {
          return {
            ...o,
            status: 'pending',
            receipt_url: receiptUrl,
            receipt_name: receiptFile.name || '',
            receipt_preview: receiptThumb || '',
            has_receipt: true
          };
        }
        return o;
      });
      localStorage.setItem('digitalisasi_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage order update notice:', e);
    }

    // 4. Update di Firestore orders jika permissions mengizinkan
    try {
      if (createdOrderId) {
        await Promise.race([
          setDoc(doc(db, 'orders', createdOrderId), {
            status: 'pending',
            receipt_url: receiptUrl,
            receipt_name: receiptFile.name || '',
            has_receipt: true
          }, { merge: true }),
          new Promise((resolve) => setTimeout(resolve, 1500))
        ]);
      }
    } catch (err) {
      console.warn('Firestore orders update notice (rules/offline):', err);
    }

    // 5. Susun format pesan WhatsApp ke Developer: 081225589199
    const finalWanita = orderWanitaPanggilan.trim();
    const finalPria = orderPriaPanggilan.trim();
    const finalPhone = orderPhone.trim();
    const finalSlug = (orderSlug.trim() || `${finalWanita}-${finalPria}`).toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    const waLines = [
      `Halo Developer Digitalisasi.id (081225589199), saya telah melakukan pemesanan dan pembayaran via QRIS:`,
      ``,
      `*Paket:* ${orderPackage} (${orderPrice})`,
      `*Nama Tautan Undangan:* domainanda.com/?id=${finalSlug}`,
      `*Nomor WhatsApp:* ${finalPhone}`,
      ``,
      `*Mempelai Wanita:* ${finalWanita} (${orderWanitaLengkap.trim()})`,
      orderWanitaOrtu.trim() ? `*Orang Tua Wanita:* ${orderWanitaOrtu.trim()}` : null,
      orderWanitaIg.trim() ? `*Instagram Wanita:* ${orderWanitaIg.trim()}` : null,
      ``,
      `*Mempelai Pria:* ${finalPria} (${orderPriaLengkap.trim()})`,
      orderPriaOrtu.trim() ? `*Orang Tua Pria:* ${orderPriaOrtu.trim()}` : null,
      orderPriaIg.trim() ? `*Instagram Pria:* ${orderPriaIg.trim()}` : null,
      ``,
      orderSongTitle.trim() ? `*Lagu Pilihan:* ${orderSongTitle.trim()}` : null,
      `*Tanggal Acara:* ${orderEventDate}`,
      `*Lokasi Acara:* ${orderEventLocation.trim()}`,
      orderLocationMapsUrl ? `*Peta Lokasi:* ${orderLocationMapsUrl}` : null,
      orderNotes.trim() ? `*Catatan Tambahan:* ${orderNotes.trim()}` : null,
      ``,
      `*Status Pembayaran:* Telah melakukan transfer QRIS`,
      `*File Bukti:* ${receiptFile.name} (${(receiptFile.size / 1024).toFixed(1)} KB)`,
      receiptUrl ? `*Link Bukti:* ${receiptUrl}` : `*(Foto bukti transfer dilampirkan langsung di chat WA ini)*`,
      ``,
      `Mohon segera diproses pembuatan undangan digital kami. Terima kasih!`
    ].filter((line) => line !== null).join('\n');

    const waUrl = `https://wa.me/6281225589199?text=${encodeURIComponent(waLines)}`;

    try {
      await Swal.fire({
        title: 'Pesanan & Bukti Pembayaran Diterima!',
        html: `
          <div style="font-size: 0.95rem; line-height: 1.5; color: #444; text-align: left;">
            <p style="margin-bottom: 0.6rem;">Data pesanan untuk <strong>${finalWanita} & ${finalPria}</strong> dan bukti transfer <strong>${receiptFile.name}</strong> telah dicatat ke antrean sistem.</p>
            <div style="margin-top: 0.8rem; padding: 0.75rem 0.9rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; font-size: 0.88rem;">
              Silakan klik tombol di bawah untuk membuka WhatsApp Developer (<strong>081225589199</strong>) dan kirimkan juga foto bukti transfer tersebut di chat agar langsung diverifikasi &amp; dibuatkan undangannya.
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Buka WhatsApp Developer',
        showCancelButton: true,
        cancelButtonText: 'Tutup'
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
      });
    } catch (swalErr) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsUploadingReceipt(false);
      setIsOrderModalOpen(false);
      setOrderStep('form');
      setReceiptFile(null);
      setReceiptPreview(null);
    }
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
            {/* Welcoming Badge ("Seperti Disambut") */}
            <div className="lp-welcome-badge">
              <FlowerLotus size={16} weight="fill" className="lp-welcome-icon" />
              <span>Selamat Datang di Digitalisasi.id • Platform Undangan Digital Eksklusif</span>
              <span className="lp-welcome-dot"></span>
            </div>

            <h1 className="lp-title lp-anim-title">Undangan Digital Premium, Elegan &amp; Bebas Ribet</h1>
            <p className="lp-subtitle lp-anim-sub">
              Hadirkan kesan pertama yang berkelas untuk seluruh tamu undangan. Lengkap dengan animasi pembuka tirai mewah, galeri foto prewedding sinematik, musik latar syahdu, serta pencatatan konfirmasi kehadiran tamu secara otomatis.
            </p>
            <div className="lp-hero-actions lp-anim-actions">
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
            <div className="lp-trust-strip lp-anim-strip">
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
          <div className="lp-hero-showcase lp-anim-mockup" aria-hidden="true">
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
          <div className="lp-section-header lp-reveal">
            <h2 className="lp-section-title">Mengapa Memilih Digitalisasi.id?</h2>
            <p className="lp-section-sub">Diciptakan dengan desain presisi tinggi agar setiap tamu undangan Anda merasa disambut dengan istimewa:</p>
          </div>

          <div className="lp-feature-grid">
            <div className="lp-feature-card lp-reveal lp-reveal-stagger-1">
              <div className="lp-feature-icon-box">
                <Sparkle size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Animasi Tirai Saat Dibuka</h3>
              <p>Sensasi membuka tirai megah saat tamu pertama kali mengklik link, memberikan impresi pertama yang eksklusif.</p>
            </div>

            <div className="lp-feature-card lp-reveal lp-reveal-stagger-2">
              <div className="lp-feature-icon-box">
                <Lightning size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Cepat &amp; Nyaman Dibuka di HP</h3>
              <p>Telah disesuaikan khusus untuk seluruh ponsel Android &amp; iPhone tanpa kendala geser atau ukuran yang terpotong.</p>
            </div>

            <div className="lp-feature-card lp-reveal lp-reveal-stagger-3">
              <div className="lp-feature-icon-box">
                <MusicNotes size={30} weight="duotone" className="lp-feature-icon" />
              </div>
              <h3>Musik Latar &amp; Galeri Foto</h3>
              <p>Latar lagu romantis pilihan dengan tombol putar fleksibel serta susunan album foto prewedding yang memukau.</p>
            </div>

            <div className="lp-feature-card lp-reveal lp-reveal-stagger-4">
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
          <div className="lp-section-header lp-reveal">
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
            <div className="lp-price-card lp-reveal lp-reveal-stagger-1">
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
            <div className="lp-price-card lp-popular lp-reveal lp-reveal-stagger-2">
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
            <div className="lp-price-card lp-reveal lp-reveal-stagger-3">
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
          <div className="lp-footer-content lp-reveal">
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
                        <span>Nama Lengkap &amp; Gelar Mempelai Wanita *</span>
                      </label>
                      <input
                        id="order-wanita-lengkap"
                        type="text"
                        required
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
                        <span>Nama Lengkap &amp; Gelar Mempelai Pria *</span>
                      </label>
                      <input
                        id="order-pria-lengkap"
                        type="text"
                        required
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
                        <span>Tanggal Acara Pernikahan *</span>
                      </label>
                      <input
                        id="order-event-date"
                        type="date"
                        required
                        value={orderEventDate}
                        onChange={(e) => setOrderEventDate(e.target.value)}
                        className="lp-order-input"
                      />
                    </div>
                  </div>

                  {/* Tempat / Lokasi Acara dengan Autocomplete & Maps Picker */}
                  <div className="lp-order-form-group full-width lp-location-field-wrapper">
                    <div className="lp-location-header-row">
                      <label htmlFor="order-location">
                        <span>Tempat / Lokasi Acara Pernikahan *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleOpenMapModal}
                        className="lp-btn-pick-map-inline"
                        title="Buka peta interaktif untuk menentukan titik koordinat presisi"
                      >
                        <MapPin size={15} weight="bold" />
                        <span>Pilih Melalui Maps</span>
                      </button>
                    </div>

                    <div className="lp-location-input-container">
                      <div className="lp-location-input-box">
                        <MapPin size={18} weight="duotone" className="lp-location-input-icon" />
                        <input
                          id="order-location"
                          type="text"
                          required
                          autoComplete="off"
                          placeholder="Ketik nama gedung, masjid, hotel, atau alamat di Indonesia..."
                          value={orderEventLocation}
                          onChange={(e) => handleLocationInputChange(e.target.value)}
                          onFocus={() => {
                            if (locationSuggestions.length > 0) setShowLocationSuggestions(true);
                          }}
                          className="lp-order-input lp-order-input-with-icon"
                        />
                        {isLoadingLocationSuggestions && (
                          <div className="lp-location-spinner" title="Mencari rekomendasi lokasi di Indonesia..." />
                        )}
                      </div>

                      {/* Dropdown Rekomendasi Lokasi ala Google Maps */}
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="lp-location-suggestions-dropdown">
                          <div className="lp-suggestions-header">
                            <span>Saran Lokasi di Indonesia (Terverifikasi):</span>
                            <button
                              type="button"
                              onClick={() => setShowLocationSuggestions(false)}
                              className="lp-btn-close-suggestions"
                            >
                              Tutup
                            </button>
                          </div>
                          {locationSuggestions.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="lp-suggestion-item"
                              onClick={() => handleSelectLocation(item)}
                            >
                              <div className="lp-suggestion-icon-wrap">
                                <MapPin size={16} weight="fill" />
                              </div>
                              <div className="lp-suggestion-text-wrap">
                                <strong className="lp-suggestion-title">{item.name}</strong>
                                <small className="lp-suggestion-addr">{item.address}</small>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Badge saat lokasi terhubung dengan peta */}
                    {orderLocationCoords && (
                      <div className="lp-location-verified-badge">
                        <CheckCircle size={14} weight="bold" />
                        <span>Titik Peta Presisi ({orderLocationCoords.lat.toFixed(4)}, {orderLocationCoords.lon.toFixed(4)})</span>
                        {orderLocationMapsUrl && (
                          <a
                            href={orderLocationMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-link-view-gmaps"
                          >
                            Buka di Google Maps
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="lp-order-form-group full-width">
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

                  <div className="lp-order-modal-actions">
                    <button 
                      type="button" 
                      className="lp-btn lp-btn-cancel"
                      onClick={() => setIsOrderModalOpen(false)}
                      disabled={isSubmittingOrder}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="lp-btn lp-btn-proceed lp-order-submit-btn"
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
                      <span>Unggah Bukti Pembayaran / Transfer <strong style={{ color: '#dc2626' }}>*</strong></span>
                      <span className="lp-label-required" style={{ color: '#dc2626', fontWeight: 600 }}>(Wajib Dilampirkan)</span>
                    </label>

                    <div className="lp-upload-receipt-area">
                      <label className={`lp-upload-file-picker ${receiptFile ? 'is-selected' : ''}`}>
                        <UploadSimple size={22} weight="bold" />
                        <span>{receiptFile ? `File Dipilih: ${receiptFile.name}` : 'Pilih Foto Bukti Transfer / Screenshot Pembayaran *'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptChange}
                          className="sr-only"
                        />
                      </label>
                      <small className="lp-upload-hint">Format file JPG, PNG, atau tangkapan layar (screenshot transfer bank / e-wallet). Maks 15MB.</small>
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
                      className="lp-btn lp-btn-cancel"
                      onClick={() => setOrderStep('form')}
                      disabled={isUploadingReceipt}
                    >
                      <ArrowLeft size={16} weight="bold" />
                      <span>Ubah Data Formulir</span>
                    </button>
                    <button 
                      type="button" 
                      className={`lp-btn lp-btn-proceed lp-order-submit-btn ${!receiptFile ? 'lp-btn-needs-receipt' : ''}`}
                      onClick={handleFinalConfirmPayment}
                      disabled={isUploadingReceipt}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      <span>{isUploadingReceipt ? 'Memproses & Menyiapkan WhatsApp...' : 'Kirim Bukti ke WhatsApp (081225589199)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL PICKER PETA INTERAKTIF (GOOGLE MAPS / OPENSTREETMAP STYLE) */}
        {isMapModalOpen && (
          <div className="lp-map-modal-backdrop" onClick={() => setIsMapModalOpen(false)}>
            <div className="lp-order-modal-card lp-map-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="lp-map-modal-header">
                <div>
                  <h3 className="lp-map-modal-title">Pilih Titik Lokasi Acara di Peta (Khusus Indonesia)</h3>
                  <p className="lp-map-modal-subtitle">Cari atau klik pada peta di seluruh wilayah Indonesia untuk menentukan titik koordinat yang presisi</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="lp-map-modal-close"
                  aria-label="Tutup Peta"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="lp-map-modal-body">
                {/* Search Bar di dalam Peta */}
                <div className="lp-map-search-bar">
                  <div className="lp-map-search-input-wrap">
                    <MagnifyingGlass size={18} weight="bold" className="lp-map-search-icon" />
                    <input
                      type="text"
                      placeholder="Cari gedung, masjid, hotel, kota..."
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchOnMap(mapSearchQuery);
                        }
                      }}
                      className="lp-map-search-input"
                    />
                    {mapSearchQuery && (
                      <button
                        type="button"
                        className="lp-map-search-clear"
                        onClick={() => setMapSearchQuery('')}
                        aria-label="Hapus kata kunci"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="lp-map-search-btn"
                    onClick={() => handleSearchOnMap(mapSearchQuery)}
                    disabled={isSearchingMap}
                    title="Cari lokasi di peta"
                  >
                    {isSearchingMap ? (
                      <>
                        <SpinnerGap size={16} weight="bold" className="lp-spin" />
                        <span>Mencari...</span>
                      </>
                    ) : (
                      <>
                        <MagnifyingGlass size={16} weight="bold" />
                        <span>Cari</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Kontainer Peta Leaflet */}
                <div id="interactive-map-container" ref={mapContainerRef} className="lp-leaflet-map-frame" />

                {/* Bar Alamat Terpilih */}
                <div className="lp-map-resolved-box">
                  <div className="lp-map-resolved-header">
                    <MapPin size={16} weight="fill" style={{ color: 'var(--lp-gold-hover)' }} />
                    <span>Alamat Titik Terpilih:</span>
                  </div>
                  <p className="lp-map-resolved-text">
                    {isResolvingMapAddress ? 'Sedang membaca nama tempat dari titik koordinat...' : (mapPickedAddress || 'Klik pada peta atau geser pin marker untuk memilih alamat.')}
                  </p>
                  <small className="lp-map-resolved-coords">
                    Koordinat: {mapPickedCoords.lat.toFixed(5)}, {mapPickedCoords.lon.toFixed(5)}
                  </small>
                </div>
              </div>

              <div className="lp-order-modal-actions lp-map-modal-actions">
                <button
                  type="button"
                  className="lp-btn lp-btn-cancel"
                  onClick={() => setIsMapModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="lp-btn lp-btn-proceed"
                  onClick={handleConfirmPickedMapLocation}
                >
                  <Check size={18} weight="bold" />
                  <span>Gunakan Lokasi Ini</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThreeScene>
  );
}
