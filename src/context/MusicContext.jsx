import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

/**
 * Extract 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://music.youtube.com/watch?v=dQw4w9WgXcQ
 * - Raw 11-char ID
 */
export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = clean.match(regExp);
  return match ? match[1] : null;
}

/**
 * Fetch YouTube video title and author/artist via oEmbed API (CORS enabled)
 * and smartly parses 'Artist - Song' or 'Author'
 */
export async function fetchYouTubeMetadata(url) {
  const ytId = getYouTubeId(url);
  if (!ytId) return null;

  try {
    let data = null;
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      // ignore & try fallback
    }

    if (!data || !data.title || data.error) {
      // Fallback via CORS proxy
      try {
        const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`)}`);
        if (proxyRes.ok) {
          data = await proxyRes.json();
        }
      } catch (err) {
        // ignore
      }
    }

    if (!data || !data.title || data.error) return null;

    const rawTitle = data.title || '';
    const rawAuthor = data.author_name || '';

    let cleaned = rawTitle
      .replace(/\s*[\(\[](?:official\s*(?:music\s*)?video|video\s*clip|official\s*audio|audio|lirik\s*(?:video)?|lyrics?(?:\s*video)?|lyric\s*video|mv|hd|4k.*?)[\)\]]/gi, '')
      .trim();

    let author = rawAuthor
      .replace(/\s*-\s*Topic$/i, '')
      .replace(/\s*(?:VEVO|Official(?:\s*Channel)?|Channel)$/i, '')
      .trim();

    let artist = author;
    let songTitle = cleaned;

    if (cleaned.includes(' - ')) {
      const parts = cleaned.split(' - ');
      artist = parts[0].trim();
      songTitle = parts.slice(1).join(' - ').trim();
    } else if (cleaned.includes(' – ')) {
      const parts = cleaned.split(' – ');
      artist = parts[0].trim();
      songTitle = parts.slice(1).join(' – ').trim();
    }

    // Display title: e.g. 'Payung Teduh - Akad'
    const displayTitle = artist && songTitle && !songTitle.toLowerCase().includes(artist.toLowerCase())
      ? `${artist} - ${songTitle}`
      : cleaned;

    return {
      displayTitle,
      songTitle,
      artist: artist || author,
      rawTitle
    };
  } catch (err) {
    console.warn('Failed to fetch YouTube metadata:', err);
    return null;
  }
}

// Global script loader for YouTube IFrame API
let ytApiPromise = null;
function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') return Promise.reject('No window');
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const existing = document.getElementById('youtube-iframe-api-script');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        resolve(window.YT);
      }
    }, 100);

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevOnReady === 'function') prevOnReady();
      clearInterval(checkInterval);
      resolve(window.YT);
    };
  });

  return ytApiPromise;
}

export function MusicProvider({
  children,
  musicSource = '/assets/wedding_song.mp3',
  songTitle = 'Payung Teduh - Akad',
  isEnabled = true
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSource, setCurrentSource] = useState(musicSource);
  const [currentTitle, setCurrentTitle] = useState(songTitle);
  const [enabled, setEnabled] = useState(isEnabled);

  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytContainerRef = useRef(null);
  const shouldPlayOnReadyRef = useRef(false);
  const isYtReadyRef = useRef(false);

  // Sync with prop updates
  useEffect(() => {
    if (musicSource) setCurrentSource(musicSource);
  }, [musicSource]);

  useEffect(() => {
    if (songTitle) setCurrentTitle(songTitle);
  }, [songTitle]);

  useEffect(() => {
    setEnabled(isEnabled);
  }, [isEnabled]);

  const youtubeId = getYouTubeId(currentSource);

  // Setup / teardown players when source or type changes
  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
      setIsPlaying(false);
      return;
    }

    if (youtubeId) {
      // YouTube Mode: stop html5 audio if running
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      loadYouTubeIframeApi().then((YT) => {
        if (!ytContainerRef.current) return;

        // If player already exists, simply load new video
        if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.loadVideoById({
            videoId: youtubeId,
            startSeconds: 0
          });
          if (shouldPlayOnReadyRef.current) {
            ytPlayerRef.current.playVideo();
          }
          return;
        }

        // Initialize new YT.Player
        try {
          ytPlayerRef.current = new YT.Player(ytContainerRef.current, {
            width: '200',
            height: '200',
            videoId: youtubeId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              loop: 1,
              playlist: youtubeId,
              playsinline: 1
            },
            events: {
              onReady: (event) => {
                isYtReadyRef.current = true;
                if (shouldPlayOnReadyRef.current) {
                  event.target.playVideo();
                }
              },
              onStateChange: (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (event.data === YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                } else if (event.data === YT.PlayerState.ENDED) {
                  // Loop fallback
                  event.target.playVideo();
                }
              },
              onError: (err) => {
                console.warn('YouTube Player Error:', err);
                setIsPlaying(false);
              }
            }
          });
        } catch (e) {
          console.warn('Failed to construct YT.Player:', e);
        }
      });
    } else {
      // HTML5 Audio Mode: pause YouTube if running
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }

      const audioSrc = currentSource || '/assets/wedding_song.mp3';
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audioRef.current = audio;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      if (shouldPlayOnReadyRef.current) {
        audio.play().catch(() => {});
      }

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [youtubeId, currentSource, enabled]);

  const play = useCallback(() => {
    if (!enabled) return;
    shouldPlayOnReadyRef.current = true;

    if (youtubeId) {
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        ytPlayerRef.current.playVideo();
      }
    } else if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay prevented or audio error:', err);
      });
    }
  }, [youtubeId, enabled]);

  const pause = useCallback(() => {
    shouldPlayOnReadyRef.current = false;
    if (youtubeId) {
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, [youtubeId]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const setMusicTrack = useCallback(({ source, title, isEnabled: en = true }) => {
    if (source !== undefined) setCurrentSource(source);
    if (title !== undefined) setCurrentTitle(title);
    if (en !== undefined) setEnabled(en);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        play,
        pause,
        toggle,
        songTitle: currentTitle,
        musicSource: currentSource,
        isEnabled: enabled,
        isYouTube: !!youtubeId,
        youtubeId,
        setMusicTrack
      }}
    >
      {/* Hidden off-screen container for YouTube Player */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: -1
        }}
      >
        <div ref={ytContainerRef} id="yt-bg-audio-container" />
      </div>

      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
