import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
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
import { Link, Eye, Edit2, Trash2, Copy, Send, Download, Upload, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import './DevDashboard.css';

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [couples, setCouples] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [isSaving, setIsSaving] = useState(false);

  // Link Generator State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedCoupleForLinks, setSelectedCoupleForLinks] = useState(null);
  const [guestData, setGuestData] = useState([]); // Array of {name, phone}
  const [waTemplate, setWaTemplate] = useState('Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nBerikut link undangan kami:\n{link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara pernikahan kami.\n\nTerima kasih.');
  const [generatedLinks, setGeneratedLinks] = useState([]);

  // Guest Data Modal State
  const [isGuestDataModalOpen, setIsGuestDataModalOpen] = useState(false);
  const [selectedCoupleForData, setSelectedCoupleForData] = useState(null);
  const [activeTab, setActiveTab] = useState('rsvp');
  const [rsvpList, setRsvpList] = useState([]);
  const [guestbookList, setGuestbookList] = useState([]);
  const [loadingGuestData, setLoadingGuestData] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCouples();
      } else {
        setLoadingData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  function getInitialFormData() {
    return {
      id: '',
      wanita_panggilan: '',
      wanita_lengkap: '',
      wanita_ortu: '',
      rekening_wanita: '',
      pria_panggilan: '',
      pria_lengkap: '',
      pria_ortu: '',
      rekening_pria: '',
      tanggal_cover: '',
      tanggal_lengkap: '',
      target_countdown: '',
      waktu_akad: '',
      waktu_resepsi: '',
      lokasi_akad: '',
      lokasi_resepsi: '',
      alamat_baris1: '',
      alamat_baris2: '',
      link_maps: '',
      url_border: 'assets/floral_border.png'
    };
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Swal.fire('Login Gagal', 'Email atau password salah!', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchCouples = async () => {
    if (!auth.currentUser) {
      Swal.fire('Error', 'Harap login kembali.', 'error');
      return;
    }
    setLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'couples'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setCouples(data);
    } catch (error) {
      console.error("Error fetching couples:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (couple) => {
    setFormData(couple);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin menghapus?',
      text: 'Data undangan ini akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "couples", id));
        Swal.fire('Terhapus!', 'Undangan berhasil dihapus.', 'success');
        fetchCouples();
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const docId = formData.id.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    if (!docId) {
      Swal.fire('Peringatan', 'ID Pasangan tidak boleh kosong!', 'warning');
      setIsSaving(false);
      return;
    }

    const dataToSave = { ...formData };
    delete dataToSave.id; // remove id from fields to save

    try {
      await setDoc(doc(db, "couples", docId), dataToSave);
      Swal.fire({ title: 'Berhasil!', text: 'Data berhasil disimpan!', icon: 'success', timer: 2000, showConfirmButton: false });
      setIsFormOpen(false);
      fetchCouples();
    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenGuestData = async (couple) => {
    setSelectedCoupleForData(couple);
    setActiveTab('rsvp');
    setRsvpList([]);
    setGuestbookList([]);
    setIsGuestDataModalOpen(true);
    setLoadingGuestData(true);
    
    try {
      // Fetch RSVP
      const rsvpSnap = await getDocs(query(collection(db, `invitations/${couple.id}/rsvp`), orderBy("timestamp", "desc")));
      const rsvps = [];
      rsvpSnap.forEach(d => rsvps.push({ id: d.id, ...d.data() }));
      setRsvpList(rsvps);

      // Fetch Guestbook
      const gbSnap = await getDocs(query(collection(db, `invitations/${couple.id}/guestbook`), orderBy("timestamp", "desc")));
      const gbs = [];
      gbSnap.forEach(d => gbs.push({ id: d.id, ...d.data() }));
      setGuestbookList(gbs);
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data tamu: ' + error.message, 'error');
    } finally {
      setLoadingGuestData(false);
    }
  };

  const exportGuestDataToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    if (rsvpList.length > 0) {
      const rsvpData = rsvpList.map(r => ({
        "Nama": r.name,
        "Status": r.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir',
        "Jumlah Orang": r.guest_count || 0,
        "Waktu": r.timestamp ? r.timestamp.toDate().toLocaleString('id-ID') : '-'
      }));
      const wsRsvp = XLSX.utils.json_to_sheet(rsvpData);
      XLSX.utils.book_append_sheet(wb, wsRsvp, "RSVP");
    }

    if (guestbookList.length > 0) {
      const gbData = guestbookList.map(g => ({
        "Nama": g.name,
        "Ucapan & Doa": g.message,
        "Waktu": g.timestamp ? g.timestamp.toDate().toLocaleString('id-ID') : '-'
      }));
      const wsGb = XLSX.utils.json_to_sheet(gbData);
      XLSX.utils.book_append_sheet(wb, wsGb, "Ucapan & Doa");
    }

    if (rsvpList.length === 0 && guestbookList.length === 0) {
      Swal.fire('Info', 'Belum ada data untuk diunduh.', 'info');
      return;
    }

    XLSX.writeFile(wb, `Data_Tamu_${selectedCoupleForData.id}.xlsx`);
  };

  const handleOpenLinkGenerator = (couple) => {
    setSelectedCoupleForLinks(couple);
    setGuestData([]);
    setGeneratedLinks([]);
    setIsLinkModalOpen(true);
  };

  const downloadExcelTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Nama Tamu": "Bapak Budi", "No WhatsApp": "081234567890" },
      { "Nama Tamu": "Andi & Keluarga", "No WhatsApp": "628987654321" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");
    XLSX.writeFile(wb, "Template_Tamu_Undangan.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const parsedGuests = data.map(row => {
        // Fallbacks for different column names
        const name = row['Nama Tamu'] || row['Nama'] || row['Name'] || Object.values(row)[0] || '';
        let phone = row['No WhatsApp'] || row['No WA'] || row['Phone'] || Object.values(row)[1] || '';
        
        // Clean phone number (remove spaces, -, +, leading 0 replaced with 62)
        if (phone) {
          phone = String(phone).replace(/\D/g, '');
          if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
          }
        }
        return { name: String(name).trim(), phone: phone };
      }).filter(g => g.name);

      setGuestData(parsedGuests);
    };
    reader.readAsBinaryString(file);
  };

  const handleGenerateLinks = () => {
    if (guestData.length === 0) {
      Swal.fire('Peringatan', 'Belum ada data tamu! Silakan import dari Excel terlebih dahulu.', 'warning');
      return;
    }
    
    const domain = window.location.origin;
    
    const results = guestData.map(guest => {
      const urlSafeName = encodeURIComponent(guest.name);
      const link = `${domain}/?id=${selectedCoupleForLinks.id}&to=${urlSafeName}`;
      
      let msg = waTemplate.replace(/{nama_tamu}/g, guest.name);
      msg = msg.replace(/{link}/g, link);
      
      return {
        name: guest.name,
        phone: guest.phone,
        link,
        message: msg
      };
    });
    setGeneratedLinks(results);
  };

  const handleCopyMessage = (msg) => {
    navigator.clipboard.writeText(msg).then(() => {
      Swal.fire({ title: 'Tersalin!', text: 'Pesan disalin ke clipboard.', icon: 'success', timer: 1500, showConfirmButton: false });
    });
  };

  if (!user) {
    return (
      <div className="dev-login-container">
        <div className="dev-login-card">
          <div className="dev-login-header">
            <h2>Digitalisasi.id</h2>
            <p>Admin Dashboard Login</p>
          </div>
          <form onSubmit={handleLogin} className="dev-login-form">
            <div className="dev-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="admin@digitalisasi.id"
              />
            </div>
            <div className="dev-input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            {loginError && <div className="dev-error-message">{loginError}</div>}
            <button type="submit" className="dev-btn dev-btn-primary" disabled={isLoggingIn}>
              {isLoggingIn ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-dashboard">
      <nav className="dev-sidebar">
        <div className="dev-brand">
          <h2>Digitalisasi.id</h2>
          <span className="dev-badge">ADMIN</span>
        </div>
        <div className="dev-nav-items">
          <button className="dev-nav-item active">Manajemen Undangan</button>
          {/* Add more nav items here if needed */}
        </div>
        <div className="dev-user-info">
          <p className="dev-user-email">{user.email}</p>
          <button onClick={handleLogout} className="dev-btn dev-btn-danger dev-btn-sm">Logout</button>
        </div>
      </nav>

      <main className="dev-main-content">
        <header className="dev-header">
          <h1>Manajemen Undangan</h1>
          <button 
            className="dev-btn dev-btn-primary" 
            onClick={() => {
              setFormData(getInitialFormData());
              setIsFormOpen(true);
            }}
          >
            + Buat Undangan Baru
          </button>
        </header>

        {loadingData ? (
          <div className="dev-loading">Memuat data...</div>
        ) : (
          <div className="dev-table-container">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>ID Undangan</th>
                  <th>Mempelai Wanita</th>
                  <th>Mempelai Pria</th>
                  <th>Tanggal Acara</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {couples.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Belum ada data undangan.</td>
                  </tr>
                ) : (
                  couples.map(couple => (
                    <tr key={couple.id}>
                      <td><span className="dev-code">{couple.id}</span></td>
                      <td>{couple.wanita_panggilan}</td>
                      <td>{couple.pria_panggilan}</td>
                      <td>{couple.tanggal_lengkap}</td>
                      <td>
                        <div className="dev-action-btns">
                          <button onClick={() => handleOpenGuestData(couple)} className="dev-btn-icon" title="Lihat Data Tamu (RSVP & Ucapan)"><Users size={18} /></button>
                          <button onClick={() => handleOpenLinkGenerator(couple)} className="dev-btn-icon" title="Generate Link Tamu"><Link size={18} /></button>
                          <a href={`/?id=${couple.id}`} target="_blank" rel="noreferrer" className="dev-btn-icon" title="Lihat Undangan"><Eye size={18} /></a>
                          <button onClick={() => handleEdit(couple)} className="dev-btn-icon" title="Edit"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(couple.id)} className="dev-btn-icon dev-text-danger" title="Hapus"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="dev-modal-overlay">
            <div className="dev-modal">
              <div className="dev-modal-header">
                <h2>{formData.id ? 'Edit Undangan' : 'Buat Undangan Baru'}</h2>
                <button className="dev-btn-close" onClick={() => setIsFormOpen(false)}>✕</button>
              </div>
              
              <form onSubmit={handleSave} className="dev-modal-body">
                <section className="dev-form-section">
                  <h3>Pengaturan Umum</h3>
                  <div className="dev-grid-2">
                    <div className="dev-input-group">
                      <label>ID Undangan (URL Slug) *</label>
                      <input type="text" name="id" value={formData.id} onChange={handleFormChange} required placeholder="contoh: andi-siti" disabled={!!couples.find(c => c.id === formData.id)} />
                      <small>Hanya huruf kecil, angka, dan strip (-).</small>
                    </div>
                    <div className="dev-input-group">
                      <label>URL Gambar Border</label>
                      <input type="text" name="url_border" value={formData.url_border} onChange={handleFormChange} />
                    </div>
                  </div>
                </section>

                <div className="dev-grid-2">
                  <section className="dev-form-section dev-card-female">
                    <h3>Data Mempelai Wanita</h3>
                    <div className="dev-input-group">
                      <label>Nama Panggilan</label>
                      <input type="text" name="wanita_panggilan" value={formData.wanita_panggilan} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Lengkap</label>
                      <input type="text" name="wanita_lengkap" value={formData.wanita_lengkap} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Orang Tua</label>
                      <input type="text" name="wanita_ortu" value={formData.wanita_ortu} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nomor Rekening</label>
                      <input type="text" name="rekening_wanita" value={formData.rekening_wanita} onChange={handleFormChange} />
                    </div>
                  </section>

                  <section className="dev-form-section dev-card-male">
                    <h3>Data Mempelai Pria</h3>
                    <div className="dev-input-group">
                      <label>Nama Panggilan</label>
                      <input type="text" name="pria_panggilan" value={formData.pria_panggilan} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Lengkap</label>
                      <input type="text" name="pria_lengkap" value={formData.pria_lengkap} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nama Orang Tua</label>
                      <input type="text" name="pria_ortu" value={formData.pria_ortu} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Nomor Rekening</label>
                      <input type="text" name="rekening_pria" value={formData.rekening_pria} onChange={handleFormChange} />
                    </div>
                  </section>
                </div>

                <section className="dev-form-section">
                  <h3>Waktu & Lokasi Acara</h3>
                  <div className="dev-grid-3">
                    <div className="dev-input-group">
                      <label>Tanggal Cover (Mis: 12 . 12 . 2026)</label>
                      <input type="text" name="tanggal_cover" value={formData.tanggal_cover} onChange={handleFormChange} required />
                    </div>
                    <div className="dev-input-group">
                      <label>Tanggal Lengkap</label>
                      <input type="text" name="tanggal_lengkap" value={formData.tanggal_lengkap} onChange={handleFormChange} required placeholder="Sabtu, 12 Desember 2026"/>
                    </div>
                    <div className="dev-input-group">
                      <label>Target Countdown</label>
                      <input type="datetime-local" name="target_countdown" value={formData.target_countdown ? formData.target_countdown.slice(0, 16) : ''} onChange={handleFormChange} />
                    </div>
                  </div>

                  <div className="dev-grid-2">
                    <div className="dev-input-group">
                      <label>Jam Akad</label>
                      <input type="text" name="waktu_akad" value={formData.waktu_akad} onChange={handleFormChange} placeholder="08:00 WIB" />
                    </div>
                    <div className="dev-input-group">
                      <label>Jam Resepsi</label>
                      <input type="text" name="waktu_resepsi" value={formData.waktu_resepsi} onChange={handleFormChange} placeholder="11:00 WIB - Selesai" />
                    </div>
                    <div className="dev-input-group">
                      <label>Lokasi Akad</label>
                      <input type="text" name="lokasi_akad" value={formData.lokasi_akad} onChange={handleFormChange} />
                    </div>
                    <div className="dev-input-group">
                      <label>Lokasi Resepsi</label>
                      <input type="text" name="lokasi_resepsi" value={formData.lokasi_resepsi} onChange={handleFormChange} />
                    </div>
                  </div>

                  <div className="dev-input-group mt-3">
                    <label>Alamat Baris 1 (Gedung/Jalan)</label>
                    <input type="text" name="alamat_baris1" value={formData.alamat_baris1} onChange={handleFormChange} required />
                  </div>
                  <div className="dev-input-group">
                    <label>Alamat Baris 2 (Kota/Kecamatan)</label>
                    <input type="text" name="alamat_baris2" value={formData.alamat_baris2} onChange={handleFormChange} required />
                  </div>
                  <div className="dev-input-group">
                    <label>Link Google Maps</label>
                    <input type="url" name="link_maps" value={formData.link_maps} onChange={handleFormChange} required />
                  </div>
                </section>

                <div className="dev-modal-footer">
                  <button type="button" className="dev-btn dev-btn-secondary" onClick={() => setIsFormOpen(false)}>Batal</button>
                  <button type="submit" className="dev-btn dev-btn-primary" disabled={isSaving}>
                    {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Link Generator Modal */}
        {isLinkModalOpen && selectedCoupleForLinks && (
          <div className="dev-modal-overlay">
            <div className="dev-modal" style={{ maxWidth: '800px' }}>
              <div className="dev-modal-header">
                <h2>Generate Link Tamu: {selectedCoupleForLinks.id}</h2>
                <button className="dev-btn-close" onClick={() => setIsLinkModalOpen(false)}>✕</button>
              </div>
              
              <div className="dev-modal-body">
                <div className="dev-grid-2">
                  <div className="dev-input-group">
                    <label>Import Data Tamu (Excel / CSV)</label>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                      <button type="button" onClick={downloadExcelTemplate} className="dev-btn dev-btn-secondary" style={{ width: 'fit-content', gap: '0.5rem' }}>
                        <Download size={16} /> Download Template Excel
                      </button>
                      
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="file" 
                          accept=".xlsx, .xls, .csv" 
                          onChange={handleFileUpload} 
                          style={{
                            padding: '0.75rem', border: '1px dashed #cbd5e1', borderRadius: '8px', width: '100%', cursor: 'pointer', background: '#f8fafc'
                          }}
                        />
                      </div>
                      {guestData.length > 0 && (
                        <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                          Berhasil memuat <strong>{guestData.length}</strong> kontak tamu.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dev-input-group">
                    <label>Template Pesan WhatsApp</label>
                    <textarea 
                      rows="8" 
                      value={waTemplate} 
                      onChange={e => setWaTemplate(e.target.value)} 
                      style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
                    ></textarea>
                    <small>Gunakan <code>{`{nama_tamu}`}</code> dan <code>{`{link}`}</code> sebagai variabel.</small>
                  </div>
                </div>

                <button 
                  className="dev-btn dev-btn-primary dev-full-width" 
                  style={{ marginTop: '1rem', marginBottom: '2rem' }}
                  onClick={handleGenerateLinks}
                  disabled={guestData.length === 0}
                >
                  Generate {guestData.length} Link Tamu
                </button>

                {generatedLinks.length > 0 && (
                  <div className="dev-generated-results">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a' }}>Hasil Generate</h3>
                    <div className="dev-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <table className="dev-table">
                        <thead>
                          <tr>
                            <th>Nama Tamu</th>
                            <th>No WA</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedLinks.map((item, idx) => (
                            <tr key={idx}>
                              <td><strong>{item.name}</strong><br/><small style={{color: '#64748b'}}>{item.link}</small></td>
                              <td>{item.phone || '-'}</td>
                              <td>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                  <button 
                                    onClick={() => handleCopyMessage(item.message)} 
                                    className="dev-btn dev-btn-sm dev-btn-outline"
                                    style={{ border: '1px solid #3b82f6', color: '#3b82f6', gap: '0.5rem' }}
                                  >
                                    <Copy size={14} /> Copy Pesan
                                  </button>
                                  <a 
                                    href={`https://wa.me/${item.phone || ''}?text=${encodeURIComponent(item.message)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dev-btn dev-btn-sm dev-btn-primary"
                                    style={{ gap: '0.5rem' }}
                                  >
                                    <Send size={14} /> Kirim WA
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
          </div>
        )}

        {/* Guest Data Modal */}
        {isGuestDataModalOpen && selectedCoupleForData && (
          <div className="dev-modal-overlay">
            <div className="dev-modal" style={{ maxWidth: '800px' }}>
              <div className="dev-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Data Tamu: {selectedCoupleForData.id}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={exportGuestDataToExcel} className="dev-btn dev-btn-sm dev-btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderColor: '#10b981', color: '#10b981' }}>
                    <Download size={14} /> Export Excel
                  </button>
                  <button className="dev-btn-close" onClick={() => setIsGuestDataModalOpen(false)}>✕</button>
                </div>
              </div>
              
              <div className="dev-modal-body">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <button 
                    onClick={() => setActiveTab('rsvp')}
                    style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'rsvp' ? '2px solid var(--dev-primary)' : '2px solid transparent', color: activeTab === 'rsvp' ? 'var(--dev-primary)' : '#64748b', fontWeight: activeTab === 'rsvp' ? '600' : '400', cursor: 'pointer' }}
                  >
                    Konfirmasi Kehadiran (RSVP)
                  </button>
                  <button 
                    onClick={() => setActiveTab('guestbook')}
                    style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'guestbook' ? '2px solid var(--dev-primary)' : '2px solid transparent', color: activeTab === 'guestbook' ? 'var(--dev-primary)' : '#64748b', fontWeight: activeTab === 'guestbook' ? '600' : '400', cursor: 'pointer' }}
                  >
                    Ucapan & Doa ({guestbookList.length})
                  </button>
                </div>

                {loadingGuestData ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Memuat data tamu...</div>
                ) : (
                  <>
                    {activeTab === 'rsvp' && (
                      <div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                          <div style={{ flex: 1 }}><strong>Total Hadir:</strong> {rsvpList.filter(r => r.hadir === 'hadir').reduce((sum, r) => sum + (r.guest_count || 1), 0)} Orang</div>
                          <div style={{ flex: 1 }}><strong>Tidak Hadir:</strong> {rsvpList.filter(r => r.hadir !== 'hadir').length} Orang</div>
                        </div>
                        {rsvpList.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Belum ada konfirmasi kehadiran.</div>
                        ) : (
                          <div className="dev-table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            <table className="dev-table">
                              <thead>
                                <tr>
                                  <th>Nama Tamu</th>
                                  <th>Status</th>
                                  <th>Jumlah</th>
                                  <th>Waktu</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rsvpList.map(r => (
                                  <tr key={r.id}>
                                    <td><strong>{r.name}</strong></td>
                                    <td>
                                      <span style={{ 
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500',
                                        background: r.hadir === 'hadir' ? '#dcfce7' : '#fee2e2',
                                        color: r.hadir === 'hadir' ? '#166534' : '#991b1b'
                                      }}>
                                        {r.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                      </span>
                                    </td>
                                    <td>{r.hadir === 'hadir' ? `${r.guest_count} Orang` : '-'}</td>
                                    <td>{r.timestamp ? r.timestamp.toDate().toLocaleString('id-ID') : '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'guestbook' && (
                      <div>
                        {guestbookList.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Belum ada ucapan & doa.</div>
                        ) : (
                          <div className="dev-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="dev-table">
                              <thead>
                                <tr>
                                  <th>Nama Tamu</th>
                                  <th>Ucapan</th>
                                  <th>Waktu</th>
                                </tr>
                              </thead>
                              <tbody>
                                {guestbookList.map(g => (
                                  <tr key={g.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}><strong>{g.name}</strong></td>
                                    <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal' }}>{g.message}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{g.timestamp ? g.timestamp.toDate().toLocaleString('id-ID') : '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
