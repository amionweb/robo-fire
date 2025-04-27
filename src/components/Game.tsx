import React, { useRef, useEffect, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import GameHUD from './GameHUD';

interface GameProps {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
}

const Game: React.FC<GameProps> = ({ onGameOver, onVictory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const engine = new GameEngine(canvas, {
      onScoreUpdate: (newScore) => setScore(newScore),
      onLevelUpdate: (newLevel) => setLevel(newLevel),
      onGameOver: (finalScore) => onGameOver(finalScore),
      onVictory: (finalScore) => onVictory(finalScore)
    });
    
    setGameEngine(engine);
    
    engine.start();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.resize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [onGameOver, onVictory]);
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 z-10"
      />
      <GameHUD score={score} level={level} />
    </div>
  );
};

export default Game;