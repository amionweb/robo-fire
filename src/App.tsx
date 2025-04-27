import React, { useState } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';
import { GameState } from './game/types';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.GAME_OVER);
  };
  
  const handleVictory = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.VICTORY);
  };
  
  const handleStart = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    setLevel(1);
  };
  
  const handleRestart = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    setLevel(1);
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-space">
      {gameState === GameState.START && (
        <StartScreen onStart={handleStart} />
      )}
      
      {gameState === GameState.PLAYING && (
        <Game 
          onGameOver={handleGameOver}
          onVictory={handleVictory}
        />
      )}
      
      {gameState === GameState.GAME_OVER && (
        <GameOverScreen 
          score={score}
          level={level}
          onRestart={handleRestart}
        />
      )}
      
      {gameState === GameState.VICTORY && (
        <VictoryScreen 
          score={score}
          level={level}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;