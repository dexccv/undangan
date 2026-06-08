import React, { useState, useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Expose audio globally for Cover.jsx to trigger
    window.document.getElementById = (id) => {
      if (id === 'bgm') return audioRef.current;
      if (id === 'btn-play') return document.querySelector('.btn-play');
      return Document.prototype.getElementById.call(document, id);
    };
    
    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <>
      <button 
        className={`btn-play ${isPlaying ? 'playing' : ''}`} 
        id="btn-play" 
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <i className="fa-solid fa-compact-disc fa-spin"></i>
        ) : (
          <i className="fa-solid fa-compact-disc"></i>
        )}
      </button>
      <audio id="bgm" loop ref={audioRef}>
        <source src="/assets/wedding_song.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
}
