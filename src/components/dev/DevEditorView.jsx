import React from 'react';
import {
  ArrowLeft,
  Check,
  ChatTeardropText,
  UserList,
  CalendarCheck,
  Camera,
  MusicNotes,
  Heart,
  ImagesSquare,
  CreditCard,
  Eye,
  ChartLineUp,
  UploadSimple,
  Play,
  Pause,
  YoutubeLogo,
  SpeakerHigh,
  ArrowClockwise,
  Plus,
  Trash,
  Export,
  DeviceMobile,
  DeviceTablet,
  Desktop
} from '@phosphor-icons/react';
import { getYouTubeId } from '../../context/MusicContext';

export default function DevEditorView({
  formData,
  handleFormChange,
  handleSave,
  isSaving,
  activeEditorTab,
  setActiveEditorTab,
  setCurrentView,
  handleApplyPackagePreset,
  setIsSmartParserOpen,
  handleFileUpload,
  uploadingField,
  PRESET_SONGS,
  handleSelectPresetSong,
  handleToggleTestAudio,
  testAudioPlaying,
  isFetchingYtMeta,
  handleYouTubeUrlChange,
  handleYouTubeUrlPaste,
  handleAudioUpload,
  handleAddStory,
  handleUpdateStory,
  handleRemoveStory,
  handleStoryFileUpload,
  handleAddGalleryPhoto,
  handleUpdateGalleryPhoto,
  handleRemoveGalleryPhoto,
  handleGalleryFileUpload,
  previewDevice,
  setPreviewDevice,
  testGuestName,
  setTestGuestName,
  rsvpList,
  guestbookList,
  rsvpFilter,
  setRsvpFilter,
  searchRsvp,
  setSearchRsvp,
  exportRsvpToExcel,
  exportGuestbookToExcel,
  totalRsvp,
  totalHadir,
  totalTidakHadir,
  totalPax
}) {
  const tabs = [
    { id: 'profile', label: 'Profil Mempelai', icon: UserList },
    { id: 'events', label: 'Jadwal Acara', icon: CalendarCheck },
    { id: 'photos', label: 'Foto & Media', icon: Camera },
    { id: 'music', label: 'Musik Latar', icon: MusicNotes },
    { id: 'story', label: 'Kisah Cinta', icon: Heart },
    { id: 'gallery', label: 'Galeri', icon: ImagesSquare },
    { id: 'accounts', label: 'Rekening', icon: CreditCard },
    { id: 'preview', label: 'Pratinjau', icon: Eye },
    { id: 'monitor', label: 'Tamu RSVP', icon: ChartLineUp }
  ];

  return (
    <div className="dev-view-container">
      {/* Top Header of Editor */}
      <div className="dev-view-header dev-editor-header-flex">
        <div className="dev-header-with-back">
          <button
            type="button"
            className="dev-btn-back"
            onClick={() => setCurrentView('list')}
            title="Kembali ke Daftar Undangan"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Kembali ke Daftar Undangan</span>
          </button>
          <h2>
            Pengaturan Undangan:{' '}
            <span className="text-gold">
              {formData.wanita_panggilan} &amp; {formData.pria_panggilan}
            </span>
          </h2>
        </div>

        <div className="dev-editor-actions-top">
          <div className="dev-presets-group">
            <span className="dev-presets-label">Preset Paket:</span>
            <button
              type="button"
              className={`dev-preset-btn ${
                formData.paket_pesanan === 'Paket Silver' ? 'active' : ''
              }`}
              onClick={() => handleApplyPackagePreset('Silver')}
              title="Terapkan konfigurasi Paket Silver"
            >
              Silver
            </button>
            <button
              type="button"
              className={`dev-preset-btn ${
                formData.paket_pesanan === 'Paket Gold Imperial' ? 'active' : ''
              }`}
              onClick={() => handleApplyPackagePreset('Gold')}
              title="Terapkan konfigurasi Paket Gold Imperial"
            >
              Gold Imperial
            </button>
            <button
              type="button"
              className={`dev-preset-btn ${
                formData.paket_pesanan === 'Paket Royal Platinum'
                  ? 'active'
                  : ''
              }`}
              onClick={() => handleApplyPackagePreset('Platinum')}
              title="Terapkan konfigurasi Paket Royal Platinum"
            >
              Platinum
            </button>
          </div>

          <button
            type="button"
            className="dev-btn-secondary"
            onClick={() => setIsSmartParserOpen(true)}
            title="Ekstrak data dari format chat WhatsApp"
          >
            <ChatTeardropText size={18} weight="bold" />
            <span>Impor Teks WhatsApp</span>
          </button>

          <button
            type="button"
            className="dev-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ArrowClockwise size={18} className="lp-spin" />
            ) : (
              <Check size={18} weight="bold" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua'}</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Tabs Horizontal Bar (Sticky on both Desktop and Mobile) */}
      <div
        className="dev-editor-subtabs-nav"
        role="tablist"
        aria-label="Bagian Formulir Undangan"
      >
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeEditorTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`dev-chip-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveEditorTab(tab.id)}
            >
              <TabIcon size={15} weight={isActive ? 'fill' : 'duotone'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFIL & KELUARGA */}
      {activeEditorTab === 'profile' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <UserList size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">1. Profil &amp; Keluarga Mempelai</h3>
          </div>

          <div className="editor-form-grid">
            <div className="dev-input-group full-width">
              <label>Nama Tautan Undangan (Wajib diisi, huruf kecil tanpa spasi)</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleFormChange}
                placeholder="nadia-agus"
                required
                className="dev-field"
              />
              <small className="dev-field-hint">
                Tautan undangan Anda nantinya:{' '}
                <code>{window.location.origin}/?id={formData.id || 'contoh'}</code>
              </small>
            </div>

            {/* Mempelai Wanita */}
            <div className="dev-section-divider-box full-width">
              <h4>Mempelai Wanita</h4>
            </div>

            <div className="dev-input-group">
              <label>Nama Panggilan Mempelai Wanita</label>
              <input
                type="text"
                name="wanita_panggilan"
                value={formData.wanita_panggilan}
                onChange={handleFormChange}
                placeholder="Nadia"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Nama Lengkap &amp; Gelar Mempelai Wanita</label>
              <input
                type="text"
                name="wanita_lengkap"
                value={formData.wanita_lengkap}
                onChange={handleFormChange}
                placeholder="Nadia Salsabila, S.Kom"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Nama Orang Tua Mempelai Wanita</label>
              <input
                type="text"
                name="wanita_ortu"
                value={formData.wanita_ortu}
                onChange={handleFormChange}
                placeholder="Bpk. Ahmad Fauzi &amp; Ibu Siti Aminah"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Akun Instagram Mempelai Wanita</label>
              <input
                type="text"
                name="wanita_ig"
                value={formData.wanita_ig}
                onChange={handleFormChange}
                placeholder="@nadiasalsabila"
                className="dev-field"
              />
            </div>

            {/* Mempelai Pria */}
            <div className="dev-section-divider-box full-width">
              <h4>Mempelai Pria</h4>
            </div>

            <div className="dev-input-group">
              <label>Nama Panggilan Mempelai Pria</label>
              <input
                type="text"
                name="pria_panggilan"
                value={formData.pria_panggilan}
                onChange={handleFormChange}
                placeholder="Agus"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Nama Lengkap &amp; Gelar Mempelai Pria</label>
              <input
                type="text"
                name="pria_lengkap"
                value={formData.pria_lengkap}
                onChange={handleFormChange}
                placeholder="Agus Pratama, S.T"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Nama Orang Tua Mempelai Pria</label>
              <input
                type="text"
                name="pria_ortu"
                value={formData.pria_ortu}
                onChange={handleFormChange}
                placeholder="Bpk. Hendra Wijaya &amp; Ibu Ratna Dewi"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Akun Instagram Mempelai Pria</label>
              <input
                type="text"
                name="pria_ig"
                value={formData.pria_ig}
                onChange={handleFormChange}
                placeholder="@aguspratama"
                className="dev-field"
              />
            </div>

            {/* Kutipan / Quote Doa */}
            <div className="dev-section-divider-box full-width">
              <h4>Kutipan Suci / Ayat Pernikahan</h4>
            </div>

            <div className="dev-input-group full-width">
              <label>Isi Kutipan Ayat / Doa Utama</label>
              <textarea
                rows={3}
                name="quote_text"
                value={formData.quote_text || formData.quote_teks || ''}
                onChange={handleFormChange}
                placeholder="Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."
                className="dev-field"
              ></textarea>
            </div>

            <div className="dev-input-group">
              <label>Sumber / Rujukan Kutipan Utama</label>
              <input
                type="text"
                name="quote_source"
                value={formData.quote_source || ''}
                onChange={handleFormChange}
                placeholder="QS. Ar-Rum: 21"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Sumber / Rujukan Kutipan Sekunder (Opsional)</label>
              <input
                type="text"
                name="quote_sekunder_source"
                value={formData.quote_sekunder_source || ''}
                onChange={handleFormChange}
                placeholder="HR. Thabrani"
                className="dev-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JADWAL ACARA */}
      {activeEditorTab === 'events' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <CalendarCheck size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">2. Jadwal Acara (Akad &amp; Resepsi)</h3>
          </div>

          <div className="editor-form-grid">
            {/* Tanggal Cover */}
            <div className="dev-input-group full-width">
              <label>Tanggal yang Tampil di Halaman Cover / Pembuka</label>
              <input
                type="text"
                name="tanggal_cover"
                value={formData.tanggal_cover || ''}
                onChange={handleFormChange}
                placeholder="Minggu, 07 Juni 2026"
                className="dev-field"
              />
            </div>

            {/* Akad Nikah */}
            <div className="dev-section-divider-box full-width">
              <h4>Prosesi Akad Nikah / Pemberkatan</h4>
            </div>

            <div className="dev-input-group">
              <label>Tanggal &amp; Jam Akad (Format ISO untuk Countdown)</label>
              <input
                type="datetime-local"
                name="tanggal_akad"
                value={formData.tanggal_akad ? formData.tanggal_akad.slice(0, 16) : ''}
                onChange={handleFormChange}
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Teks Waktu Pelaksanaan Akad</label>
              <input
                type="text"
                name="waktu_akad"
                value={formData.waktu_akad || ''}
                onChange={handleFormChange}
                placeholder="08.00 - 10.00 WIB"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Lokasi / Gedung Akad Nikah</label>
              <input
                type="text"
                name="lokasi_akad"
                value={formData.lokasi_akad || ''}
                onChange={handleFormChange}
                placeholder="Masjid Agung Al-Barkah"
                className="dev-field"
              />
            </div>

            {/* Resepsi Pernikahan */}
            <div className="dev-section-divider-box full-width">
              <h4>Acara Resepsi Pernikahan</h4>
            </div>

            <div className="dev-input-group">
              <label>Tanggal &amp; Jam Resepsi (Format ISO)</label>
              <input
                type="datetime-local"
                name="tanggal_resepsi"
                value={formData.tanggal_resepsi ? formData.tanggal_resepsi.slice(0, 16) : ''}
                onChange={handleFormChange}
                className="dev-field"
              />
            </div>

            <div className="dev-input-group">
              <label>Teks Waktu Pelaksanaan Resepsi</label>
              <input
                type="text"
                name="waktu_resepsi"
                value={formData.waktu_resepsi || ''}
                onChange={handleFormChange}
                placeholder="11.00 - 14.00 WIB"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Lokasi / Ballroom Resepsi</label>
              <input
                type="text"
                name="lokasi_resepsi"
                value={formData.lokasi_resepsi || ''}
                onChange={handleFormChange}
                placeholder="Grand Ballroom Grand City"
                className="dev-field"
              />
            </div>

            {/* Alamat & Google Maps */}
            <div className="dev-section-divider-box full-width">
              <h4>Alamat Lengkap &amp; Tautan Peta</h4>
            </div>

            <div className="dev-input-group full-width">
              <label>Alamat Baris 1 (Nama Jalan / Nomor)</label>
              <input
                type="text"
                name="alamat_baris1"
                value={formData.alamat_baris1 || ''}
                onChange={handleFormChange}
                placeholder="Jl. Pemuda No. 45"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Alamat Baris 2 (Kelurahan, Kecamatan, Kota)</label>
              <input
                type="text"
                name="alamat_baris2"
                value={formData.alamat_baris2 || ''}
                onChange={handleFormChange}
                placeholder="Kebayoran Baru, Jakarta Selatan"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Tautan Google Maps Lokasi Acara</label>
              <input
                type="url"
                name="link_maps"
                value={formData.link_maps || ''}
                onChange={handleFormChange}
                placeholder="https://maps.google.com/?q=..."
                className="dev-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOTO & MEDIA UTAMA */}
      {activeEditorTab === 'photos' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <Camera size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">3. Foto &amp; Media Utama</h3>
          </div>

          <div className="editor-form-grid">
            {[
              { label: 'Foto Cover Utama', field: 'foto_cover' },
              { label: 'Foto Prewedding / Sambutan', field: 'foto_prewedding_1' },
              { label: 'Foto Profil Mempelai Wanita', field: 'foto_mempelai_wanita' },
              { label: 'Foto Profil Mempelai Pria', field: 'foto_mempelai_pria' },
              { label: 'Foto Venue Akad', field: 'foto_venue_akad' },
              { label: 'Foto Venue Resepsi', field: 'foto_venue_resepsi' },
              { label: 'Foto Penutup / Closing', field: 'foto_closing' }
            ].map((item) => (
              <div key={item.field} className="dev-input-group">
                <label>{item.label}</label>
                <div className="dev-photo-field-wrapper">
                  <div className="dev-photo-thumbnail">
                    <img
                      src={formData[item.field] || '/assets/foto1.jpg'}
                      alt={item.label}
                      onError={(e) => {
                        e.target.src = '/assets/foto1.jpg';
                      }}
                    />
                  </div>
                  <div className="dev-photo-controls">
                    <label className="dev-upload-btn-label">
                      <UploadSimple size={16} weight="bold" />
                      <span>
                        {uploadingField === item.field
                          ? 'Mengunggah...'
                          : 'Pilih Berkas Foto'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, item.field)}
                        className="sr-only"
                        disabled={uploadingField === item.field}
                      />
                    </label>
                    <input
                      type="text"
                      name={item.field}
                      value={formData[item.field] || ''}
                      onChange={handleFormChange}
                      placeholder="Atau masukkan link URL gambar..."
                      className="dev-field dev-field-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MUSIK LATAR */}
      {activeEditorTab === 'music' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <MusicNotes size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">4. Pengaturan Musik Latar</h3>
          </div>

          <div className="dev-music-settings-box">
            {/* Toggle Audio */}
            <div className="dev-switch-row">
              <label htmlFor="fitur_musik_toggle" className="dev-switch-label">
                <strong>Aktifkan Pemutar Musik Otomatis</strong>
                <span>Musik akan berputar lembut saat tamu membuka undangan</span>
              </label>
              <input
                id="fitur_musik_toggle"
                type="checkbox"
                name="fitur_musik"
                checked={formData.fitur_musik !== false}
                onChange={handleFormChange}
                className="dev-toggle"
              />
            </div>

            {formData.fitur_musik !== false && (
              <>
                {/* Audio Type Selector */}
                <div className="dev-music-source-tabs">
                  <button
                    type="button"
                    className={`music-tab-btn ${
                      formData.musik_tipe === 'preset' ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'musik_tipe', value: 'preset' }
                      })
                    }
                  >
                    <SpeakerHigh size={18} weight="duotone" />
                    <span>Lagu Pilihan Rekomendasi</span>
                  </button>
                  <button
                    type="button"
                    className={`music-tab-btn ${
                      formData.musik_tipe === 'youtube' ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'musik_tipe', value: 'youtube' }
                      })
                    }
                  >
                    <YoutubeLogo size={18} weight="duotone" />
                    <span>Tautan Video YouTube</span>
                  </button>
                  <button
                    type="button"
                    className={`music-tab-btn ${
                      formData.musik_tipe === 'upload' ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'musik_tipe', value: 'upload' }
                      })
                    }
                  >
                    <UploadSimple size={18} weight="duotone" />
                    <span>Unggah Berkas MP3</span>
                  </button>
                </div>

                {/* Sub-panel 1: Preset Songs */}
                {formData.musik_tipe === 'preset' && (
                  <div className="preset-songs-list">
                    <h4>Pilih Salah Satu Lagu Tema Pernikahan Populer:</h4>
                    <div className="preset-songs-grid">
                      {PRESET_SONGS.map((song, idx) => (
                        <div
                          key={idx}
                          className={`preset-song-card ${
                            formData.musik_url === song.url ? 'is-selected' : ''
                          }`}
                          onClick={() => handleSelectPresetSong(song)}
                        >
                          <div className="preset-song-info">
                            <strong>{song.title}</strong>
                            <span>{song.artist}</span>
                          </div>
                          <span className="preset-badge">{song.badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-panel 2: YouTube URL */}
                {formData.musik_tipe === 'youtube' && (
                  <div className="youtube-input-box">
                    <label>Tautan URL YouTube Lagu Pernikahan</label>
                    <input
                      type="url"
                      name="musik_url"
                      value={formData.musik_url || ''}
                      onChange={handleYouTubeUrlChange}
                      onPaste={handleYouTubeUrlPaste}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="dev-field"
                    />
                    <small className="dev-field-hint">
                      Cukup tempelkan link video YouTube, judul dan penyanyi akan terisi otomatis.
                    </small>

                    {getYouTubeId(formData.musik_url) && (
                      <div className="dev-yt-detected-box">
                        <div className="dev-yt-thumb-wrap">
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(
                              formData.musik_url
                            )}/hqdefault.jpg`}
                            alt="YouTube Thumbnail"
                            className="dev-yt-thumb"
                          />
                        </div>
                        <div className="dev-yt-info">
                          <span className="dev-yt-badge">
                            <YoutubeLogo size={14} weight="fill" />
                            YouTube Terdeteksi
                          </span>
                          <h5>{formData.judul_lagu || 'Lagu YouTube'}</h5>
                          <p>{formData.penyanyi_lagu || 'Audio Streaming'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-panel 3: Custom Upload */}
                {formData.musik_tipe === 'upload' && (
                  <div className="upload-audio-box">
                    <label>Unggah Berkas Audio MP3 Mandiri</label>
                    <label className="dev-upload-btn-label">
                      <UploadSimple size={16} weight="bold" />
                      <span>
                        {uploadingField === 'custom_audio'
                          ? 'Mengunggah Berkas Audio...'
                          : 'Pilih File MP3'}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="sr-only"
                        disabled={uploadingField === 'custom_audio'}
                      />
                    </label>
                    <input
                      type="text"
                      name="musik_url"
                      value={formData.musik_url || ''}
                      onChange={handleFormChange}
                      placeholder="Atau masukkan URL audio .mp3 eksternal..."
                      className="dev-field dev-field-sm"
                    />
                  </div>
                )}

                {/* Audio Meta and Tester */}
                <div className="dev-audio-current-preview">
                  <div className="current-audio-meta">
                    <span className="meta-label">Lagu yang Aktif Saat Ini:</span>
                    <strong>{formData.judul_lagu || 'Belum dipilih'}</strong>
                    <span>{formData.penyanyi_lagu || '-'}</span>
                  </div>
                  <button
                    type="button"
                    className={`btn-test-audio ${testAudioPlaying ? 'playing' : ''}`}
                    onClick={handleToggleTestAudio}
                    title="Uji coba dengarkan audio sekarang"
                  >
                    {testAudioPlaying ? (
                      <>
                        <Pause size={16} weight="fill" />
                        <span>Hentikan Uji Coba</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} weight="fill" />
                        <span>Dengarkan Lagu</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: KISAH CINTA */}
      {activeEditorTab === 'story' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <Heart size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">5. Timeline Perjalanan &amp; Kisah Cinta</h3>
            <button
              type="button"
              className="dev-btn-secondary dev-btn-sm"
              onClick={handleAddStory}
              style={{ marginLeft: 'auto' }}
            >
              <Plus size={15} weight="bold" />
              <span>Tambah Momen Baru</span>
            </button>
          </div>

          <div className="dev-story-editor-list">
            {(formData.love_story || []).map((story, idx) => (
              <div key={idx} className="dev-story-editor-card">
                <div className="story-card-header">
                  <span className="story-step-badge">Fase #{idx + 1}</span>
                  <button
                    type="button"
                    className="btn-delete-story"
                    onClick={() => handleRemoveStory(idx)}
                    title="Hapus Momen Ini"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                <div className="milestone-fields-grid">
                  <div className="dev-input-group">
                    <label>Tahun / Periode</label>
                    <input
                      type="text"
                      value={story.year || ''}
                      onChange={(e) => handleUpdateStory(idx, 'year', e.target.value)}
                      placeholder="2024"
                      className="dev-field dev-field-sm"
                    />
                  </div>

                  <div className="dev-input-group">
                    <label>Judul Momen Indah</label>
                    <input
                      type="text"
                      value={story.title || ''}
                      onChange={(e) => handleUpdateStory(idx, 'title', e.target.value)}
                      placeholder="Menjalin Komitmen"
                      className="dev-field dev-field-sm"
                    />
                  </div>

                  <div className="dev-input-group full-width">
                    <label>Deskripsi Cerita</label>
                    <textarea
                      rows={2}
                      value={story.desc || ''}
                      onChange={(e) => handleUpdateStory(idx, 'desc', e.target.value)}
                      placeholder="Ceritakan kenangan penting di fase ini..."
                      className="dev-field dev-field-sm"
                    ></textarea>
                  </div>

                  <div className="dev-input-group full-width">
                    <label>Foto Kenangan Momen Ini</label>
                    <div className="milestone-photo-manager">
                      <div className="milestone-thumb">
                        <img
                          src={story.foto || '/assets/foto1.jpg'}
                          alt={story.title || 'Foto Momen'}
                        />
                      </div>
                      <div className="milestone-photo-inputs">
                        <label className="dev-upload-btn-label dev-upload-btn-sm">
                          <UploadSimple size={15} weight="bold" />
                          <span>
                            {uploadingField === `story_${idx}`
                              ? 'Mengunggah...'
                              : 'Pilih Berkas Foto'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleStoryFileUpload(e, idx)}
                            className="sr-only"
                            disabled={uploadingField === `story_${idx}`}
                          />
                        </label>
                        <input
                          type="text"
                          value={story.foto || ''}
                          onChange={(e) => handleUpdateStory(idx, 'foto', e.target.value)}
                          placeholder="Atau masukkan link URL gambar..."
                          className="dev-field dev-field-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GALERI PREWEDDING */}
      {activeEditorTab === 'gallery' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <ImagesSquare size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">6. Galeri Foto Prewedding</h3>
            <button
              type="button"
              className="dev-btn-secondary dev-btn-sm"
              onClick={handleAddGalleryPhoto}
              style={{ marginLeft: 'auto' }}
            >
              <Plus size={15} weight="bold" />
              <span>Tambah Foto Baru</span>
            </button>
          </div>

          <div className="dev-gallery-editor-grid">
            {(formData.foto_galeri || []).map((photo, idx) => (
              <div key={idx} className="dev-gallery-editor-card">
                <img
                  src={photo.src || photo.url || '/assets/foto1.jpg'}
                  alt={`Galeri ${idx + 1}`}
                  className="gallery-editor-preview"
                />
                <div className="gallery-editor-inputs">
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) =>
                      handleUpdateGalleryPhoto(idx, 'caption', e.target.value)
                    }
                    placeholder="Keterangan foto"
                    className="dev-field dev-field-sm"
                  />
                  <label className="dev-upload-btn-label dev-upload-btn-sm">
                    <UploadSimple size={15} weight="bold" />
                    <span>
                      {uploadingField === `gallery_${idx}`
                        ? 'Mengunggah...'
                        : 'Pilih File Foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGalleryFileUpload(e, idx)}
                      className="sr-only"
                      disabled={uploadingField === `gallery_${idx}`}
                    />
                  </label>
                  <input
                    type="text"
                    value={photo.src || photo.url || ''}
                    onChange={(e) =>
                      handleUpdateGalleryPhoto(idx, 'src', e.target.value)
                    }
                    placeholder="Atau tempel tautan URL foto..."
                    className="dev-field dev-field-sm"
                  />
                </div>
                <button
                  type="button"
                  className="btn-delete-gallery-item"
                  onClick={() => handleRemoveGalleryPhoto(idx)}
                  title="Hapus Foto"
                >
                  <Trash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REKENING & HADIAH */}
      {activeEditorTab === 'accounts' && (
        <div className="editor-tab-content">
          <div className="tab-title-area">
            <CreditCard size={22} weight="duotone" className="tab-title-icon" />
            <h3 className="editor-tab-heading">7. Amplop Digital &amp; Pengiriman Hadiah</h3>
          </div>

          <div className="editor-form-grid">
            {/* Rekening Wanita */}
            <div className="dev-section-divider-box full-width">
              <h4>Rekening Mempelai Wanita</h4>
            </div>

            <div className="dev-input-group">
              <label>Pilihan Bank / Dompet Digital</label>
              <select
                name="bank_wanita"
                value={formData.bank_wanita || 'Bank BCA'}
                onChange={handleFormChange}
                className="dev-field"
              >
                {[
                  'Bank BCA',
                  'Bank Mandiri',
                  'Bank BNI',
                  'Bank BRI',
                  'Bank BSI',
                  'Gopay',
                  'OVO',
                  'Dana',
                  'ShopeePay'
                ].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="dev-input-group">
              <label>Nomor Rekening / Nomor Telepon</label>
              <input
                type="text"
                name="rekening_wanita"
                value={formData.rekening_wanita || ''}
                onChange={handleFormChange}
                placeholder="Contoh: 1234567890"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Atas Nama Pemilik Rekening</label>
              <input
                type="text"
                name="an_wanita"
                value={formData.an_wanita || ''}
                onChange={handleFormChange}
                placeholder="Contoh: Nadia Salsabila"
                className="dev-field"
              />
            </div>

            {/* Rekening Pria */}
            <div className="dev-section-divider-box full-width">
              <h4>Rekening Mempelai Pria</h4>
            </div>

            <div className="dev-input-group">
              <label>Pilihan Bank / Dompet Digital</label>
              <select
                name="bank_pria"
                value={formData.bank_pria || 'Bank BCA'}
                onChange={handleFormChange}
                className="dev-field"
              >
                {[
                  'Bank BCA',
                  'Bank Mandiri',
                  'Bank BNI',
                  'Bank BRI',
                  'Bank BSI',
                  'Gopay',
                  'OVO',
                  'Dana',
                  'ShopeePay'
                ].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="dev-input-group">
              <label>Nomor Rekening / Nomor Telepon</label>
              <input
                type="text"
                name="rekening_pria"
                value={formData.rekening_pria || ''}
                onChange={handleFormChange}
                placeholder="Contoh: 0987654321"
                className="dev-field"
              />
            </div>

            <div className="dev-input-group full-width">
              <label>Atas Nama Pemilik Rekening</label>
              <input
                type="text"
                name="an_pria"
                value={formData.an_pria || ''}
                onChange={handleFormChange}
                placeholder="Contoh: Agus Pratama"
                className="dev-field"
              />
            </div>

            {/* Alamat Pengiriman Hadiah */}
            <div className="dev-section-divider-box full-width">
              <h4>Alamat Pengiriman Kado Fisik</h4>
            </div>

            <div className="dev-input-group full-width">
              <label>Alamat Lengkap Pengiriman Kado</label>
              <textarea
                rows={2}
                name="alamat_kado"
                value={formData.alamat_kado || ''}
                onChange={handleFormChange}
                placeholder="Masukkan alamat rumah tempat menerima kado fisik..."
                className="dev-field"
              ></textarea>
            </div>

            <div className="dev-input-group full-width">
              <label>Nama &amp; Nomor Kontak Penerima Kado</label>
              <input
                type="text"
                name="penerima_kado"
                value={formData.penerima_kado || ''}
                onChange={handleFormChange}
                placeholder="Contoh: Nadia Salsabila (0812-3456-7890)"
                className="dev-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PRATINJAU LAYAR */}
      {activeEditorTab === 'preview' && (
        <div className="editor-tab-content">
          <div className="preview-top-toolbar">
            <div className="preview-device-switch">
              <button
                type="button"
                className={`device-btn ${previewDevice === 'mobile' ? 'is-active' : ''}`}
                onClick={() => setPreviewDevice('mobile')}
                title="Tampilan Layar HP (390px)"
              >
                <DeviceMobile size={17} weight="duotone" />
                <span>Layar HP</span>
              </button>
              <button
                type="button"
                className={`device-btn ${previewDevice === 'tablet' ? 'is-active' : ''}`}
                onClick={() => setPreviewDevice('tablet')}
                title="Tampilan Layar Tablet (768px)"
              >
                <DeviceTablet size={17} weight="duotone" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                className={`device-btn ${previewDevice === 'desktop' ? 'is-active' : ''}`}
                onClick={() => setPreviewDevice('desktop')}
                title="Tampilan Layar Komputer (100%)"
              >
                <Desktop size={17} weight="duotone" />
                <span>Komputer</span>
              </button>
            </div>

            <div className="preview-guest-tester">
              <label>Uji Coba Nama Tamu:</label>
              <input
                type="text"
                value={testGuestName}
                onChange={(e) => setTestGuestName(e.target.value)}
                className="dev-field dev-field-sm preview-guest-input"
                placeholder="Nama tamu..."
              />
              <a
                href={`/?id=${formData.id || 'demo'}&to=${encodeURIComponent(
                  testGuestName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dev-btn-secondary preview-open-btn"
              >
                <Eye size={16} weight="bold" />
                <span>Buka Tab Baru</span>
              </a>
            </div>
          </div>

          <div className="preview-viewport-wrapper">
            <div className={`preview-frame-container frame-${previewDevice}`}>
              {previewDevice === 'mobile' && (
                <div className="preview-device-notch" aria-hidden="true" />
              )}
              <iframe
                src={`/?id=${formData.id || 'demo'}&to=${encodeURIComponent(
                  testGuestName
                )}`}
                title="Pratinjau Undangan"
                className="preview-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: KEHADIRAN & DOA */}
      {activeEditorTab === 'monitor' && (
        <div className="editor-tab-content">
          <div className="tab-header-flex">
            <div className="tab-title-area">
              <ChartLineUp size={22} weight="duotone" className="tab-title-icon" />
              <h3 className="editor-tab-heading">
                9. Data Konfirmasi Kehadiran &amp; Doa Tamu
              </h3>
            </div>
            <div className="export-actions">
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={exportRsvpToExcel}
              >
                <Export size={16} weight="bold" />
                <span>Unduh Excel Kehadiran</span>
              </button>
              <button
                type="button"
                className="dev-btn-secondary"
                onClick={exportGuestbookToExcel}
              >
                <Export size={16} weight="bold" />
                <span>Unduh Excel Doa Tamu</span>
              </button>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="dev-stats-grid">
            <div className="dev-stat-card">
              <span className="stat-label">Total Konfirmasi Masuk</span>
              <strong className="stat-val">{totalRsvp} Tamu</strong>
            </div>
            <div className="dev-stat-card">
              <span className="stat-label">Pasti Hadir</span>
              <strong className="stat-val text-green">{totalHadir}</strong>
            </div>
            <div className="dev-stat-card">
              <span className="stat-label">Berhalangan Hadir</span>
              <strong className="stat-val text-red">{totalTidakHadir}</strong>
            </div>
            <div className="dev-stat-card">
              <span className="stat-label">Total Jumlah Tamu Hadir</span>
              <strong className="stat-val text-gold">{totalPax} Orang</strong>
            </div>
          </div>

          {/* Kehadiran Table */}
          <div className="dev-monitor-table-box">
            <div className="table-filter-bar">
              <h4>Daftar Tamu yang Mengisi Kehadiran ({rsvpList.length})</h4>
              <div className="filter-controls">
                <select
                  value={rsvpFilter}
                  onChange={(e) => setRsvpFilter(e.target.value)}
                  className="dev-field dev-field-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                </select>
                <input
                  type="text"
                  placeholder="Cari nama tamu..."
                  value={searchRsvp}
                  onChange={(e) => setSearchRsvp(e.target.value)}
                  className="dev-field dev-field-sm"
                />
              </div>
            </div>

            <div className="dev-table-card">
              <table className="dev-table">
                <thead>
                  <tr>
                    <th>Nama Tamu</th>
                    <th>Status Kehadiran</th>
                    <th>Jumlah Orang</th>
                    <th>Waktu Mengisi</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpList
                    .filter((item) => {
                      if (rsvpFilter !== 'all' && item.hadir !== rsvpFilter)
                        return false;
                      if (
                        searchRsvp &&
                        !item.name?.toLowerCase().includes(searchRsvp.toLowerCase())
                      )
                        return false;
                      return true;
                    })
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              item.hadir === 'hadir' ? 'hadir' : 'tidak'
                            }`}
                          >
                            {item.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                          </span>
                        </td>
                        <td>
                          {item.hadir === 'hadir'
                            ? `${item.guest_count || 1} Orang`
                            : '-'}
                        </td>
                        <td>
                          {item.timestamp
                            ? new Date(item.timestamp.toDate()).toLocaleString(
                                'id-ID'
                              )
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  {rsvpList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Belum ada tamu yang mengisi konfirmasi kehadiran.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buku Tamu List */}
          <div className="dev-monitor-wishes-box">
            <h4>Pesan Doa &amp; Ucapan Tamu Undangan ({guestbookList.length})</h4>
            <div className="dev-wishes-admin-list">
              {guestbookList.map((wish) => (
                <div key={wish.id} className="dev-wish-admin-item">
                  <div className="wish-admin-header">
                    <strong>{wish.name}</strong>
                    <span className="wish-admin-time">
                      {wish.timestamp
                        ? new Date(wish.timestamp.toDate()).toLocaleString('id-ID')
                        : '-'}
                    </span>
                  </div>
                  <p className="wish-admin-text">"{wish.message}"</p>
                </div>
              ))}
              {guestbookList.length === 0 && (
                <p className="text-muted">
                  Belum ada ucapan doa yang dikirimkan tamu.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar (Sticky in Editor View) */}
      <div className="dev-floating-save-bar">
        <div className="dev-save-bar-info">
          <span className="status-dot"></span>
          <span>
            {isSaving
              ? 'Sedang Menyimpan Perubahan...'
              : `Mode Edit: ${formData.id || 'Undangan Baru'}`}
          </span>
        </div>
        <div className="dev-save-bar-actions">
          <button
            type="button"
            className="dev-btn-secondary dev-btn-sm"
            onClick={() => setActiveEditorTab('preview')}
          >
            <Eye size={16} weight="bold" />
            <span>Pratinjau</span>
          </button>
          <button
            type="button"
            className="dev-btn-gold dev-btn-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ArrowClockwise size={16} className="lp-spin" />
            ) : (
              <Check size={16} weight="bold" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Undangan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
