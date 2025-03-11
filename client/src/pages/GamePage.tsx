import { useEffect, useRef } from 'react';
import { Game } from '../game/core/Game';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Game(containerRef.current);
    gameRef.current = game;
    game.start();

    const handleResize = () => {
      if (containerRef.current) {
        game.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
