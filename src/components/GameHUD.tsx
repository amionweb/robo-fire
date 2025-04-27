import React from 'react';

interface GameHUDProps {
  score: number;
  level: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, level }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start pointer-events-none">
      <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
        <p className="text-white font-bold">LEVEL: {level}</p>
      </div>
      <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
        <p className="text-white font-bold">SCORE: {score}</p>
      </div>
    </div>
  );
};

export default GameHUD;