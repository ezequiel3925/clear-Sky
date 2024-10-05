import React from 'react';

const AudioPlayer = () => {
  return (
    <div>
      <h1>Audio Player</h1>
      <audio controls>
        <source src="/sound.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;