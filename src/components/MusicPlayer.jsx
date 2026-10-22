import React from 'react';
import { Disc } from '@phosphor-icons/react';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, toggle } = useMusic();

  return (
    <aside className="music-player-wrapper" aria-label="Pemutar Musik Latar">
      <button
        type="button"
        className={`btn-music-toggle ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={toggle}
        aria-label={isPlaying ? 'Hentikan musik' : 'Putar musik'}
        title={isPlaying ? 'Pause Musik' : 'Play Musik'}
      >
        <Disc size={26} weight="duotone" className={`disc-icon ${isPlaying ? 'spinning' : ''}`} />
        <span className="sr-only">{isPlaying ? 'Musik Aktif' : 'Musik Mati'}</span>
      </button>
    </aside>
  );
}
