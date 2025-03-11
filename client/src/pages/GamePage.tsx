// File: client/src/pages/GamePage.tsx
import { useEffect, useRef, useState } from "react";
import { Game } from "../game/core/Game";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Game(containerRef.current);
    gameRef.current = game;
    game.start().catch((err) => console.error("Game start failed:", err));

    const updateUI = () => {
      setScore(game.score);
      setGameOver(game.gameOver);
    };
    const interval = setInterval(updateUI, 100);

    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        game.resize(clientWidth, clientHeight);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, []);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current
        .reset()
        .catch((err) => console.error("Reset failed:", err));
    }
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 text-white text-lg font-bold">
        Score: {score}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-2xl mb-4">Score: {score}</p>
            <Button onClick={handleRestart}>Restart</Button>
          </div>
        </div>
      )}
    </div>
  );
}
