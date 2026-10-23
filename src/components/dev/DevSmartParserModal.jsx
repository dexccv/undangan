import React from 'react';
import { X, Lightning, ChatTeardropText } from '@phosphor-icons/react';

export default function DevSmartParserModal({
  isOpen,
  onClose,
  rawChatText,
  setRawChatText,
  onParse
}) {
  if (!isOpen) return null;

  return (
    <div className="dev-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dev-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="dev-modal-header">
          <div>
            <h3>Impor Teks Format dari WhatsApp</h3>
            <p>Tempelkan teks bio/data yang dikirim calon pengantin dari chat WhatsApp:</p>
          </div>
          <button
            type="button"
            className="dev-modal-close"
            onClick={onClose}
            aria-label="Tutup jendela impor teks"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="dev-modal-body">
          <textarea
            rows={9}
            value={rawChatText}
            onChange={(e) => setRawChatText(e.target.value)}
            placeholder={`Contoh teks chat WA yang bisa dipaste:\n\nMempelai Wanita: Nadia Salsabila, S.Kom\nMempelai Pria: Agus Pratama, S.T\nOrang Tua Wanita: Bpk. Ahmad Fauzi & Ibu Siti Aminah\nOrang Tua Pria: Bpk. Hendra Wijaya & Ibu Ratna Dewi\nTanggal: Minggu, 20 Desember 2026\nLokasi: Masjid Raya Al-Barkah, Jakarta\nRekening: 1234567890 (BCA - Nadia)`}
            className="dev-field dev-textarea-code"
            autoFocus
          ></textarea>

          <div className="dev-modal-hint-box">
            <ChatTeardropText size={18} weight="duotone" />
            <p>
              Parser akan otomatis mendeteksi nama mempelai, orang tua, tanggal, tempat acara, dan nomor rekening lalu memetakannya langsung ke formulir editor.
            </p>
          </div>
        </div>

        <div className="dev-modal-footer">
          <button
            type="button"
            className="dev-btn-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="dev-btn-primary"
            onClick={onParse}
            disabled={!rawChatText.trim()}
          >
            <Lightning size={16} weight="fill" />
            <span>Ekstrak &amp; Terapkan ke Form</span>
          </button>
        </div>
      </div>
    </div>
  );
}
