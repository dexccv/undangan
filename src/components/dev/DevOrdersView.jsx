import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  CalendarBlank,
  MusicNotes,
  Eye,
  ChatCircleText,
  WhatsappLogo,
  Lightning,
  Trash,
  MagnifyingGlass,
  ArrowClockwise
} from '@phosphor-icons/react';

export default function DevOrdersView({
  orders,
  loadingOrders,
  fetchOrders,
  orderFilter,
  setOrderFilter,
  handleUpdateOrderStatus,
  handleViewReceipt,
  handleConvertOrderToInvitation,
  handleDeleteOrder,
  isRulesRestricted,
  showRulesGuide,
  handleCreateTestOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const isPendingStatus = (st) =>
    st === 'pending' || st === 'menunggu_pembayaran' || st === 'menunggu' || !st;
  const isProcessingStatus = (st) =>
    st === 'processing' || st === 'diproses';
  const isCompletedStatus = (st) =>
    st === 'completed' || st === 'selesai';

  const pendingOrdersCount = orders.filter((o) => isPendingStatus(o.status)).length;
  const completedOrdersCount = orders.filter((o) => isCompletedStatus(o.status)).length;
  const processingOrdersCount = orders.filter((o) => isProcessingStatus(o.status)).length;

  const filteredOrders = orders.filter((o) => {
    // Status Filter
    if (orderFilter === 'pending' && !isPendingStatus(o.status)) {
      return false;
    }
    if (orderFilter === 'processing' && !isProcessingStatus(o.status)) {
      return false;
    }
    if (orderFilter === 'completed' && !isCompletedStatus(o.status)) {
      return false;
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (o.couple_name || '').toLowerCase().includes(q);
      const matchPhone = (o.customer_phone || '').toLowerCase().includes(q);
      const matchPkg = (o.package_name || '').toLowerCase().includes(q);
      const matchSlug = (o.slug || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchPkg || matchSlug;
    }
    return true;
  });

  return (
    <div className="dev-view-container">
      {/* Header View */}
      <div className="dev-view-header">
        <div>
          <h2>Antrean Pesanan Pelanggan</h2>
          <p>
            Pesanan yang masuk dari pilihan paket di landing page. Klik tombol
            untuk langsung membuat undangan:
          </p>
        </div>

        <div className="dev-orders-header-actions">
          {handleCreateTestOrder && (
            <button
              type="button"
              className="dev-btn-primary"
              onClick={handleCreateTestOrder}
              title="Klik untuk membuat simulasi pesanan masuk dan menguji realtime dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                borderRadius: '8px'
              }}
            >
              <Lightning size={16} weight="fill" />
              <span>Tes Simulasi Pesanan</span>
            </button>
          )}

          <button
            type="button"
            className="dev-btn-secondary"
            onClick={fetchOrders}
            disabled={loadingOrders}
            title="Segarkan antrean pesanan"
          >
            <ArrowClockwise
              size={16}
              weight="bold"
              className={loadingOrders ? 'lp-spin' : ''}
            />
            <span>{loadingOrders ? 'Menyegarkan...' : 'Segarkan Pesanan'}</span>
          </button>
        </div>
      </div>

      {/* Peringatan Firebase Security Rules jika terblokir */}
      {isRulesRestricted && (
        <div className="dev-rules-alert-banner">
          <div className="dev-rules-alert-left">
            <span className="dev-rules-alert-badge">Izin Firebase Dibutuhkan</span>
            <h4>Koleksi Pesanan Terblokir oleh Firestore Security Rules</h4>
            <p>
              Terdeteksi error <code>Missing or insufficient permissions</code>. Pesanan dari landing page belum dapat masuk ke dashboard sampai aturan keamanan Firestore diizinkan.
            </p>
          </div>
          <button
            type="button"
            className="dev-btn-rules-action"
            onClick={showRulesGuide}
          >
            Buka Panduan &amp; Salin Rules
          </button>
        </div>
      )}

      {/* Metrics Bento Cards (Responsive Compact Grid) */}
      <div className="dev-orders-metrics-grid">
        <div className="dev-stat-card">
          <div
            className="dev-stat-icon-wrapper"
            style={{ color: '#1F6C9F', background: '#E1F3FE' }}
          >
            <ShoppingBag size={22} weight="duotone" />
          </div>
          <div className="dev-stat-info">
            <span className="dev-stat-label">Total Pesanan</span>
            <h4 className="dev-stat-value">{orders.length}</h4>
            <small className="dev-stat-note">Semua paket masuk</small>
          </div>
        </div>

        <div className="dev-stat-card">
          <div
            className="dev-stat-icon-wrapper"
            style={{ color: '#956400', background: '#FBF3DB' }}
          >
            <Clock size={22} weight="duotone" />
          </div>
          <div className="dev-stat-info">
            <span className="dev-stat-label">Perlu Diproses</span>
            <h4 className="dev-stat-value">{pendingOrdersCount}</h4>
            <small className="dev-stat-note">Status menunggu</small>
          </div>
        </div>

        <div className="dev-stat-card">
          <div
            className="dev-stat-icon-wrapper"
            style={{ color: '#346538', background: '#EDF3EC' }}
          >
            <CheckCircle size={22} weight="duotone" />
          </div>
          <div className="dev-stat-info">
            <span className="dev-stat-label">Pesanan Selesai</span>
            <h4 className="dev-stat-value">{completedOrdersCount}</h4>
            <small className="dev-stat-note">Undangan aktif</small>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="dev-orders-filter-bar">
        <div className="dev-orders-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'all'}
            className={`dev-orders-tab ${orderFilter === 'all' ? 'active' : ''}`}
            onClick={() => setOrderFilter('all')}
          >
            Semua ({orders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'pending'}
            className={`dev-orders-tab ${orderFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setOrderFilter('pending')}
          >
            Menunggu ({pendingOrdersCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'processing'}
            className={`dev-orders-tab ${orderFilter === 'processing' ? 'active' : ''}`}
            onClick={() => setOrderFilter('processing')}
          >
            Diproses ({processingOrdersCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'completed'}
            className={`dev-orders-tab ${orderFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setOrderFilter('completed')}
          >
            Selesai ({completedOrdersCount})
          </button>
        </div>

        <div className="dev-orders-search-wrap">
          <MagnifyingGlass size={16} weight="bold" className="dev-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mempelai, telepon..."
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
      </div>

      {/* Orders List / Cards Grid */}
      {loadingOrders ? (
        <div className="dev-loading-state">
          <ArrowClockwise size={22} className="lp-spin" />
          <span>Memuat data pesanan masuk...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="dev-empty-box">
          <p>
            {searchQuery
              ? `Tidak ditemukan pesanan dengan kata kunci "${searchQuery}".`
              : orders.length === 0
              ? 'Belum ada pesanan masuk. Pesanan baru dari formulir pilihan paket di landing page akan otomatis muncul di sini secara realtime.'
              : 'Tidak ada pesanan pada kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="dev-orders-list-grid">
          {filteredOrders.map((ord) => {
            const isSilver = ord.package_name?.includes('Silver');
            const isPlatinum =
              ord.package_name?.includes('Platinum') ||
              ord.package_name?.includes('Royal');
            const packageClass = isSilver
              ? 'pkg-silver'
              : isPlatinum
              ? 'pkg-platinum'
              : 'pkg-gold';
            const currentStatus = isProcessingStatus(ord.status)
              ? 'processing'
              : isCompletedStatus(ord.status)
              ? 'completed'
              : 'pending';

            return (
              <div key={ord.id} className="dev-order-card">
                <div className="dev-order-card-header">
                  <div className="dev-order-card-pkg-info">
                    <span className={`dev-pkg-pill ${packageClass}`}>
                      {ord.package_name || 'Paket Gold Imperial'}
                    </span>
                    <span className="dev-order-price">
                      {ord.package_price || 'Rp 99.000'}
                    </span>
                  </div>

                  <div className="dev-order-status-wrap">
                    <select
                      className={`dev-status-select status-${currentStatus}`}
                      value={currentStatus}
                      onChange={(e) =>
                        handleUpdateOrderStatus(ord.id, e.target.value)
                      }
                      aria-label="Ubah status pesanan"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="processing">Sedang Diproses</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="dev-order-card-body">
                  <div className="dev-order-couple-title">
                    <div className="dev-order-couple-name-row">
                      <h4>{ord.couple_name || 'Calon Pengantin'}</h4>
                      {ord.slug && (
                        <span className="dev-slug-badge">/?id={ord.slug}</span>
                      )}
                    </div>
                    <span className="dev-order-date-meta">
                      <CalendarBlank size={14} weight="bold" />
                      <span>Acara: {ord.event_date || 'Belum ditentukan'}</span>
                    </span>
                  </div>

                  {ord.song_title && (
                    <div className="dev-order-song-row">
                      <MusicNotes size={14} weight="bold" />
                      <span>
                        Lagu: <strong>{ord.song_title}</strong>
                      </span>
                    </div>
                  )}

                  {(ord.receipt_url ||
                    ord.receipt_preview ||
                    ord.receipt_name ||
                    ord.has_receipt) && (
                    <div className="dev-order-receipt-wrap">
                      <button
                        type="button"
                        className={`dev-order-receipt-btn ${
                          ord.receipt_url || ord.receipt_preview
                            ? 'has-image'
                            : 'no-image'
                        }`}
                        onClick={() => handleViewReceipt(ord)}
                        title="Klik untuk membuka bukti transfer QRIS"
                      >
                        <CheckCircle
                          size={15}
                          weight="bold"
                          className="receipt-icon-check"
                        />
                        <span className="receipt-label">
                          Bukti QRIS:{' '}
                          <strong>
                            {ord.receipt_name || 'Lihat Bukti Foto'}
                          </strong>
                        </span>
                        <span className="receipt-action-badge">
                          <Eye size={13} weight="bold" />
                          <span>
                            {ord.receipt_url || ord.receipt_preview
                              ? 'Buka Foto'
                              : 'Info Bukti'}
                          </span>
                        </span>
                      </button>
                    </div>
                  )}

                  {ord.notes && (
                    <div className="dev-order-notes-box">
                      <ChatCircleText size={14} weight="bold" />
                      <span>{ord.notes}</span>
                    </div>
                  )}

                  <div className="dev-order-contact-row">
                    <a
                      href={`https://wa.me/${(ord.customer_phone || '').replace(
                        /\D/g,
                        ''
                      )}?text=${encodeURIComponent(
                        `Halo ${ord.couple_name}, terima kasih telah memesan ${ord.package_name} di Digitalisasi.id. Kami siap memproses undangan Anda!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-btn-wa-pill"
                    >
                      <WhatsappLogo size={16} weight="fill" />
                      <span>{ord.customer_phone || '-'}</span>
                    </a>
                  </div>
                </div>

                <div className="dev-order-card-footer">
                  <button
                    type="button"
                    className="dev-btn-convert"
                    onClick={() => handleConvertOrderToInvitation(ord)}
                    title="Generate draf undangan otomatis dari pesanan ini"
                  >
                    <Lightning size={16} weight="fill" />
                    <span>Buat Undangan dari Pesanan Ini</span>
                  </button>

                  <button
                    type="button"
                    className="dev-action-btn delete"
                    onClick={() => handleDeleteOrder(ord.id)}
                    title="Hapus Pesanan"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
