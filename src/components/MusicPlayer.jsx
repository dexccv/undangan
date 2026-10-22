import React from 'react';
import { Disc, MusicNotes } from '@phosphor-icons/react';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, toggle, isEnabled, songTitle } = useMusic();

  if (isEnabled === false) return null;

  return (
    <aside className="music-player-wrapper" aria-label="Pemutar Musik Latar">
      <button
        type="button"
        className={`btn-music-toggle ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={toggle}
        aria-label={isPlaying ? 'Hentikan musik' : 'Putar musik'}
        title={songTitle ? `Lagu: ${songTitle} (${isPlaying ? 'Klik untuk Jeda' : 'Klik untuk Putar'})` : (isPlaying ? 'Jeda Musik' : 'Putar Musik')}
      >
        <Disc size={26} weight="duotone" className={`disc-icon ${isPlaying ? 'spinning' : ''}`} />
        <span className="sr-only">{isPlaying ? 'Musik Aktif' : 'Musik Mati'}</span>
      </button>
      {songTitle && (
        <div className={`music-info-pill ${isPlaying ? 'is-active' : ''}`} title={songTitle}>
          <MusicNotes size={13} weight="bold" className="music-note-icon" />
          <span className="music-info-text">{songTitle}</span>
        </div>
      )}
    </aside>
  );
}
