import React from 'react';
import { Notebook as Robot } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
      <div className="glass-card p-8 rounded-xl text-center max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="animate-float">
            <Robot className="text-blue-300 h-24 w-24 animate-pulse-glow" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">RoboFire</h1>
        <h2 className="text-2xl font-bold text-blue-300 mb-8">Cloud Clash</h2>
        
        <div className="glass-card p-6 rounded-lg mb-8">
          <h3 className="text-white font-semibold text-xl mb-4">How to Play:</h3>
          <ul className="text-blue-100 text-left space-y-3">
            <li className="flex items-center">
              <span className="text-yellow-300 mr-2">→</span>
              Move with <span className="text-yellow-300 mx-2">Arrow keys</span> or <span className="text-yellow-300 mx-2">WASD</span>
            </li>
            <li className="flex items-center">
              <span className="text-yellow-300 mr-2">→</span>
              Shoot with <span className="text-yellow-300 mx-2">Spacebar</span>
            </li>
            <li className="flex items-center">
              <span className="text-yellow-300 mr-2">→</span>
              Destroy clouds and collect coins
            </li>
            <li className="flex items-center">
              <span className="text-red-400 mr-2">!</span>
              Avoid obstacles
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">★</span>
              Reach level 10 to win!
            </li>
          </ul>
        </div>
        
        <button 
          onClick={onStart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg text-xl relative overflow-hidden group"
        >
          <span className="relative z-10">START GAME</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;