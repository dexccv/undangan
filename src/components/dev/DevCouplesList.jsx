import React, { useState } from 'react';
import {
  Plus,
  Eye,
  PencilSimple,
  Trash,
  Copy,
  Check,
  CalendarBlank,
  MapPin,
  MagnifyingGlass,
  ArrowClockwise,
  LinkSimple
} from '@phosphor-icons/react';
import Swal from 'sweetalert2';

export default function DevCouplesList({
  couples,
  loadingData,
  handleCreateNew,
  handleEdit,
  handleDelete
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (id) => {
    const fullUrl = `${window.location.origin}/?id=${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Tautan Tersalin!',
      text: fullUrl,
      showConfirmButton: false,
      timer: 2000
    });
  };

  const filteredCouples = couples.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchId = (c.id || '').toLowerCase().includes(q);
    const matchBride = (c.wanita_panggilan || '').toLowerCase().includes(q) ||
      (c.wanita_lengkap || '').toLowerCase().includes(q);
    const matchGroom = (c.pria_panggilan || '').toLowerCase().includes(q) ||
      (c.pria_lengkap || '').toLowerCase().includes(q);
    const matchVenue = (c.lokasi_resepsi || c.lokasi_akad || '').toLowerCase().includes(q);
    return matchId || matchBride || matchGroom || matchVenue;
  });

  return (
    <div className="dev-view-container">
      {/* Header View */}
      <div className="dev-view-header">
        <div>
          <h2>Daftar Undangan Pernikahan</h2>
          <p>Kelola seluruh tautan undangan pasangan yang telah dibuat:</p>
        </div>
        <button
          type="button"
          className="dev-btn-primary"
          onClick={handleCreateNew}
          title="Buat draf undangan pasangan baru"
        >
          <Plus size={18} weight="bold" />
          <span>Buat Undangan Baru</span>
        </button>
      </div>

      {/* Search & Counter Strip */}
      <div className="dev-couples-search-bar">
        <div className="dev-couples-search-input-wrap">
          <MagnifyingGlass size={16} weight="bold" className="dev-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pasangan atau ID tautan..."
            className="dev-field dev-field-sm dev-search-field"
          />
          {searchQuery && (
            <button
              type="button"
              className="dev-search-clear"
              onClick={() => setSearchQuery('')}
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>
        <div className="dev-couples-counter">
          <span>
            Menampilkan <strong>{filteredCouples.length}</strong> dari {couples.length} undangan
          </span>
        </div>
      </div>

      {/* Content Area */}
      {loadingData ? (
        <div className="dev-loading-state">
          <ArrowClockwise size={22} className="lp-spin" />
          <span>Memuat data pasangan...</span>
        </div>
      ) : couples.length === 0 ? (
        <div className="dev-empty-box">
          <p>Belum ada undangan yang dibuat. Klik tombol "Buat Undangan Baru" untuk memulai.</p>
        </div>
      ) : filteredCouples.length === 0 ? (
        <div className="dev-empty-box">
          <p>Tidak ditemukan undangan dengan kata kunci "{searchQuery}".</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile via CSS) */}
          <div className="dev-table-card dev-desktop-only-table">
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
                {filteredCouples.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="dev-slug-copy-cell">
                        <span className="dev-slug-badge">/?id={c.id}</span>
                        <button
                          type="button"
                          className="dev-copy-inline-btn"
                          onClick={() => handleCopyLink(c.id)}
                          title="Salin tautan lengkap"
                        >
                          {copiedId === c.id ? (
                            <Check size={14} weight="bold" style={{ color: '#2E7D32' }} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>
                        {c.wanita_panggilan} &amp; {c.pria_panggilan}
                      </strong>
                      <span className="dev-sub-meta">
                        {c.wanita_lengkap} &amp; {c.pria_lengkap}
                      </span>
                    </td>
                    <td>{c.tanggal_cover || c.tanggal_lengkap_akad || c.tanggal_akad || '-'}</td>
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

          {/* Mobile Responsive Cards View (Visible on mobile screens) */}
          <div className="dev-mobile-couples-grid">
            {filteredCouples.map((c) => (
              <div key={c.id} className="dev-couple-card-mobile">
                <div className="dev-couple-card-header">
                  <div>
                    <h4 className="dev-couple-card-title">
                      {c.wanita_panggilan} &amp; {c.pria_panggilan}
                    </h4>
                    <span className="dev-couple-card-fullname">
                      {c.wanita_lengkap} &amp; {c.pria_lengkap}
                    </span>
                  </div>
                  {c.paket_pesanan && (
                    <span className="dev-pkg-pill-sm">
                      {c.paket_pesanan.replace('Paket ', '')}
                    </span>
                  )}
                </div>

                <div className="dev-couple-card-details">
                  <div className="dev-couple-card-meta-row">
                    <CalendarBlank size={15} weight="bold" />
                    <span>{c.tanggal_cover || c.tanggal_lengkap_akad || c.tanggal_akad || 'Tanggal belum diatur'}</span>
                  </div>
                  <div className="dev-couple-card-meta-row">
                    <MapPin size={15} weight="bold" />
                    <span>{c.lokasi_resepsi || c.lokasi_akad || 'Lokasi belum diatur'}</span>
                  </div>
                </div>

                <div className="dev-couple-card-link-strip">
                  <span className="dev-slug-badge-mobile">/?id={c.id}</span>
                  <button
                    type="button"
                    className="dev-btn-copy-mobile"
                    onClick={() => handleCopyLink(c.id)}
                  >
                    {copiedId === c.id ? (
                      <>
                        <Check size={14} weight="bold" style={{ color: '#2E7D32' }} />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="dev-couple-card-actions">
                  <a
                    href={`/?id=${c.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dev-btn-mobile-action view"
                    title="Buka Undangan"
                  >
                    <Eye size={16} weight="bold" />
                    <span>Lihat</span>
                  </a>
                  <button
                    type="button"
                    className="dev-btn-mobile-action edit"
                    onClick={() => handleEdit(c)}
                    title="Edit Data Undangan"
                  >
                    <PencilSimple size={16} weight="bold" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="dev-btn-mobile-action delete"
                    onClick={() => handleDelete(c.id)}
                    title="Hapus Undangan"
                  >
                    <Trash size={16} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
