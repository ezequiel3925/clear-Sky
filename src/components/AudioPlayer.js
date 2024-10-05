import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Use useEffect to play audio when the component mounts
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true); // Set playing state to true
        } catch (error) {
          console.error('Error playing audio on mount:', error);
        }
      }
    };

    playAudio(); // Call the function to play audio

    // Optional: Cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div>
      
      <audio ref={audioRef} src="/spacetravel.wav" preload="auto" />
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pausar música' : 'Activar música'}
      </button>
    </div>
  );
};

export default AudioPlayer;
