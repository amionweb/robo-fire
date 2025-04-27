import React, { useEffect, useState } from 'react';
import { Frown } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart }) => {
  const [highScore, setHighScore] = useState(0);
  
  useEffect(() => {
    const savedHighScore = localStorage.getItem('robofire-highscore');
    const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
    
    if (score > currentHighScore) {
      localStorage.setItem('robofire-highscore', score.toString());
      setHighScore(score);
    } else {
      setHighScore(currentHighScore);
    }
  }, [score]);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/50">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center max-w-md w-full mx-4 animate-fade-in">
        <Frown className="text-red-400 h-20 w-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-6">Game Over!</h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">Your Score</p>
            <p className="text-white text-3xl font-bold">{score}</p>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">Level Reached</p>
            <p className="text-white text-2xl font-bold">{level}</p>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">High Score</p>
            <p className="text-white text-2xl font-bold">{highScore}</p>
          </div>
        </div>
        
        <button 
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;