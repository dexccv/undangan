import React, { useState, useRef } from 'react';
import {
  PaperPlaneRight,
  Copy,
  Check,
  FileArrowUp,
  WhatsappLogo,
  ChatCircleText,
  Sparkle,
  ArrowClockwise,
  User,
  LinkSimple
} from '@phosphor-icons/react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

export default function DevBlastView({
  couples,
  selectedCoupleForLinks,
  setSelectedCoupleForLinks,
  rawGuestList,
  setRawGuestList,
  waTemplate,
  setWaTemplate,
  generatedLinks,
  handleGenerateLinks
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const templateTextareaRef = useRef(null);

  const coupleId = selectedCoupleForLinks?.id || (couples[0]?.id || 'demo');
  const sampleGuestName = 'Bpk. Hendra Wijaya';
  const sampleUrl = `${window.location.origin}/?id=${coupleId}&to=${encodeURIComponent(sampleGuestName)}`;
  const samplePreviewMessage = waTemplate
    .replace(/{nama_tamu}/g, sampleGuestName)
    .replace(/{link}/g, sampleUrl);

  // Inserter helper for {nama_tamu} or {link}
  const insertVariable = (variable) => {
    const textarea = templateTextareaRef.current;
    if (!textarea) {
      setWaTemplate((prev) => `${prev} ${variable}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = waTemplate;
    const next = current.substring(0, start) + variable + current.substring(end);
    setWaTemplate(next);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 50);
  };

  // Excel / CSV File Upload Parser
  const handleExcelFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!data || data.length === 0) {
          Swal.fire('File Kosong', 'Tidak ada data terbaca dari file spreadsheet.', 'warning');
          setIsReadingFile(false);
          return;
        }

        // Cari index kolom nama dan nomor telepon
        let nameColIdx = -1;
        let phoneColIdx = -1;
        let startRowIdx = 0;

        // Cek baris pertama / header
        const headerRow = data[0];
        if (Array.isArray(headerRow)) {
          headerRow.forEach((col, idx) => {
            const colName = String(col || '').toLowerCase().trim();
            if (colName.includes('nama') || colName.includes('name') || colName.includes('tamu')) {
              nameColIdx = idx;
            } else if (colName.includes('wa') || colName.includes('telepon') || colName.includes('phone') || colName.includes('hp') || colName.includes('nomor')) {
              phoneColIdx = idx;
            }
          });
        }

        if (nameColIdx === -1) {
          // Asumsikan kolom pertama adalah nama
          nameColIdx = 0;
          if (headerRow && headerRow.length > 1) {
            phoneColIdx = 1;
          }
        } else {
          startRowIdx = 1; // skip header row
        }

        const parsedLines = [];
        for (let i = startRowIdx; i < data.length; i++) {
          const row = data[i];
          if (!row || !row[nameColIdx]) continue;
          const name = String(row[nameColIdx]).trim();
          const phone = phoneColIdx !== -1 && row[phoneColIdx] ? String(row[phoneColIdx]).replace(/\D/g, '').trim() : '';
          if (name) {
            if (phone) {
              parsedLines.push(`${name}, ${phone}`);
            } else {
              parsedLines.push(name);
            }
          }
        }

        if (parsedLines.length === 0) {
          Swal.fire('Format Tidak Ditemukan', 'Tidak ada baris nama tamu yang valid ditemukan.', 'warning');
        } else {
          const newText = rawGuestList.trim()
            ? `${rawGuestList.trim()}\n${parsedLines.join('\n')}`
            : parsedLines.join('\n');
          setRawGuestList(newText);

          Swal.fire({
            title: 'Berhasil Diimpor!',
            text: `${parsedLines.length} nama tamu berhasil ditambahkan dari file Excel.`,
            icon: 'success',
            confirmButtonColor: '#B8860B'
          });
        }
      } catch (err) {
        console.error('Excel parse error:', err);
        Swal.fire('Gagal Membaca File', 'Pastikan file berekstensi .xlsx, .xls, atau .csv.', 'error');
      } finally {
        setIsReadingFile(false);
      }
    };

    reader.onerror = () => {
      setIsReadingFile(false);
      Swal.fire('Gagal Membaca File', 'Terjadi kesalahan saat membaca file.', 'error');
    };

    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleCopyLink = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Tautan Tersalin!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const guestCount = rawGuestList
    .split('\n')
    .filter((l) => l.trim().length > 0).length;

  return (
    <div className="dev-view-container">
      {/* Header View */}
      <div className="dev-view-header">
        <div>
          <h2>Kirim Undangan WhatsApp Massal</h2>
          <p>
            Buat tautan personal secara otomatis untuk dikirimkan langsung ke
            kontak WhatsApp tamu:
          </p>
        </div>
      </div>

      <div className="dev-blast-card">
        <div className="blast-inputs-grid">
          {/* Pilih Undangan Pasangan */}
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

          {/* Daftar Nama Tamu + Excel Upload */}
          <div className="dev-input-group full-width">
            <div className="dev-field-header-row">
              <label>
                Daftar Nama Tamu{' '}
                <span className="dev-badge-count">
                  {guestCount} Tamu Terdeteksi
                </span>
              </label>

              {/* Tombol Impor Excel */}
              <label className="dev-btn-excel-upload" title="Impor nama dan no WhatsApp dari file Excel (.xlsx / .csv)">
                <FileArrowUp size={16} weight="bold" />
                <span>{isReadingFile ? 'Membaca Excel...' : 'Impor File Excel / CSV'}</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelFileUpload}
                  className="sr-only"
                  disabled={isReadingFile}
                />
              </label>
            </div>

            <textarea
              rows={6}
              value={rawGuestList}
              onChange={(e) => setRawGuestList(e.target.value)}
              placeholder={`Bpk. Hendra Wijaya, 6281225589199\nIbu Siti Aminah, 6289876543210\nDimas Anggara`}
              className="dev-field"
            ></textarea>
            <small className="dev-field-hint">
              Format per baris: <strong>Nama Tamu, Nomor WhatsApp</strong> atau cukup <strong>Nama Tamu</strong>.
            </small>
          </div>

          {/* Template Pesan WA + Inserter Tags */}
          <div className="dev-input-group full-width">
            <div className="dev-field-header-row">
              <label>Kalimat Pengantar Pesan WhatsApp</label>
              <div className="dev-variable-tags-group">
                <span className="dev-tags-label">Sisipkan:</span>
                <button
                  type="button"
                  className="dev-variable-tag-btn"
                  onClick={() => insertVariable('{nama_tamu}')}
                  title="Klik untuk menyisipkan variabel nama tamu di kursor"
                >
                  + &#123;nama_tamu&#125;
                </button>
                <button
                  type="button"
                  className="dev-variable-tag-btn"
                  onClick={() => insertVariable('{link}')}
                  title="Klik untuk menyisipkan variabel tautan undangan di kursor"
                >
                  + &#123;link&#125;
                </button>
              </div>
            </div>

            <textarea
              ref={templateTextareaRef}
              rows={6}
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value)}
              className="dev-field"
            ></textarea>
          </div>

          {/* Live WhatsApp Bubble Preview */}
          <div className="dev-wa-preview-box full-width">
            <div className="dev-wa-preview-header">
              <WhatsappLogo size={18} weight="fill" style={{ color: '#25D366' }} />
              <span>Simulasi Tampilan Pesan WhatsApp Tamu</span>
            </div>
            <div className="dev-wa-bubble">
              <p className="dev-wa-bubble-text">
                {samplePreviewMessage.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              <span className="dev-wa-bubble-time">10:30 ✓✓</span>
            </div>
          </div>

          <button
            type="button"
            className="dev-btn-primary dev-btn-block"
            onClick={handleGenerateLinks}
            disabled={!rawGuestList.trim()}
          >
            <PaperPlaneRight size={18} weight="bold" />
            <span>Buat {guestCount > 0 ? `${guestCount} ` : ''}Daftar Tautan Undangan</span>
          </button>
        </div>

        {/* Results Section */}
        {generatedLinks.length > 0 && (
          <div className="blast-results-section">
            <div className="blast-results-header">
              <h3>Tautan Siap Dikirim ({generatedLinks.length} Tamu)</h3>
            </div>

            {/* Desktop Table */}
            <div className="blast-links-table-wrapper dev-desktop-only-table">
              <table className="dev-table">
                <thead>
                  <tr>
                    <th>Nama Tamu</th>
                    <th>Nomor WhatsApp</th>
                    <th>Tautan Personal</th>
                    <th>Tindakan Kirim</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedLinks.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        {item.phone ? (
                          <span className="text-muted">+{item.phone}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <a
                          href={item.inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dev-link-preview"
                        >
                          {item.inviteUrl}
                        </a>
                      </td>
                      <td>
                        <div className="dev-blast-actions">
                          <button
                            type="button"
                            className="dev-action-btn"
                            onClick={() => handleCopyLink(item.inviteUrl, idx)}
                            title="Salin Tautan"
                          >
                            {copiedIdx === idx ? (
                              <Check size={16} weight="bold" style={{ color: '#2E7D32' }} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <a
                            href={item.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dev-btn-wa-send"
                          >
                            <WhatsappLogo size={16} weight="fill" />
                            <span>Buka WA</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Blast Cards */}
            <div className="dev-mobile-blast-grid">
              {generatedLinks.map((item, idx) => (
                <div key={idx} className="dev-blast-card-mobile">
                  <div className="dev-blast-card-top">
                    <strong>{item.name}</strong>
                    {item.phone && <span className="dev-blast-phone">+{item.phone}</span>}
                  </div>
                  <div className="dev-blast-card-url">
                    <span>{item.inviteUrl}</span>
                  </div>
                  <div className="dev-blast-card-actions">
                    <button
                      type="button"
                      className="dev-btn-blast-copy"
                      onClick={() => handleCopyLink(item.inviteUrl, idx)}
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check size={15} weight="bold" style={{ color: '#2E7D32' }} />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>
                    <a
                      href={item.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-btn-blast-wa"
                    >
                      <WhatsappLogo size={16} weight="fill" />
                      <span>Kirim WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
