import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface VictoryScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ score, level, onRestart }) => {
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
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center max-w-md w-full mx-4 animate-bounce-in">
        <Trophy className="text-yellow-400 h-20 w-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Victory!</h1>
        <p className="text-blue-200 mb-6">You've mastered RoboFire!</p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">Final Score</p>
            <p className="text-white text-3xl font-bold">{score}</p>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">Max Level</p>
            <p className="text-white text-2xl font-bold">{level}</p>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-blue-200">High Score</p>
            <p className="text-white text-2xl font-bold">{highScore}</p>
          </div>
        </div>
        
        <div className="mb-6 bg-white/5 p-4 rounded-lg">
          <p className="text-yellow-300 font-semibold">Congratulations!</p>
          <p className="text-blue-100">You've defeated the cloud invasion and saved the digital skies!</p>
        </div>
        
        <button 
          onClick={onRestart}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;