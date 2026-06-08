import React from 'react';

export default function Gift({ data }) {
  const handleCopy = async (text, e) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    const btn = e.currentTarget;
    const original = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  };

  return (
    <section id="gift" className="section">
      <div className="container">
        <h2 className="section-title reveal">Hadiah Digital</h2>
        <span className="section-subtitle reveal">Tanda Kasih</span>
        <div className="divider reveal"><i className="fa-solid fa-gift" aria-hidden="true"></i></div>

        <p className="gift-intro reveal">
          "Doa restu dari Bapak/Ibu/Saudara adalah yang paling utama bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menerima melalui transfer berikut."
        </p>

        <div className="gift-cards">
          {/* Rekening Wanita */}
          <div className="gift-card reveal-left">
            <div className="gift-bank-logo bca" aria-hidden="true">BCA</div>
            <h3>Bank BCA</h3>
            <p className="account-name">a.n. <span>{data?.wanita_lengkap}</span></p>
            <div className="account-number"><span>{data?.rekening_wanita}</span></div>
            <button className="btn-copy" onClick={(e) => handleCopy(data?.rekening_wanita, e)}>
              <i className="fa-regular fa-copy"></i> Salin Nomor
            </button>
          </div>

          {/* Rekening Pria */}
          <div className="gift-card reveal-right">
            <div className="gift-bank-logo bca" aria-hidden="true">BCA</div>
            <h3>Bank BCA</h3>
            <p className="account-name">a.n. <span>{data?.pria_lengkap}</span></p>
            <div className="account-number"><span>{data?.rekening_pria}</span></div>
            <button className="btn-copy" onClick={(e) => handleCopy(data?.rekening_pria, e)}>
              <i className="fa-regular fa-copy"></i> Salin Nomor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
