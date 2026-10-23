import React, { useState } from 'react';
import { Copy, Check, CreditCard, Package } from '@phosphor-icons/react';
import { useToast } from '../context/ToastContext';
import ScrollReveal from './ui/ScrollReveal';

export default function Gift({ data }) {
  const { showToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, label, idx) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      showToast(`Nomor rekening ${label} berhasil disalin!`);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedIndex(idx);
      showToast(`Nomor rekening ${label} berhasil disalin!`);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  const accounts = [
    {
      bank: data?.bank_wanita || 'Bank BCA',
      number: data?.rekening_wanita || '1234567890',
      holder: data?.an_wanita || data?.wanita_lengkap || 'Nadia Salsabila',
      role: 'Mempelai Wanita'
    },
    {
      bank: data?.bank_pria || 'Bank BCA',
      number: data?.rekening_pria || '0987654321',
      holder: data?.an_pria || data?.pria_lengkap || 'Agus Pratama',
      role: 'Mempelai Pria'
    }
  ].filter(acc => Boolean(acc.number));

  return (
    <section id="gift" className="section-padding gift-section">
      <div className="section-container">
        <ScrollReveal direction="up">
          <div className="section-header text-center">
            <h2 className="section-title">Amplop &amp; Hadiah Digital</h2>
            <p className="section-description">
              Doa restu Anda adalah karunia yang terindah. Bagi keluarga dan sahabat yang ingin memberikan tanda kasih secara digital, dapat disalurkan melalui:
            </p>
          </div>
        </ScrollReveal>

        <div className="gift-cards-grid">
          {accounts.map((acc, idx) => (
            <ScrollReveal
              key={idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={0.15 * (idx + 1)}
              className="gift-card-col"
            >
              <div className="digital-bank-card">
                <div className="bank-card-chip" aria-hidden="true">
                  <div className="chip-lines"></div>
                </div>

                <div className="bank-card-header">
                  <span className="bank-card-type">{acc.bank}</span>
                  <span className="bank-card-role">{acc.role}</span>
                </div>

                <div className="bank-card-number-box">
                  <span className="bank-card-number">{acc.number}</span>
                </div>

                <div className="bank-card-footer">
                  <div className="bank-card-holder">
                    <span className="holder-label">Atas Nama:</span>
                    <span className="holder-name">{acc.holder}</span>
                  </div>

                  <button
                    type="button"
                    className={`btn-copy-account ${copiedIndex === idx ? 'copied' : ''}`}
                    onClick={() => handleCopy(acc.number, acc.bank, idx)}
                    aria-label={`Salin nomor rekening ${acc.bank}`}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={18} weight="bold" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} weight="bold" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Physical Gift Address (Optional) */}
        {data?.alamat_kado && (
          <ScrollReveal direction="up" delay={0.3}>
            <div className="gift-address-card">
              <Package size={28} weight="duotone" className="gift-address-icon" />
              <div className="gift-address-info">
                <h4>Kirim Kado Fisik</h4>
                <p>{data.alamat_kado}</p>
                {data?.penerima_kado && <p className="gift-recipient">Penerima: <strong>{data.penerima_kado}</strong></p>}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
