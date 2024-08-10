import React, { useState, useEffect, useRef } from 'react';
import Button from './components/ui/button';
import { AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const NumberRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [finalNumber, setFinalNumber] = useState(null);
  const [volume, setVolume] = useState(0.5); // Default volume is set to 50%
  const backgroundMusicRef = useRef(null);
  const [musicInitialized, setMusicInitialized] = useState(false);

  useEffect(() => {
    backgroundMusicRef.current = new Audio('/background.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = volume;

    return () => {
      // Cleanup: stop the music when the component unmounts
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isSpinning) {
      interval = setInterval(() => {
        setCurrentNumber((prevNumber) => (prevNumber % 10) + 1);
      }, 100);
    } else if (finalNumber !== null) {
      setCurrentNumber(finalNumber);
      clearInterval(interval);
      
      // Déclencher les confettis lorsque le chiffre s'arrête
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return () => clearInterval(interval);
  }, [isSpinning, finalNumber]);

  const handleSpin = () => {
    if (!musicInitialized) {
      backgroundMusicRef.current.play();
      setMusicInitialized(true);
    }

    setIsSpinning(true);
    setFinalNumber(null);
    playSound('/spin-start.mp3');

    setTimeout(() => {
      const newFinalNumber = Math.floor(Math.random() * 10) + 1;
      setFinalNumber(newFinalNumber);
      setIsSpinning(false);
      playSound('/spin-stop.mp3');
    }, 3000);
  };

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className={`text-7xl md:text-9xl font-bold mb-8 transition-all duration-300 ${isSpinning ? 'animate-bounce text-yellow-300' : finalNumber !== null ? 'animate-pulse text-green-300' : 'text-white'}`}>
        {currentNumber}
      </div>
      <Button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-semibold rounded-full shadow-lg transition-all duration-300 ${
          isSpinning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        {isSpinning ? (
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
        ) : (
          'Tourner'
        )}
      </Button>

      {/* Slider for Volume Control */}
      <div className="mt-8 w-full flex flex-col items-center">
        <label htmlFor="volume-slider" className="text-white mb-2 text-lg">Volume</label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-1/2 md:w-1/3 h-4 bg-blue-500 rounded-full appearance-none cursor-pointer"
          style={{
            background: 'linear-gradient(90deg, #ff7f50, #ff6347)', // Degrade de couleur
            WebkitAppearance: 'none', // Required for Chrome/Safari
            appearance: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default NumberRoulette;
